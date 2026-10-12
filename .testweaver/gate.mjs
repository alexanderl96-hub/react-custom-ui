#!/usr/bin/env node
// TestWeaver quality gate (plain Node, no dependencies).
// Runs the project's tests with coverage, then checks the thresholds in .testweaver/gate.json.
// Exit code 0 = gate passed, 1 = gate failed. A git hook uses this exit code to block a commit or merge.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';

const root = process.cwd();
const dir = join(root, '.testweaver');
const cfg = JSON.parse(readFileSync(join(dir, 'gate.json'), 'utf8'));
const win = process.platform === 'win32';
const started = Date.now();

const rel = p => relative(root, p).split(sep).join('/');
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#10;/g, '\n').replace(/&#13;/g, '').replace(/&amp;/g, '&');
const SKIP = new Set(['node_modules', '.git', '.testweaver']);
function walk(d, cb) {
  let ents;
  try { ents = readdirSync(d, { withFileTypes: true }); } catch { return; }
  for (const e of ents) { const p = join(d, e.name); if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p, cb); } else cb(p); }
}

function run(cmd, args) {
  return new Promise(resolve => {
    const p = spawn(cmd, args, { cwd: root, shell: win, env: process.env });
    let out = '';
    const feed = d => { const s = d.toString(); out += s; process.stdout.write(s); };
    p.stdout.on('data', feed);
    p.stderr.on('data', feed);
    p.on('error', e => resolve({ code: -1, out: out + String(e) }));
    p.on('close', code => resolve({ code, out }));
  });
}

// ---------------------------------------------------------------- explaining failures
const HINTS = [
  [/useNavigate|useLocation|useHref|useParams|inside a <Router>|<Router>|basename.*useContext/i, () => 'This component needs a Router around it. Render it inside <MemoryRouter>.'],
  [/react-redux context|could not find .*store/i, () => 'This component needs a Redux <Provider> with a store.'],
  [/Invalid hook call|Hooks can only be called/i, () => 'A React hook ran outside a component. Test the component that uses it instead.'],
  [/(\S+?)\.(map|filter|forEach|reduce|find|some|every|length) is not a function|(\S+?) is not iterable/, m => `\`${m[1] ?? m[3]}\` was expected to be an array but is not. The argument or prop should be an array.`],
  [/Cannot read propert(?:y|ies) of (undefined|null) \(reading '(\w+)'\)/, m => `The code reads \`.${m[2]}\` of a value that is ${m[1]}. A required argument, prop or dependency was not provided.`],
  [/Unexpected token </, () => 'The code parsed an HTML page as JSON: a real HTTP request reached a server that answered with a web page. Stub the request.'],
  [/ENOTFOUND|ECONNREFUSED|fetch failed|Failed to fetch|getaddrinfo/, () => 'The code tried to reach the network. Mock fetch/axios in the test.'],
  [/Failed to resolve import|Cannot find module|Cannot find package/, () => 'An import could not be resolved. Check the path or install the package.'],
  [/(\w+) is not defined/, m => `\`${m[1]}\` is used but never imported or defined.`],
  [/NullPointerException/, () => 'A null value was used. The test passed null for an object or dependency; give it a real object or a Mockito mock.'],
  [/ClassNotFoundException|NoClassDefFoundError/, () => 'A class is missing on the test classpath.'],
  [/ApplicationContext|BeanCreationException|NoSuchBeanDefinition/, () => 'The Spring context could not start: a bean or configuration it needs is missing.'],
  [/No module named '?([\w.]+)'?|ModuleNotFoundError/, m => `A Python module is missing${m[1] ? ': ' + m[1] : ''}. Install it in the project's .venv (pip install).`],
  [/missing (\d+) required positional argument/, () => 'The function needs more arguments than the test passed.'],
  [/NoMethodError.*for nil|undefined method .* for nil/, () => 'A value was nil. A required argument or object was not provided.'],
  [/ArgumentError.*wrong number of arguments/, () => 'The method takes a different number of arguments than the test passed.'],
  [/uninitialized constant (\S+)/, m => `\`${m[1]}\` is not loaded. The spec needs to require the file that defines it.`],
  [/NullReferenceException/, () => 'A null value was used. The test passed null for an object or dependency.'],
  [/Could not load file or assembly|FileNotFoundException/, () => 'A file or assembly the code needs is missing on the test machine.'],
];
const hintFor = text => { for (const [re, fn] of HINTS) { const m = re.exec(text); if (m) return fn(m); } return undefined; };

const SMOKE = /runs with sample input|resolves with sample input|renders without crashing|loads without throwing|loads without raising|returns a |_runsWithSampleInput|runs_with_sample_input|RunsWithSampleInput|contextLoads/;

function compare(message, test) {
  let m;
  if ((m = /expected \[Function\] to not throw an error but '?(.*?)'? was thrown/.exec(message))) return { expected: 'no error to be thrown', actual: m[1] };
  if ((m = /expected (.+?) to (?:be|equal|strictly equal|deeply equal|be close to|match|contain|have) (.+?)(?: \/\/.*)?$/.exec(message))) return { expected: m[2], actual: m[1] };
  if ((m = /expected: ?<(.*?)> but was: ?<(.*?)>/.exec(message))) return { expected: m[1], actual: m[2] };
  if ((m = /^assert (.+?) == (.+)$/.exec(message))) return { expected: m[2], actual: m[1] };
  if ((m = /Expected:\s*(.*?)\r?\n\s*Actual:\s*(.*)/.exec(message))) return { expected: m[1], actual: m[2] };
  if ((m = /expected: (.*?)\r?\n\s*got: (.*)/.exec(message))) return { expected: m[1], actual: m[2] };
  if (SMOKE.test(test) && /^[\w.$:]*(Error|Exception)\b/.test(message)) return { expected: 'no error to be thrown', actual: message.split('\n')[0] };
  return {};
}

const componentName = f => basename(f).replace(/\.(test|spec)\.[^.]+$/, '').replace(/_spec\.rb$/, '').replace(/\.[^.]+$/, '').replace(/^test_/, '').replace(/(Tests?|IT)$/, '') || basename(f);

// JS stack frames: "at /abs/path/file.js:12:5" or "at fn (/abs/path/file.js:12:5)"
function jsFailure(component, test, text, testFile, location) {
  const message = (text.split('\n').find(l => l.trim()) ?? '').trim();
  const frames = [...text.matchAll(/(?:\(|\s)((?:file:\/\/)?(?:[A-Za-z]:)?[^\s():]*[\\/][^\s():]+):(\d+):(\d+)\)?/g)]
    .map(m => ({ file: m[1].replace(/^file:\/\//, ''), line: Number(m[2]) }))
    .filter(f => !/node_modules|node:internal/.test(f.file));
  const isTest = f => /\.(test|spec)\.[cm]?[jt]sx?$/.test(f.file);
  const t = frames.find(isTest) ?? (location ? { file: testFile, line: location.line } : undefined);
  const s = frames.find(f => !isTest(f));
  return {
    component, test, file: rel(t?.file ?? testFile), line: t?.line,
    sourceFile: s ? rel(s.file) : undefined, sourceLine: s?.line,
    message, ...compare(message, test), hint: hintFor(text),
  };
}

// ---------------------------------------------------------------- JavaScript / TypeScript (Vitest)
function parseVitest(file) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const components = [], failures = [];
  for (const tr of j.testResults ?? []) {
    const c = { name: componentName(tr.name), file: rel(tr.name), passed: 0, failed: 0, skipped: 0 };
    const results = tr.assertionResults ?? [];
    for (const a of results) {
      if (a.status === 'passed') c.passed++;
      else if (a.status === 'failed') { c.failed++; failures.push(jsFailure(c.name, a.title, (a.failureMessages ?? []).join('\n'), tr.name, a.location)); }
      else c.skipped++;
    }
    if (!results.length && tr.status === 'failed') {   // the file could not even load (syntax error, bad import...)
      c.failed++;
      failures.push(jsFailure(c.name, '(test file could not run)', tr.message || 'The test file failed to load', tr.name));
    }
    components.push(c);
  }
  return { components, failures };
}

function vitestCoverage() {
  const f = join(dir, 'coverage', 'coverage-summary.json');
  if (!existsSync(f)) return null;
  const t = JSON.parse(readFileSync(f, 'utf8')).total;
  return { lines: t.lines.pct, statements: t.statements.pct, branches: t.branches.pct, functions: t.functions.pct };
}

function npmAudit() {
  try {
    const r = spawnSync('npm', ['audit', '--json'], { cwd: root, encoding: 'utf8', timeout: 90000, shell: win });
    const j = JSON.parse(r.stdout || '{}');
    if (j.error) return { unavailable: j.error.summary || j.error.code || 'npm audit failed' };
    const v = j.metadata?.vulnerabilities;
    if (!v) return { unavailable: 'npm audit returned no data (offline or no lockfile)' };
    return { critical: v.critical ?? 0, high: v.high ?? 0, moderate: v.moderate ?? 0, low: v.low ?? 0 };
  } catch (e) { return { unavailable: 'npm audit could not run: ' + String(e.message ?? e) }; }
}

async function runNode() {
  const bin = join(root, 'node_modules', '.bin', win ? 'vitest.cmd' : 'vitest');
  if (!existsSync(bin)) throw new Error('Vitest is not installed in this project. Run TestWeaver and click "Install libraries and write tests" first.');
  const json = join(dir, 'vitest.json');
  rmSync(json, { force: true });
  rmSync(join(dir, 'coverage'), { recursive: true, force: true });
  const hasCoverageLib = existsSync(join(root, 'node_modules', '@vitest', 'coverage-v8'));
  const args = ['run', '--reporter=default', '--reporter=json', `--outputFile.json=${json}`];
  if (hasCoverageLib) {
    // reportOnFailure: Vitest skips the coverage report by default when any test fails
    args.push('--coverage.enabled=true', '--coverage.provider=v8', '--coverage.reportOnFailure=true',
      '--coverage.reporter=json-summary', '--coverage.reporter=lcov', `--coverage.reportsDirectory=${join(dir, 'coverage')}`);
    if (existsSync(join(root, 'src'))) args.push('--coverage.include=src/**');
  }
  const r = await run(bin, args);
  if (!existsSync(json)) throw new Error('Vitest did not produce a results file.\n' + r.out.split('\n').slice(-15).join('\n'));
  const coverage = vitestCoverage();
  const coverageNote = coverage ? undefined
    : !hasCoverageLib ? 'The coverage package @vitest/coverage-v8 is not installed in this project. Click "Install libraries and write tests" again.'
    : (r.out.split('\n').find(l => /coverage/i.test(l) && /(error|cannot|missing|failed|install)/i.test(l)) ?? 'Vitest produced no coverage-summary.json (is @vitest/coverage-v8 installed at the same version as vitest?)').trim();
  return { ...parseVitest(json), coverage, coverageNote, vulnerabilities: npmAudit() };
}

// ---------------------------------------------------------------- Java (JUnit XML + JaCoCo)
function javaFailure(component, test, caseXml, files) {
  const m = /<(?:failure|error)\b([^>]*)>([\s\S]*?)<\/(?:failure|error)>|<(?:failure|error)\b([^>]*)\/>/.exec(caseXml);
  const attrs = m?.[1] ?? m?.[3] ?? '';                       // read attribute values before decoding entities (&quot; would end them early)
  const body = decode(m?.[2] ?? '');
  const type = decode(/type="([^"]*)"/.exec(attrs)?.[1] ?? '');
  const msg = decode(/message="([^"]*)"/.exec(attrs)?.[1] ?? '') || body.split('\n')[0] || '';
  const shortType = type.split('.').pop();
  const message = type && !/AssertionFailed|ComparisonFailure/.test(type) ? `${shortType}${msg ? ': ' + msg : ''}` : msg || shortType || 'Test failed';
  const frames = [...body.matchAll(/at ([\w$.<>]+)\(([\w$]+\.java):(\d+)\)/g)].map(f => ({ cls: f[1], file: f[2], line: Number(f[3]) }));
  const isTest = f => /Tests?\.java$|IT\.java$/.test(f.file);
  const lib = f => /^(org\.junit|java\.|jdk\.|sun\.|org\.apache|org\.opentest4j|org\.springframework\.test)/.test(f.cls);
  const t = frames.find(isTest);
  const s = frames.find(f => !isTest(f) && !lib(f));
  const path = f => files.get(f.file) ?? f.file;
  return {
    component, test, file: t ? path(t) : (files.get(component + 'Test.java') ?? component + 'Test.java'), line: t?.line,
    sourceFile: s ? path(s) : undefined, sourceLine: s?.line,
    message, ...compare(message, test), hint: hintFor(type + ' ' + message + ' ' + body),
  };
}

function parseJUnit() {
  const files = new Map();                 // File.java -> relative path
  const xmls = [];
  walk(root, p => {
    if (p.endsWith('.java')) { if (!files.has(basename(p))) files.set(basename(p), rel(p)); }
    else if (p.endsWith('.xml') && /[\\/](surefire-reports|test-results)[\\/]/.test(p) && /TEST-.*\.xml$/.test(p)) xmls.push(p);
  });
  const byClass = new Map();
  const failures = [];
  for (const x of xmls) {
    const xml = readFileSync(x, 'utf8');
    for (const m of xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)) {
      const attrs = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(a => [a[1], decode(a[2])]));
      const cls = (attrs.classname ?? 'Unknown').split('.').pop();
      const name = componentName(cls + '.java');
      const c = byClass.get(cls) ?? { name, file: files.get(cls + '.java') ?? cls + '.java', passed: 0, failed: 0, skipped: 0 };
      const body = m[2] ?? '';
      if (/<(failure|error)\b/.test(body)) { c.failed++; failures.push(javaFailure(name, attrs.name ?? '', body, files)); }
      else if (/<skipped\b/.test(body)) c.skipped++;
      else c.passed++;
      byClass.set(cls, c);
    }
  }
  return { components: [...byClass.values()], failures, found: xmls.length };
}

function jacocoCoverage() {
  const sums = { LINE: [0, 0], BRANCH: [0, 0], METHOD: [0, 0] };
  let found = 0;
  walk(root, p => {
    if (!/jacoco(TestReport)?\.xml$/.test(p)) return;
    found++;
    const xml = readFileSync(p, 'utf8');
    for (const type of Object.keys(sums)) {
      const all = [...xml.matchAll(new RegExp(`<counter type="${type}" missed="(\\d+)" covered="(\\d+)"\\s*/>`, 'g'))];
      const last = all[all.length - 1];                        // the report-level total comes last
      if (last) { sums[type][0] += Number(last[1]); sums[type][1] += Number(last[2]); }
    }
  });
  if (!found) return null;
  const pct = ([missed, covered]) => (missed + covered ? Math.round((covered / (missed + covered)) * 1000) / 10 : 0);
  return { lines: pct(sums.LINE), branches: pct(sums.BRANCH), functions: pct(sums.METHOD) };
}

async function runJava() {
  walk(root, p => { if (/[\\/](surefire-reports|test-results)[\\/].*\.xml$/.test(p) || /jacoco(TestReport)?\.(xml|exec)$/.test(p)) rmSync(p, { force: true }); });
  let r;
  if (existsSync(join(root, 'pom.xml'))) {
    const mvn = existsSync(join(root, 'mvnw')) ? join(root, 'mvnw') : 'mvn';
    r = await run(mvn, ['-B', '-Dmaven.test.failure.ignore=true', 'test-compile',
      'org.jacoco:jacoco-maven-plugin:0.8.12:prepare-agent',
      'org.apache.maven.plugins:maven-surefire-plugin:3.2.5:test',
      'org.jacoco:jacoco-maven-plugin:0.8.12:report']);
  } else {
    const init = join(dir, 'jacoco.init.gradle');
    writeFileSync(init, [
      'allprojects { p ->',
      '  p.plugins.withType(JavaPlugin) {',
      "    p.apply plugin: 'jacoco'",
      '    p.tasks.withType(Test).configureEach { t ->',
      '      t.ignoreFailures = true',
      "      t.finalizedBy 'jacocoTestReport'",
      '    }',
      '    p.tasks.withType(org.gradle.testing.jacoco.tasks.JacocoReport).configureEach { r ->',
      '      r.reports { rep ->',
      '        try { rep.xml.required = true } catch (ignored) { rep.xml.enabled = true }',
      '      }',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'));
    const g = existsSync(join(root, 'gradlew')) ? join(root, 'gradlew') : 'gradle';
    r = await run(g, ['-I', init, 'test', 'jacocoTestReport', '--continue']);
  }
  const res = parseJUnit();
  if (!res.found) throw new Error('No JUnit reports were produced (compile error or build failure?).\n' + r.out.split('\n').slice(-20).join('\n'));
  return { components: res.components, failures: res.failures, coverage: jacocoCoverage(),
           vulnerabilities: { unavailable: 'not measured for Java (use OWASP Dependency-Check or SonarQube)' } };
}


// ---------------------------------------------------------------- shared parsers
function cobertura(files) {
  let covered = 0, valid = 0, branchSum = 0, n = 0;
  for (const f of files) {
    const xml = readFileSync(f, 'utf8');
    const c = /lines-covered="(\d+)"/.exec(xml), v = /lines-valid="(\d+)"/.exec(xml);
    if (c && v) { covered += Number(c[1]); valid += Number(v[1]); }
    else { const lr = /line-rate="([\d.]+)"/.exec(xml); if (lr) { covered += Number(lr[1]); valid += 1; } }
    const br = /branch-rate="([\d.]+)"/.exec(xml); if (br) { branchSum += Number(br[1]); n++; }
  }
  if (!valid) return null;
  return { lines: Math.round((covered / valid) * 1000) / 10, branches: n ? Math.round((branchSum / n) * 1000) / 10 : undefined };
}
function findFiles(test) { const out = []; walk(root, p => { if (test(p)) out.push(p); }); return out; }
// like walk(), but enters TestWeaver's own output folder
function filesUnder(d) {
  const out = [];
  const go = x => { let ents; try { ents = readdirSync(x, { withFileTypes: true }); } catch { return; } for (const e of ents) { const q = join(x, e.name); if (e.isDirectory()) go(q); else out.push(q); } };
  go(d); return out;
}

// ---------------------------------------------------------------- Python (pytest + pytest-cov)
function pyFailure(component, test, caseXml) {
  const m = /<(?:failure|error)\b([^>]*)>([\s\S]*?)<\/(?:failure|error)>|<(?:failure|error)\b([^>]*)\/>/.exec(caseXml);
  const attrs = m?.[1] ?? m?.[3] ?? '';
  const body = decode(m?.[2] ?? '');
  const message = (decode(/message="([^"]*)"/.exec(attrs)?.[1] ?? '') || body.split('\n').find(l => l.trim()) || 'Test failed').split('\n')[0].trim();
  const frames = [...body.matchAll(/^([^\s:][^:\n]*\.py):(\d+):/gm)].map(f => ({ file: f[1], line: Number(f[2]) }))
    .filter(f => !/site-packages|_pytest|[\\/]\.venv[\\/]|[\\/]venv[\\/]/.test(f.file));
  const isTest = f => /(^|[\\/])test_[^\\/]*\.py$|_test\.py$/.test(f.file);
  const t = frames.find(isTest), s = frames.find(f => !isTest(f));
  return { component, test, file: t ? t.file : component, line: t?.line, sourceFile: s?.file, sourceLine: s?.line,
           message, ...compare(message, test), hint: hintFor(message + '\n' + body) };
}

async function runPython() {
  const junit = join(dir, 'junit.xml'), cov = join(dir, 'coverage.xml'), rc = join(dir, 'coveragerc');
  rmSync(junit, { force: true }); rmSync(cov, { force: true });
  writeFileSync(rc, '[run]\nomit =\n    */test_*.py\n    */*_test.py\n    */tests/*\n    */conftest.py\n    */.venv/*\n    */venv/*\n    */.testweaver/*\n');
  const py = ['.venv', 'venv'].map(v => join(root, v, win ? 'Scripts' : 'bin', win ? 'python.exe' : 'python')).find(existsSync) ?? 'python3';
  const source = existsSync(join(root, 'src')) ? 'src' : '.';
  const r = await run(py, ['-m', 'pytest', '-q', `--junitxml=${junit}`, `--cov=${source}`, `--cov-report=xml:${cov}`, `--cov-config=${rc}`]);
  if (!existsSync(junit)) throw new Error('pytest did not produce a results file (is pytest installed? click "Install libraries and write tests").\n' + r.out.split('\n').slice(-12).join('\n'));
  const xml = readFileSync(junit, 'utf8');
  const byClass = new Map(), failures = [];
  for (const m of xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const attrs = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(a => [a[1], decode(a[2])]));
    const cls = attrs.classname ?? 'unknown';
    const name = componentName(cls.split('.').pop() + '.py');
    const c = byClass.get(cls) ?? { name, file: cls.replace(/\./g, '/') + '.py', passed: 0, failed: 0, skipped: 0 };
    const body = m[2] ?? '';
    if (/<(failure|error)\b/.test(body)) { c.failed++; failures.push(pyFailure(name, attrs.name ?? '', body)); }
    else if (/<skipped\b/.test(body)) c.skipped++;
    else c.passed++;
    byClass.set(cls, c);
  }
  const coverage = existsSync(cov) ? cobertura([cov]) : null;
  return { components: [...byClass.values()], failures, coverage,
           coverageNote: coverage ? undefined : 'pytest-cov produced no coverage.xml (is pytest-cov installed?)',
           vulnerabilities: { unavailable: 'not measured for Python (use pip-audit or SonarQube)' } };
}

// ---------------------------------------------------------------- C# (dotnet test + coverlet)
function parseTrx(file) {
  const xml = readFileSync(file, 'utf8');
  const classOf = new Map();
  for (const m of xml.matchAll(/<UnitTest\b[^>]*?\bid="([^"]+)"[\s\S]*?<TestMethod\b[^>]*?className="([^"]+)"/g)) classOf.set(m[1], m[2]);
  const byClass = new Map(), failures = [];
  for (const m of xml.matchAll(/<UnitTestResult\b([^>]*?)(?:\/>|>([\s\S]*?)<\/UnitTestResult>)/g)) {
    const a = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(x => [x[1], decode(x[2])]));
    const cls = (classOf.get(a.testId) ?? 'Unknown').split('.').pop().split('+')[0];
    const name = componentName(cls + '.cs');
    const c = byClass.get(cls) ?? { name, file: cls + '.cs', passed: 0, failed: 0, skipped: 0 };
    if (a.outcome === 'Passed') c.passed++;
    else if (a.outcome === 'Failed') {
      c.failed++;
      const body = m[2] ?? '';
      const text = decode(/<Message>([\s\S]*?)<\/Message>/.exec(body)?.[1] ?? '');
      const stack = decode(/<StackTrace>([\s\S]*?)<\/StackTrace>/.exec(body)?.[1] ?? '');
      const frames = [...stack.matchAll(/ in (.+?\.cs):line (\d+)/g)].map(f => ({ file: f[1], line: Number(f[2]) }));
      const isTest = f => /\.Tests?[\\/]|Tests?\.cs$/.test(f.file);
      const t = frames.find(isTest), s = frames.find(f => !isTest(f));
      const message = (text.split('\n').find(l => l.trim()) ?? 'Test failed').trim();
      const testName = (a.testName ?? '').split('.').pop();
      failures.push({ component: name, test: testName, file: t ? rel(t.file) : cls + '.cs', line: t?.line, sourceFile: s ? rel(s.file) : undefined, sourceLine: s?.line,
                      message, ...compare(text, testName), hint: hintFor(text + '\n' + stack) });
    } else c.skipped++;
    byClass.set(cls, c);
  }
  return { components: [...byClass.values()], failures };
}

async function runDotnet() {
  const projects = findFiles(p => p.endsWith('.csproj') && readFileSync(p, 'utf8').includes('<!-- testweaver -->'));
  if (!projects.length) throw new Error('No TestWeaver test project found. Click "Install libraries and write tests" first.');
  const out = join(dir, 'dotnet');
  rmSync(out, { recursive: true, force: true });
  let tail = '';
  for (const [i, proj] of projects.entries()) {
    const r = await run('dotnet', ['test', proj, '--logger', `trx;LogFileName=${join(out, `results${i}.trx`)}`, '--collect:XPlat Code Coverage', '--results-directory', join(out, `run${i}`)]);
    tail = r.out;
  }
  const trx = filesUnder(out).filter(p => p.endsWith('.trx'));
  if (!trx.length) throw new Error('dotnet test produced no results (build error? is the .NET SDK installed?).\n' + tail.split('\n').slice(-15).join('\n'));
  const components = [], failures = [];
  for (const f of trx) { const r = parseTrx(f); components.push(...r.components); failures.push(...r.failures); }
  const covFiles = filesUnder(out).filter(p => p.endsWith('coverage.cobertura.xml'));
  const coverage = covFiles.length ? cobertura(covFiles) : null;
  return { components, failures, coverage, coverageNote: coverage ? undefined : 'coverlet produced no coverage.cobertura.xml',
           vulnerabilities: { unavailable: 'not measured for C# (use `dotnet list package --vulnerable` or SonarQube)' } };
}

// ---------------------------------------------------------------- Ruby (RSpec + SimpleCov)
async function runRuby() {
  const json = join(dir, 'rspec.json');
  rmSync(json, { force: true }); rmSync(join(root, 'coverage'), { recursive: true, force: true });
  const r = await run('bundle', ['exec', 'rspec', '--format', 'progress', '--format', 'json', '--out', json]);
  if (!existsSync(json)) throw new Error('RSpec did not produce a results file (is the bundle installed?).\n' + r.out.split('\n').slice(-12).join('\n'));
  const j = JSON.parse(readFileSync(json, 'utf8'));
  const byFile = new Map(), failures = [];
  for (const ex of j.examples ?? []) {
    const file = (ex.file_path ?? '').replace(/^\.\//, '');
    const name = componentName(basename(file));
    const c = byFile.get(file) ?? { name, file, passed: 0, failed: 0, skipped: 0 };
    if (ex.status === 'passed') c.passed++;
    else if (ex.status === 'failed') {
      c.failed++;
      const e = ex.exception ?? {};
      const message = `${e.class ?? 'Error'}: ${String(e.message ?? '').split('\n')[0]}`.trim();
      const frames = (e.backtrace ?? []).map(b => /([^\s:'`]+\.rb):(\d+)/.exec(b)).filter(Boolean).map(m => ({ file: m[1].replace(/^\.\//, ''), line: Number(m[2]) }))
        .filter(f => !/[\\/]gems[\\/]|[\\/]rubies[\\/]|rspec-core|rspec-expectations/.test(f.file));
      const isSpec = f => /(^|[\\/])spec[\\/]|_spec\.rb$/.test(f.file);
      const t = frames.find(isSpec) ?? { file, line: ex.line_number }, s = frames.find(f => !isSpec(f));
      failures.push({ component: name, test: ex.description, file: rel(join(root, t.file)).replace(/^\.\.\/.*\//, '') || t.file, line: t.line,
                      sourceFile: s ? s.file : undefined, sourceLine: s?.line, message, ...compare(message + '\n' + String(e.message ?? ''), ex.description), hint: hintFor(message + '\n' + (e.message ?? '')) });
    } else c.skipped++;
    byFile.set(file, c);
  }
  let coverage = null;
  const last = join(root, 'coverage', '.last_run.json');
  if (existsSync(last)) { const r2 = JSON.parse(readFileSync(last, 'utf8')).result ?? {}; const v = r2.line ?? r2.covered_percent; if (typeof v === 'number') coverage = { lines: v }; }
  return { components: [...byFile.values()], failures, coverage, coverageNote: coverage ? undefined : 'SimpleCov wrote no coverage/.last_run.json (is spec_helper.rb starting SimpleCov?)',
           vulnerabilities: { unavailable: 'not measured for Ruby (use bundler-audit or SonarQube)' } };
}

// ---------------------------------------------------------------- SonarQube / SonarCloud (optional)
async function runSonar() {
  const url = String(cfg.sonar.url).replace(/\/+$/, '');
  const token = process.env.SONAR_TOKEN;
  if (!token) return { skipped: 'No SonarQube token. Enter it in TestWeaver (or set SONAR_TOKEN) to include SonarQube.' };
  if (!['javascript', 'typescript', 'java', 'python'].includes(cfg.language)) return { skipped: `SonarQube scanning is not set up for ${cfg.language} yet.` };
  const props = existsSync(join(root, 'sonar-project.properties')) ? readFileSync(join(root, 'sonar-project.properties'), 'utf8') : '';
  const key = /^sonar\.projectKey=(.+)$/m.exec(props)?.[1]?.trim() ?? basename(root);
  const have = spawnSync('sonar-scanner', ['--version'], { shell: win });
  const [cmd, ...pre] = have.status === 0 ? ['sonar-scanner'] : [win ? 'npx.cmd' : 'npx', '--yes', 'sonarqube-scanner'];
  console.log(`[sonar] analysing ${key} on ${url}`);
  await run(cmd, [...pre, `-Dsonar.host.url=${url}`]);
  const auth = { Authorization: 'Basic ' + Buffer.from(token + ':').toString('base64') };
  const get = async path => { const r = await fetch(url + path, { headers: auth }); if (r.status === 401 || r.status === 403) throw new Error(`the server rejected the token (HTTP ${r.status}); check the token and its permissions`); if (!r.ok) throw new Error(`${path.split('?')[0]} answered ${r.status}`); return r.json(); };
  try {
    const metrics = 'coverage,bugs,vulnerabilities,code_smells,sqale_index,duplicated_lines_density,security_hotspots,ncloc';
    let measures = [];
    for (let i = 0; i < 6 && !measures.length; i++) {
      try { measures = (await get(`/api/measures/component?component=${encodeURIComponent(key)}&metricKeys=${metrics}`)).component?.measures ?? []; } catch (e) { if (i === 5) throw e; }
      if (!measures.length) await new Promise(r => setTimeout(r, 2000));
    }
    const m = k => measures.find(x => x.metric === k)?.value;
    const num = k => (m(k) === undefined ? undefined : Number(m(k)));
    const gate = (await get(`/api/qualitygates/project_status?projectKey=${encodeURIComponent(key)}`)).projectStatus ?? {};
    return {
      url, projectKey: key, status: gate.status ?? 'UNKNOWN', dashboard: `${url}/dashboard?id=${encodeURIComponent(key)}`,
      coverage: num('coverage'), bugs: num('bugs'), vulnerabilities: num('vulnerabilities'), codeSmells: num('code_smells'),
      debtMinutes: num('sqale_index'), duplication: num('duplicated_lines_density'), hotspots: num('security_hotspots'), ncloc: num('ncloc'),
      conditions: (gate.conditions ?? []).map(c => ({ metric: c.metricKey, status: c.status, actual: c.actualValue, threshold: c.errorThreshold })),
    };
  } catch (e) { return { error: `SonarQube could not be queried: ${String(e.message ?? e)}` }; }
}

// ---------------------------------------------------------------- gate
function evaluate(report) {
  const t = report.totals, checks = [];
  if (report.error) checks.push({ name: 'Tests could run', required: 'yes', actual: 'no', passed: false, note: report.error.split('\n')[0] });
  if (cfg.requireAllTestsPass) {
    checks.push({ name: 'All tests pass', required: '0 failed', actual: `${t.failed} failed of ${t.total}`, passed: t.failed === 0 && t.total > 0, note: t.total === 0 ? 'no tests were found' : undefined });
  }
  const cov = report.coverage;
  checks.push({ name: 'Code coverage', required: `at least ${cfg.minCoverage}%`, actual: cov ? `${cov.lines}%` : 'not measured', passed: !!cov && cov.lines >= cfg.minCoverage,
                note: cov ? undefined : 'no coverage report was produced' });
  const v = report.vulnerabilities;
  if (v && 'high' in v) {
    const bad = v.high + v.critical;
    checks.push({ name: 'High/critical vulnerabilities', required: `at most ${cfg.maxHighVulnerabilities}`, actual: `${bad} (${v.critical} critical, ${v.high} high)`, passed: bad <= cfg.maxHighVulnerabilities });
  } else if (v) {
    checks.push({ name: 'High/critical vulnerabilities', required: `at most ${cfg.maxHighVulnerabilities}`, actual: 'not measured', passed: true, note: v.unavailable });
  }
  const sn = report.sonar;
  if (sn && sn.status) checks.push({ name: 'SonarQube quality gate', required: 'OK', actual: sn.status, passed: sn.status === 'OK', note: sn.conditions?.filter(c => c.status !== 'OK').map(c => `${c.metric} ${c.actual}`).join(', ') || undefined });
  else if (sn) checks.push({ name: 'SonarQube quality gate', required: 'OK', actual: 'not checked', passed: true, note: sn.error || sn.skipped });
  return { passed: checks.every(c => c.passed), checks };
}

function print(r) {
  const L = ['', '=== TestWeaver quality gate ===',
    `Tests: ${r.totals.passed} passed, ${r.totals.failed} failed, ${r.totals.skipped} skipped (of ${r.totals.total})`];
  for (const c of r.components) L.push(`  ${c.failed ? 'FAIL' : ' ok '} ${c.name}: ${c.passed} passed, ${c.failed} failed`);
  r.failures.slice(0, 20).forEach(f => {
    L.push('', `FAILED ${f.component} > ${f.test}`);
    L.push(`  at ${f.file}${f.line ? ':' + f.line : ''}${f.sourceFile ? `  (fails in ${f.sourceFile}${f.sourceLine ? ':' + f.sourceLine : ''})` : ''}`);
    if (f.expected !== undefined) L.push(`  expected: ${f.expected}`, `  actual:   ${f.actual}`);
    L.push(`  ${f.message}`);
    if (f.hint) L.push(`  likely cause: ${f.hint}`);
  });
  if (r.failures.length > 20) L.push(`... and ${r.failures.length - 20} more failures (see .testweaver/last-run.json)`);
  L.push('');
  for (const c of r.gate.checks) L.push(`${c.passed ? 'PASS' : 'FAIL'}  ${c.name}: ${c.actual} (required ${c.required})${c.note ? ' - ' + c.note : ''}`);
  if (r.sonar?.status) L.push(`SonarQube: gate ${r.sonar.status}, coverage ${r.sonar.coverage ?? 'n/a'}%, ${r.sonar.bugs ?? 0} bugs, ${r.sonar.vulnerabilities ?? 0} vulnerabilities, ${r.sonar.codeSmells ?? 0} code smells (${r.sonar.dashboard})`);
  L.push(r.gate.passed ? 'GATE PASSED' : 'GATE FAILED: commit/merge blocked');
  console.log(L.join('\n'));
}

let result;
const RUNNERS = { java: runJava, python: runPython, csharp: runDotnet, ruby: runRuby };
try { result = await (RUNNERS[cfg.language] ?? runNode)(); }
catch (e) { result = { components: [], failures: [], coverage: null, vulnerabilities: null, error: String(e.message ?? e) }; }

const sonar = cfg.sonar?.url && !result.error ? await runSonar() : cfg.sonar?.url ? { skipped: 'Tests did not run, so SonarQube was skipped.' } : null;
const sum = k => result.components.reduce((n, c) => n + c[k], 0);
const totals = { passed: sum('passed'), failed: sum('failed'), skipped: sum('skipped') };
totals.total = totals.passed + totals.failed + totals.skipped;
const report = { language: cfg.language, durationMs: Date.now() - started, totals, components: result.components, failures: result.failures,
                 coverage: result.coverage, coverageNote: result.coverageNote, vulnerabilities: result.vulnerabilities, sonar, error: result.error, gate: null };
report.gate = evaluate(report);
writeFileSync(join(dir, 'last-run.json'), JSON.stringify(report, null, 2));
print(report);
process.exit(report.gate.passed ? 0 : 1);

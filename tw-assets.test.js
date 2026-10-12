// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Structure checks for CSS, JSON, HTML and WebAssembly files, written by TestWeaver.
const root = fileURLToPath(new URL('.', import.meta.url));
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const count = (s, c) => s.split(c).length - 1;

// tw:generated asset .vite/deps/_metadata.json
describe(".vite/deps/_metadata.json", () => {
  it('is valid JSON', () => {
    expect(() => JSON.parse(read(".vite/deps/_metadata.json"))).not.toThrow();
  });
});

// tw:generated asset .vite/deps/package.json
describe(".vite/deps/package.json", () => {
  it('is valid JSON', () => {
    expect(() => JSON.parse(read(".vite/deps/package.json"))).not.toThrow();
  });
});

// tw:generated asset index.html
describe("index.html", () => {
  it('is not empty', () => {
    expect(read("index.html").trim().length).toBeGreaterThan(0);
  });

  it('declares a doctype', () => {
    expect(read("index.html")).toMatch(/<!doctype html>/i);
  });

  it('has a title', () => {
    expect(read("index.html")).toMatch(/<title>/i);
  });

  it('has matching div tags', () => {
    const html = read("index.html");
    expect((html.match(/<div\b/gi) || []).length).toBe((html.match(/<\/div>/gi) || []).length);
  });
});

// tw:generated asset package.json
describe("package.json", () => {
  it('is valid JSON', () => {
    expect(() => JSON.parse(read("package.json"))).not.toThrow();
  });
});

// tw:generated asset src/styles.css
describe("src/styles.css", () => {
  it('is not empty', () => {
    expect(read("src/styles.css").trim().length).toBeGreaterThan(0);
  });

  it('has balanced braces', () => {
    const css = read("src/styles.css")
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(["'])(?:\\.|(?!\1)[^\n])*\1/g, '');
    expect(count(css, '{')).toBe(count(css, '}'));
  });
});

// tw:generated asset src/themes/ui-kit.css
describe("src/themes/ui-kit.css", () => {
  it('is not empty', () => {
    expect(read("src/themes/ui-kit.css").trim().length).toBeGreaterThan(0);
  });

  it('has balanced braces', () => {
    const css = read("src/themes/ui-kit.css")
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(["'])(?:\\.|(?!\1)[^\n])*\1/g, '');
    expect(count(css, '{')).toBe(count(css, '}'));
  });
});

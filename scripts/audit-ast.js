#!/usr/bin/env node
'use strict';

/**
 * SorobanMind Audit v8
 * Read-only static analysis using TypeScript Compiler API.
 * Writes reports under audit-output/ and never edits src/.
 */

const fs = require('node:fs');
const path = require('node:path');

let ts;
try {
  ts = require('typescript');
} catch {
  console.error(
    'TypeScript is unavailable. Install it with: npm install --no-save --no-package-lock typescript'
  );
  process.exit(2);
}

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'audit-output');
const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next',
]);
const EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts']);

const data = {
  metadata: {
    audit: 'SorobanMind Audit v8',
    generatedAt: new Date().toISOString(),
    mode: 'read-only static analysis',
    limitations: [
      'Static analysis does not prove runtime reachability.',
      'Dynamic imports and computed keys may not be fully resolved.',
      'Call names are syntactic names, not guaranteed symbol resolution.',
      'Detected stores are candidates requiring manual confirmation.',
    ],
  },
  files: [],
  imports: [],
  calls: [],
  storageKeys: [],
  storageOperations: [],
  stores: [],
  keyReferences: [],
  gaps: [],
  errors: [],
};

const rel = file => path.relative(ROOT, file).split(path.sep).join('/');
const ensureDir = dir => fs.mkdirSync(dir, { recursive: true });
const write = (name, value) =>
  fs.writeFileSync(path.join(OUT, name), `${value}\n`, 'utf8');

function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    data.errors.push({ file: rel(dir), message: String(error.message || error) });
    return result;
  }

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, result);
    else if (EXTENSIONS.has(path.extname(entry.name))) result.push(full);
  }
  return result;
}

function loc(sf, node) {
  const p = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  return { file: rel(sf.fileName), line: p.line + 1, column: p.character + 1 };
}

function staticString(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (
    ts.isParenthesizedExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isSatisfiesExpression(node)
  ) return staticString(node.expression);
  return null;
}

function nodeText(node, sf) {
  return node ? node.getText(sf) : '';
}

function nameOf(node, sf) {
  if (!node) return '<unknown>';
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isPropertyAccessExpression(node) || ts.isPropertyAccessChain(node)) {
    return `${nameOf(node.expression, sf)}.${node.name.text}`;
  }
  if (ts.isElementAccessExpression(node)) {
    return `${nameOf(node.expression, sf)}[${
      staticString(node.argumentExpression) ??
      nodeText(node.argumentExpression, sf) ?? '?'
    }]`;
  }
  return nodeText(node, sf);
}

function propertyName(node, sf) {
  if (!node) return null;
  if (
    ts.isIdentifier(node) ||
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node)
  ) return node.text;
  if (ts.isComputedPropertyName(node)) {
    return staticString(node.expression) ??
      `[dynamic:${nodeText(node.expression, sf)}]`;
  }
  return nodeText(node, sf);
}

function addUnique(list, item, key) {
  if (!list.some(old => key(old) === key(item))) list.push(item);
}

function storageOperation(method) {
  const m = method.toLowerCase();
  if (m === 'getitem') return 'read';
  if (m === 'setitem') return 'write';
  if (m === 'removeitem' || m === 'clear') return 'delete-or-clear';
  return 'unknown';
}

function inspect(file) {
  let source;
  try {
    source = fs.readFileSync(file, 'utf8');
  } catch (error) {
    data.errors.push({ file: rel(file), message: String(error.message || error) });
    return;
  }

  const sf = ts.createSourceFile(
    file, source, ts.ScriptTarget.Latest, true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  data.files.push({
    path: rel(file),
    lines: source.split(/\r?\n/).length,
    bytes: Buffer.byteLength(source, 'utf8'),
  });

  function visit(node) {
    const position = loc(sf, node);

    if (ts.isImportDeclaration(node)) {
      data.imports.push({
        ...position,
        kind: 'static-import',
        module: staticString(node.moduleSpecifier) ?? '<dynamic>',
        bindings: node.importClause ? nodeText(node.importClause, sf) : '',
      });
    }

    if (ts.isCallExpression(node)) {
      const callName = nameOf(node.expression, sf);
      data.calls.push({
        ...position,
        name: callName,
        argumentCount: node.arguments.length,
        expression: nodeText(node, sf).slice(0, 300),
      });

      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        data.imports.push({
          ...position,
          kind: 'dynamic-import',
          module: staticString(node.arguments[0]) ?? '<dynamic>',
          bindings: '',
        });
      }

      if (
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'require'
      ) {
        data.imports.push({
          ...position,
          kind: 'require',
          module: staticString(node.arguments[0]) ?? '<dynamic>',
          bindings: '',
        });
      }

      const callee = node.expression;
      if (
        ts.isPropertyAccessExpression(callee) ||
        ts.isPropertyAccessChain(callee)
      ) {
        const receiver = nameOf(callee.expression, sf);
        const method = callee.name.text;
        if ([
          'localStorage', 'window.localStorage',
          'sessionStorage', 'window.sessionStorage',
        ].includes(receiver)) {
          const key = staticString(node.arguments[0]);
          const operation = storageOperation(method);
          data.storageOperations.push({
            ...position, storage: receiver, method, operation,
            key: key ?? '<dynamic-or-missing>',
            keyIsStatic: key !== null,
            valueExpression: method === 'setItem'
              ? nodeText(node.arguments[1], sf).slice(0, 200) || null
              : null,
          });
          if (key !== null) {
            addUnique(
              data.storageKeys,
              { ...position, storage: receiver, key, operation },
              x => `${x.file}|${x.line}|${x.storage}|${x.key}|${x.operation}`
            );
          } else {
            data.gaps.push({
              type: 'dynamic-storage-key',
              ...position,
              detail: `${receiver}.${method} uses a non-static key`,
              expression: nodeText(node, sf).slice(0, 250),
            });
          }
        }
      }

      const snippet = nodeText(node, sf).slice(0, 500);
      if (
        /create(?:Store)?|persist|createJSONStorage|combine|subscribeWithSelector/i.test(callName) &&
        /zustand|persist|createStore|createJSONStorage|combine|subscribeWithSelector/i.test(
          `${callName} ${snippet}`
        )
      ) {
        data.stores.push({
          ...position,
          call: callName,
          classification: /persist|createJSONStorage/i.test(`${callName} ${snippet}`)
            ? 'store-or-persistence-candidate'
            : 'store-candidate',
          snippet,
        });
      }
    }

    if (ts.isPropertyAccessExpression(node)) {
      const isCallTarget =
        ts.isCallExpression(node.parent) && node.parent.expression === node;
      if (!isCallTarget && /store|progress|mastery|badge|quest|state|persist|storage/i.test(node.name.text)) {
        data.keyReferences.push({
          ...position,
          reference: nodeText(node, sf),
        });
      }
    }

    if (
      ts.isPropertyAssignment(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isPropertyDeclaration(node)
    ) {
      const key = propertyName(node.name, sf);
      if (key !== null && /^(id|key|storage|name|version|state|progress|level|lesson|skill|score|xp|streak|badges|mastery|questions|phase|variant|attempts|cooldown|passed|completed|language|sound|haptics)$/i.test(key)) {
        data.keyReferences.push({ ...position, reference: `property:${key}` });
      }
    }

    ts.forEachChild(node, visit);
  }

  try {
    visit(sf);
  } catch (error) {
    data.errors.push({ file: rel(file), message: String(error.stack || error) });
  }

  for (const diagnostic of sf.parseDiagnostics || []) {
    const p = sf.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    data.errors.push({
      file: rel(file),
      line: p.line + 1,
      type: 'parse-diagnostic',
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    });
  }
}

function table(headers, rows) {
  const cell = v => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  return [
    `| ${headers.map(cell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n');
}

function reports() {
  ensureDir(OUT);

  const summary = [
    '# SorobanMind Audit v8 — Summary',
    '',
    `- Generated: ${data.metadata.generatedAt}`,
    `- Source files scanned: ${data.files.length}`,
    `- Imports found: ${data.imports.length}`,
    `- Call expressions found: ${data.calls.length}`,
    `- Static storage-key operations: ${data.storageKeys.length}`,
    `- Storage operations total: ${data.storageOperations.length}`,
    `- Store/persistence candidates: ${data.stores.length}`,
    `- Key/property references: ${data.keyReferences.length}`,
    `- Gaps requiring review: ${data.gaps.length}`,
    `- Errors/diagnostics: ${data.errors.length}`,
    '',
    '## Limitations',
    ...data.metadata.limitations.map(x => `- ${x}`),
    '',
  ].join('\n');
  write('SUMMARY.md', summary);

  write('KEYS_TABLE.md', [
    '# Storage Keys',
    '',
    table(['Storage', 'Key', 'Operation', 'Location'], data.storageKeys.map(x => [
      x.storage, x.key, x.operation, `${x.file}:${x.line}`,
    ])),
    '',
    '## Dynamic or unresolved storage operations',
    '',
    table(['Storage', 'Method', 'Key', 'Location'], data.storageOperations
      .filter(x => !x.keyIsStatic)
      .map(x => [x.storage, x.method, x.key, `${x.file}:${x.line}`])),
    '',
  ].join('\n'));

  write('STORES_TABLE.md', [
    '# Store and Persistence Candidates',
    '',
    table(['Classification', 'Call', 'Location', 'Snippet'], data.stores.map(x => [
      x.classification, x.call, `${x.file}:${x.line}`, x.snippet,
    ])),
    '',
    '> Candidates only; verify imports and runtime usage before classifying a store as active.',
    '',
  ].join('\n'));

  write('GAPS.md', [
    '# Audit Gaps and Diagnostics',
    '',
    table(['Type', 'Location', 'Detail'], data.gaps.map(x => [
      x.type, `${x.file}:${x.line}`, x.detail,
    ])),
    '',
    '## Parse errors and script errors',
    '',
    table(['Type', 'Location', 'Message'], data.errors.map(x => [
      x.type || 'error',
      x.line ? `${x.file}:${x.line}` : x.file,
      x.message,
    ])),
    '',
    '## Manual follow-up',
    '',
    '- Trace dynamic storage keys and computed expressions.',
    '- Confirm which stores are imported by active screens.',
    '- Follow imports to distinguish legacy and active data flows.',
    '- Static analysis cannot establish actual runtime reads/writes.',
    '',
  ].join('\n'));

  write('MASTER_REPORT.md', [
    '# SorobanMind — Audit v8 Master Report',
    '',
    summary,
    '## Imports',
    '',
    table(['Kind', 'Module', 'Location', 'Bindings'], data.imports.map(x => [
      x.kind, x.module, `${x.file}:${x.line}`, x.bindings,
    ])),
    '',
    '## Call expressions',
    '',
    table(['Call', 'Arguments', 'Location', 'Expression'], data.calls.map(x => [
      x.name, x.argumentCount, `${x.file}:${x.line}`, x.expression,
    ])),
    '',
    '## Storage operations',
    '',
    table(['Storage', 'Method', 'Operation', 'Key', 'Location'], data.storageOperations.map(x => [
      x.storage, x.method, x.operation, x.key, `${x.file}:${x.line}`,
    ])),
    '',
    '## Store candidates',
    '',
    table(['Classification', 'Call', 'Location'], data.stores.map(x => [
      x.classification, x.call, `${x.file}:${x.line}`,
    ])),
    '',
    '## Source inventory',
    '',
    table(['File', 'Lines', 'Bytes'], data.files.map(x => [
      x.path, x.lines, x.bytes,
    ])),
    '',
    '## Machine-readable data',
    '',
    'See `audit-data.json` for the complete inventory.',
    '',
  ].join('\n'));

  write('audit-data.json', JSON.stringify(data, null, 2));
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source directory not found: src/');
    process.exit(2);
  }
  const files = walk(SRC).sort();
  if (!files.length) {
    console.error('No TypeScript/TSX source files found under src/.');
    process.exit(2);
  }
  for (const file of files) inspect(file);
  try {
    reports();
  } catch (error) {
    console.error('Failed to write audit reports:', error);
    process.exit(2);
  }
  console.log(`Audit v8 completed: ${files.length} source files.`);
  console.log(`Reports written to: ${rel(OUT)}/`);
  console.log(`Diagnostics: ${data.errors.length}`);
  console.log(`Review gaps: ${data.gaps.length}`);
}

main();

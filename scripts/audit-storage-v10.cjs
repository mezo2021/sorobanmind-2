#!/usr/bin/env node
'use strict';

/**
 * SorobanMind Storage Lifecycle Audit v10
 * Read-only TypeScript AST audit. Does not modify src/ or application data.
 * Requires the project's existing TypeScript dependency.
 */

const fs = require('node:fs');
const path = require('node:path');

let ts;
try {
  ts = require('typescript');
} catch {
  console.error('TypeScript is unavailable. Run npm ci before this audit.');
  process.exit(2);
}

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'audit-storage-v10');
const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);
const EXT = new Set(['.ts', '.tsx', '.mts', '.cts']);

const result = {
  metadata: {
    audit: 'SorobanMind Storage Lifecycle Audit v10',
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY || 'local',
    commit: process.env.GITHUB_SHA || 'local',
    mode: 'read-only TypeScript AST analysis',
    limitations: [
      'Static analysis does not prove runtime reachability or browser execution order.',
      'Computed values depending on runtime inputs remain unresolved.',
      'Aliases created by arbitrary assignments and reflection may not be resolved.',
      'A direct localStorage call is not automatically a defect; identity, security and device preferences may intentionally remain unprefixed.',
      'Classification labels are suggestions based on key names, not authorization to migrate or delete data.',
    ],
  },
  files: [],
  operations: [],
  enumeration: [],
  persistStores: [],
  lifecycleFunctions: [],
  unresolved: [],
  diagnostics: [],
};

const rel = file => path.relative(ROOT, file).split(path.sep).join('/');
const pos = (sf, node) => {
  const p = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  return { file: rel(sf.fileName), line: p.line + 1, column: p.character + 1 };
};
const textOf = (node, sf, max = 260) => node ? node.getText(sf).replace(/\s+/g, ' ').slice(0, max) : '';

function classifyKey(key) {
  if (!key || key.startsWith('<dynamic')) return 'UNCLASSIFIED_DYNAMIC';
  const k = key.toLowerCase();
  if (k === 'soroban_mode') return 'APP_MODE_IDENTITY';
  if (/guardian|pin|recovery|lock_until|attempts/.test(k)) return 'GUARDIAN_SECURITY_CANDIDATE';
  if (/hero|child_name|avatar|companion|profile/.test(k)) return 'DEVICE_OR_HERO_IDENTITY_CANDIDATE';
  if (/lang|language|number_style|theme|sound|haptic|preview/.test(k)) return 'DEVICE_PREFERENCE_OR_PREVIEW_CANDIDATE';
  if (/progress|level|lesson|skill|exam|score|streak|xp|badge|quest|attempt|certificate|placement/.test(k)) return 'LEARNING_OR_GAME_DATA_CANDIDATE';
  if (/archive|backup|history|leaderboard|duel/.test(k)) return 'HISTORY_OR_ARCHIVE_CANDIDATE';
  return 'UNCLASSIFIED_REVIEW';
}

function parseProject() {
  const configPath = ts.findConfigFile(ROOT, ts.sys.fileExists, 'tsconfig.json');
  if (configPath) {
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    if (config.error) result.diagnostics.push({ type: 'tsconfig-read', message: ts.flattenDiagnosticMessageText(config.error.messageText, '\n') });
    const parsed = ts.parseJsonConfigFileContent(config.config || {}, ts.sys, path.dirname(configPath), { noEmit: true }, configPath);
    for (const d of parsed.errors || []) result.diagnostics.push({ type: 'tsconfig-parse', message: ts.flattenDiagnosticMessageText(d.messageText, '\n') });
    return ts.createProgram({ rootNames: walk(SRC).sort(), options: { ...parsed.options, noEmit: true, skipLibCheck: true } });
  }
  const files = walk(SRC);
  return ts.createProgram({ rootNames: files, options: { target: ts.ScriptTarget.Latest, jsx: ts.JsxEmit.ReactJSX, allowJs: false, noEmit: true, skipLibCheck: true } });
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function unwrap(expr) {
  while (expr && (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr) || ts.isTypeAssertionExpression(expr) || ts.isSatisfiesExpression(expr))) expr = expr.expression;
  return expr;
}

function resolveStatic(expr, checker, seen = new Set()) {
  expr = unwrap(expr);
  if (!expr) return { value: null, resolved: false };
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return { value: expr.text, resolved: true };
  if (ts.isNumericLiteral(expr)) return { value: expr.text, resolved: true };
  if (ts.isTemplateExpression(expr)) {
    let value = expr.head.text;
    let complete = true;
    for (const span of expr.templateSpans) {
      const part = resolveStatic(span.expression, checker, seen);
      if (part.resolved) value += String(part.value);
      else { value += '${' + span.expression.getText() + '}'; complete = false; }
      value += span.literal.text;
    }
    return { value, resolved: complete, partial: value };
  }
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const a = resolveStatic(expr.left, checker, seen);
    const b = resolveStatic(expr.right, checker, seen);
    if (a.resolved && b.resolved) return { value: String(a.value) + String(b.value), resolved: true };
    return { value: null, resolved: false, partial: `${a.resolved ? a.value : expr.left.getText()} + ${b.resolved ? b.value : expr.right.getText()}` };
  }
  if (ts.isIdentifier(expr) || ts.isPropertyAccessExpression(expr)) {
    let symbol = checker.getSymbolAtLocation(expr) || (ts.isPropertyAccessExpression(expr) ? checker.getSymbolAtLocation(expr.name) : undefined);
    if (symbol && (symbol.flags & ts.SymbolFlags.Alias)) {
      try { symbol = checker.getAliasedSymbol(symbol); } catch { /* unresolved import */ }
    }
    if (symbol && !seen.has(symbol)) {
      const next = new Set(seen); next.add(symbol);
      const decl = symbol.valueDeclaration || (symbol.declarations || []).find(d => d.initializer);
      if (decl && ts.isVariableDeclaration(decl)) {
        const list = decl.parent;
        if (!ts.isVariableDeclarationList(list) || !(list.flags & ts.NodeFlags.Const)) return { value: null, resolved: false };
      }
      if (decl && decl.initializer) return resolveStatic(decl.initializer, checker, next);
      if (decl && ts.isPropertyAssignment(decl)) return resolveStatic(decl.initializer, checker, next);
    }
  }
  return { value: null, resolved: false };
}

function isStorageAdapter(receiver, adapterAliases) {
  receiver = unwrap(receiver);
  return !!receiver && ts.isIdentifier(receiver) && adapterAliases.has(receiver.text);
}

function storageKind(receiver, adapterAliases, sf) {
  receiver = unwrap(receiver);
  if (!receiver) return null;
  const name = receiver.getText();
  if (rel(sf.fileName) === 'src/utils/storage.ts') return 'STORAGE_ADAPTER_INTERNAL';
  if (name === 'localStorage' || name === 'window.localStorage' || name === 'globalThis.localStorage') return 'DIRECT_LOCAL_STORAGE';
  if (name === 'sessionStorage' || name === 'window.sessionStorage' || name === 'globalThis.sessionStorage') return 'DIRECT_SESSION_STORAGE';
  if (isStorageAdapter(receiver, adapterAliases)) return 'APP_STORAGE_ADAPTER';
  return null;
}

function receiverName(expr) {
  return expr ? expr.getText().replace(/\s+/g, '') : '';
}

function nearestFunction(node, sf) {
  let n = node.parent;
  while (n && n !== sf) {
    if (ts.isFunctionDeclaration(n)) return n.name ? n.name.text : '<anonymous-function>';
    if (ts.isMethodDeclaration(n)) return n.name.getText(sf);
    if (ts.isArrowFunction(n) || ts.isFunctionExpression(n)) {
      const p = n.parent;
      if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
      if (ts.isPropertyAssignment(p)) return p.name.getText(sf);
      return '<callback-or-anonymous-function>';
    }
    n = n.parent;
  }
  return '<module-scope>';
}

function isStorageObject(expr) {
  const t = receiverName(expr);
  return ['localStorage', 'window.localStorage', 'globalThis.localStorage', 'sessionStorage', 'window.sessionStorage', 'globalThis.sessionStorage'].includes(t);
}

function addOperation(sf, node, checker, adapterAliases, method, receiver, args) {
  const kind = storageKind(receiver, adapterAliases, sf);
  if (!kind) return;
  const isEnumeration = method === 'key' || method === 'clear' || method === 'length';
  const keyArg = args && args[0];
  const resolved = keyArg ? resolveStatic(keyArg, checker) : { value: null, resolved: false };
  const key = resolved.resolved ? String(resolved.value) : (resolved.partial ? `<dynamic:${resolved.partial}>` : '<no-static-key>');
  const operation = method === 'getItem' ? 'READ' : method === 'setItem' ? 'WRITE' : method === 'removeItem' ? 'DELETE_ONE' : method === 'clear' ? 'CLEAR_ALL' : method === 'key' ? 'ENUMERATE_KEY' : method === 'length' ? 'READ_LENGTH' : 'OTHER';
  const row = {
    ...pos(sf, node), startOffset: node.getStart(sf), endOffset: node.end, function: nearestFunction(node, sf), storage: kind,
    method, operation, key, keyResolved: !!resolved.resolved,
    classification: classifyKey(resolved.resolved ? String(resolved.value) : key),
    expression: textOf(node, sf),
  };
  result.operations.push(row);
  if (isEnumeration) result.enumeration.push(row);
  if (!resolved.resolved && !isEnumeration) result.unresolved.push({ ...row, reason: 'Key expression could not be fully resolved statically.' });
}

function objectProperty(obj, name) {
  if (!obj || !ts.isObjectLiteralExpression(obj)) return null;
  for (const p of obj.properties) {
    if ((ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) && p.name && (p.name.text === name || (ts.isStringLiteral(p.name) && p.name.text === name))) return p;
  }
  return null;
}

function main() {
  if (!fs.existsSync(SRC)) { console.error('Source directory not found: src/'); process.exit(2); }
  const program = parseProject();
  const checker = program.getTypeChecker();
  const sourceFiles = program.getSourceFiles().filter(sf => sf.fileName.startsWith(SRC) && EXT.has(path.extname(sf.fileName)));
  if (!sourceFiles.length) { console.error('No TypeScript source files found under src/.'); process.exit(2); }

  for (const sf of sourceFiles) {
    const adapterAliases = new Set();
    for (const stmt of sf.statements) {
      if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier) && /(^|\/)utils\/storage$/.test(stmt.moduleSpecifier.text.replace(/\\/g, '/')) && stmt.importClause && stmt.importClause.namedBindings && ts.isNamedImports(stmt.importClause.namedBindings)) {
        for (const el of stmt.importClause.namedBindings.elements) if (el.propertyName ? el.propertyName.text === 'storage' : el.name.text === 'storage') adapterAliases.add(el.name.text);
      }
    }
    let sourceText = sf.text;
    result.files.push({ path: rel(sf.fileName), lines: sourceText.split(/\r?\n/).length, bytes: Buffer.byteLength(sourceText, 'utf8') });
    for (const d of sf.parseDiagnostics || []) {
      const p = sf.getLineAndCharacterOfPosition(d.start || 0);
      result.diagnostics.push({ file: rel(sf.fileName), line: p.line + 1, type: 'parse', message: ts.flattenDiagnosticMessageText(d.messageText, '\n') });
    }

    function visit(node) {
      if (ts.isCallExpression(node)) {
        const callee = unwrap(node.expression);
        if (ts.isPropertyAccessExpression(callee)) {
          const method = callee.name.text;
          const recv = callee.expression;
          if (['getItem', 'setItem', 'removeItem', 'clear', 'key'].includes(method)) addOperation(sf, node, checker, adapterAliases, method, recv, node.arguments);
        }
        if (ts.isCallExpression(callee) && callee.expression && callee.expression.kind === ts.SyntaxKind.ImportKeyword) {
          // Dynamic imports are intentionally not treated as storage operations.
        }

        const callName = ts.isIdentifier(callee) ? callee.text : ts.isPropertyAccessExpression(callee) ? callee.name.text : '';
        if (callName === 'persist') {
          const options = node.arguments[node.arguments.length - 1];
          const nameProp = objectProperty(options, 'name');
          const storageProp = objectProperty(options, 'storage');
          const nameExpr = nameProp && nameProp.initializer;
          const nameValue = nameExpr ? resolveStatic(nameExpr, checker) : { resolved: false };
          const storageText = storageProp ? textOf(storageProp.initializer, sf) : (textOf(options, sf, 800).includes('createJSONStorage') ? 'createJSONStorage(...)' : '<default Zustand storage>');
          result.persistStores.push({ ...pos(sf, node), function: nearestFunction(node, sf), name: nameValue.resolved ? String(nameValue.value) : (nameExpr ? `<dynamic:${textOf(nameExpr, sf, 100)}>` : '<missing-name>'), nameResolved: !!nameValue.resolved, storage: storageText, expression: textOf(node, sf, 500) });
        }
      }

      if (ts.isPropertyAccessExpression(node) && node.name.text === 'length' && isStorageObject(node.expression)) {
        addOperation(sf, node, checker, adapterAliases, 'length', node.expression, []);
      }

      // Object.keys(localStorage), Object.entries(localStorage), and for..in patterns.
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && ['keys', 'entries', 'values'].includes(node.expression.name.text) && node.arguments[0] && isStorageObject(node.arguments[0])) {
        const p = pos(sf, node);
        result.enumeration.push({ ...p, function: nearestFunction(node, sf), storage: receiverName(node.arguments[0]), method: `Object.${node.expression.name.text}`, operation: 'ENUMERATE_ALL_KEYS', key: '*', keyResolved: false, classification: 'ENUMERATION_REVIEW', expression: textOf(node, sf) });
      }

      if (ts.isForInStatement(node) && isStorageObject(node.expression)) {
        result.enumeration.push({ ...pos(sf, node), function: nearestFunction(node, sf), storage: receiverName(node.expression), method: 'for..in', operation: 'ENUMERATE_ALL_KEYS', key: '*', keyResolved: false, classification: 'ENUMERATION_REVIEW', expression: textOf(node, sf) });
      }

      // Capture reset/backup/restore/sync function names with storage operations inside.
      const fnName = (ts.isFunctionDeclaration(node) && node.name && node.name.text) ||
        ((ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isPropertyAssignment(node) || ts.isVariableDeclaration(node)) && node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : '');
      if (fnName && /reset|wipe|clear|delete|remove|backup|restore|export|import|sync|migrate/i.test(fnName)) {
        const start = node.getStart(sf), end = node.end;
        result.lifecycleFunctions.push({ ...pos(sf, node), startOffset: start, endOffset: end, name: fnName, expression: textOf(node, sf, 420) });
      }

      ts.forEachChild(node, visit);
    }
    visit(sf);
  }

  // Resolve function-to-operation membership after the complete AST walk.
  result.lifecycleFunctions = result.lifecycleFunctions.filter((x, i, a) => a.findIndex(y => y.file === x.file && y.line === x.line && y.name === x.name) === i).map(fn => {
    const contained = result.operations.filter(op => op.file === fn.file && op.startOffset >= fn.startOffset && op.endOffset <= fn.endOffset);
    return { ...fn, operationCount: contained.length, operations: contained.map(x => `${x.operation}:${x.storage}:${x.key}`) };
  });
  result.operations.sort((a,b) => a.file.localeCompare(b.file) || a.line-b.line || a.column-b.column);
  result.persistStores.sort((a,b) => a.file.localeCompare(b.file) || a.line-b.line);

  fs.mkdirSync(OUT, { recursive: true });
  const byKey = new Map();
  for (const op of result.operations.filter(x => x.storage !== 'STORAGE_ADAPTER_INTERNAL')) {
    const k = `${op.storage}|${op.key}|${op.classification}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(op);
  }
  const inventoryRows = [...byKey.entries()].map(([k, ops]) => {
    const [storage, key, classification] = k.split('|');
    return { storage, key, classification, reads: ops.filter(x=>x.operation==='READ').length, writes: ops.filter(x=>x.operation==='WRITE').length, deletes: ops.filter(x=>x.operation==='DELETE_ONE').length, locations: ops.map(x=>`${x.file}:${x.line}`).join('; ') };
  });
  const mdTable = (headers, rows) => [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(()=> '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(v => String(v ?? '').replace(/\|/g,'\\|').replace(/\r?\n/g,' ')).join(' | ')} |`),
  ].join('\n');
  const write = (name, content) => fs.writeFileSync(path.join(OUT, name), content.endsWith('\n') ? content : content+'\n', 'utf8');

  const direct = result.operations.filter(x => x.storage.startsWith('DIRECT_'));
  const adapter = result.operations.filter(x => x.storage === 'APP_STORAGE_ADAPTER');
  const adapterInternal = result.operations.filter(x => x.storage === 'STORAGE_ADAPTER_INTERNAL');
  const destructive = result.operations.filter(x => ['DELETE_ONE','CLEAR_ALL'].includes(x.operation));
  const summary = [
    '# SorobanMind Storage Lifecycle Audit v10', '',
    `- Generated: ${result.metadata.generatedAt}`,
    `- Commit: ${result.metadata.commit}`,
    `- Source files scanned: ${result.files.length}`,
    `- Storage operations detected: ${result.operations.length}`,
    `- Direct browser-storage operations: ${direct.length}`,
    `- App storage-adapter operations: ${adapter.length}`,
    `- Adapter implementation internals: ${adapterInternal.length}`,
    `- Delete/clear operations: ${destructive.length}`,
    `- Enumeration operations: ${result.enumeration.length}`,
    `- Zustand persist candidates: ${result.persistStores.length}`,
    `- Unresolved key expressions (excluding adapter internals): ${result.unresolved.filter(x => x.storage !== 'STORAGE_ADAPTER_INTERNAL').length}`,
    `- Parse/config diagnostics: ${result.diagnostics.length}`,
    '', '## Interpretation rules',
    '- Direct localStorage/sessionStorage use is a review item, not automatically a defect.',
    '- Adapter keys are logical names; at runtime storage.ts prefixes them with the active mode.',
    '- The adapter exposes getItem/setItem/removeItem only; it does not expose clear/key/length.',
    '- Classification is heuristic and must not be used to delete, migrate, or rewrite data.',
    '', '## Static-analysis limitations', ...result.metadata.limitations.map(x=>`- ${x}`), ''
  ].join('\n');
  write('SUMMARY.md', summary);
  write('STORAGE_INVENTORY.md', '# Storage Inventory\n\n' + mdTable(['Storage API','Key','Classification','Reads','Writes','Deletes','Locations'], inventoryRows.map(x=>[x.storage,x.key,x.classification,x.reads,x.writes,x.deletes,x.locations])) + '\n');
  write('ISOLATION_AUDIT.md', [
    '# Isolation Audit', '',
    'Direct browser-storage calls are listed for review. Some are expected device identity, security, migration, or preference operations.', '',
    '## Direct localStorage/sessionStorage', '',
    mdTable(['Operation','Key','Function','Location','Expression'], direct.map(x=>[x.operation,x.key,x.function,`${x.file}:${x.line}`,x.expression])),
    '', '## App storage adapter', '',
    mdTable(['Operation','Logical key','Function','Location','Runtime namespace'], adapter.map(x=>[x.operation,x.key,x.function,`${x.file}:${x.line}`, 'local:<key> or cloud:<key> based on active mode'])),
    '', '## Adapter implementation internals', '',
    mdTable(['Operation','Key','Function','Location','Expression'], adapterInternal.map(x=>[x.operation,x.key,x.function,`${x.file}:${x.line}`,x.expression])),
    '', '## Review note',
    'Confirm each direct operation is intentional. Do not bulk-convert identity, guardian-security, app-mode, language, or migration keys.'
  ].join('\n'));
  write('DELETE_RESET_AUDIT.md', [
    '# Delete / Reset / Enumeration Audit', '',
    '## Destructive operations', '',
    mdTable(['Operation','Storage','Key','Function','Location','Expression'], destructive.map(x=>[x.operation,x.storage,x.key,x.function,`${x.file}:${x.line}`,x.expression])),
    '', '## Key enumeration and whole-storage access', '',
    mdTable(['Operation','Storage','Function','Location','Expression'], result.enumeration.map(x=>[x.operation,x.storage,x.function,`${x.file}:${x.line}`,x.expression])),
    '', '## Reset / backup / restore / sync-like functions', '',
    mdTable(['Function','Storage operations detected','Operations','Location','Snippet'], result.lifecycleFunctions.map(x=>[x.name,x.operationCount,x.operations.join('; '),`${x.file}:${x.line}`,x.expression])),
    '', 'A function name match is a review lead, not proof that the function is reachable or that every indirect effect is captured.'
  ].join('\n'));
  write('LIFECYCLE_MAP.md', [
    '# Storage Lifecycle Map', '',
    '## Key inventory', '',
    mdTable(['Storage','Key','Classification suggestion','Read','Write','Delete','Locations'], inventoryRows.map(x=>[x.storage,x.key,x.classification,x.reads,x.writes,x.deletes,x.locations])),
    '', '## Zustand persist candidates', '',
    mdTable(['Persist name','Name resolved','Configured storage','Location','Snippet'], result.persistStores.map(x=>[x.name,x.nameResolved?'yes':'no',x.storage,`${x.file}:${x.line}`,x.expression])),
    '', '## Unresolved key expressions', '',
    mdTable(['Storage','Method','Expression / partial key','Function','Location'], result.unresolved.filter(x => x.storage !== 'STORAGE_ADAPTER_INTERNAL').map(x=>[x.storage,x.method,x.key,x.function,`${x.file}:${x.line}`])),
    '', 'Classification labels are heuristic suggestions only.'
  ].join('\n'));
  write('audit-v10-data.json', JSON.stringify(result, null, 2));

  console.log(`Storage Audit v10 completed: ${result.files.length} source files.`);
  console.log(`Operations: ${result.operations.length}; direct: ${direct.length}; adapter: ${adapter.length}; unresolved: ${result.unresolved.length}.`);
  console.log(`Reports written to: ${rel(OUT)}/`);
}

main();

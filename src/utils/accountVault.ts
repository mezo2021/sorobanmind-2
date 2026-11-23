
/**
 * Account Vault — isolated account storage engine
 *
 * Independent from cloudSync.ts.
 * No authentication or network requests are performed here.
 *
 * Active account data:
 *   cloud:<key>
 *   explicitly listed direct keys
 *
 * Vault data:
 *   vault:account:<uid>
 *
 * Transaction journal:
 *   vault:txn
 *
 * Active account slot:
 *   vault:slot
 */

export interface KV {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const SLOT_KEY = 'vault:slot';
const TXN_KEY = 'vault:txn';
const VAULT_PREFIX = 'vault:account:';
const VERSION = 1;

/**
 * Provisional direct account keys.
 *
 * This list must be reconciled with the actual application
 * before integrating the vault into cloudSync.ts.
 */
export const ACCOUNT_BOUND_DIRECT_KEYS = [
  'srb_progress',
  'sorobania_progress_v2',
  'sorobania_progress_v1',
  'soroban_friends_weak_v1',
  'sorobanmind-ghost-v1',
  'soroban_companion',
  'soroban_secrets_best_scores',
] as const;

/**
 * Device-scoped keys.
 *
 * These are never moved into an account vault.
 * This is a provisional classification, not a complete
 * application-wide storage manifest.
 */
export const DEVICE_KEYS = [
  'soroban_parent_pin_hash',
  'soroban_parent_pin_salt',
  'soroban_parent_pin_recovery_hash',
  'soroban_parent_pin_recovery_salt',
  'soroban_parent_pin_attempts',
  'soroban_parent_pin_lock_until',
  'soroban_parent_recovery_attempts',
  'soroban_parent_recovery_lock_until',
  'soroban_emergency_used_at',

  'soroban_hero_key',
  'soroban_child_name',
  'soroban_child_full_name',

  'soroban_theme_key',
  'soroban2d5-theme',
  'soroban_number_style',
  'sorobanmind-v2-lang',
  'soroban_mode',
  'soroban_welcome_seen',
  'soroban_avatar_pending_upload',
  'soroban_progress_owner',
] as const;

/**
 * Old experimental vault keys using cloud:<uid>:...
 * are excluded from active account detection.
 */
const LEGACY_VAULT_RE =
  /^cloud:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:/i;

export function isVaultKey(key: string): boolean {
  return (
    key.startsWith('vault:') ||
    LEGACY_VAULT_RE.test(key)
  );
}

export function isAccountBoundKey(key: string): boolean {
  if (isVaultKey(key)) return false;

  if ((DEVICE_KEYS as readonly string[]).includes(key)) {
    return false;
  }

  if (key.startsWith('cloud:')) {
    return true;
  }

  return (
    ACCOUNT_BOUND_DIRECT_KEYS as readonly string[]
  ).includes(key);
}

function validateUserId(uid: string): void {
  if (
    !uid ||
    uid.includes(':') ||
    uid.startsWith('vault:')
  ) {
    throw new Error('accountVault: invalid user ID');
  }
}

function accountVaultKey(uid: string): string {
  validateUserId(uid);
  return `${VAULT_PREFIX}${encodeURIComponent(uid)}`;
}

function allKeys(s: KV): string[] {
  const result: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const key = s.key(i);
    if (key !== null) result.push(key);
  }

  return result;
}

type Snapshot = Record<string, string>;

interface Transaction {
  version: number;
  from: string | null;
  to: string;
  activeBefore: Snapshot;
}

function snapshotActive(s: KV): Snapshot {
  const result: Snapshot = {};

  for (const key of allKeys(s)) {
    if (!isAccountBoundKey(key)) continue;

    const value = s.getItem(key);

    if (value !== null) {
      result[key] = value;
    }
  }

  return result;
}

function validateSnapshot(value: unknown): Snapshot {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    throw new Error('accountVault: invalid snapshot');
  }

  const result: Snapshot = {};

  for (const [key, item] of Object.entries(value)) {
    if (
      !isAccountBoundKey(key) ||
      typeof item !== 'string'
    ) {
      throw new Error('accountVault: invalid snapshot entry');
    }

    result[key] = item;
  }

  return result;
}

function readSnapshot(
  s: KV,
  uid: string,
): Snapshot | null {
  const raw = s.getItem(accountVaultKey(uid));

  if (raw === null) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `accountVault: corrupted vault for ${uid}`,
    );
  }

  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new Error('accountVault: invalid vault format');
  }

  const record = parsed as {
    version?: unknown;
    data?: unknown;
  };

  if (record.version !== VERSION) {
    throw new Error('accountVault: unsupported vault version');
  }

  return validateSnapshot(record.data);
}

/**
 * A complete snapshot replaces the previous snapshot.
 * Deleted keys therefore cannot reappear from an older snapshot.
 */
function writeSnapshot(
  s: KV,
  uid: string,
  data: Snapshot,
): void {
  const key = accountVaultKey(uid);

  const raw = JSON.stringify({
    version: VERSION,
    data,
  });

  s.setItem(key, raw);

  if (s.getItem(key) !== raw) {
    throw new Error(
      `accountVault: failed to verify vault ${uid}`,
    );
  }
}

/**
 * Remove a snapshot and verify the deletion.
 * Used only when rolling back an incomplete first login.
 */
function removeSnapshot(s: KV, uid: string): void {
  const key = accountVaultKey(uid);

  s.removeItem(key);

  if (s.getItem(key) !== null) {
    throw new Error(
      `accountVault: failed to remove vault ${uid}`,
    );
  }
}

function readTransaction(s: KV): Transaction | null {
  const raw = s.getItem(TXN_KEY);

  if (raw === null) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      'accountVault: corrupted transaction journal',
    );
  }

  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      'accountVault: invalid transaction journal',
    );
  }

  const txn = parsed as Partial<Transaction>;

  if (
    txn.version !== VERSION ||
    typeof txn.to !== 'string' ||
    !txn.to ||
    !(
      txn.from === null ||
      typeof txn.from === 'string'
    )
  ) {
    throw new Error(
      'accountVault: invalid transaction fields',
    );
  }

  return {
    version: VERSION,
    from: txn.from,
    to: txn.to,
    activeBefore: validateSnapshot(txn.activeBefore),
  };
}

function writeTransaction(
  s: KV,
  txn: Transaction,
): void {
  const raw = JSON.stringify(txn);

  s.setItem(TXN_KEY, raw);

  if (s.getItem(TXN_KEY) !== raw) {
    throw new Error(
      'accountVault: journal verification failed',
    );
  }
}

function clearTransaction(s: KV): void {
  s.removeItem(TXN_KEY);

  if (s.getItem(TXN_KEY) !== null) {
    throw new Error(
      'accountVault: failed to clear journal',
    );
  }
}

function getSlot(s: KV): string | null {
  return s.getItem(SLOT_KEY);
}

function setSlot(s: KV, uid: string | null): void {
  if (uid === null) {
    s.removeItem(SLOT_KEY);

    if (s.getItem(SLOT_KEY) !== null) {
      throw new Error(
        'accountVault: failed to clear active slot',
      );
    }

    return;
  }

  s.setItem(SLOT_KEY, uid);

  if (s.getItem(SLOT_KEY) !== uid) {
    throw new Error(
      'accountVault: slot verification failed',
    );
  }
}

/**
 * Replaces all active account-bound data with a snapshot.
 * Device keys and vault metadata are not touched.
 */
function replaceActive(
  s: KV,
  snapshot: Snapshot,
): void {
  for (const key of allKeys(s)) {
    if (!isAccountBoundKey(key)) continue;

    s.removeItem(key);

    if (s.getItem(key) !== null) {
      throw new Error(
        `accountVault: failed to remove ${key}`,
      );
    }
  }

  for (const [key, value] of Object.entries(snapshot)) {
    if (!isAccountBoundKey(key)) {
      throw new Error(
        `accountVault: rejected key ${key}`,
      );
    }

    s.setItem(key, value);

    if (s.getItem(key) !== value) {
      throw new Error(
        `accountVault: failed to restore ${key}`,
      );
    }
  }
}

export function getActiveAccount(s: KV): string | null {
  return getSlot(s);
}

/**
 * Save the current active data as a complete account snapshot.
 * The supplied account must match the active slot.
 */
export function saveCurrentAccount(
  s: KV,
  userId: string,
): void {
  validateUserId(userId);

  if (getSlot(s) !== userId) {
    throw new Error(
      'accountVault: active account mismatch',
    );
  }

  writeSnapshot(s, userId, snapshotActive(s));
}

/**
 * Recover an interrupted account switch.
 *
 * If the destination slot was written, the switch reached
 * its commit point and is considered completed.
 *
 * Otherwise, restore the exact pre-switch active snapshot.
 *
 * Special first-login rollback:
 * if there was no previous active account, remove the
 * destination snapshot created by the incomplete transaction.
 *
 * If recovery fails, the journal is deliberately retained
 * so a later attempt can retry.
 */
export function recoverInterruptedSwitch(
  s: KV,
): 'none' | 'rolled-back' | 'completed' {
  const txn = readTransaction(s);

  if (txn === null) return 'none';

  // The destination slot is the commit point.
  if (getSlot(s) === txn.to) {
    clearTransaction(s);
    return 'completed';
  }

  // First-login rollback.
  if (txn.from === null) {
    replaceActive(s, txn.activeBefore);
    setSlot(s, null);
    removeSnapshot(s, txn.to);
    clearTransaction(s);

    return 'rolled-back';
  }

  // Normal account-switch rollback.
  replaceActive(s, txn.activeBefore);
  setSlot(s, txn.from);
  clearTransaction(s);

  return 'rolled-back';
}

/**
 * Switch the active data to another account.
 *
 * First login:
 *   If there is no active slot and no existing destination
 *   vault, existing active data is adopted by that account.
 *
 * Normal switch:
 *   Save the source snapshot, then restore the destination.
 */
export function switchAccount(
  s: KV,
  toUserId: string,
): 'same' | 'swapped' {
  validateUserId(toUserId);

  recoverInterruptedSwitch(s);

  const from = getSlot(s);

  if (from === toUserId) {
    return 'same';
  }

  const activeBefore = snapshotActive(s);

  // First account login: adopt existing active data.
  if (from === null) {
    const existing = readSnapshot(s, toUserId);

    if (existing !== null) {
      throw new Error(
        'accountVault: destination vault exists but no active slot; reconciliation required',
      );
    }

    writeTransaction(s, {
      version: VERSION,
      from: null,
      to: toUserId,
      activeBefore,
    });

    writeSnapshot(s, toUserId, activeBefore);
    setSlot(s, toUserId);
    clearTransaction(s);

    return 'swapped';
  }

  // Normal account switch.
  writeTransaction(s, {
    version: VERSION,
    from,
    to: toUserId,
    activeBefore,
  });

  // Save the complete source snapshot before clearing anything.
  writeSnapshot(s, from, activeBefore);

  const destination = readSnapshot(s, toUserId) ?? {};

  replaceActive(s, destination);

  // Commit point: after this succeeds, the destination is active.
  setSlot(s, toUserId);

  clearTransaction(s);

  return 'swapped';
}

/**
 * True means account adoption/switch handling is required.
 * legacyOwner is a fallback for older installations.
 */
export function needsAdoption(
  s: KV,
  userId: string,
  legacyOwner: string | null = null,
): boolean {
  if (readTransaction(s) !== null) return true;

  const activeOwner = getSlot(s) ?? legacyOwner;

  return activeOwner !== userId;
}

export function getVaultStatus(s: KV): {
  active: string | null;
  hasPendingTxn: boolean;
  vaults: string[];
} {
  const vaults: string[] = [];

  for (const key of allKeys(s)) {
    if (!key.startsWith(VAULT_PREFIX)) continue;

    const encodedUid = key.slice(VAULT_PREFIX.length);

    try {
      vaults.push(decodeURIComponent(encodedUid));
    } catch {
      // Ignore malformed vault key names.
    }
  }

  return {
    active: getSlot(s),
    hasPendingTxn: s.getItem(TXN_KEY) !== null,
    vaults,
  };
}

import { describe, it, expect } from 'vitest';

import {
  switchAccount,
  recoverInterruptedSwitch,
  needsAdoption,
  isVaultKey,
  isAccountBoundKey,
  getActiveAccount,
  saveCurrentAccount,
  getVaultStatus,
  type KV,
} from '../src/utils/accountVault';

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const C = '33333333-3333-4333-8333-333333333333';

const ACCOUNT_A: Record<string, string> = {
  'cloud:sorobanmind-v2-progress': '{"a":1}',
  'cloud:soroban_mastery_badges': '{"badges":["x"]}',
  'srb_progress': '{"srb":1}',
  'sorobania_progress_v2': '{"sorobania":1}',
  'soroban_companion': 'bana',
};

const DEVICE_STATE: Record<string, string> = {
  'soroban_parent_pin_hash': 'pin_hash_value',
  'soroban_hero_key': 'joud',
  'soroban_theme_key': 'theme_cosmic',
  'soroban_mode': 'cloud',
};

function memKV(
  initial: Record<string, string> = {},
): KV & { map: Map<string, string> } {
  const map = new Map(Object.entries(initial));

  return {
    map,

    get length() {
      return map.size;
    },

    key: (index: number) =>
      Array.from(map.keys())[index] ?? null,

    getItem: (key: string) =>
      map.has(key) ? map.get(key)! : null,

    setItem: (key: string, value: string) => {
      map.set(key, String(value));
    },

    removeItem: (key: string) => {
      map.delete(key);
    },
  };
}

/**
 * Simulates a temporary storage failure after maxOps writes.
 * The underlying storage remains available for recovery,
 * as it would be after restarting the application.
 */
function crashAfter(
  inner: KV,
  maxOps: number,
): { kv: KV; ops: () => number } {
  let count = 0;

  function check(): void {
    count++;

    if (count > maxOps) {
      throw new Error('simulated interruption');
    }
  }

  return {
    kv: {
      get length() {
        return inner.length;
      },

      key: (index) => inner.key(index),

      getItem: (key) => inner.getItem(key),

      setItem: (key, value) => {
        check();
        inner.setItem(key, value);
      },

      removeItem: (key) => {
        check();
        inner.removeItem(key);
      },
    },

    ops: () => count,
  };
}

function activeSnapshot(
  storage: KV & { map: Map<string, string> },
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key of storage.map.keys()) {
    if (!isAccountBoundKey(key)) continue;

    const value = storage.getItem(key);

    if (value !== null) {
      result[key] = value;
    }
  }

  return result;
}

function cloneStorage(
  storage: KV & { map: Map<string, string> },
) {
  return memKV(Object.fromEntries(storage.map));
}

describe('accountVault', () => {
  it('adopts existing data on first login without deleting it', () => {
    const s = memKV({
      ...ACCOUNT_A,
      ...DEVICE_STATE,
    });

    expect(switchAccount(s, A)).toBe('swapped');

    expect(getActiveAccount(s)).toBe(A);
    expect(activeSnapshot(s)).toEqual(ACCOUNT_A);

    expect(s.getItem('soroban_parent_pin_hash'))
      .toBe('pin_hash_value');
  });

  it('restores each account in A → B → C → A sequence', () => {
    const s = memKV({
      ...ACCOUNT_A,
      ...DEVICE_STATE,
    });

    switchAccount(s, A);

    s.setItem('srb_progress', '{"a_updated":1}');

    switchAccount(s, B);

    expect(activeSnapshot(s)).toEqual({});

    s.setItem('cloud:sorobanmind-v2-progress', '{"b":1}');
    s.setItem('srb_progress', '{"b_srb":1}');

    switchAccount(s, C);

    expect(activeSnapshot(s)).toEqual({});

    s.setItem('srb_progress', '{"c":1}');

    switchAccount(s, A);

    expect(activeSnapshot(s)).toEqual({
      ...ACCOUNT_A,
      'srb_progress': '{"a_updated":1}',
    });

    switchAccount(s, B);

    expect(activeSnapshot(s)).toEqual({
      'cloud:sorobanmind-v2-progress': '{"b":1}',
      'srb_progress': '{"b_srb":1}',
    });

    switchAccount(s, C);

    expect(activeSnapshot(s)).toEqual({
      'srb_progress': '{"c":1}',
    });

    expect(s.getItem('soroban_parent_pin_hash'))
      .toBe('pin_hash_value');

    expect(s.getItem('soroban_hero_key'))
      .toBe('joud');
  });

  it('does not change data when switching to the same account', () => {
    const s = memKV({
      ...ACCOUNT_A,
      ...DEVICE_STATE,
    });

    switchAccount(s, A);

    const before = activeSnapshot(s);

    expect(switchAccount(s, A)).toBe('same');
    expect(activeSnapshot(s)).toEqual(before);
  });

  it('does not resurrect keys deleted by the account owner', () => {
    const s = memKV({
      ...ACCOUNT_A,
    });

    switchAccount(s, A);

    s.removeItem('srb_progress');

    switchAccount(s, B);
    switchAccount(s, A);

    expect(s.getItem('srb_progress')).toBeNull();

    expect(s.getItem('sorobania_progress_v2'))
      .toBe(ACCOUNT_A['sorobania_progress_v2']);
  });

  it('rolls back interrupted first login and allows retry', () => {
    const initial = {
      ...ACCOUNT_A,
      ...DEVICE_STATE,
    };

    // Measure the number of storage mutations in a successful first login.
    const successful = crashAfter(memKV(initial), 10000);

    switchAccount(successful.kv, A);

    const totalOperations = successful.ops();

    for (
      let maxOps = 0;
      maxOps < totalOperations;
      maxOps++
    ) {
      const inner = memKV(initial);
      const interrupted = crashAfter(inner, maxOps);

      try {
        switchAccount(interrupted.kv, A);
      } catch {
        // Expected simulated interruption.
      }

      
const hadPendingTxn = inner.getItem('vault:txn') !== null;

const recovery = recoverInterruptedSwitch(inner);

expect(inner.getItem('vault:txn')).toBeNull();
expect(activeSnapshot(inner)).toEqual(ACCOUNT_A);

if (!hadPendingTxn) {
  // Interruption happened before the journal was written.
  expect(recovery).toBe('none');
  expect(getActiveAccount(inner)).toBeNull();

  expect(
    inner.getItem(`vault:account:${A}`),
  ).toBeNull();
} else if (getActiveAccount(inner) === null) {
  // The first login was rolled back.
  expect(recovery).toBe('rolled-back');

  // No orphan destination vault may block a retry.
  expect(
    inner.getItem(`vault:account:${A}`),
  ).toBeNull();
} else {
  // The slot was written: first login was committed.
  expect(getActiveAccount(inner)).toBe(A);
  expect(recovery).toBe('completed');
}

      // Either state must allow a clean attempt to log in again.
      switchAccount(inner, A);

      expect(getActiveAccount(inner)).toBe(A);
      expect(activeSnapshot(inner)).toEqual(ACCOUNT_A);
    }
  });

  it('recovers interrupted normal switches before or after commit', () => {
    const initial = {
      ...ACCOUNT_A,
      ...DEVICE_STATE,
    };

    const baseline = memKV(initial);
    switchAccount(baseline, A);

    baseline.setItem('srb_progress', '{"a_updated":1}');

    // Save the exact expected source state.
    saveCurrentAccount(baseline, A);

    const beforeA = activeSnapshot(baseline);

    // Measure successful A → B mutation count.
    const successful = crashAfter(cloneStorage(baseline), 10000);

    switchAccount(successful.kv, B);

    const totalOperations = successful.ops();

    for (
      let maxOps = 0;
      maxOps < totalOperations;
      maxOps++
    ) {
      const inner = cloneStorage(baseline);
      const interrupted = crashAfter(inner, maxOps);

      try {
        switchAccount(interrupted.kv, B);
      } catch {
        // Expected simulated interruption.
      }

      recoverInterruptedSwitch(inner);

      expect(inner.getItem('vault:txn')).toBeNull();

      if (getActiveAccount(inner) === A) {
        // Commit point was not reached: A must be restored.
        expect(activeSnapshot(inner)).toEqual(beforeA);
      } else {
        // Commit point was reached: B must be active.
        expect(getActiveAccount(inner)).toBe(B);
        expect(activeSnapshot(inner)).toEqual({});
      }
    }
  });

  it('detects pending transactions and account mismatches', () => {
    const s = memKV({
      ...ACCOUNT_A,
    });

    switchAccount(s, A);

    expect(needsAdoption(s, A)).toBe(false);
    expect(needsAdoption(s, B)).toBe(true);

    expect(getVaultStatus(s).active).toBe(A);
  });

  it('distinguishes active keys from vault and device keys', () => {
    expect(isVaultKey('vault:slot')).toBe(true);

    expect(
      isVaultKey(`vault:account:${A}`),
    ).toBe(true);

    expect(
      isVaultKey(`cloud:${A}:srb_progress`),
    ).toBe(true);

    expect(isVaultKey('cloud:srb_progress')).toBe(false);
    expect(isVaultKey('srb_progress')).toBe(false);

    expect(isAccountBoundKey('srb_progress')).toBe(true);

    expect(
      isAccountBoundKey('soroban_parent_pin_hash'),
    ).toBe(false);

    expect(
      isAccountBoundKey('soroban_hero_key'),
    ).toBe(false);
  });

  it('never stores device keys inside account snapshots', () => {
    const s = memKV({
      ...ACCOUNT_A,
      ...DEVICE_STATE,
    });

    switchAccount(s, A);
    saveCurrentAccount(s, A);

    const raw = s.getItem(`vault:account:${A}`);

    expect(raw).not.toContain('pin_hash_value');
    expect(raw).not.toContain('joud');
    expect(raw).not.toContain('theme_cosmic');

    expect(s.getItem('soroban_parent_pin_hash'))
      .toBe('pin_hash_value');
  });

  it('does not silently overwrite an existing vault when slot is missing', () => {
    const s = memKV({
      ...ACCOUNT_A,
    });

    switchAccount(s, A);

    const existingVault = s.getItem(`vault:account:${A}`);

    s.removeItem('vault:slot');

    expect(() => switchAccount(s, A)).toThrow(
      /reconciliation required/,
    );

    expect(s.getItem(`vault:account:${A}`))
      .toBe(existingVault);
  });

  it('treats reconciled direct child-data keys as account data', () => {
    for (const k of [
      'soroban_completed_enrichment',
      'sorobanmind-duels-v1',
    ]) {
      expect(isAccountBoundKey(k)).toBe(true);
    }

    for (const k of [
      'soroban_laser_theme_v1',
      'sorobania_muted',
      'soroban_local_player_id',
    ]) {
      expect(isAccountBoundKey(k)).toBe(false);
    }
  });
});

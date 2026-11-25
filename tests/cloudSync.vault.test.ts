import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isAccountBoundKey, type KV, switchAccount } from '../src/utils/accountVault';

const { auth } = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    setSession: vi.fn(async () => ({ error: null })),
    signOut: vi.fn(async () => ({ error: null })),
  },
}));

vi.mock('../src/lib/supabase', () => {
  const chain: any = {};
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.maybeSingle = async () => ({ data: null, error: null });

  return {
    supabase: {
      auth,
      from: () => chain,
      rpc: vi.fn(async () => ({ error: null })),
    },
  };
});

vi.mock('../src/utils/appMode', () => ({ getMode: () => 'cloud' }));

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const C = '33333333-3333-4333-8333-333333333333';

const DATA_A: Record<string, string> = {
  srb_progress: '{"a":1}',
  soroban_secrets_best_scores: '{"1":5}',
  soroban_companion: 'bana',
  sorobania_progress_v2: '{"lv":3}',
  soroban_completed_enrichment: '["x"]',
  'sorobanmind-duels-v1': '{"matches":[]}',
  'cloud:sorobanmind-v2-progress': '{"state":{"score":11,"childName":"A"}}',
  'cloud:soroban_mastery_badges': '{"badges":["A-gold"]}',
  'cloud:soroban_high_scores_v1': '{"best":99}',
};

const WATCHED_KEYS = Object.keys(DATA_A).filter(
  (key) => key !== 'cloud:sorobanmind-v2-progress',
);

function persistedProgressScore(storage: TestStorage): unknown {
  const raw = storage.getItem('cloud:sorobanmind-v2-progress');
  if (!raw) return undefined;
  try {
    return JSON.parse(raw)?.state?.score;
  } catch {
    return undefined;
  }
}

const DEVICE_DATA: Record<string, string> = {
  soroban_progress_owner: A,
  soroban_parent_pin_hash: 'pin-hash',
  'soroban2d5-theme': 'ocean',
  'sorobanmind-v2-lang': 'ar',
  soroban_mode: 'cloud',
};

function fakeStorage(
  initial: Record<string, string>,
  failOn?: (key: string, value: string) => boolean,
) {
  const map = new Map(Object.entries(initial));
  const writes: Array<[string, string]> = [];

  const storage: KV & {
    map: Map<string, string>;
    writes: Array<[string, string]>;
  } = {
    map,
    writes,
    get length() {
      return map.size;
    },
    key: (index) => Array.from(map.keys())[index] ?? null,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      const next = String(value);
      if (failOn?.(key, next)) throw new Error('simulated storage quota failure');
      writes.push([key, next]);
      map.set(key, next);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };

  return storage;
}

type TestStorage = ReturnType<typeof fakeStorage>;

function watched(storage: TestStorage) {
  return Object.fromEntries(
    WATCHED_KEYS
      .filter((key) => storage.getItem(key) !== null)
      .map((key) => [key, storage.getItem(key)]),
  );
}

async function loadCloudSync(storage: TestStorage) {
  vi.stubGlobal('localStorage', storage);
  vi.stubGlobal('window', {
    setTimeout: vi.fn(),
    location: { reload: vi.fn() },
  });
  vi.stubGlobal('navigator', {
    locks: { request: (_name: string, callback: () => unknown) => callback() },
  });

  vi.resetModules();
  return (await import('../src/lib/cloudSync')).cloudSync;
}

async function loginAs(storage: TestStorage, userId: string) {
  const cloudSync = await loadCloudSync(storage);
  auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });
  auth.signInWithPassword.mockResolvedValue({
    data: { user: { id: userId } },
    error: null,
  });

  return cloudSync.loginParent('parent@example.test', 'test-password');
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });
  auth.signInWithPassword.mockImplementation(async (_email: string, _password: string) => ({
    data: { user: { id: B } },
    error: null,
  }));
  auth.signOut.mockResolvedValue({ error: null });
  auth.setSession.mockResolvedValue({ error: null });
});

describe('cloudSync Account Vault integration', () => {
  it('isolates A → B → C → A → B → C and restores each account data', async () => {
    const storage = fakeStorage({ ...DATA_A, ...DEVICE_DATA });

    await loginAs(storage, B);
    expect(watched(storage)).toEqual({});
    storage.setItem('cloud:sorobanmind-v2-progress', '{"state":{"score":22}}');
    storage.setItem('srb_progress', '{"b":1}');
    storage.setItem('cloud:soroban_mastery_badges', '{"badges":["B"]}');

    await loginAs(storage, C);
    expect(storage.getItem('srb_progress')).toBeNull();
    storage.setItem('cloud:sorobanmind-v2-progress', '{"state":{"score":33}}');
    storage.setItem('srb_progress', '{"c":1}');
    storage.setItem('cloud:soroban_mastery_badges', '{"badges":["C"]}');

    await loginAs(storage, A);
    expect(watched(storage)).toEqual(
      Object.fromEntries(
        Object.entries(DATA_A).filter(([key]) => key !== 'cloud:sorobanmind-v2-progress'),
      ),
    );
    expect(persistedProgressScore(storage)).toBe(11);

    await loginAs(storage, B);
    expect(persistedProgressScore(storage)).toBe(22);
    expect(storage.getItem('srb_progress')).toBe('{"b":1}');
    expect(storage.getItem('cloud:soroban_mastery_badges')).toBe('{"badges":["B"]}');

    await loginAs(storage, C);
    expect(persistedProgressScore(storage)).toBe(33);
    expect(storage.getItem('srb_progress')).toBe('{"c":1}');
    expect(storage.getItem('cloud:soroban_mastery_badges')).toBe('{"badges":["C"]}');

    expect(storage.getItem('vault:slot')).toBe(C);
    expect(storage.getItem('soroban_progress_owner')).toBe(C);
    expect(storage.getItem(`vault:account:${A}`)).not.toBeNull();
    expect(storage.getItem(`vault:account:${B}`)).not.toBeNull();
    expect(storage.getItem(`vault:account:${C}`)).not.toBeNull();
  });

  it('does not change account data when the same owner logs in (LOCAL WINS)', async () => {
    const storage = fakeStorage({
      ...DATA_A,
      ...DEVICE_DATA,
      'vault:slot': A,
    });

    await loginAs(storage, A);

    expect(watched(storage)).toEqual(
      Object.fromEntries(
        Object.entries(DATA_A).filter(([key]) => key !== 'cloud:sorobanmind-v2-progress'),
      ),
    );
    expect(storage.getItem('vault:slot')).toBe(A);
    expect(storage.writes[storage.writes.length - 1]).toEqual(['soroban_progress_owner', A]);
  });

  it('rolls back a completed account switch if the final owner write fails', async () => {
    let shouldFail = true;
    const storage = fakeStorage(
      { ...DATA_A, ...DEVICE_DATA },
      (key, value) =>
        shouldFail &&
        key === 'soroban_progress_owner' &&
        value === B,
    );

    await expect(loginAs(storage, B)).rejects.toBeTruthy();

    shouldFail = false;
    expect(watched(storage)).toEqual(
      Object.fromEntries(
        Object.entries(DATA_A).filter(([key]) => key !== 'cloud:sorobanmind-v2-progress'),
      ),
    );
    expect(storage.getItem('vault:slot')).toBe(A);
    expect(storage.getItem('vault:txn')).toBeNull();

    await loginAs(storage, B);
    expect(storage.getItem('soroban_progress_owner')).toBe(B);
    expect(
      JSON.parse(storage.getItem(`vault:account:${A}`) as string).data.srb_progress,
    ).toBe('{"a":1}');
  });

  it('gates getSession until a different account has been adopted', async () => {
    const storage = fakeStorage({ ...DATA_A, ...DEVICE_DATA });
    const cloudSync = await loadCloudSync(storage);

    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: B } } },
      error: null,
    });

    const session = await cloudSync.getSession();

    expect(session).not.toBeNull();
    expect(storage.getItem('soroban_progress_owner')).toBe(B);
    expect(watched(storage)).toEqual({});
  });

  it('signs out locally and returns null if getSession adoption cannot reconcile a missing slot', async () => {
    const storage = fakeStorage({ ...DATA_A, ...DEVICE_DATA });

    // Create a real vault, then simulate the inconsistent state:
    // an existing vault with no active slot.
    switchAccount(storage, A);
    switchAccount(storage, B);
    storage.removeItem('vault:slot');
    const vaultBefore = storage.getItem(`vault:account:${A}`);

    const cloudSync = await loadCloudSync(storage);
    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: B } } },
      error: null,
    });

    const session = await cloudSync.getSession();

    expect(session).toBeNull();
    expect(auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(storage.getItem(`vault:account:${A}`)).toBe(vaultBefore);
    expect(storage.getItem('soroban_progress_owner')).toBe(A);
  });

  it('keeps device-scoped PIN, theme, language and mode outside account vaults', async () => {
    const storage = fakeStorage({ ...DATA_A, ...DEVICE_DATA });

    await loginAs(storage, B);

    expect(storage.getItem('soroban_parent_pin_hash')).toBe('pin-hash');
    expect(storage.getItem('soroban2d5-theme')).toBe('ocean');
    expect(storage.getItem('sorobanmind-v2-lang')).toBe('ar');
    expect(storage.getItem('soroban_mode')).toBe('cloud');

    const vaultA = JSON.parse(
      storage.getItem(`vault:account:${A}`) as string,
    ).data as Record<string, string>;

    for (const key of Object.keys(vaultA)) {
      expect(isAccountBoundKey(key)).toBe(true);
    }
    expect(vaultA).not.toHaveProperty('soroban_parent_pin_hash');
    expect(vaultA).not.toHaveProperty('soroban2d5-theme');
    expect(vaultA).not.toHaveProperty('sorobanmind-v2-lang');
  });

  it('adopts legacy account-bound data when owner is null without overwriting it silently', async () => {
    const legacyData = {
      srb_progress: '{"legacy":1}',
      'cloud:soroban_mastery_badges': '{"badges":["legacy"]}',
    };
    const storage = fakeStorage(legacyData);

    await loginAs(storage, B);

    expect(storage.getItem('soroban_progress_owner')).toBe(B);
    expect(storage.getItem('vault:slot')).toBe(B);
    const vaultB = JSON.parse(
      storage.getItem(`vault:account:${B}`) as string,
    ).data as Record<string, string>;
    expect(vaultB).toMatchObject(legacyData);
  });

  it('does not overwrite an existing vault when its active slot is missing', async () => {
    const storage = fakeStorage({ ...DATA_A, ...DEVICE_DATA });

    switchAccount(storage, A);
    const vaultBefore = storage.getItem(`vault:account:${A}`);
    storage.removeItem('vault:slot');

    await expect(loginAs(storage, A)).rejects.toBeTruthy();

    expect(storage.getItem(`vault:account:${A}`)).toBe(vaultBefore);
    expect(storage.getItem('vault:slot')).toBeNull();
    expect(storage.getItem('soroban_progress_owner')).toBe(A);
  });

  it('keeps the main persisted progress and mastery badges account-bound', () => {
    expect(isAccountBoundKey('cloud:sorobanmind-v2-progress')).toBe(true);
    expect(isAccountBoundKey('cloud:soroban_mastery_badges')).toBe(true);
  });
});

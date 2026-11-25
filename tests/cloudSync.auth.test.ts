import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock('../src/lib/supabase', () => ({
  supabase: { auth: { getSession, signOut: vi.fn(async () => ({ error: null })) } },
}));
vi.mock('../src/utils/appMode', () => ({ getMode: () => 'cloud' }));

async function load() {
  vi.resetModules();
  return (await import('../src/lib/cloudSync')).cloudSync;
}

describe('withAuthLock عبر loginParent', () => {
  beforeEach(() => {
    getSession.mockReset();
    vi.stubGlobal('navigator', { locks: { request: (_n: string, cb: () => unknown) => cb() } });
  });

  it('C3/C4: عملية ثانية متزامنة ← AUTH_FLOW_BUSY', async () => {
    getSession.mockReturnValue(new Promise(() => {}));
    const sync = await load();
    void sync.loginParent('a@b.c', 'x').catch(() => {});
    await expect(sync.loginParent('a@b.c', 'x')).rejects.toMatchObject({ code: 'AUTH_FLOW_BUSY' });
    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it('C5: لا Web Locks ← AUTH_FLOW_BUSY بلا اعتماد', async () => {
    vi.stubGlobal('navigator', {});
    const sync = await load();
    await expect(sync.loginParent('a@b.c', 'x')).rejects.toMatchObject({ code: 'AUTH_FLOW_BUSY' });
    expect(getSession).not.toHaveBeenCalled();
  });

  it('C6: فشل الحصول على القفل ← لا متابعة', async () => {
    vi.stubGlobal('navigator', { locks: { request: () => Promise.reject(new Error('lock failed')) } });
    const sync = await load();
    await expect(sync.loginParent('a@b.c', 'x')).rejects.toThrow('lock failed');
    expect(getSession).not.toHaveBeenCalled();
  });
});

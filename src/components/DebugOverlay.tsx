// src/components/DebugOverlay.tsx
// DebugOverlay — لعرض سجلات التشخيص في زاوية الشاشة
import { useState } from 'react';

interface Props {
  logs?: string[];
  onClear?: () => void;
}

export function DebugOverlay({ logs = [], onClear }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: '0.5rem',
        left: '0.5rem',
        zIndex: 9999,
        direction: 'ltr',
        fontFamily: 'monospace',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: open ? '#16a34a' : 'rgba(0,0,0,0.6)',
          color: 'white',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🐞 {logs.length > 0 ? `(${logs.length})` : ''}
      </button>

      {open && (
        <div
          style={{
            marginTop: '4px',
            maxWidth: '260px',
            maxHeight: '60vh',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.88)',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            padding: '6px 8px',
            color: '#22c55e',
            fontSize: '10px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
          }}
        >
          <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px' }}>
            🔍 SOROBANA DEBUG
          </div>
          {logs.length === 0 ? (
            <div style={{ color: '#94a3b8' }}>لا سجلات بعد...</div>
          ) : (
            logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))
          )}
          {onClear && logs.length > 0 && (
            <button
              onClick={onClear}
              style={{
                marginTop: '6px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              مسح
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DebugOverlay;
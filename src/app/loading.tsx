export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        borderTop: '4px solid var(--accent-primary)',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: 'var(--text-secondary)' }}>Loading content...</p>
    </div>
  );
}

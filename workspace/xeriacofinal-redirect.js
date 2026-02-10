// DEPLOYMENT READY: xeriacofinal.vercel.app redirect fix
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Immediate redirect to working store
    window.location.replace('https://xeria-378.myshopify.com');
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>XeriaCo</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Premium Products • Fast AU Shipping</p>
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #333',
          borderRadius: '8px'
        }}>
          <p>Redirecting to store...</p>
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#333',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '1rem auto'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0070f3',
              animation: 'loading 2s infinite'
            }}></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
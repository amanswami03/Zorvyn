// Global theme and animation styles
export const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080C18;
    --surface:   #0D1225;
    --card:      #111827;
    --card2:     #141D2E;
    --border:    #1C2A42;
    --border2:   #243047;
    --gold:      #F0A500;
    --gold-dim:  #C8861A;
    --teal:      #2DD4BF;
    --rose:      #F43F5E;
    --violet:    #818CF8;
    --green:     #22C55E;
    --text:      #E2E8F4;
    --text2:     #94A3B8;
    --text3:     #4A5A75;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;
    --font-body: 'DM Sans', sans-serif;
  }

  html, body, #root { height: 100%; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  // Smooth transitions for UI elements
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.6; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-up { animation: fadeUp 0.4s ease both; }
  .fade-up-1 { animation: fadeUp 0.4s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.4s 0.1s  ease both; }
  .fade-up-3 { animation: fadeUp 0.4s 0.15s ease both; }
  .fade-up-4 { animation: fadeUp 0.4s 0.2s  ease both; }
  .fade-up-5 { animation: fadeUp 0.4s 0.25s ease both; }
  .fade-up-6 { animation: fadeUp 0.4s 0.3s  ease both; }
  .fade-in   { animation: fadeIn 0.3s ease both; }

  // Chart tooltip styles
  .recharts-tooltip-wrapper { outline: none; }
`;

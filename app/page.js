<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>illness.lol — Clean Halloween Landing Page</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Space Grotesk', 'sans-serif'],
          },
          colors: {
            brandBg: '#0a060d',
            brandDark: '#050307',
            brandOrange: '#e65c00',
            brandOrangeBright: '#ff6600',
          }
        }
      }
    }
  </script>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #0a060d;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
    }

    ::selection {
      background: rgba(230, 92, 0, 0.4);
      color: #ffffff;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #050307;
    }
    ::-webkit-scrollbar-thumb {
      background: #23112b;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #e65c00;
    }

    .glass-nav {
      background: rgba(10, 6, 13, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(230, 92, 0, 0.2);
    }

    .hero-btn {
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hero-btn:hover {
      transform: translateY(-2px);
    }

    .card-3d-dashboard {
      transform: perspective(1200px) rotateY(8deg) rotateZ(3deg);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-3d-dashboard:hover {
      transform: perspective(1200px) rotateY(2deg) rotateZ(1deg) translateY(-4px);
    }

    .card-profile-stack {
      transition: transform 0.4s ease, opacity 0.4s ease;
    }

    .bg-grid-pattern {
      background-image: radial-gradient(rgba(230, 92, 0, 0.12) 1px, transparent 1px);
      background-size: 24px 24px;
    }
  </style>
</head>
<body class="relative bg-brandBg text-white antialiased selection:bg-brandOrange/30">

  <!-- CANVAS PARTICLES -->
  <canvas id="particleCanvas" class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>

  <!-- RADIAL ATMOSPHERIC GLOW -->
  <div id="ambientGlow" class="fixed -top-80 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none z-0 opacity-70 transition-all duration-700"
       style="background: radial-gradient(circle, rgba(230,92,0,0.18) 0%, transparent 65%);"></div>

  <!-- MAIN WRAPPER -->
  <div class="relative z-10 flex flex-col min-h-screen">

    <!-- TOP NAVIGATION -->
    <header class="pt-5 px-4 w-full flex justify-center">
      <nav class="glass-nav w-full max-w-6xl h-16 rounded-full px-6 flex items-center justify-between shadow-2xl relative z-30">
        
        <!-- BRAND -->
        <a href="#" class="flex items-center gap-3 text-white no-underline group">
          <div id="brandDot" class="w-3 h-3 rounded-full bg-brandOrange shadow-[0_0_12px_rgba(230,92,0,0.8)] transition-all duration-300"></div>
          <span class="font-heading font-bold text-xl tracking-tight text-white group-hover:text-brandOrange transition-colors">
            illness.lol
          </span>
        </a>

        <!-- DESKTOP LINKS -->
        <div class="hidden md:flex items-center gap-1 text-sm font-medium">
          <a href="#help" class="px-3 py-1.5 text-neutral-300 hover:text-brandOrange transition-colors rounded-lg">Help Center</a>
          <a href="#discord" class="px-3 py-1.5 text-neutral-300 hover:text-brandOrange transition-colors rounded-lg">Discord</a>
          <a href="#compare" class="px-3 py-1.5 text-neutral-300 hover:text-brandOrange transition-colors rounded-lg">Compare</a>
          <a href="#leaderboard" class="px-3 py-1.5 text-neutral-300 hover:text-brandOrange transition-colors rounded-lg">Leaderboard</a>
          <a href="#pricing" class="px-3 py-1.5 text-neutral-300 hover:text-brandOrange transition-colors rounded-lg">Pricing</a>
        </div>

        <!-- AUTH BUTTONS -->
        <div class="flex items-center gap-3">
          <a href="#login" class="text-sm text-neutral-300 hover:text-white transition-colors px-3 py-1.5 hidden sm:block">Log in</a>
          <a href="#signup" id="navPrimaryBtn" class="hero-btn text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-amber-700 to-brandOrange text-white border border-amber-500/30 shadow-[0_0_15px_rgba(230,92,0,0.25)] hover:shadow-[0_0_25px_rgba(230,92,0,0.45)]">
            Sign up
          </a>
        </div>
      </nav>
    </header>

    <!-- HERO SECTION -->
    <section class="pt-20 pb-12 px-4 text-center flex flex-col items-center justify-center relative">
      
      <!-- HALLOWEEN BADGE -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/30 text-xs text-brandOrangeBright font-medium mb-6">
        <span class="w-2 h-2 rounded-full bg-brandOrange animate-pulse"></span>
        <span>Halloween Event Active</span>
      </div>

      <!-- MAIN HEADLINE -->
      <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1]">
        Everything you want, <br class="hidden sm:inline" />
        <span id="heroAccentText" class="text-brandOrange transition-colors duration-500">unbelievably fast.</span>
      </h1>

      <!-- SUBTITLE -->
      <p class="mt-5 text-neutral-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
        illness.lol is your platform for modern, customizable bio pages and high-performance file hosting — updated for Halloween.
      </p>

      <!-- CTA BUTTONS -->
      <div class="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <a href="#claim" id="ctaPrimary" class="hero-btn px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-700 to-brandOrange border border-white/20 shadow-[0_0_20px_rgba(230,92,0,0.3)] hover:shadow-[0_0_30px_rgba(230,92,0,0.5)]">
          Claim Username
        </a>
        <a href="#pricing" class="hero-btn px-5 py-3 rounded-xl font-medium text-sm text-neutral-200 bg-neutral-900/80 border border-brandOrange/20 hover:border-brandOrange/40 hover:text-white">
          View Pricing
        </a>
      </div>
    </section>

    <!-- INTERACTIVE CONTROL PANEL FOR PREVIEW -->
    <section class="max-w-4xl mx-auto w-full px-4 mb-8 relative z-30">
      <div class="bg-neutral-950/80 border border-brandOrange/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
        <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-400">Live Preview Controls</span>
          <span class="text-xs text-brandOrange font-mono">Interactive Demo</span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <!-- INPUT: USERNAME -->
          <div>
            <label class="block text-neutral-400 mb-1 font-medium">Card Username</label>
            <input type="text" id="inputUsername" value="pumpkin" 
                   class="w-full bg-neutral-900 border border-neutral-800 focus:border-brandOrange text-white rounded-lg px-3 py-1.5 outline-none transition-colors" />
          </div>

          <!-- INPUT: BIO -->
          <div>
            <label class="block text-neutral-400 mb-1 font-medium">Card Bio Text</label>
            <input type="text" id="inputBio" value="Welcome to my profile page." 
                   class="w-full bg-neutral-900 border border-neutral-800 focus:border-brandOrange text-white rounded-lg px-3 py-1.5 outline-none transition-colors" />
          </div>

          <!-- INPUT: THEME TONE -->
          <div>
            <label class="block text-neutral-400 mb-1 font-medium">Theme Accent Tone</label>
            <div class="flex gap-2">
              <button onclick="setTheme('orange')" class="flex-1 py-1.5 rounded bg-amber-700/30 border border-amber-600/50 text-amber-300 font-medium hover:bg-amber-700/50 transition">
                Orange
              </button>
              <button onclick="setTheme('purple')" class="flex-1 py-1.5 rounded bg-purple-900/30 border border-purple-600/50 text-purple-300 font-medium hover:bg-purple-900/50 transition">
                Purple
              </button>
              <button onclick="toggleParticles()" id="particleBtn" class="flex-1 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-700 transition">
                Ember: On
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SHOWCASE AREA -->
    <section class="w-full max-w-7xl mx-auto px-4 pb-24 relative z-20 overflow-hidden sm:overflow-visible">
      <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 min-h-[520px] relative">
        
        <!-- DASHBOARD CARD (3D TILT) -->
        <div class="card-3d-dashboard w-full lg:w-[680px] bg-[#08040a] border border-brandOrange/30 rounded-2xl p-5 shadow-[0_0_50px_rgba(230,92,0,0.12),0_30px_90px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row gap-5 relative overflow-hidden">
          
          <!-- SIDEBAR -->
          <div class="w-full sm:w-44 bg-[#060308] border-r sm:border-r border-b sm:border-b-0 border-white/10 p-3 rounded-xl flex-shrink-0 flex sm:flex-col justify-between">
            <div>
              <div class="flex items-center gap-2.5 mb-5">
                <div id="sideAvatar" class="w-8 h-8 rounded-full bg-gradient-to-tr from-brandOrange to-amber-500 shadow-[0_0_12px_rgba(230,92,0,0.4)]"></div>
                <div>
                  <div class="text-[11px] font-semibold text-white">Welcome back</div>
                  <div class="text-[9px] text-neutral-400 font-mono">illness.lol</div>
                </div>
              </div>

              <div class="space-y-1 hidden sm:block">
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-brandOrange/20 text-white text-[11px] font-medium border border-brandOrange/30">
                  <div class="w-2.5 h-2.5 rounded bg-brandOrange"></div>
                  account
                </div>
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-400 text-[11px] hover:text-white transition">
                  <div class="w-2.5 h-2.5 rounded bg-neutral-800"></div>
                  customize
                </div>
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-400 text-[11px] hover:text-white transition">
                  <div class="w-2.5 h-2.5 rounded bg-neutral-800"></div>
                  links
                </div>
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-400 text-[11px] hover:text-white transition">
                  <div class="w-2.5 h-2.5 rounded bg-neutral-800"></div>
                  premium
                </div>
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-400 text-[11px] hover:text-white transition">
                  <div class="w-2.5 h-2.5 rounded bg-neutral-800"></div>
                  image host
                </div>
              </div>
            </div>

            <div class="p-2.5 rounded-lg bg-brandOrange/5 border border-brandOrange/15 mt-4 sm:mt-8 text-left">
              <div class="text-[9px] text-neutral-400 mb-2">Need assistance? Reach out anytime.</div>
              <div class="h-6 rounded bg-gradient-to-r from-amber-700 to-brandOrange flex items-center justify-center text-[10px] text-white font-semibold shadow">
                Join Discord
              </div>
            </div>
          </div>

          <!-- DASHBOARD CONTENT -->
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div class="text-xs font-semibold text-white mb-3">Overview</div>
              
              <!-- METRICS GRID -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div class="bg-brandOrange/10 border border-brandOrange/20 p-2.5 rounded-lg">
                  <div class="text-[9px] text-neutral-400">Username</div>
                  <div id="dashUsername" class="text-xs font-semibold text-white mt-1">pumpkin</div>
                </div>
                <div class="bg-brandOrange/10 border border-brandOrange/20 p-2.5 rounded-lg">
                  <div class="text-[9px] text-neutral-400">Alias</div>
                  <div class="text-xs font-semibold text-white mt-1">hirs</div>
                </div>
                <div class="bg-brandOrange/10 border border-brandOrange/20 p-2.5 rounded-lg">
                  <div class="text-[9px] text-neutral-400">UID</div>
                  <div class="text-xs font-semibold text-white mt-1">1337</div>
                </div>
                <div class="bg-brandOrange/10 border border-brandOrange/20 p-2.5 rounded-lg">
                  <div class="text-[9px] text-neutral-400">Views</div>
                  <div class="text-xs font-semibold text-white mt-1">6,660</div>
                </div>
              </div>

              <!-- ANALYTICS CHART GRAPH -->
              <div class="text-xs font-semibold text-white mb-2">Analytics</div>
              <div class="h-40 rounded-xl bg-neutral-950 border border-brandOrange/20 p-3 relative overflow-hidden flex flex-col justify-between">
                <div class="text-[9px] text-neutral-500">Profile Visits (Past 24 Hours)</div>
                
                <svg viewBox="0 0 500 120" class="w-full h-28 overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#e65c00" stop-opacity="0.5" />
                      <stop offset="100%" stop-color="#e65c00" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  <path d="M0 100 Q 60 90, 120 40 T 240 70 T 360 20 T 480 80 L 500 90 L 500 120 L 0 120 Z" 
                        fill="url(#chartGrad)" />
                  <path d="M0 100 Q 60 90, 120 40 T 240 70 T 360 20 T 480 80 L 500 90" 
                        fill="none" id="chartStroke" stroke="#e65c00" stroke-width="2.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- PROFILE PREVIEW CARDS (STACKED) -->
        <div class="relative w-full max-w-[340px] h-[380px] flex-shrink-0">
          
          <!-- CARD 3 (BACK) -->
          <div class="card-profile-stack absolute inset-0 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-brandOrange/20 p-6 shadow-xl transform translate-x-6 translate-y-6 rotate-6 opacity-40">
            <div class="w-10 h-10 rounded-full bg-neutral-800 mb-3"></div>
            <div class="h-4 w-24 bg-neutral-800 rounded mb-2"></div>
            <div class="h-3 w-36 bg-neutral-800/60 rounded"></div>
          </div>

          <!-- CARD 2 (MIDDLE) -->
          <div class="card-profile-stack absolute inset-0 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-brandOrange/30 p-6 shadow-xl transform translate-x-3 translate-y-3 rotate-3 opacity-70">
            <div class="w-10 h-10 rounded-full bg-neutral-800 mb-3"></div>
            <div class="h-4 w-28 bg-neutral-800 rounded mb-2"></div>
            <div class="h-3 w-40 bg-neutral-800/60 rounded"></div>
          </div>

          <!-- CARD 1 (FRONT / INTERACTIVE) -->
          <div class="card-profile-stack absolute inset-0 rounded-2xl bg-gradient-to-b from-[#140817] to-[#09050b] border border-brandOrange/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(230,92,0,0.15)] flex flex-col justify-end relative overflow-hidden">
            
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a060d] via-transparent to-transparent z-0"></div>

            <div class="relative z-10">
              <div id="cardAvatar" class="w-12 h-12 rounded-full bg-gradient-to-tr from-brandOrange to-amber-500 border-2 border-brandOrange/50 shadow-[0_0_15px_rgba(230,92,0,0.4)] mb-3"></div>
              
              <div id="profileUsername" class="font-heading font-bold text-xl text-white tracking-tight">
                pumpkin
              </div>

              <div id="profileBio" class="text-xs text-neutral-300 mt-1 font-normal leading-normal">
                Welcome to my profile page.
              </div>

              <!-- SOCIAL ICONS MOCK -->
              <div class="flex gap-2 mt-4">
                <div class="w-8 h-8 rounded-lg bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center">
                  <div class="w-3.5 h-3.5 rounded-sm bg-brandOrange/80"></div>
                </div>
                <div class="w-8 h-8 rounded-lg bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center">
                  <div class="w-3.5 h-3.5 rounded-sm bg-brandOrange/80"></div>
                </div>
                <div class="w-8 h-8 rounded-lg bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center">
                  <div class="w-3.5 h-3.5 rounded-sm bg-brandOrange/80"></div>
                </div>
                <div class="w-8 h-8 rounded-lg bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center">
                  <div class="w-3.5 h-3.5 rounded-sm bg-brandOrange/80"></div>
                </div>
              </div>

              <!-- ACTION BAR MOCK -->
              <div class="h-9 w-full mt-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between px-3">
                <span class="text-[10px] text-neutral-400">illness.lol/pumpkin</span>
                <span class="text-[10px] text-brandOrange font-medium">Copy</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mt-auto border-t border-white/10 py-8 px-4 text-center text-xs text-neutral-500">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-brandOrange"></div>
          <span class="font-heading text-neutral-300 font-semibold text-sm">illness.lol</span>
          <span>&mdash; Halloween Edition</span>
        </div>
        <div class="flex gap-6 text-neutral-400">
          <a href="#" class="hover:text-white transition">Terms</a>
          <a href="#" class="hover:text-white transition">Privacy</a>
          <a href="#" class="hover:text-white transition">Status</a>
          <a href="#" class="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>

  </div>

  <script>
    // PARTICLES ANIMATION
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particlesEnabled = true;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticles() {
      particles = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedY: Math.random() * 0.5 + 0.2,
          speedX: Math.random() * 0.4 - 0.2,
          opacity: Math.random() * 0.4 + 0.15,
          color: '#e65c00'
        });
      }
    }

    createParticles();

    function renderParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particlesEnabled) {
        particles.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        });
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();

    // LIVE EDIT CONTROLS
    const inputUsername = document.getElementById('inputUsername');
    const inputBio = document.getElementById('inputBio');
    const profileUsername = document.getElementById('profileUsername');
    const dashUsername = document.getElementById('dashUsername');
    const profileBio = document.getElementById('profileBio');

    inputUsername.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'username';
      profileUsername.textContent = val;
      dashUsername.textContent = val;
    });

    inputBio.addEventListener('input', (e) => {
      profileBio.textContent = e.target.value || 'Welcome to my profile page.';
    });

    // THEME SWITCHING
    function setTheme(theme) {
      const ambientGlow = document.getElementById('ambientGlow');
      const heroAccent = document.getElementById('heroAccentText');
      const brandDot = document.getElementById('brandDot');
      const chartStroke = document.getElementById('chartStroke');

      if (theme === 'purple') {
        ambientGlow.style.background = 'radial-gradient(circle, rgba(147,51,234,0.22) 0%, transparent 65%)';
        heroAccent.style.color = '#a855f7';
        brandDot.style.backgroundColor = '#a855f7';
        brandDot.style.boxShadow = '0 0 12px rgba(168,85,247,0.8)';
        chartStroke.setAttribute('stroke', '#a855f7');
        particles.forEach(p => p.color = '#a855f7');
      } else {
        ambientGlow.style.background = 'radial-gradient(circle, rgba(230,92,0,0.18) 0%, transparent 65%)';
        heroAccent.style.color = '#e65c00';
        brandDot.style.backgroundColor = '#e65c00';
        brandDot.style.boxShadow = '0 0 12px rgba(230,92,0,0.8)';
        chartStroke.setAttribute('stroke', '#e65c00');
        particles.forEach(p => p.color = '#e65c00');
      }
    }

    function toggleParticles() {
      particlesEnabled = !particlesEnabled;
      const btn = document.getElementById('particleBtn');
      btn.textContent = `Ember: ${particlesEnabled ? 'On' : 'Off'}`;
    }
  </script>
</body>
</html>
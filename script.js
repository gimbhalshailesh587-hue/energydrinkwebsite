// @ts-nocheck
/* ==========================================================================
   VOLTIX ENERGY - INTERACTIVE CORE ENGINE (SCRIPT.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // FLAVOR DATA
  // --------------------------------------------------------------------------
  const FLAVORS = {
    lime: {
      id: 'lime',
      name: 'Neon Citrus Charge',
      shortName: 'Citrus Charge',
      tagline: 'Electric Key Lime + Mountain Yuzu',
      caffeine: '200mg',
      sugar: '0g',
      calories: '5',
      image: 'assets/can_lime.jpg',
      themeColor: '#00FF87',
      secondaryColor: '#00e1d9',
      notes: 'Crisp, electrifying mountain yuzu and cold-pressed lime with an effervescent bite that triggers instant alertness.',
      sweetness: 'Crisp & Tart (2/5)',
      intensity: 'Hyper Focus (5/5)',
      price: '$3.49'
    },
    berry: {
      id: 'berry',
      name: 'Cosmic Berry Warp',
      shortName: 'Cosmic Berry',
      tagline: 'Ultraviolet Acai + Arctic Blackberry',
      caffeine: '200mg',
      sugar: '0g',
      calories: '5',
      image: 'assets/can_berry.jpg',
      themeColor: '#C026D3',
      secondaryColor: '#7C3AED',
      notes: 'Deep antioxidant-rich wild acai berries layered with frosted blackberries for clean, dark-fruit velocity.',
      sweetness: 'Balanced Berry (3/5)',
      intensity: 'Deep Flow (5/5)',
      price: '$3.49'
    },
    orange: {
      id: 'orange',
      name: 'Solar Flare Rush',
      shortName: 'Solar Flare',
      tagline: 'Blood Orange + Passionfruit Inferno',
      caffeine: '200mg',
      sugar: '0g',
      calories: '5',
      image: 'assets/can_orange.jpg',
      themeColor: '#FF5722',
      secondaryColor: '#FFA000',
      notes: 'Sun-ripened Sicilian blood orange smashed with exotic passionfruit for an explosive rush of tropical adrenaline.',
      sweetness: 'Zesty Citrus (3/5)',
      intensity: 'Explosive Stamina (5/5)',
      price: '$3.49'
    },
    frost: {
      id: 'frost',
      name: 'Arctic Frost Surge',
      shortName: 'Arctic Frost',
      tagline: 'Glacier Blue Raspberry + Sub-Zero Mint',
      caffeine: '200mg',
      sugar: '0g',
      calories: '5',
      image: 'assets/can_frost.jpg',
      themeColor: '#00D2FF',
      secondaryColor: '#0077FF',
      notes: 'Sub-zero glacier raspberry with an ultra-crisp arctic mint finish designed to lower mental fatigue and hydrate fast.',
      sweetness: 'Icy Crisp (2/5)',
      intensity: 'Cool Focus (4/5)',
      price: '$3.49'
    },
    mango: {
      id: 'mango',
      name: 'Cyber Mango Glitch',
      shortName: 'Cyber Mango',
      tagline: 'Alphonso Mango + Golden Nectar + Guarana',
      caffeine: '200mg',
      sugar: '0g',
      calories: '5',
      image: 'assets/can_mango.jpg',
      themeColor: '#FFB703',
      secondaryColor: '#FB8500',
      notes: 'Hyper-saturated Alphonso mango and golden peach nectar turbocharged with natural Brazilian guarana for unstoppable stamina.',
      sweetness: 'Tropical Nectar (3/5)',
      intensity: 'High Adrenaline (5/5)',
      price: '$3.49'
    },
    cherry: {
      id: 'cherry',
      name: 'Quantum Cherry Void',
      shortName: 'Quantum Cherry',
      tagline: 'Dark Wild Cherry + Midnight Dragonfruit',
      caffeine: '200mg',
      sugar: '0g',
      calories: '5',
      image: 'assets/can_cherry.jpg',
      themeColor: '#FF0055',
      secondaryColor: '#990033',
      notes: 'Mystic dark black cherries blended with crushed dragonfruit and L-Tyrosine to lock you into impenetrable deep cognitive flow.',
      sweetness: 'Velvet Tart (3/5)',
      intensity: 'Quantum Focus (5/5)',
      price: '$3.49'
    }
  };

  let currentFlavor = 'lime';

  // --------------------------------------------------------------------------
  // SOUND ENGINE (Web Audio API Synthesizer - No External Assets Needed)
  // --------------------------------------------------------------------------
  let soundEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('sound-on', soundEnabled);
      const label = soundToggleBtn.querySelector('.sound-label');
      if (label) {
        label.textContent = soundEnabled ? 'FX: ON' : 'FX: OFF';
      }
      if (soundEnabled) {
        playSound('beep', 580, 0.1);
        showToast('⚡ Sound Effects Activated!');
      } else {
        showToast('🔇 Sound Muted');
      }
    });
  }

  function playSound(type, freq = 440, duration = 0.15) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (type === 'beep') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } else if (type === 'fizz') {
        // Synthesize a crisp soda/energy can fizz crack
        const bufferSize = audioCtx.sampleRate * 0.25;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1400;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      } else if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
          setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
          }, idx * 60);
        });
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // --------------------------------------------------------------------------
  // BACKGROUND PARTICLE CANVAS (Reactive Electric Sparks)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(window.innerWidth < 768 ? 25 : 55, 60);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.9;
        this.speedY = (Math.random() - 0.5) * 0.9 - 0.3; // subtle upward energy drift
        this.life = Math.random() * 0.8 + 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
          this.y = height + 5;
        }
      }
      draw() {
        const theme = FLAVORS[currentFlavor] ? FLAVORS[currentFlavor].themeColor : '#00FF87';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = theme;
        ctx.globalAlpha = this.opacity * 0.7;
        ctx.shadowColor = theme;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --------------------------------------------------------------------------
  // FLAVOR SWITCHING LOGIC
  // --------------------------------------------------------------------------
  const heroCanImg = document.getElementById('hero-can-img');
  const heroFlavorBadge = document.getElementById('hero-flavor-badge');
  const heroFlavorTitle = document.getElementById('hero-flavor-title');
  const heroFlavorDesc = document.getElementById('hero-flavor-desc');
  const flavorButtons = document.querySelectorAll('.flavor-btn');

  function setFlavor(flavorKey) {
    if (!FLAVORS[flavorKey]) return;
    currentFlavor = flavorKey;
    document.body.setAttribute('data-flavor', flavorKey);

    // Update active state in buttons
    flavorButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-select') === flavorKey);
    });

    const info = FLAVORS[flavorKey];

    // Smooth transition on hero image
    if (heroCanImg) {
      heroCanImg.style.opacity = '0';
      heroCanImg.style.transform = 'scale(0.92) translateY(10px)';
      setTimeout(() => {
        heroCanImg.src = info.image;
        heroCanImg.alt = `VOLTIX ${info.name}`;
        heroCanImg.style.opacity = '1';
        heroCanImg.style.transform = 'scale(1) translateY(0)';
      }, 180);
    }

    if (heroFlavorBadge) heroFlavorBadge.textContent = info.shortName.toUpperCase();
    if (heroFlavorTitle) heroFlavorTitle.textContent = info.name;
    if (heroFlavorDesc) heroFlavorDesc.textContent = info.notes;

    // Trigger sound
    playSound('fizz');
    drawEnergyComparisonChart();
  }

  flavorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-select');
      setFlavor(selected);
    });
  });

  // --------------------------------------------------------------------------
  // 3D CAN TILT ON MOUSE MOVE
  // --------------------------------------------------------------------------
  const canStage = document.getElementById('hero-visual-stage');
  const canWrapper = document.getElementById('can-3d-wrapper');

  if (canStage && canWrapper) {
    canStage.addEventListener('mousemove', (e) => {
      const rect = canStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateY = (x / (rect.width / 2)) * 18;
      const rotateX = -(y / (rect.height / 2)) * 18;

      canWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    canStage.addEventListener('mouseleave', () => {
      canWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // --------------------------------------------------------------------------
  // ENERGY COMPARISON CURVE CANVAS CHART
  // --------------------------------------------------------------------------
  const chartCanvas = document.getElementById('energy-curve-canvas');
  function drawEnergyComparisonChart() {
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = chartCanvas.getBoundingClientRect();

    chartCanvas.width = rect.width * dpr;
    chartCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 30, right: 30, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    // X-axis time labels (0h to 8h)
    ctx.font = '11px "Space Grotesk", monospace';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    const hours = ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h'];
    hours.forEach((label, idx) => {
      const x = padding.left + (chartW / (hours.length - 1)) * idx;
      ctx.fillText(label, x, h - 14);
    });

    // Baseline Line
    const baselineY = padding.top + chartH * 0.75;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, baselineY);
    ctx.lineTo(w - padding.right, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = 'left';
    ctx.fillText('Baseline Focus', padding.left + 8, baselineY - 6);

    // 1. Traditional Sugary Energy Drink (Extreme spike then crash deep below baseline)
    ctx.beginPath();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([3, 3]);
    const tradPoints = [
      [0, 0.75],
      [0.8, 0.12], // sharp spike
      [1.5, 0.35],
      [2.5, 0.75],
      [3.5, 0.95], // severe crash below baseline
      [5.0, 0.88],
      [8.0, 0.75]
    ];
    tradPoints.forEach((pt, i) => {
      const x = padding.left + (pt[0] / 8) * chartW;
      const y = padding.top + pt[1] * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Standard Coffee Curve (Fast spike, moderate afternoon slump)
    ctx.beginPath();
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 2.5;
    const coffeePoints = [
      [0, 0.75],
      [1.0, 0.28],
      [2.5, 0.45],
      [4.0, 0.75],
      [5.5, 0.86],
      [8.0, 0.75]
    ];
    coffeePoints.forEach((pt, i) => {
      const x = padding.left + (pt[0] / 8) * chartW;
      const y = padding.top + pt[1] * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. VOLTIX Kinetic Zero (Smooth ramp, extended stable plateau 6+ hours, clean landing)
    const voltColor = FLAVORS[currentFlavor] ? FLAVORS[currentFlavor].themeColor : '#00FF87';
    ctx.beginPath();
    ctx.strokeStyle = voltColor;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = voltColor;
    ctx.shadowBlur = 12;

    const voltixPoints = [
      [0, 0.75],
      [0.6, 0.22],
      [1.5, 0.20],
      [3.0, 0.21],
      [4.5, 0.24],
      [6.0, 0.38],
      [7.5, 0.65],
      [8.0, 0.75]
    ];

    voltixPoints.forEach((pt, i) => {
      const x = padding.left + (pt[0] / 8) * chartW;
      const y = padding.top + pt[1] * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gradient fill under Voltix curve
    ctx.lineTo(padding.left + chartW, baselineY);
    ctx.lineTo(padding.left, baselineY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padding.top, 0, baselineY);
    grad.addColorStop(0, voltColor + '44');
    grad.addColorStop(1, voltColor + '00');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Initial draw and redraw on resize
  setTimeout(drawEnergyComparisonChart, 150);
  window.addEventListener('resize', drawEnergyComparisonChart);

  // --------------------------------------------------------------------------
  // CUSTOM 12-PACK BUNDLE BUILDER
  // --------------------------------------------------------------------------
  const bundleCounts = {
    lime: 2,
    berry: 2,
    orange: 2,
    frost: 2,
    mango: 2,
    cherry: 2
  };

  const bundleProgressFill = document.getElementById('bundle-progress-fill');
  const bundleTotalLabel = document.getElementById('bundle-total-selected');
  const bundleAddBtn = document.getElementById('bundle-add-to-cart-btn');

  function updateBundleUI() {
    const total = Object.values(bundleCounts).reduce((a, b) => a + b, 0);

    Object.keys(bundleCounts).forEach(flavor => {
      const el = document.getElementById(`bundle-count-${flavor}`);
      if (el) el.textContent = String(bundleCounts[flavor]);
    });

    if (bundleTotalLabel) bundleTotalLabel.textContent = `${total} / 12 CANS SELECTED`;

    const pct = Math.min((total / 12) * 100, 100);
    if (bundleProgressFill) bundleProgressFill.style.width = `${pct}%`;

    // Disable plus buttons if at limit of 12
    document.querySelectorAll('.bundle-plus-btn').forEach(btn => {
      btn.disabled = total >= 12;
    });

    // Disable minus buttons if at 0
    document.querySelectorAll('.bundle-minus-btn').forEach(btn => {
      const flavor = btn.getAttribute('data-flavor');
      btn.disabled = (bundleCounts[flavor] || 0) <= 0;
    });

    if (bundleAddBtn) {
      if (total === 12) {
        bundleAddBtn.disabled = false;
        bundleAddBtn.innerHTML = `⚡ Add 12-Pack Bundle to Cart ($34.99)`;
      } else {
        bundleAddBtn.disabled = true;
        bundleAddBtn.innerHTML = `Select ${12 - total} more cans to complete pack`;
      }
    }
  }

  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const flavor = btn.getAttribute('data-flavor');
      const action = btn.getAttribute('data-action');
      const total = Object.values(bundleCounts).reduce((a, b) => a + b, 0);

      if (action === 'plus' && total < 12) {
        bundleCounts[flavor] = (bundleCounts[flavor] || 0) + 1;
        playSound('beep', 480, 0.08);
      } else if (action === 'minus' && (bundleCounts[flavor] || 0) > 0) {
        bundleCounts[flavor]--;
        playSound('beep', 360, 0.08);
      }
      updateBundleUI();
    });
  });

  updateBundleUI();

  // --------------------------------------------------------------------------
  // SHOPPING CART STATE & DRAWER
  // --------------------------------------------------------------------------
  let cart = [
    {
      id: 'lime',
      name: 'Neon Citrus Charge (12-Pack)',
      flavor: 'lime',
      price: 34.99,
      qty: 1,
      image: 'assets/can_lime.jpg'
    }
  ];

  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartOpenBtns = document.querySelectorAll('.cart-open-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBody = document.getElementById('cart-body');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const cartBadge = document.getElementById('cart-badge');
  const checkoutBtn = document.getElementById('checkout-btn');

  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('open');
    renderCart();
  }

  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  cartOpenBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  function renderCart() {
    if (!cartBody) return;
    cartBody.innerHTML = '';

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalQty;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty-message">
          <p style="font-size: 2rem; margin-bottom: 12px;">⚡</p>
          <p style="font-weight: 700; color: #fff; margin-bottom: 6px;">Your Fuel Cell is Empty</p>
          <p style="font-size: 0.85rem; color: #94A3B8;">Add your favorite Voltix flavors to unlock sustained peak performance.</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price * item.qty;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item-card';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty-row">
            <button class="cart-qty-btn cart-qty-minus" data-index="${index}">-</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn cart-qty-plus" data-index="${index}">+</button>
          </div>
        </div>
        <button class="cart-remove-item" data-index="${index}" title="Remove item">&times;</button>
      `;
      cartBody.appendChild(itemEl);
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Attach listeners
    cartBody.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cart[idx].qty++;
        playSound('beep', 500, 0.08);
        renderCart();
      });
    });

    cartBody.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        playSound('beep', 380, 0.08);
        renderCart();
      });
    });

    cartBody.querySelectorAll('.cart-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cart.splice(idx, 1);
        playSound('beep', 300, 0.08);
        renderCart();
      });
    });
  }

  function addToCart(item) {
    const existing = cart.find(x => x.id === item.id);
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cart.push({ ...item, qty: item.qty || 1 });
    }
    playSound('chime');
    showToast(`⚡ Added ${item.name} to Cart!`);
    renderCart();
    openCart();
  }

  // Hero Add to Cart
  const heroAddSingleBtn = document.getElementById('hero-add-single-btn');
  if (heroAddSingleBtn) {
    heroAddSingleBtn.addEventListener('click', () => {
      const flavor = FLAVORS[currentFlavor];
      addToCart({
        id: `${flavor.id}-single`,
        name: `${flavor.name} (Single Can)`,
        flavor: flavor.id,
        price: 3.49,
        image: flavor.image
      });
    });
  }

  const heroAddPackBtn = document.getElementById('hero-add-pack-btn');
  if (heroAddPackBtn) {
    heroAddPackBtn.addEventListener('click', () => {
      const flavor = FLAVORS[currentFlavor];
      addToCart({
        id: `${flavor.id}-12pack`,
        name: `${flavor.name} (12-Pack Case)`,
        flavor: flavor.id,
        price: 34.99,
        image: flavor.image
      });
    });
  }

  // Flavor Cards Direct Add
  document.querySelectorAll('.add-flavor-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const flavorKey = btn.getAttribute('data-flavor');
      const flavor = FLAVORS[flavorKey];
      addToCart({
        id: `${flavor.id}-12pack`,
        name: `${flavor.name} (12-Pack)`,
        flavor: flavor.id,
        price: 34.99,
        image: flavor.image
      });
    });
  });

  // Bundle Add
  if (bundleAddBtn) {
    bundleAddBtn.addEventListener('click', () => {
      const breakdown = Object.entries(bundleCounts)
        .filter(([_, count]) => count > 0)
        .map(([flv, count]) => `${count}x ${FLAVORS[flv] ? FLAVORS[flv].shortName : flv}`)
        .join(', ');
      const summary = `Custom 12-Pack (${breakdown || '12-Pack'})`;
      addToCart({
        id: `custom-bundle-${Date.now()}`,
        name: summary,
        flavor: 'custom',
        price: 34.99,
        image: 'assets/can_frost.jpg'
      });
    });
  }

  // --------------------------------------------------------------------------
  // FLAVOR FILTER TABS & EXPLORE MORE BUTTON
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.flavor-filter-pill');
  const flavorCards = document.querySelectorAll('.flavor-product-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      playSound('beep', 500, 0.06);

      flavorCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const exploreMoreBtn = document.getElementById('hero-explore-btn');
  if (exploreMoreBtn) {
    exploreMoreBtn.addEventListener('click', () => {
      playSound('beep', 520, 0.08);
    });
  }

  // Footer flavor direct links
  document.querySelectorAll('.footer-flavor-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const flv = link.getAttribute('data-select');
      if (flv && FLAVORS[flv]) {
        setFlavor(flv);
      }
    });
  });

  // --------------------------------------------------------------------------
  // MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-order-btn');

  function openMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.add('open');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    playSound('beep', 520, 0.05);
  }

  function closeMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ==========================================================================
  // REALISTIC MULTI-STEP ONLINE CHECKOUT ENGINE
  // ==========================================================================
  const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
  const checkoutModalCloseBtn = document.getElementById('checkout-modal-close-btn');
  const checkoutStepperBar = document.querySelector('.checkout-stepper-bar');

  // Step Indicators & Connection Lines
  const stepNodes = {
    1: document.getElementById('step-node-1'),
    2: document.getElementById('step-node-2'),
    3: document.getElementById('step-node-3')
  };
  const stepLine1 = document.getElementById('step-line-1');
  const stepLine2 = document.getElementById('step-line-2');

  // Step Panels
  const checkoutPanels = {
    1: document.getElementById('checkout-step-1'),
    2: document.getElementById('checkout-step-2'),
    3: document.getElementById('checkout-step-3'),
    success: document.getElementById('checkout-step-success')
  };

  // Checkout State
  let currentCheckoutStep = 1;
  let checkoutShipping = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    speed: 'standard',
    speedPrice: 0.00
  };
  let checkoutPayment = {
    method: 'card',
    cardNum: '',
    cardName: '',
    cardExp: '',
    cardCvv: '',
    upiId: ''
  };
  let checkoutPromo = {
    code: '',
    discountPercent: 0
  };

  // Elements - Step 1: Shipping
  const shippingForm = document.getElementById('shipping-form');
  const shipFname = document.getElementById('ship-fname');
  const shipLname = document.getElementById('ship-lname');
  const shipEmail = document.getElementById('ship-email');
  const shipPhone = document.getElementById('ship-phone');
  const shipAddress = document.getElementById('ship-address');
  const shipCity = document.getElementById('ship-city');
  const shipState = document.getElementById('ship-state');
  const shipZip = document.getElementById('ship-zip');
  const step1CancelBtn = document.getElementById('step-1-cancel-btn');
  const speedOptStd = document.getElementById('speed-opt-std');
  const speedOptExp = document.getElementById('speed-opt-exp');

  // Elements - Step 2: Payment
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const paymentPanels = document.querySelectorAll('.payment-method-panel');
  const cardNum = document.getElementById('card-num');
  const cardBrandIcon = document.getElementById('card-brand-icon');
  const cardName = document.getElementById('card-name');
  const cardExp = document.getElementById('card-exp');
  const cardCvv = document.getElementById('card-cvv');
  const upiId = document.getElementById('upi-id');
  const step2BackBtn = document.getElementById('step-2-back-btn');
  const step2NextBtn = document.getElementById('step-2-next-btn');

  // Elements - Step 3: Review
  const step3BackBtn = document.getElementById('step-3-back-btn');
  const editShippingBtn = document.getElementById('edit-shipping-btn');
  const editPaymentBtn = document.getElementById('edit-payment-btn');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const placeOrderTotalBtn = document.getElementById('place-order-total-btn');
  const reviewShippingSummary = document.getElementById('review-shipping-summary');
  const reviewPaymentSummary = document.getElementById('review-payment-summary');
  const reviewItemsList = document.getElementById('review-items-list');

  // Elements - Step 4: Success Screen
  const successCustomerName = document.getElementById('success-customer-name');
  const receiptOrderId = document.getElementById('receipt-order-id');
  const receiptDeliveryDate = document.getElementById('receipt-delivery-date');
  const receiptPaymentStatus = document.getElementById('receipt-payment-status');
  const receiptShippingMethod = document.getElementById('receipt-shipping-method');
  const receiptTotalAmount = document.getElementById('receipt-total-amount');
  const receiptItemsPreview = document.getElementById('receipt-items-preview');
  const successContinueBtn = document.getElementById('success-continue-btn');
  const successPrintBtn = document.getElementById('success-print-btn');

  // Elements - Sidebar Summary & Promo
  const checkoutMiniItems = document.getElementById('checkout-mini-items');
  const promoCodeInput = document.getElementById('promo-code-input');
  const promoApplyBtn = document.getElementById('promo-apply-btn');
  const promoMessage = document.getElementById('promo-message');
  const coSubtotal = document.getElementById('co-subtotal');
  const coDiscountRow = document.getElementById('co-discount-row');
  const coDiscount = document.getElementById('co-discount');
  const coShipping = document.getElementById('co-shipping');
  const coTax = document.getElementById('co-tax');
  const coTotal = document.getElementById('co-total');

  // Open Checkout Modal
  function openCheckoutModal() {
    if (!cart || cart.length === 0) {
      showToast('⚠️ Your fuel cell is empty! Add an energy drink first.');
      playSound('beep', 320, 0.08);
      return;
    }
    closeCart();
    setCheckoutStep(1);
    updateCheckoutSidebar();
    if (checkoutModalOverlay) {
      checkoutModalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSound('beep', 580, 0.06);
    }
  }

  // Close Checkout Modal
  function closeCheckoutModal() {
    if (checkoutModalOverlay) {
      checkoutModalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Set Current Active Step
  function setCheckoutStep(step) {
    currentCheckoutStep = step;

    // Switch panels
    Object.keys(checkoutPanels).forEach(key => {
      if (checkoutPanels[key]) {
        if (key === String(step)) {
          checkoutPanels[key].classList.add('active');
        } else {
          checkoutPanels[key].classList.remove('active');
        }
      }
    });

    if (step === 'success') {
      if (checkoutStepperBar) checkoutStepperBar.style.display = 'none';
      return;
    } else {
      if (checkoutStepperBar) checkoutStepperBar.style.display = 'flex';
    }

    // Update Stepper Nodes and connecting glow lines
    if (step === 1) {
      if (stepNodes[1]) { stepNodes[1].className = 'checkout-step-item active'; }
      if (stepNodes[2]) { stepNodes[2].className = 'checkout-step-item'; }
      if (stepNodes[3]) { stepNodes[3].className = 'checkout-step-item'; }
      if (stepLine1) stepLine1.classList.remove('active');
      if (stepLine2) stepLine2.classList.remove('active');
    } else if (step === 2) {
      if (stepNodes[1]) { stepNodes[1].className = 'checkout-step-item completed'; }
      if (stepNodes[2]) { stepNodes[2].className = 'checkout-step-item active'; }
      if (stepNodes[3]) { stepNodes[3].className = 'checkout-step-item'; }
      if (stepLine1) stepLine1.classList.add('active');
      if (stepLine2) stepLine2.classList.remove('active');
    } else if (step === 3) {
      if (stepNodes[1]) { stepNodes[1].className = 'checkout-step-item completed'; }
      if (stepNodes[2]) { stepNodes[2].className = 'checkout-step-item completed'; }
      if (stepNodes[3]) { stepNodes[3].className = 'checkout-step-item active'; }
      if (stepLine1) stepLine1.classList.add('active');
      if (stepLine2) stepLine2.classList.add('active');
      populateReviewStep();
    }

    // Scroll checkout content to top
    const modalBody = document.querySelector('.checkout-modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  // Cost Computations
  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function getCheckoutTotals() {
    const subtotal = getCartSubtotal();
    const discount = subtotal * (checkoutPromo.discountPercent / 100);
    const shipping = checkoutShipping.speedPrice;
    const tax = 0.00;
    const grandTotal = Math.max(0, subtotal - discount + shipping + tax);
    return { subtotal, discount, shipping, tax, grandTotal };
  }

  // Render Sidebar Mini-items and Cost Calculation
  function updateCheckoutSidebar() {
    if (!checkoutMiniItems) return;
    checkoutMiniItems.innerHTML = '';

    cart.forEach(item => {
      const itemRow = document.createElement('div');
      itemRow.className = 'co-mini-item';
      itemRow.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="co-mini-thumb">
        <div class="co-mini-info">
          <div class="co-mini-name">${item.name}</div>
          <div class="co-mini-qty">Qty: ${item.qty}</div>
        </div>
        <div class="co-mini-price">$${(item.price * item.qty).toFixed(2)}</div>
      `;
      checkoutMiniItems.appendChild(itemRow);
    });

    const { subtotal, discount, shipping, grandTotal } = getCheckoutTotals();

    if (coSubtotal) coSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    if (coDiscountRow && coDiscount) {
      if (discount > 0) {
        coDiscountRow.style.display = 'flex';
        coDiscount.textContent = `-$${discount.toFixed(2)} (${checkoutPromo.code})`;
      } else {
        coDiscountRow.style.display = 'none';
      }
    }

    if (coShipping) {
      if (shipping === 0) {
        coShipping.textContent = 'FREE';
        coShipping.style.color = 'var(--theme-primary)';
      } else {
        coShipping.textContent = `$${shipping.toFixed(2)}`;
        coShipping.style.color = 'var(--text-white)';
      }
    }

    if (coTotal) coTotal.textContent = `$${grandTotal.toFixed(2)}`;
    if (placeOrderTotalBtn) placeOrderTotalBtn.textContent = `$${grandTotal.toFixed(2)}`;
  }

  // Promo Code Application
  function applyPromoCode() {
    if (!promoCodeInput) return;
    const code = promoCodeInput.value.trim().toUpperCase();
    if (!code) {
      setPromoMessage('Please enter a coupon code.', 'error');
      return;
    }

    if (code === 'VOLTIX20') {
      checkoutPromo = { code: 'VOLTIX20', discountPercent: 20 };
      setPromoMessage('⚡ VOLTIX20 applied: 20% Bio-Speed discount activated!', 'success');
      playSound('chime');
    } else if (code === 'REFLEX15') {
      checkoutPromo = { code: 'REFLEX15', discountPercent: 15 };
      setPromoMessage('⚡ REFLEX15 applied: 15% discount activated!', 'success');
      playSound('chime');
    } else {
      setPromoMessage('✕ Invalid code. Try VOLTIX20 or REFLEX15.', 'error');
      playSound('beep', 300, 0.08);
      return;
    }
    updateCheckoutSidebar();
  }

  function setPromoMessage(msg, type) {
    if (!promoMessage) return;
    promoMessage.textContent = msg;
    promoMessage.className = `promo-message ${type}`;
  }

  if (promoApplyBtn) {
    promoApplyBtn.addEventListener('click', applyPromoCode);
  }
  if (promoCodeInput) {
    promoCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromoCode();
      }
    });
  }

  // Shipping Speed Toggle
  document.querySelectorAll('input[name="shipping-speed"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'express') {
        if (speedOptExp) speedOptExp.classList.add('active');
        if (speedOptStd) speedOptStd.classList.remove('active');
        checkoutShipping.speed = 'express';
        checkoutShipping.speedPrice = 4.99;
      } else {
        if (speedOptStd) speedOptStd.classList.add('active');
        if (speedOptExp) speedOptExp.classList.remove('active');
        checkoutShipping.speed = 'standard';
        checkoutShipping.speedPrice = 0.00;
      }
      playSound('beep', 480, 0.05);
      updateCheckoutSidebar();
    });
  });

  // Validation Error Helpers
  function setFieldError(fieldId, errorMsg) {
    const input = document.getElementById(fieldId);
    const errSpan = document.getElementById('err-' + fieldId);
    if (input) input.classList.add('input-error');
    if (errSpan) errSpan.textContent = errorMsg;
  }

  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errSpan = document.getElementById('err-' + fieldId);
    if (input) input.classList.remove('input-error');
    if (errSpan) errSpan.textContent = '';
  }

  [
    'ship-fname', 'ship-lname', 'ship-email', 'ship-phone',
    'ship-address', 'ship-city', 'ship-state', 'ship-zip',
    'card-num', 'card-name', 'card-exp', 'card-cvv', 'upi-id'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('focus', () => clearFieldError(id));
    }
  });

  // Validate Step 1 (Shipping Form)
  function validateShippingStep() {
    let isValid = true;

    const fname = shipFname ? shipFname.value.trim() : '';
    const lname = shipLname ? shipLname.value.trim() : '';
    const email = shipEmail ? shipEmail.value.trim() : '';
    const phone = shipPhone ? shipPhone.value.trim() : '';
    const address = shipAddress ? shipAddress.value.trim() : '';
    const city = shipCity ? shipCity.value.trim() : '';
    const state = shipState ? shipState.value.trim() : '';
    const zip = shipZip ? shipZip.value.trim() : '';

    if (!fname) {
      setFieldError('ship-fname', 'First name is required');
      isValid = false;
    }
    if (!lname) {
      setFieldError('ship-lname', 'Last name is required');
      isValid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setFieldError('ship-email', 'Valid email required for delivery updates');
      isValid = false;
    }
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      setFieldError('ship-phone', 'Valid phone required for courier SMS');
      isValid = false;
    }
    if (!address) {
      setFieldError('ship-address', 'Street address is required');
      isValid = false;
    }
    if (!city) {
      setFieldError('ship-city', 'City is required');
      isValid = false;
    }
    if (!state) {
      setFieldError('ship-state', 'State / Province is required');
      isValid = false;
    }
    if (!zip || zip.length < 3) {
      setFieldError('ship-zip', 'Postal code is required');
      isValid = false;
    }

    if (isValid) {
      checkoutShipping = {
        ...checkoutShipping,
        fname,
        lname,
        email,
        phone,
        address,
        city,
        state,
        zip
      };
    }

    return isValid;
  }

  if (shippingForm) {
    shippingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateShippingStep()) {
        playSound('beep', 600, 0.06);
        setCheckoutStep(2);
      } else {
        playSound('beep', 280, 0.1);
      }
    });
  }

  if (step1CancelBtn) {
    step1CancelBtn.addEventListener('click', () => {
      closeCheckoutModal();
      openCart();
    });
  }

  // Step 2: Payment Methods Tab Switching
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetMethod = tab.getAttribute('data-payment-tab');
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      paymentPanels.forEach(p => {
        if (p.getAttribute('data-panel') === targetMethod) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      checkoutPayment.method = targetMethod;
      playSound('beep', 520, 0.05);
    });
  });

  // Card input auto-formatting & brand detection
  if (cardNum) {
    cardNum.addEventListener('input', (e) => {
      let raw = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
      e.target.value = formatted;

      if (cardBrandIcon) {
        if (raw.startsWith('4')) {
          cardBrandIcon.textContent = '💳 Visa';
        } else if (/^5[1-5]/.test(raw)) {
          cardBrandIcon.textContent = '💳 MC';
        } else if (/^3[47]/.test(raw)) {
          cardBrandIcon.textContent = '💳 Amex';
        } else {
          cardBrandIcon.textContent = '💳';
        }
      }
    });
  }

  // Card Expiry auto-formatting (MM/YY)
  if (cardExp) {
    cardExp.addEventListener('input', (e) => {
      let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (raw.length >= 2) {
        e.target.value = raw.substring(0, 2) + '/' + raw.substring(2);
      } else {
        e.target.value = raw;
      }
    });
  }

  // Card CVV length restriction
  if (cardCvv) {
    cardCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  // Validate Step 2 (Payment Form)
  function validatePaymentStep() {
    let isValid = true;
    const method = checkoutPayment.method;

    if (method === 'card') {
      const numRaw = cardNum ? cardNum.value.replace(/\s/g, '') : '';
      const nameVal = cardName ? cardName.value.trim() : '';
      const expVal = cardExp ? cardExp.value.trim() : '';
      const cvvVal = cardCvv ? cardCvv.value.trim() : '';

      if (numRaw.length < 15) {
        setFieldError('card-num', 'Enter a valid 15-16 digit card number');
        isValid = false;
      }
      if (!nameVal) {
        setFieldError('card-name', 'Cardholder name is required');
        isValid = false;
      }
      if (!expVal || !/^\d{2}\/\d{2}$/.test(expVal)) {
        setFieldError('card-exp', 'Valid MM/YY required');
        isValid = false;
      }
      if (!cvvVal || cvvVal.length < 3) {
        setFieldError('card-cvv', 'CVV required');
        isValid = false;
      }

      if (isValid) {
        checkoutPayment.cardNum = numRaw;
        checkoutPayment.cardName = nameVal;
        checkoutPayment.cardExp = expVal;
        checkoutPayment.cardCvv = cvvVal;
      }
    } else if (method === 'upi') {
      const upiVal = upiId ? upiId.value.trim() : '';
      if (!upiVal || !upiVal.includes('@')) {
        setFieldError('upi-id', 'Enter a valid UPI ID (e.g. name@okhdfcbank)');
        isValid = false;
      } else {
        checkoutPayment.upiId = upiVal;
      }
    } else if (method === 'cod') {
      isValid = true;
    }

    return isValid;
  }

  if (step2BackBtn) {
    step2BackBtn.addEventListener('click', () => {
      setCheckoutStep(1);
    });
  }

  if (step2NextBtn) {
    step2NextBtn.addEventListener('click', () => {
      if (validatePaymentStep()) {
        playSound('beep', 600, 0.06);
        setCheckoutStep(3);
      } else {
        playSound('beep', 280, 0.1);
      }
    });
  }

  // Step 3: Populate Review Summary
  function populateReviewStep() {
    // Shipping Address Review
    if (reviewShippingSummary) {
      reviewShippingSummary.innerHTML = `
        <strong>${checkoutShipping.fname} ${checkoutShipping.lname}</strong><br>
        ${checkoutShipping.address}, ${checkoutShipping.city}, ${checkoutShipping.state} ${checkoutShipping.zip}<br>
        <span style="color:#94A3B8;">Phone:</span> ${checkoutShipping.phone} • <span style="color:#94A3B8;">Email:</span> ${checkoutShipping.email}
      `;
    }

    // Payment & Transit Review
    if (reviewPaymentSummary) {
      let paymentText = '';
      if (checkoutPayment.method === 'card') {
        const last4 = (checkoutPayment.cardNum || '8892').slice(-4);
        paymentText = `💳 Credit/Debit Card (Ending in •••• ${last4})`;
      } else if (checkoutPayment.method === 'upi') {
        paymentText = `⚡ UPI Direct Collect (${checkoutPayment.upiId || 'Direct App'})`;
      } else {
        paymentText = `💵 Cash on Delivery (Pay upon arrival)`;
      }

      const speedText = checkoutShipping.speed === 'express'
        ? '🚀 Hyper-Velocity Flight Courier (Next Day by 10 AM, +$4.99)'
        : '⚡ Standard Bio-Transit (2-3 Business Days, FREE)';

      reviewPaymentSummary.innerHTML = `
        ${paymentText}<br>
        <span style="color:#94A3B8;">Transit:</span> ${speedText}
      `;
    }

    // Items list in Step 3
    if (reviewItemsList) {
      reviewItemsList.innerHTML = '';
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'review-item-row';
        row.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="review-item-thumb">
          <div class="review-item-details">
            <span class="review-item-title">${item.name}</span>
            <span class="review-item-qty">Quantity: ${item.qty}</span>
          </div>
          <span class="review-item-cost">$${(item.price * item.qty).toFixed(2)}</span>
        `;
        reviewItemsList.appendChild(row);
      });
    }

    const { grandTotal } = getCheckoutTotals();
    if (placeOrderTotalBtn) placeOrderTotalBtn.textContent = `$${grandTotal.toFixed(2)}`;
  }

  if (editShippingBtn) {
    editShippingBtn.addEventListener('click', () => setCheckoutStep(1));
  }
  if (editPaymentBtn) {
    editPaymentBtn.addEventListener('click', () => setCheckoutStep(2));
  }
  if (step3BackBtn) {
    step3BackBtn.addEventListener('click', () => setCheckoutStep(2));
  }

  // Step 3: Transmit and Place Order (Transitions to Success Step)
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      placeOrderBtn.disabled = true;
      const originalText = placeOrderBtn.innerHTML;
      placeOrderBtn.innerHTML = `⚡ TRANSMITTING TO DISPATCH...`;
      playSound('chime');

      setTimeout(() => {
        // Generate Order Tracking ID
        const orderId = `#VLX-${Math.floor(100000 + Math.random() * 900000)}`;

        // Calculate delivery estimate
        const deliveryDate = new Date();
        const daysToAdd = checkoutShipping.speed === 'express' ? 1 : 3;
        deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = deliveryDate.toLocaleDateString('en-US', options) +
          (checkoutShipping.speed === 'express' ? ' (by 10:00 AM Priority Flight)' : ' (2-3 Business Days)');

        let paymentStatus = 'CONFIRMED (PAID)';
        if (checkoutPayment.method === 'cod') {
          paymentStatus = 'PENDING (Pay at Doorstep)';
        }

        const { grandTotal } = getCheckoutTotals();

        // Populate Success Confirmation Card
        if (successCustomerName) successCustomerName.textContent = checkoutShipping.fname || 'Valued Athlete';
        if (receiptOrderId) receiptOrderId.textContent = orderId;
        if (receiptDeliveryDate) receiptDeliveryDate.textContent = formattedDate;
        if (receiptPaymentStatus) {
          receiptPaymentStatus.textContent = paymentStatus;
          receiptPaymentStatus.style.color = checkoutPayment.method === 'cod' ? '#FFB703' : 'var(--success)';
        }
        if (receiptShippingMethod) {
          receiptShippingMethod.textContent = checkoutShipping.speed === 'express'
            ? 'Hyper-Velocity Courier ($4.99)'
            : 'Standard Bio-Transit (Free)';
        }
        if (receiptTotalAmount) receiptTotalAmount.textContent = `$${grandTotal.toFixed(2)}`;

        // Itemized list in receipt
        if (receiptItemsPreview) {
          receiptItemsPreview.innerHTML = '<div style="font-size:0.78rem; font-weight:700; color:#94A3B8; margin-bottom:8px; letter-spacing:0.05em;">ORDERED ITEMS:</div>';
          cart.forEach(item => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,0.08);';
            row.innerHTML = `
              <span>${item.qty}x ${item.name}</span>
              <span style="font-family:var(--font-mono); font-weight:600; color:var(--text-white);">$${(item.price * item.qty).toFixed(2)}</span>
            `;
            receiptItemsPreview.appendChild(row);
          });
        }

        // Empty cart and update drawer
        cart = [];
        renderCart();

        // Switch to celebration step
        setCheckoutStep('success');
        playSound('chime');
        showToast(`🎉 Order ${orderId} placed successfully! Receipt sent.`);

        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = originalText;
      }, 900);
    });
  }

  // Step 4 Actions: Continue & Print
  if (successContinueBtn) {
    successContinueBtn.addEventListener('click', () => {
      closeCheckoutModal();
      setCheckoutStep(1);
    });
  }

  if (successPrintBtn) {
    successPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Modal Open & Close Event Triggers
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      openCheckoutModal();
    });
  }

  if (checkoutModalCloseBtn) {
    checkoutModalCloseBtn.addEventListener('click', closeCheckoutModal);
  }

  if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutModalOverlay) {
        closeCheckoutModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkoutModalOverlay && checkoutModalOverlay.classList.contains('open')) {
      closeCheckoutModal();
    }
  });

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast-notice');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // FAQ ACCORDION
  // --------------------------------------------------------------------------
  document.querySelectorAll('.faq-item').forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
          playSound('beep', 420, 0.05);
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  });

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Newsletter Submit
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        playSound('chime');
        showToast('⚡ Welcome to the VOLTIX Drop Squad! Check your inbox.');
        input.value = '';
      }
    });
  }

  // Initial render
  renderCart();
});

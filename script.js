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

  // Checkout Simulator
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      playSound('chime');
      showToast('🚀 Order Initialized! Redirecting to secure checkout...');
      setTimeout(() => {
        alert('⚡ VOLTIX DEMO CHECKOUT\n\nThank you for fueling with Voltix Kinetic Bio-Energy!\n\nYour order has been recorded in this demo showcase.');
        cart = [];
        renderCart();
        closeCart();
      }, 700);
    });
  }

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

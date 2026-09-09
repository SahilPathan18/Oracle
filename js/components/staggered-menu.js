/**
 * StaggeredMenu - Vanilla JS port of the React Bits StaggeredMenu component.
 * Requires GSAP loaded globally (via CDN).
 *
 * Usage:
 *   StaggeredMenu.init({
 *     position: 'right',
 *     colors: ['#1a1a24', '#ff003c'],
 *     items: [ { label: 'Home', link: '/', ariaLabel: 'Go to home' } ],
 *     socialItems: [ { label: 'Twitter', link: 'https://twitter.com' } ],
 *     ...
 *   });
 */
const StaggeredMenu = (() => {
  let state = {
    open: false,
    busy: false,
  };

  let els = {};
  let tweens = {};
  let config = {};

  function init(options = {}) {
    config = Object.assign({
      position: 'right',
      colors: ['#1a1a24', '#ff003c'],
      items: [],
      socialItems: [],
      displaySocials: true,
      displayItemNumbering: true,
      logoText: 'ORACLE',
      logoUrl: null,
      logoLink: 'index.html',
      menuButtonColor: '#fff',
      openMenuButtonColor: '#fff',
      accentColor: '#ff003c',
      changeMenuColorOnOpen: true,
      isFixed: true,
      closeOnClickAway: true,
      onMenuOpen: null,
      onMenuClose: null,
    }, options);

    buildDOM();
    cacheElements();
    setupInitialState();
    bindEvents();
  }

  function buildDOM() {
    // Process colors for pre-layers
    let raw = config.colors && config.colors.length ? config.colors.slice(0, 4) : ['#1e1e22', '#35353c'];
    let arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'staggered-menu-wrapper' + (config.isFixed ? ' fixed-wrapper' : '');
    if (config.accentColor) {
      wrapper.style.setProperty('--sm-accent', config.accentColor);
    }
    wrapper.setAttribute('data-position', config.position);
    wrapper.id = 'staggered-menu-wrapper';

    // Pre-layers
    const preLayers = document.createElement('div');
    preLayers.className = 'sm-prelayers';
    preLayers.setAttribute('aria-hidden', 'true');
    arr.forEach((c) => {
      const layer = document.createElement('div');
      layer.className = 'sm-prelayer';
      layer.style.background = c;
      preLayers.appendChild(layer);
    });
    wrapper.appendChild(preLayers);

    // Header
    const header = document.createElement('header');
    header.className = 'staggered-menu-header';
    header.setAttribute('aria-label', 'Main navigation header');

    // Logo
    const logoDiv = document.createElement('div');
    logoDiv.className = 'sm-logo';
    logoDiv.setAttribute('aria-label', 'Logo');
    if (config.logoUrl) {
      const img = document.createElement('img');
      img.src = config.logoUrl;
      img.alt = 'Logo';
      img.className = 'sm-logo-img';
      img.draggable = false;
      img.width = 110;
      img.height = 24;
      logoDiv.appendChild(img);
    } else {
      const logoLink = document.createElement('a');
      logoLink.href = config.logoLink;
      logoLink.className = 'sm-logo-text';
      logoLink.textContent = config.logoText;
      logoDiv.appendChild(logoLink);
    }
    header.appendChild(logoDiv);

    // Toggle button
    const toggle = document.createElement('button');
    toggle.className = 'sm-toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'staggered-menu-panel');
    toggle.type = 'button';
    toggle.id = 'sm-toggle-btn';

    const textWrap = document.createElement('span');
    textWrap.className = 'sm-toggle-textWrap';
    textWrap.setAttribute('aria-hidden', 'true');

    const textInner = document.createElement('span');
    textInner.className = 'sm-toggle-textInner';
    textInner.id = 'sm-toggle-textInner';
    ['Menu', 'Close'].forEach(t => {
      const line = document.createElement('span');
      line.className = 'sm-toggle-line';
      line.textContent = t;
      textInner.appendChild(line);
    });
    textWrap.appendChild(textInner);
    toggle.appendChild(textWrap);

    const icon = document.createElement('span');
    icon.className = 'sm-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.id = 'sm-icon';

    const plusH = document.createElement('span');
    plusH.className = 'sm-icon-line';
    plusH.id = 'sm-icon-h';

    const plusV = document.createElement('span');
    plusV.className = 'sm-icon-line sm-icon-line-v';
    plusV.id = 'sm-icon-v';

    icon.appendChild(plusH);
    icon.appendChild(plusV);
    toggle.appendChild(icon);
    header.appendChild(toggle);
    wrapper.appendChild(header);

    // Panel
    const panel = document.createElement('aside');
    panel.id = 'staggered-menu-panel';
    panel.className = 'staggered-menu-panel';
    panel.setAttribute('aria-hidden', 'true');

    const panelInner = document.createElement('div');
    panelInner.className = 'sm-panel-inner';

    // Menu items list
    const ul = document.createElement('ul');
    ul.className = 'sm-panel-list';
    ul.setAttribute('role', 'list');
    if (config.displayItemNumbering) {
      ul.setAttribute('data-numbering', '');
    }

    if (config.items.length) {
      config.items.forEach((it, idx) => {
        const li = document.createElement('li');
        li.className = 'sm-panel-itemWrap';

        const a = document.createElement('a');
        a.className = 'sm-panel-item';
        a.href = it.link;
        if (it.ariaLabel) a.setAttribute('aria-label', it.ariaLabel);
        a.setAttribute('data-index', idx + 1);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'sm-panel-itemLabel';
        labelSpan.textContent = it.label;

        a.appendChild(labelSpan);
        li.appendChild(a);
        ul.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'sm-panel-itemWrap';
      li.setAttribute('aria-hidden', 'true');
      const span = document.createElement('span');
      span.className = 'sm-panel-item';
      const labelSpan = document.createElement('span');
      labelSpan.className = 'sm-panel-itemLabel';
      labelSpan.textContent = 'No items';
      span.appendChild(labelSpan);
      li.appendChild(span);
      ul.appendChild(li);
    }
    panelInner.appendChild(ul);

    // Social items
    if (config.displaySocials && config.socialItems.length > 0) {
      const socialsDiv = document.createElement('div');
      socialsDiv.className = 'sm-socials';
      socialsDiv.setAttribute('aria-label', 'Social links');

      const socialsTitle = document.createElement('h3');
      socialsTitle.className = 'sm-socials-title';
      socialsTitle.textContent = 'Socials';
      socialsDiv.appendChild(socialsTitle);

      const socialsList = document.createElement('ul');
      socialsList.className = 'sm-socials-list';
      socialsList.setAttribute('role', 'list');

      config.socialItems.forEach(s => {
        const li = document.createElement('li');
        li.className = 'sm-socials-item';
        const a = document.createElement('a');
        a.href = s.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'sm-socials-link';
        a.textContent = s.label;
        li.appendChild(a);
        socialsList.appendChild(li);
      });
      socialsDiv.appendChild(socialsList);
      panelInner.appendChild(socialsDiv);
    }

    panel.appendChild(panelInner);
    wrapper.appendChild(panel);

    document.body.prepend(wrapper);
  }

  function cacheElements() {
    els.wrapper = document.getElementById('staggered-menu-wrapper');
    els.panel = document.getElementById('staggered-menu-panel');
    els.preLayers = els.wrapper.querySelector('.sm-prelayers');
    els.preLayerEls = Array.from(els.wrapper.querySelectorAll('.sm-prelayer'));
    els.plusH = document.getElementById('sm-icon-h');
    els.plusV = document.getElementById('sm-icon-v');
    els.icon = document.getElementById('sm-icon');
    els.textInner = document.getElementById('sm-toggle-textInner');
    els.toggleBtn = document.getElementById('sm-toggle-btn');
  }

  function setupInitialState() {
    const offscreen = config.position === 'left' ? -100 : 100;
    gsap.set([els.panel, ...els.preLayerEls], { xPercent: offscreen, opacity: 1 });
    if (els.preLayers) {
      gsap.set(els.preLayers, { xPercent: 0, opacity: 1 });
    }
    gsap.set(els.plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(els.plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(els.icon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(els.textInner, { yPercent: 0 });
    gsap.set(els.toggleBtn, { color: config.menuButtonColor });
  }

  function bindEvents() {
    els.toggleBtn.addEventListener('click', toggleMenu);

    if (config.closeOnClickAway) {
      document.addEventListener('mousedown', (e) => {
        if (!state.open) return;
        if (els.panel.contains(e.target) || els.toggleBtn.contains(e.target)) return;
        closeMenu();
      });
    }
  }

  function buildOpenTimeline() {
    if (tweens.openTl) tweens.openTl.kill();
    if (tweens.closeTween) { tweens.closeTween.kill(); tweens.closeTween = null; }
    if (tweens.itemEntrance) tweens.itemEntrance.kill();

    const panel = els.panel;
    const layers = els.preLayerEls;

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen = config.position === 'left' ? -100 : 100;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' }
      }, itemsStart);

      if (numberEls.length) {
        tl.to(numberEls, {
          duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1,
          stagger: { each: 0.08, from: 'start' }
        }, itemsStart + 0.1);
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
        }, socialsStart + 0.04);
      }
    }

    tweens.openTl = tl;
    return tl;
  }

  function playOpen() {
    if (state.busy) return;
    state.busy = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { state.busy = false; });
      tl.play(0);
    } else {
      state.busy = false;
    }
  }

  function playClose() {
    if (tweens.openTl) { tweens.openTl.kill(); tweens.openTl = null; }
    if (tweens.itemEntrance) tweens.itemEntrance.kill();

    const panel = els.panel;
    const layers = els.preLayerEls;
    const all = [...layers, panel];

    if (tweens.closeTween) tweens.closeTween.kill();
    const offscreen = config.position === 'left' ? -100 : 100;

    tweens.closeTween = gsap.to(all, {
      xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        state.busy = false;
      }
    });
  }

  function animateIcon(opening) {
    if (tweens.spin) tweens.spin.kill();
    if (opening) {
      tweens.spin = gsap.to(els.icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      tweens.spin = gsap.to(els.icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }

  function animateColor(opening) {
    if (tweens.color) tweens.color.kill();
    if (config.changeMenuColorOnOpen) {
      const targetColor = opening ? config.openMenuButtonColor : config.menuButtonColor;
      tweens.color = gsap.to(els.toggleBtn, {
        color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out'
      });
    } else {
      gsap.set(els.toggleBtn, { color: config.menuButtonColor });
    }
  }

  function animateText(opening) {
    if (tweens.textCycle) tweens.textCycle.kill();

    const inner = els.textInner;
    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    // Rebuild text lines
    inner.innerHTML = '';
    seq.forEach(t => {
      const line = document.createElement('span');
      line.className = 'sm-toggle-line';
      line.textContent = t;
      inner.appendChild(line);
    });

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    tweens.textCycle = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }

  function toggleMenu() {
    const target = !state.open;
    state.open = target;

    els.toggleBtn.setAttribute('aria-expanded', target);
    els.toggleBtn.setAttribute('aria-label', target ? 'Close menu' : 'Open menu');
    els.panel.setAttribute('aria-hidden', !target);

    if (target) {
      els.wrapper.setAttribute('data-open', '');
      if (config.onMenuOpen) config.onMenuOpen();
      playOpen();
    } else {
      els.wrapper.removeAttribute('data-open');
      if (config.onMenuClose) config.onMenuClose();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }

  function closeMenu() {
    if (state.open) {
      state.open = false;
      els.toggleBtn.setAttribute('aria-expanded', 'false');
      els.toggleBtn.setAttribute('aria-label', 'Open menu');
      els.panel.setAttribute('aria-hidden', 'true');
      els.wrapper.removeAttribute('data-open');
      if (config.onMenuClose) config.onMenuClose();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }

  return { init };
})();

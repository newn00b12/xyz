/* ============================================================
   CINEMATIC PORTFOLIO — Interactions & Animations
   ============================================================ */

;(function(){
  'use strict';

  /* --- Preloader --- */
  const loader      = document.getElementById('loader');
  const loaderCount = document.getElementById('loaderCount');
  let loadProgress  = 0;

  function tickLoader(){
    loadProgress += Math.random() * 12 + 4;
    if(loadProgress > 100) loadProgress = 100;
    loaderCount.textContent = Math.floor(loadProgress);
    if(loadProgress < 100){
      requestAnimationFrame(()=> setTimeout(tickLoader, 40));
    } else {
      setTimeout(()=>{
        loader.classList.add('done');
        revealHero();
      }, 400);
    }
  }
  window.addEventListener('load', ()=> setTimeout(tickLoader, 200));

  /* --- Custom Cursor --- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
  });

  (function loopRing(){
    rx += (mx - rx) * .08;
    ry += (my - ry) * .08;
    ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
    requestAnimationFrame(loopRing);
  })();

  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', ()=> document.body.classList.add('on-link'));
    el.addEventListener('mouseleave', ()=> document.body.classList.remove('on-link'));
  });

  /* --- Magnetic Buttons --- */
  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      el.style.transform = `translate(${x*.25}px,${y*.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
      setTimeout(()=> el.style.transition = '', 500);
    });
  });

  /* --- Header Scroll --- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* --- Burger / Mobile Menu --- */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('on');
    menu.classList.toggle('on');
    document.body.style.overflow = menu.classList.contains('on') ? 'hidden' : '';
  });
  document.querySelectorAll('.menu__link').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('on');
    menu.classList.remove('on');
    document.body.style.overflow = '';
  }));

  /* --- Smooth Scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  /* --- Portfolio Filter --- */
  const filterBtns  = document.querySelectorAll('.filter');
  const workItems   = document.querySelectorAll('.work__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      workItems.forEach((item, i) => {
        if(f === 'all' || item.dataset.cat === f){
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(24px) scale(.96)';
          setTimeout(()=> {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 60 + i * 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* --- Contact Form --- */
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const btn = this.querySelector('.btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="btn__text">Sent!</span>';
    btn.style.background = '#10b981';
    btn.disabled = true;
    setTimeout(()=>{
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 3000);
  });

  /* ============================================================
     HERO REVEAL (after preloader)
     ============================================================ */
  function revealHero(){
    // Title words
    document.querySelectorAll('.hero__title-word').forEach((w, i) => {
      setTimeout(()=>{
        w.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s ease';
        w.style.transform = 'translateY(0)';
        w.style.opacity = '1';
      }, 150 + i * 100);
    });
    // Desc + actions
    setTimeout(()=>{
      ['hero__desc','hero__actions'].forEach(cls => {
        const el = document.querySelector('.' + cls);
        if(el){ el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease';
                el.style.transform = 'translateY(0)'; el.style.opacity = '1'; }
      });
    }, 700);
    // Portrait
    setTimeout(()=>{
      const p = document.querySelector('.hero__portrait');
      if(p){ p.style.transition = 'transform 1s cubic-bezier(.16,1,.3,1), opacity 1s ease';
             p.style.transform = 'scale(1)'; p.style.opacity = '1'; }
    }, 500);
    // Bottom stats
    document.querySelectorAll('.hero__stat, .hero__scroll').forEach((el, i) => {
      setTimeout(()=>{
        el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease';
        el.style.transform = 'translateY(0)'; el.style.opacity = '1';
      }, 1100 + i * 120);
    });
    // Counters
    document.querySelectorAll('[data-count]').forEach(c => {
      const target = +c.dataset.count;
      const dur = 2000;
      const t0 = performance.now();
      (function tick(now){
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        c.textContent = Math.floor(target * ease);
        if(p < 1) requestAnimationFrame(tick);
      })(t0);
    });

    initScrollReveal();
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initScrollReveal(){
    const opts = { threshold: .15, rootMargin: '0px 0px -50px 0px' };

    /* Section titles */
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.querySelectorAll('.section-title__word').forEach((w, i) => {
          setTimeout(()=>{
            w.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s ease';
            w.style.transform = 'translateY(0)'; w.style.opacity = '1';
          }, i * 90);
        });
        entry.target.previousElementSibling?.style &&
          (entry.target.previousElementSibling.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1), opacity .7s ease',
           entry.target.previousElementSibling.style.transform = 'translateY(0)',
           entry.target.previousElementSibling.style.opacity = '1');
      });
    }, opts).observe(document.querySelector('.about__header'));
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.querySelectorAll('.section-title__word').forEach((w, i) => {
          setTimeout(()=>{
            w.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s ease';
            w.style.transform = 'translateY(0)'; w.style.opacity = '1';
          }, i * 90);
        });
      });
    }, opts).observe(document.querySelector('.services__header'));
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.querySelectorAll('.section-title__word').forEach((w, i) => {
          setTimeout(()=>{
            w.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s ease';
            w.style.transform = 'translateY(0)'; w.style.opacity = '1';
          }, i * 90);
        });
      });
    }, opts).observe(document.querySelector('.work__header'));
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.querySelectorAll('.section-title__word').forEach((w, i) => {
          setTimeout(()=>{
            w.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s ease';
            w.style.transform = 'translateY(0)'; w.style.opacity = '1';
          }, i * 90);
        });
      });
    }, opts).observe(document.querySelector('.contact__header'));

    /* [data-reveal] generic fade-up */
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
      });
    }, opts).observe;

    document.querySelectorAll('[data-reveal]').forEach(el => {
      new IntersectionObserver((entries, obs) => {
        if(entries[0].isIntersecting){
          entries[0].target.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease';
          entries[0].target.style.transform = 'translateY(0)';
          entries[0].target.style.opacity = '1';
          obs.unobserve(entries[0].target);
        }
      }, opts).observe(el);
    });

    /* Services stagger */
    document.querySelectorAll('.service').forEach((s, i) => {
      new IntersectionObserver((entries, obs) => {
        if(entries[0].isIntersecting){
          setTimeout(()=>{
            entries[0].target.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease';
            entries[0].target.style.transform = 'translateY(0)';
            entries[0].target.style.opacity = '1';
          }, i * 80);
          obs.unobserve(entries[0].target);
        }
      }, {threshold:.1, rootMargin:'0px 0px -30px 0px'}).observe(s);
    });

    /* Work grid stagger */
    new IntersectionObserver((entries, obs) => {
      if(!entries[0].isIntersecting) return;
      entries[0].target.querySelectorAll('.work__item').forEach((item, i) => {
        setTimeout(()=>{
          item.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease';
          item.style.transform = 'translateY(0)'; item.style.opacity = '1';
        }, i * 80);
      });
      obs.unobserve(entries[0].target);
    }, {threshold:.08}).observe(document.querySelector('.work__grid'));

    /* Skill bars */
    document.querySelectorAll('.skill').forEach(s => {
      new IntersectionObserver((entries, obs) => {
        if(entries[0].isIntersecting){
          const fill = s.querySelector('.skill__fill');
          if(fill) setTimeout(()=> fill.style.width = fill.dataset.width + '%', 250);
          obs.unobserve(s);
        }
      }, {threshold:.5}).observe(s);
    });

    /* Parallax */
    let ticking = false;
    window.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(()=>{
        const y = window.scrollY;
        const l1 = document.querySelector('.hero__light--1');
        const l2 = document.querySelector('.hero__light--2');
        if(l1) l1.style.transform = `translate(${y*.03}px, ${y*.08}px)`;
        if(l2) l2.style.transform = `translate(${-y*.04}px, ${y*.06}px)`;
        ticking = false;
      });
    });
  }

})();

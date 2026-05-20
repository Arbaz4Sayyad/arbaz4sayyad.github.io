document.addEventListener("DOMContentLoaded", () => {
    // 1. Dark Mode Logic
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    const setDarkMode = (isDark) => {
      if (isDark) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }

    themeToggle.addEventListener('click', () => {
      setDarkMode(!html.classList.contains('dark'));
    });

    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            setDarkMode(!html.classList.contains('dark'));
        });
    }

    // 2. GSAP Animations Initialization
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entrance
    const tl = gsap.timeline();
    tl.from(".stagger-hero", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: "power4.out"
    });

    // Section Reveals on Scroll
    gsap.utils.toArray(".reveal").forEach((elem) => {
      gsap.from(elem, {
        y: 40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // 3. Navbar & Back-to-Top Scroll Effects
    window.addEventListener("scroll", () => {
      const nav = document.getElementById("navbar");
      const navContent = nav.querySelector('div');
      const backToTop = document.getElementById("backToTop");
      
      if (window.scrollY > 100) {
        nav.style.backgroundColor = html.classList.contains('dark') ? '#020617' : 'white';
        nav.classList.add("shadow-2xl");
        nav.classList.remove("py-4");
        nav.classList.add("py-0");
        
        navContent.style.backgroundColor = 'transparent';
        navContent.style.backdropFilter = 'none';
        navContent.classList.remove("bg-white/70", "dark:bg-slate-900/70", "shadow-lg", "rounded-2xl", "border", "backdrop-blur-md");
        navContent.classList.add("rounded-none", "border-b", "border-slate-200/50", "dark:border-slate-800/50");
        backToTop.classList.remove("opacity-0", "invisible", "translate-y-10");
      } else {
        nav.style.backgroundColor = 'transparent';
        nav.classList.remove("shadow-2xl", "py-0");
        nav.classList.add("py-4");
        
        navContent.style.backgroundColor = '';
        navContent.style.backdropFilter = '';
        navContent.classList.add("bg-white/70", "dark:bg-slate-900/70", "shadow-lg", "rounded-2xl", "border", "backdrop-blur-md");
        navContent.classList.remove("rounded-none", "border-b", "border-slate-200/50", "dark:border-slate-800/50");
        backToTop.classList.add("opacity-0", "invisible", "translate-y-10");
      }
    });

    // 4. Typed.js Setup
    if (document.querySelector(".role")) {
        new Typed(".role", {
            strings: [
                "Software Developer",
                "Java Full Stack Developer",
                "Web Developer",
                "Backend Developer",
            ],
            loop: true,
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 1500,
        });
    }

    // 5. Video Modal Logic
    window.openVideoModal = (id) => {
      const modal = document.getElementById(id);
      // Lazy-load: only set the src when the modal is actually opened
      const iframe = modal.querySelector('iframe');
      if (iframe && iframe.dataset.src && !iframe.src) {
        iframe.src = iframe.dataset.src;
      }
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      gsap.from(modal.querySelector('.relative'), { scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.4)' });
    };

    window.closeVideoModal = (id) => {
      const modal = document.getElementById(id);
      gsap.to(modal.querySelector('.relative'), {
        scale: 0.85, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
          // Blank the src to fully stop video playback (works for YouTube & Drive)
          const iframe = modal.querySelector('iframe');
          if (iframe) iframe.src = '';
        }
      });
    };

    document.querySelectorAll('.video-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal(modal.id);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.video-modal').forEach(modal => {
                if (modal.style.display === 'flex') {
                    closeVideoModal(modal.id);
                }
            });
        }
    });

    // 6. Floating Animation for Decorations
    gsap.to(".floating-element", {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

    // 7. Hero Blob Movement
    gsap.to(".hero-blob", {
        x: "random(-40, 40)",
        y: "random(-40, 40)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
    });

    // 7. Back to Top Click Logic
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 8. Stats Counter Animation
    gsap.utils.toArray(".counter").forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count"));
      gsap.to(counter, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counter,
          start: "top 100%",
        },
      });
    });

    // 9. Experience Timeline Animations
    if (document.querySelector(".timeline-line")) {
      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: "#experience",
          start: "top 75%",
          end: "bottom 85%",
          scrub: 1,
        }
      });
    }

    gsap.utils.toArray(".timeline-item").forEach((item, index) => {
      gsap.from(item, {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none none"
        }
      });
    });

    // Refresh ScrollTrigger after all initializations
    ScrollTrigger.refresh();



    // 10. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('translate-x-full');
        });
    }

    if (closeMobileMenu && mobileDrawer) {
        closeMobileMenu.addEventListener('click', () => {
            mobileDrawer.classList.add('translate-x-full');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.add('translate-x-full');
        });
    });
});

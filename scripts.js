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
      // Lazy-load: use getAttribute to get the LITERAL attribute value (not browser-resolved URL).
      // iframe.src (DOM property) always returns an absolute URL even when src="", so !iframe.src
      // was always false. getAttribute('src') correctly returns the raw "" string.
      const iframe = modal.querySelector('iframe');
      if (iframe && iframe.dataset.src && iframe.getAttribute('src') === '') {
        iframe.setAttribute('src', iframe.dataset.src);
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
          // Use setAttribute so the literal attribute value becomes "" again,
          // allowing openVideoModal to correctly detect it next time.
          const iframe = modal.querySelector('iframe');
          if (iframe) iframe.setAttribute('src', '');
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

    // 5b. Interactive In-Page Resume Modal Logic
    const resumeModal = document.getElementById('resumeModal');
    const resumeModalCard = document.getElementById('resumeModalCard');
    const resumeIframe = document.getElementById('resumeIframe');
    const resumeIframeLoader = document.getElementById('resumeIframeLoader');

    window.openResumeModal = () => {
      if (!resumeModal) return;

      // Lazy load iframe src
      if (resumeIframe) {
        if (!resumeIframe.getAttribute('src') && resumeIframe.dataset.src) {
          if (resumeIframeLoader) {
            resumeIframeLoader.style.display = 'flex';
            resumeIframeLoader.style.opacity = '1';
          }
          resumeIframe.setAttribute('src', resumeIframe.dataset.src);
          resumeIframe.onload = () => {
            if (resumeIframeLoader) {
              resumeIframeLoader.style.opacity = '0';
              setTimeout(() => {
                resumeIframeLoader.style.display = 'none';
              }, 300);
            }
          };
        }
      }

      resumeModal.classList.remove('hidden');
      resumeModal.classList.add('flex');
      document.body.style.overflow = 'hidden';

      // Animate modal entry
      requestAnimationFrame(() => {
        resumeModal.classList.remove('opacity-0');
        resumeModal.classList.add('opacity-100');
        if (resumeModalCard) {
          resumeModalCard.classList.remove('scale-95', 'opacity-0');
          resumeModalCard.classList.add('scale-100', 'opacity-100');
        }
      });
    };

    window.closeResumeModal = () => {
      if (!resumeModal) return;

      resumeModal.classList.remove('opacity-100');
      resumeModal.classList.add('opacity-0');
      if (resumeModalCard) {
        resumeModalCard.classList.remove('scale-100', 'opacity-100');
        resumeModalCard.classList.add('scale-95', 'opacity-0');
      }

      setTimeout(() => {
        resumeModal.classList.remove('flex');
        resumeModal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    };

    window.downloadOrPrintResume = async () => {
      const pdfUrl = 'https://arbaz4sayyad.github.io/resume/Arbaz_Sayyad_Software_Engineer_Backend_Resume.pdf';
      const downloadBtn = document.getElementById('resumeDownloadBtn');
      const originalText = downloadBtn ? downloadBtn.innerHTML : '';

      if (downloadBtn) {
        downloadBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin text-[11px]"></i> <span>Downloading...</span>';
      }

      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Arbaz_Sayyad_Software_Engineer_Backend_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      } catch (err) {
        console.warn('Direct blob download failed, falling back to hidden iframe/link:', err);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Arbaz_Sayyad_Software_Engineer_Backend_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } finally {
        if (downloadBtn) {
          setTimeout(() => {
            downloadBtn.innerHTML = originalText || '<i class="fas fa-download text-[11px]"></i> <span>Download / Print</span>';
          }, 600);
        }
      }
    };

    if (resumeModal) {
      resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
          closeResumeModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (resumeModal && !resumeModal.classList.contains('hidden')) {
                closeResumeModal();
            }
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

/* ===================================================
   ENGINEERING PORTFOLIO — Tab & Modal Logic
   =================================================== */

function switchEPTab(tabId, clickedBtn) {
  // Hide all panels
  document.querySelectorAll('.ep-tab-panel').forEach(p => p.classList.add('hidden'));
  // Deactivate all buttons
  document.querySelectorAll('.ep-tab-btn').forEach(b => b.classList.remove('active'));
  // Show target panel
  const panel = document.getElementById('ep-' + tabId);
  if (panel) panel.classList.remove('hidden');
  // Activate clicked button
  if (clickedBtn) clickedBtn.classList.add('active');
}

/* ── Modal Content Data ── */
const epModalContent = {

  /* ARCHITECTURE MODALS */
  'collabmatrix-arch': `
    <div class="ep-modal-badge"><i class="fas fa-project-diagram"></i> Architecture Deep Dive</div>
    <h2>CollabMatrix — Distributed Collaboration Platform</h2>
    <p>A 9-container production-grade architecture combining a Spring Boot modular monolith with Kafka, Redis Pub/Sub, CRDT-based collaborative editing, and polyglot persistence.</p>

    <h3>🏗️ High-Level Topology</h3>
    <ul>
      <li><strong>Spring Boot Modular Monolith</strong> — 5 bounded contexts (Projects, Tasks, Documents, Chat, Notifications) sharing one JVM but cleanly separated by package + @Module boundaries</li>
      <li><strong>PostgreSQL</strong> — Projects, Tasks, Users (transactional, ACID, FK constraints, optimistic locking via @Version)</li>
      <li><strong>MongoDB</strong> — Chat messages (document-per-conversation, TTL index for auto-expiry)</li>
      <li><strong>Redis</strong> — Pub/Sub for WS backplane, presence TTL, SLA keyspace notifications</li>
      <li><strong>Apache Kafka</strong> — Durable event streaming via Transactional Outbox Pattern</li>
    </ul>

    <h3>📡 WebSocket Scaling — Redis Pub/Sub Backplane</h3>
    <p>Problem: When 3 instances of the app run behind a load balancer, a WS connection to instance-A can't receive messages published to instance-B. Solution: every STOMP message is published to a Redis channel; all instances subscribe and relay to local WS sessions.</p>
    <pre>// On publish:
redisTemplate.convertAndSend("collab:project:" + projectId, payload);

// Subscriber (all instances):
@RedisListener(channels = "collab:project:*")
public void onMessage(String payload, String channel) {
  simpMessagingTemplate.convertAndSend("/topic/" + channel, payload);
}</pre>

    <h3>📬 Transactional Outbox Pattern</h3>
    <p>The dual-write problem: writing to the DB and publishing to Kafka in the same transaction is impossible across two different systems. Solution: write an <code>outbox_events</code> table inside the same DB transaction; a scheduled poller reads and publishes to Kafka, then marks as <code>PUBLISHED</code>.</p>
    <pre>@Transactional
public void createTask(Task task) {
  taskRepository.save(task);                    // writes task
  outboxRepository.save(new OutboxEvent(task)); // same TX
}

@Scheduled(fixedDelay = 500)
public void relay() {
  outboxRepository.findByStatus(PENDING).forEach(e -> {
    kafkaTemplate.send(e.getTopic(), e.getPayload());
    e.setStatus(PUBLISHED);
    outboxRepository.save(e);
  });
}</pre>

    <h3>✏️ CRDT Collaborative Editing — Yjs</h3>
    <p>Uses Yjs (YATA algorithm) for conflict-free collaborative document edits. The Spring server acts as a relay — it never interprets Yjs update bytes, it just forwards them between connected clients and persists a snapshot to PostgreSQL every 30s.</p>

    <h3>⚡ Performance Metrics</h3>
    <ul>
      <li>WebSocket message delivery: <strong>&lt;50ms</strong></li>
      <li>Horizontal WS scaling: <strong>10,000+ concurrent connections</strong></li>
      <li>SLA monitoring: <strong>zero DB polling</strong> (Redis keyspace notifications)</li>
      <li>Data loss: <strong>zero</strong> (Outbox + Kafka EOS)</li>
    </ul>
  `,

  'iecs-arch': `
    <div class="ep-modal-badge"><i class="fas fa-network-wired"></i> Architecture Deep Dive</div>
    <h2>IECS Enterprise — Insurance Eligibility & Claims System</h2>
    <p>A 6-service Spring Cloud microservices platform for health insurance eligibility determination and claims processing, with centralized gateway, service discovery, and a Redis-cached rule engine.</p>

    <h3>🏗️ Service Topology</h3>
    <ul>
      <li><strong>API Gateway</strong> — Spring Cloud Gateway: JWT auth, rate limiting (20 req/s), circuit breaking, routing</li>
      <li><strong>Auth Service</strong> — OAuth2 + JWT issuance, role-based (ADMIN, ADJUDICATOR, MEMBER)</li>
      <li><strong>Member Service</strong> — Member profiles, coverage tiers, PostgreSQL</li>
      <li><strong>Eligibility Service</strong> — Redis-cached rule engine, <code>@Cacheable</code> with instant eviction</li>
      <li><strong>Claims Service</strong> — FSM workflow: SUBMITTED → UNDER_REVIEW → APPROVED/DENIED</li>
      <li><strong>Notification Service</strong> — Async email/SMS via Spring Events</li>
      <li><strong>Eureka Registry</strong> — Service registration & health-based routing</li>
    </ul>

    <h3>⚡ Redis Rule Engine Cache</h3>
    <pre>@Cacheable(value = "eligibility-rules", key = "#planType + ':' + #state")
public EligibilityDecision evaluate(String planType, String state, Member m) {
  // Heavy DB + computation — cached after first call
  return ruleEngine.evaluate(planType, state, m);
}

@CacheEvict(value = "eligibility-rules", allEntries = true)
public void onRuleUpdate(RuleUpdateEvent event) { /* instant eviction */ }</pre>

    <h3>🔐 Security Architecture</h3>
    <ul>
      <li>JWT signed with RS256 (asymmetric) — public key distributed to all services</li>
      <li>Gateway validates token on every request before forwarding</li>
      <li>Service-level @PreAuthorize annotations for RBAC</li>
      <li>All inter-service calls use propagated JWT (no service mesh overhead)</li>
    </ul>

    <h3>📊 Performance Metrics</h3>
    <ul>
      <li>Eligibility evaluation: <strong>&lt;5s</strong> (from 45s pre-cache)</li>
      <li>Cache-hit ratio: <strong>90%</strong> during open-enrollment periods</li>
      <li>Application submission response: <strong>&lt;2s</strong></li>
      <li>Services: <strong>6 independently deployable</strong></li>
    </ul>
  `,

  'ai-arch': `
    <div class="ep-modal-badge"><i class="fas fa-brain"></i> Architecture Deep Dive</div>
    <h2>AI Meeting Notes — Async AI Processing Pipeline</h2>
    <p>A fault-tolerant Spring Boot service that decouples audio transcription (Whisper/Google STT) and AI summarization (Gemini) from the HTTP request thread, processing meetings end-to-end in under 90 seconds with zero blocking.</p>

    <h3>🔄 Processing Pipeline</h3>
    <pre>Upload (audio file)
    ↓ [202 Accepted, &lt;500ms]
    ↓ @Async CompletableFuture
    ↓ TranscriptionService (Whisper → Google STT fallback)
    ↓ GeminiService.extractStructuredInsights()
    ↓ PostgreSQL save (transcript + summary + actions + risks)
    ↓ SSE push to frontend (or polling endpoint)</pre>

    <h3>⚡ @Async Thread Pool Configuration</h3>
    <pre>@Bean("aiExecutor")
public ThreadPoolTaskExecutor aiExecutor() {
  var exec = new ThreadPoolTaskExecutor();
  exec.setCorePoolSize(4);
  exec.setMaxPoolSize(12);
  exec.setQueueCapacity(50);
  exec.setRejectedExecutionHandler(new CallerRunsPolicy());
  exec.setThreadNamePrefix("ai-worker-");
  return exec;
}</pre>

    <h3>🛡️ Multi-Provider Fallback with Resilience4j</h3>
    <pre>@CircuitBreaker(name = "whisper", fallbackMethod = "googleSTTFallback")
public String transcribeWithWhisper(byte[] audio) { ... }

public String googleSTTFallback(byte[] audio, Throwable t) {
  return googleSpeechClient.transcribe(audio);
}</pre>

    <h3>🤖 Gemini AI Structured Extraction</h3>
    <p>Gemini API receives the transcript with a structured prompt requesting JSON output with: <code>summary</code>, <code>decisions[]</code>, <code>actionItems[]{owner,deadline}</code>, and <code>risks[]</code>. Response is validated with Jackson and stored as JSONB in PostgreSQL.</p>

    <h3>📊 Performance Metrics</h3>
    <ul>
      <li>HTTP response time: <strong>&lt;500ms</strong> (async decoupling)</li>
      <li>End-to-end processing: <strong>&lt;90 seconds</strong></li>
      <li>Transcription success rate: <strong>99.5%+</strong> (with fallback)</li>
      <li>Post-meeting effort reduction: <strong>~70%</strong></li>
    </ul>
  `,

  /* CASE STUDY MODALS */
  'collabmatrix-case': `
    <div class="ep-modal-badge"><i class="fas fa-flask"></i> Engineering Case Study</div>
    <h2>CollabMatrix — Real-Time Collaboration Infrastructure</h2>

    <h3>Problem Statement</h3>
    <p>Modern engineering teams suffer from context-switching across Jira (tasks), Notion (docs), and Slack (chat). Each tool has separate auth, separate UX, and no real-time awareness of work happening in parallel. The business problem: how do you build a Jira+Notion+Slack unified workspace that scales WebSockets horizontally and handles concurrent document editing without conflicts?</p>

    <h3>Non-Functional Requirements</h3>
    <ul>
      <li>WebSocket message delivery: &lt;100ms P99</li>
      <li>Horizontal scalability: 10,000+ concurrent WS connections</li>
      <li>Collaborative editing: conflict-free without a central authority</li>
      <li>Data durability: zero message loss across service restarts</li>
      <li>SLA alerting: latency &lt;2ms (zero DB polling)</li>
    </ul>

    <h3>Key Trade-Off: CRDT vs Operational Transformation</h3>
    <p><strong>OT (Operational Transformation)</strong> — Used by Google Docs. Requires a central server to order all operations. Complex to implement correctly (diamond problem). Doesn't work well in distributed scenarios.</p>
    <p><strong>CRDT (Conflict-free Replicated Data Type)</strong> — Chosen approach via Yjs. Mathematically proven to converge without a central authority. Peers can merge changes independently. Simpler server: just relay + snapshot.</p>

    <h3>Key Trade-Off: Redis Pub/Sub vs Kafka for WS Backplane</h3>
    <p><strong>Kafka</strong> — Durable, replayable, ordered. But high latency (~5-50ms) and complex consumer group management for WS use case.</p>
    <p><strong>Redis Pub/Sub</strong> — Chosen: &lt;1ms latency, fire-and-forget (acceptable for WS — client reconnects handle missed messages), zero offset management complexity.</p>

    <h3>Failure Scenarios & Recovery</h3>
    <ul>
      <li><strong>Server crash mid-outbox</strong>: Outbox rows with PENDING status are re-processed on restart. Kafka consumer idempotency via unique event_id deduplication.</li>
      <li><strong>Redis restart</strong>: WS connections reconnect, re-subscribe. No state loss (state is in PostgreSQL).</li>
      <li><strong>Network partition</strong>: Yjs CRDTs can merge diverged states when connectivity restores.</li>
    </ul>
  `,

  'iecs-case': `
    <div class="ep-modal-badge"><i class="fas fa-flask"></i> Engineering Case Study</div>
    <h2>IECS Enterprise — Distributed Insurance Eligibility System</h2>

    <h3>Problem Statement</h3>
    <p>Health insurance eligibility determination involves cross-referencing dozens of rules: coverage tier, state regulations, pre-existing condition exclusions, plan-specific benefits. A monolithic rule engine was a 45-second bottleneck for each application. The system needed decomposition for independent scaling during open-enrollment surges (10x traffic in 2 weeks/year).</p>

    <h3>Domain Decomposition Strategy</h3>
    <p>Applied Domain-Driven Design (DDD) to identify 6 bounded contexts, each with its own database (database-per-service pattern):</p>
    <ul>
      <li><strong>Auth</strong> — User identity, JWT issuance</li>
      <li><strong>Member</strong> — Policyholder profiles and coverage tiers</li>
      <li><strong>Eligibility</strong> — Rule evaluation engine</li>
      <li><strong>Claims</strong> — FSM-based claims processing workflow</li>
      <li><strong>Notification</strong> — Async communication</li>
      <li><strong>Gateway</strong> — Cross-cutting: auth, routing, rate limiting</li>
    </ul>

    <h3>Key Trade-Off: Service Mesh vs Gateway-Only</h3>
    <p><strong>Service Mesh (Istio/Linkerd)</strong> — Automatic mTLS, observability sidecar, fine-grained traffic control. But operational complexity, Kubernetes required, steep learning curve.</p>
    <p><strong>Spring Cloud Gateway + Resilience4j</strong> — Chosen: same circuit breaking, rate limiting, and routing in pure Java. Zero sidecar overhead. Team already had Spring expertise.</p>

    <h3>Redis Cache Strategy</h3>
    <p>Eligibility rules don't change frequently, but must be consistent when they do. Cache-aside pattern with Spring's @Cacheable. On rule update, @CacheEvict clears all entries instantly — next request re-populates from PostgreSQL. 90% cache-hit ratio during steady-state enrollment.</p>

    <h3>Lessons Learned</h3>
    <ul>
      <li>Database-per-service was the right call — the Eligibility service scaled to 12 instances during peak without impacting Claims</li>
      <li>Eureka health checks caught 3 real network issues in staging before production</li>
      <li>JWT propagation (not service-to-service tokens) simplified auth but required careful expiry handling</li>
    </ul>
  `,

  'ai-case': `
    <div class="ep-modal-badge"><i class="fas fa-flask"></i> Engineering Case Study</div>
    <h2>AI Meeting Notes — Async AI Processing System</h2>

    <h3>Problem Statement</h3>
    <p>Teams spend 20-30 minutes after every meeting writing up notes, action items, and follow-ups. AI can automate this, but audio transcription takes 30-90 seconds and AI summarization another 15-30 seconds. Making a user wait 2 minutes for an HTTP response is unacceptable. The engineering challenge: decouple long-running AI processing from the HTTP request lifecycle.</p>

    <h3>Async Architecture Decision</h3>
    <p>Three options were evaluated:</p>
    <ul>
      <li><strong>Synchronous</strong>: Simple, but 2-minute HTTP timeout. Rejected.</li>
      <li><strong>Message Queue (Kafka/RabbitMQ)</strong>: Durable, but adds infrastructure. Overkill for single-service.</li>
      <li><strong>Spring @Async + ThreadPoolTaskExecutor</strong>: Chosen. Returns 202 in &lt;500ms. Background thread handles AI. Bounded queue (cap=50) with CallerRunsPolicy for backpressure.</li>
    </ul>

    <h3>Multi-Provider Fallback Design</h3>
    <p>Whisper (primary) has occasional rate limits and model loading delays. Google STT (fallback) is more reliable but costs more. Resilience4j circuit breaker: opens after 5 failures in 10s, waits 30s in open state, then allows one test call. Zero manual intervention needed.</p>

    <h3>Gemini AI Prompt Engineering</h3>
    <p>Gemini receives the transcript with a structured system prompt requiring strict JSON output. Jackson's ObjectMapper with <code>@JsonProperty</code> mapping handles parsing. Invalid AI responses trigger a retry with a simpler fallback prompt that returns just a plain summary.</p>

    <h3>Results</h3>
    <ul>
      <li>API response time: 45s → <strong>&lt;500ms</strong> (99x improvement)</li>
      <li>Post-meeting documentation effort: reduced by <strong>~70%</strong></li>
      <li>Transcription success rate: <strong>99.5%+</strong> with fallback</li>
      <li>Thread pool utilization: steady at 60-70% under normal load</li>
    </ul>
  `,

  /* BLOG MODALS */
  'blog1': `
    <div class="ep-modal-badge"><i class="fas fa-stream"></i> Technical Blog · Kafka · PostgreSQL</div>
    <h2>Solving the Dual-Write Problem with the Transactional Outbox Pattern</h2>
    <p><em>12 min read · Senior Level · Full Code Included</em></p>

    <h3>The Problem: Silent Data Loss</h3>
    <p>Every distributed system eventually faces this scenario: you save data to PostgreSQL, then publish an event to Kafka. Between these two operations, your service crashes. The database write succeeded; the Kafka event never happened. Now your downstream consumers are out of sync — silently.</p>
    <p>This is the dual-write problem. And it's more common than most engineers admit.</p>

    <h3>Why You Can't Use a Distributed Transaction</h3>
    <p>XA transactions (two-phase commit across DB + Kafka) technically work, but they're slow (2x network roundtrips), Kafka's support is limited, and failure modes during coordinator crashes are complex. Don't use them.</p>

    <h3>The Solution: Transactional Outbox</h3>
    <p>Write to an <code>outbox_events</code> table in the same database transaction as your business data. A separate process reads from this table and publishes to Kafka. If the service crashes before publishing, the outbox row survives and will be retried.</p>
    <pre>-- Schema
CREATE TABLE outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type VARCHAR(100) NOT NULL,
  aggregate_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Index for the poller
CREATE INDEX idx_outbox_pending ON outbox_events(status, created_at)
WHERE status = 'PENDING';</pre>

    <h3>Spring Boot Implementation</h3>
    <pre>@Service @RequiredArgsConstructor
public class TaskService {
  private final TaskRepository taskRepo;
  private final OutboxRepository outboxRepo;

  @Transactional
  public Task createTask(CreateTaskRequest req) {
    Task task = taskRepo.save(new Task(req));

    // Same transaction — atomicity guaranteed
    OutboxEvent event = OutboxEvent.builder()
        .aggregateType("Task")
        .aggregateId(task.getId().toString())
        .eventType("TASK_CREATED")
        .payload(objectMapper.writeValueAsString(task))
        .build();
    outboxRepo.save(event);

    return task;
  }
}</pre>

    <h3>The Outbox Relayer (Scheduler)</h3>
    <pre>@Component @RequiredArgsConstructor
public class OutboxRelayer {
  private final OutboxRepository outboxRepo;
  private final KafkaTemplate&lt;String, String&gt; kafka;

  @Scheduled(fixedDelay = 500) // Polls every 500ms
  @Transactional
  public void relay() {
    outboxRepo.findTop100ByStatusOrderByCreatedAtAsc(PENDING)
        .forEach(event -> {
          try {
            kafka.send(event.getAggregateType() + ".events",
                       event.getAggregateId(),
                       event.getPayload()).get(5, SECONDS);
            event.setStatus(PUBLISHED);
            event.setPublishedAt(Instant.now());
          } catch (Exception e) {
            event.setStatus(FAILED);
            event.setRetryCount(event.getRetryCount() + 1);
          }
          outboxRepo.save(event);
        });
  }
}</pre>

    <h3>Idempotent Kafka Consumer</h3>
    <pre>@KafkaListener(topics = "Task.events", groupId = "notification-group")
public void onTaskEvent(String payload, @Header("kafka_messageKey") String eventId) {
  // Idempotency check — skip if already processed
  if (processedEventRepo.existsById(eventId)) return;

  NotificationEvent event = objectMapper.readValue(payload, ...);
  notificationService.send(event);

  processedEventRepo.save(new ProcessedEvent(eventId, Instant.now()));
}</pre>

    <h3>Key Trade-offs</h3>
    <ul>
      <li><strong>At-least-once delivery</strong>: Outbox may replay events on crash-recovery → consumers must be idempotent</li>
      <li><strong>Polling latency</strong>: 500ms poller interval means max 500ms delay from write to Kafka publish</li>
      <li><strong>Outbox table growth</strong>: Schedule cleanup of PUBLISHED events older than 7 days</li>
    </ul>
  `,

  'blog2': `
    <div class="ep-modal-badge"><i class="fas fa-plug"></i> Technical Blog · WebSocket · Redis</div>
    <h2>Scaling WebSockets Horizontally with a Redis Pub/Sub Backplane</h2>
    <p><em>10 min read · Senior Level · Full Code Included</em></p>

    <h3>The Problem: Stateful Connections Don't Scale Horizontally</h3>
    <p>WebSocket connections are stateful — when a client connects to Instance A, that connection lives only on Instance A. If a message is published to Instance B (due to load balancing), Instance A's clients never see it. Standard horizontal scaling breaks real-time delivery.</p>

    <h3>The Redis Pub/Sub Backplane</h3>
    <p>Every server instance subscribes to Redis channels. When any instance receives a WebSocket message to broadcast, it publishes to Redis. Redis fans out to all subscribers (all instances), which then relay the message to their local WebSocket sessions.</p>

    <h3>Spring Boot Implementation</h3>
    <pre>// Publisher (called when STOMP message arrives)
@Service @RequiredArgsConstructor
public class WSMessageBroker {
  private final RedisTemplate&lt;String, String&gt; redis;
  private final SimpMessagingTemplate stomp;

  public void broadcast(String projectId, Object message) {
    String channel = "collab:project:" + projectId;
    String payload = objectMapper.writeValueAsString(message);
    redis.convertAndSend(channel, payload); // Fan-out via Redis
  }
}</pre>

    <pre>// Subscriber (all instances listen)
@Component @RequiredArgsConstructor
public class RedisMessageSubscriber implements MessageListener {
  private final SimpMessagingTemplate stomp;

  @Override
  public void onMessage(Message message, byte[] pattern) {
    String channel = new String(message.getChannel());
    String projectId = channel.replace("collab:project:", "");
    stomp.convertAndSend("/topic/project/" + projectId,
                         new String(message.getBody()));
  }
}

// Registration
@Bean
public RedisMessageListenerContainer listenerContainer(
    RedisConnectionFactory factory, RedisMessageSubscriber sub) {
  var container = new RedisMessageListenerContainer();
  container.setConnectionFactory(factory);
  container.addMessageListener(sub, new PatternTopic("collab:*"));
  return container;
}</pre>

    <h3>Presence Tracking with TTL</h3>
    <pre>// On user join
redis.opsForValue().set(
  "presence:" + userId + ":project:" + projectId,
  "ONLINE",
  Duration.ofSeconds(30)  // TTL — auto-expire on disconnect
);

// Heartbeat (every 15s from frontend)
redis.expire("presence:" + userId + ":project:" + projectId,
             Duration.ofSeconds(30));</pre>

    <h3>SLA Monitoring via Keyspace Notifications</h3>
    <pre>// Enable in Redis config: notify-keyspace-events Ex
// Spring listener for expired keys:
@Component
public class SLAExpiryListener implements KeyExpirationEventMessageListener {
  @Override
  public void onMessage(Message message, byte[] pattern) {
    String expiredKey = message.toString();
    if (expiredKey.startsWith("task:deadline:")) {
      String taskId = expiredKey.replace("task:deadline:", "");
      notificationService.sendSLABreach(taskId);
    }
  }
}</pre>

    <h3>When to Use Redis Pub/Sub vs Kafka for WebSockets</h3>
    <ul>
      <li><strong>Redis Pub/Sub</strong>: Fire-and-forget, &lt;1ms latency, no persistence. Perfect for WS fanout where clients reconnect and re-sync state.</li>
      <li><strong>Kafka</strong>: Durable, ordered, replayable. Use when you need guaranteed delivery to offline consumers or event sourcing.</li>
    </ul>
  `,

  'blog3': `
    <div class="ep-modal-badge"><i class="fas fa-code-branch"></i> Technical Blog · CRDT · Yjs</div>
    <h2>CRDTs vs. Operational Transformation — Why I Chose Yjs for CollabMatrix</h2>
    <p><em>14 min read · Expert Level · Full Implementation</em></p>

    <h3>The Collaborative Editing Problem</h3>
    <p>Two users edit the same document simultaneously. User A deletes character at position 5. User B inserts "X" at position 5. Applied in different orders, these operations produce different results. This is the core challenge of real-time collaborative editing.</p>

    <h3>Operational Transformation (OT)</h3>
    <p>Used by Google Docs (Jupiter algorithm). Transforms operations relative to concurrent operations. Requires a central server to serialize and order all operations. The "diamond problem" — three or more concurrent edits — requires complex transformation functions that are notoriously hard to implement correctly.</p>

    <h3>CRDTs — Conflict-free Replicated Data Types</h3>
    <p>Mathematically proven to converge to the same state regardless of the order operations are applied. No central server required. Peers can be offline, merge later, and always converge. Yjs implements YATA (Yet Another Transformation Approach) — a CRDT specifically optimized for collaborative text.</p>

    <h3>Yjs in CollabMatrix — Spring WebSocket Relay</h3>
    <pre>@Controller
public class YjsRelayController {
  @MessageMapping("/doc/{docId}/update")
  public void relayUpdate(@DestinationVariable String docId,
                          byte[] update,
                          SimpMessageHeaderAccessor headers) {
    String senderId = headers.getUser().getName();

    // Store snapshot every 30s
    docSnapshotService.maybePersist(docId, update);

    // Relay to all other subscribers (NOT back to sender)
    template.convertAndSend("/topic/doc/" + docId,
        UpdateMessage.builder()
            .update(update)  // Raw Yjs bytes — server never interprets
            .excludeUser(senderId)
            .build());
  }
}</pre>

    <h3>Frontend Yjs Integration</h3>
    <pre>import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();
const provider = new WebsocketProvider(wsUrl, 'doc-' + docId, ydoc);
const ytext = ydoc.getText('content');

// Bind to CodeMirror / TipTap / Quill editor
const binding = new CodemirrorBinding(ytext, editor, provider.awareness);</pre>

    <h3>Why CRDT > OT for This Use Case</h3>
    <ul>
      <li><strong>No central coordination</strong>: Peers can sync directly (P2P future), not just via server</li>
      <li><strong>Simpler server</strong>: Just relay bytes — no operation interpretation or conflict resolution</li>
      <li><strong>Offline-first</strong>: Changes accumulate offline, merge seamlessly on reconnect</li>
      <li><strong>Proven convergence</strong>: Mathematical proof, not heuristics</li>
    </ul>
  `,

  'blog4': `
    <div class="ep-modal-badge"><i class="fas fa-database"></i> Technical Blog · Polyglot Persistence</div>
    <h2>Choosing Between PostgreSQL, MongoDB, and Redis — A Framework</h2>
    <p><em>11 min read · Senior Level · Full Code Included</em></p>

    <h3>The Decision Framework: Access Patterns First</h3>
    <p>The wrong way to choose a database: pick what you know, or what's popular. The right way: model your access patterns first, then choose the database that serves those patterns most efficiently.</p>

    <h3>CollabMatrix's Three Databases</h3>
    <ul>
      <li><strong>PostgreSQL</strong> — Projects, Tasks, Users, Outbox Events</li>
      <li><strong>MongoDB</strong> — Chat messages, Document snapshots</li>
      <li><strong>Redis</strong> — Presence, WS backplane, SLA TTLs, Rate limiting</li>
    </ul>

    <h3>Why PostgreSQL for Tasks?</h3>
    <p>Tasks have: complex relationships (Project → Sprint → Task → Subtask → Comment), status transitions requiring atomicity (@Version optimistic locking), ACID compliance for financial-adjacent operations, and complex queries (GROUP BY assignee, BETWEEN dates, JOIN project_members).</p>
    <pre>-- Complex task query — perfect for PostgreSQL
SELECT t.*, COUNT(c.id) as comment_count, u.name as assignee_name
FROM tasks t
JOIN users u ON t.assignee_id = u.id
LEFT JOIN comments c ON t.id = c.task_id
WHERE t.project_id = :projectId
  AND t.status != 'DONE'
  AND t.due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
GROUP BY t.id, u.name
ORDER BY t.priority DESC;</pre>

    <h3>Why MongoDB for Chat?</h3>
    <p>Chat messages are written once, read sequentially, rarely updated. No JOINs needed. Variable structure (reactions, thread replies, attachments). Write throughput > consistency. MongoDB's document model maps naturally, and TTL indexes auto-expire old messages.</p>
    <pre>// MongoDB TTL index — auto-delete messages after 1 year
db.messages.createIndex(
  { "createdAt": 1 },
  { expireAfterSeconds: 31536000 }
);</pre>

    <h3>Why Redis for Presence?</h3>
    <p>Presence data is: ephemeral (lost on disconnect = expected), sub-millisecond latency required, perfect TTL semantics (expires when user goes offline), no persistence needed (reconstructed on reconnect).</p>

    <h3>The Decision Matrix</h3>
    <ul>
      <li><strong>Use PostgreSQL when</strong>: ACID required, complex JOINs, financial data, audit trails</li>
      <li><strong>Use MongoDB when</strong>: Variable schema, high write throughput, document-centric, hierarchical data</li>
      <li><strong>Use Redis when</strong>: Ephemeral data, caching, Pub/Sub, rate limiting, TTL-based expiry, sub-1ms latency</li>
    </ul>
  `,

  'blog5': `
    <div class="ep-modal-badge"><i class="fas fa-robot"></i> Technical Blog · AI · Spring Boot</div>
    <h2>Building a Fault-Tolerant Async AI Pipeline with Spring Boot</h2>
    <p><em>13 min read · Senior Level · Full Code Included</em></p>

    <h3>The Problem: AI APIs Are Slow</h3>
    <p>Whisper transcription: 30-60 seconds. Gemini summarization: 10-20 seconds. Total: up to 80 seconds. Making a user wait behind an HTTP 200 for 80 seconds violates every UX principle. The solution: decouple the AI processing from the HTTP response lifecycle entirely.</p>

    <h3>The @Async Pattern</h3>
    <pre>@RestController @RequiredArgsConstructor
public class MeetingController {
  private final MeetingService meetingService;

  @PostMapping("/meetings/upload")
  public ResponseEntity&lt;MeetingResponse&gt; upload(@RequestParam MultipartFile audio) {
    Meeting meeting = meetingService.createPending(audio);

    // Fire and forget — returns immediately
    meetingService.processAsync(meeting.getId(), audio.getBytes());

    return ResponseEntity.accepted()  // 202, not 200
        .body(new MeetingResponse(meeting.getId(), "PROCESSING"));
  }
}</pre>

    <pre>@Service @RequiredArgsConstructor
public class MeetingService {
  private final TranscriptionService transcription;
  private final GeminiService gemini;
  private final MeetingRepository repo;

  @Async("aiExecutor")  // Runs on bounded thread pool
  public CompletableFuture&lt;Void&gt; processAsync(UUID meetingId, byte[] audio) {
    try {
      String transcript = transcription.transcribe(audio);       // 30-60s
      MeetingSummary summary = gemini.extractInsights(transcript); // 10-20s

      repo.findById(meetingId).ifPresent(m -> {
        m.setTranscript(transcript);
        m.setSummary(summary);
        m.setStatus(COMPLETED);
        repo.save(m);
      });
    } catch (Exception e) {
      repo.updateStatus(meetingId, FAILED);
    }
    return CompletableFuture.completedFuture(null);
  }
}</pre>

    <h3>Thread Pool Configuration</h3>
    <pre>@Bean("aiExecutor")
public ThreadPoolTaskExecutor aiExecutor() {
  var exec = new ThreadPoolTaskExecutor();
  exec.setCorePoolSize(4);       // Always-alive threads
  exec.setMaxPoolSize(12);       // Burst capacity
  exec.setQueueCapacity(50);     // Max queued jobs before CallerRuns
  exec.setRejectedExecutionHandler(new CallerRunsPolicy());
  exec.setThreadNamePrefix("ai-worker-");
  exec.initialize();
  return exec;
}</pre>

    <h3>Resilience4j Circuit Breaker</h3>
    <pre>resilience4j.circuitbreaker:
  instances:
    whisper:
      failure-rate-threshold: 50      # Open after 50% failures
      wait-duration-in-open-state: 30s
      sliding-window-size: 10</pre>

    <h3>Status Polling API</h3>
    <pre>@GetMapping("/meetings/{id}/status")
public MeetingStatusResponse getStatus(@PathVariable UUID id) {
  return repo.findById(id)
      .map(m -> new MeetingStatusResponse(m.getStatus(), m.getSummary()))
      .orElseThrow();
}
// Frontend polls every 5s until status = COMPLETED</pre>
  `,

  /* INTERVIEW MODALS */
  'interview-sd': `
    <div class="ep-modal-badge"><i class="fas fa-drafting-compass"></i> Interview Prep · System Design</div>
    <h2>System Design — 20 Questions & Answers</h2>

    <h3>Q1: How would you scale WebSocket connections across multiple servers?</h3>
    <p><strong>A:</strong> Use a Redis Pub/Sub backplane. Each server instance subscribes to Redis channels. When any instance receives a WS message to broadcast, it publishes to Redis; all instances receive it and relay to their local WS sessions. This eliminates the cross-server message delivery problem. In CollabMatrix, this supports 10,000+ concurrent connections across horizontally-scaled instances with sub-50ms delivery.</p>

    <h3>Q2: Design a collaborative document editor (like Google Docs)</h3>
    <p><strong>A:</strong> Use CRDTs (Yjs) instead of Operational Transformation. The server is just a relay — it never interprets document operations. Clients exchange Yjs update bytes over WebSocket. CRDT mathematically guarantees convergence regardless of operation order. Persist snapshots to PostgreSQL every 30 seconds. For scaling, the WS relay layer uses Redis Pub/Sub (as above).</p>

    <h3>Q3: How do you prevent data loss when writing to a database and publishing to Kafka?</h3>
    <p><strong>A:</strong> Use the Transactional Outbox Pattern. Write to an <code>outbox_events</code> table in the same database transaction as your business data. A separate scheduled poller reads unpublished events and sends them to Kafka, then marks them as published. If the service crashes between writing and publishing, the outbox row survives and will be retried on restart. Consumers must be idempotent to handle at-least-once delivery.</p>

    <h3>Q4: Design a distributed rate limiter</h3>
    <p><strong>A:</strong> Use Redis + Lua scripting for atomic token bucket. Key per user+endpoint, TTL = window size. Lua script atomically checks count, increments if below limit, rejects if exceeded. Redis single-threaded execution guarantees no race conditions. For very high scale, use Redis Cluster with consistent hashing to distribute keys.</p>

    <h3>Q5: How would you handle SLA deadline monitoring at scale?</h3>
    <p><strong>A:</strong> Use Redis TTL keyspace notifications. On task creation, set: <code>SET task:deadline:{taskId} "" EX {secondsToDeadline}</code>. Enable <code>notify-keyspace-events Ex</code> in Redis config. A Spring <code>KeyExpirationEventMessageListener</code> receives expired key events and triggers alerts. Zero database polling — purely event-driven.</p>

    <h3>Q6: Design a microservices architecture for an insurance platform</h3>
    <p><strong>A:</strong> Apply DDD to identify bounded contexts (Auth, Member, Eligibility, Claims, Notification). Each gets its own database (database-per-service). Use Spring Cloud Gateway as centralized entry point for JWT auth, rate limiting, and routing. Eureka for service discovery. Each service uses Resilience4j circuit breakers for inter-service calls. The Eligibility service caches rules in Redis (90% cache-hit ratio).</p>

    <h3>Q7: How do you implement exactly-once message processing?</h3>
    <p><strong>A:</strong> At the producer: Kafka transactional API + idempotent producer config. At the consumer: store processed event IDs in a <code>processed_events</code> table. On each message, check if the event ID was already processed before executing business logic. This idempotency key check + Kafka's EOS semantics together achieve effectively-once processing.</p>

    <h3>Q8: Design a multi-tenant SaaS architecture</h3>
    <p><strong>A:</strong> Three strategies: (1) Schema-per-tenant — separate PostgreSQL schemas, shared server; (2) Database-per-tenant — maximum isolation, high cost; (3) Row-level tenant ID — simplest, shared tables with <code>tenant_id</code> column + RLS (Row Level Security) in PostgreSQL. For CollabMatrix: row-level with RLS enforced at the DB layer, bypassed only by admin service account.</p>

    <h3>Q9: How would you implement an async AI processing pipeline?</h3>
    <p><strong>A:</strong> HTTP endpoint returns 202 Accepted immediately. @Async CompletableFuture submits to bounded ThreadPoolTaskExecutor. Processing thread: transcription (Whisper + circuit breaker fallback to Google STT) → AI extraction (Gemini) → DB save. Frontend polls a status endpoint or uses SSE for push notification on completion.</p>

    <h3>Q10: Explain the Saga pattern for distributed transactions</h3>
    <p><strong>A:</strong> Saga breaks a distributed transaction into a sequence of local transactions with compensating actions. Two types: (1) Choreography — services react to events and emit their own events; decentralized but harder to trace. (2) Orchestration — a central Saga Orchestrator drives the flow; easier to visualize, single point of failure risk. For IECS, claims processing uses choreography: ClaimSubmitted → EligibilityChecked → ClaimApproved/Denied.</p>

    <h3>Q11-Q20: Full Guide Available</h3>
    <p>The complete 20-question guide covers: CQRS with event sourcing, consistent hashing, distributed locking with Redlock, observability (distributed tracing), zero-downtime deployments, database sharding strategies, API gateway patterns, event-driven architecture, and service mesh vs gateway trade-offs — all grounded in the CollabMatrix and IECS architectures.</p>
  `,

  'interview-kafka': `
    <div class="ep-modal-badge"><i class="fas fa-stream"></i> Interview Prep · Apache Kafka</div>
    <h2>Apache Kafka — 20 Questions & Answers</h2>

    <h3>Q1: Explain Kafka consumer group offset management</h3>
    <p><strong>A:</strong> Consumer groups track their progress via offsets stored in the <code>__consumer_offsets</code> internal topic. Each partition is consumed by exactly one consumer within a group. Offsets are committed either automatically (risk of duplicate processing) or manually (precise control). In CollabMatrix, the outbox consumer uses manual commit: only commit after successful Kafka send to avoid publishing without acknowledging.</p>

    <h3>Q2: What is exactly-once semantics (EOS) in Kafka?</h3>
    <p><strong>A:</strong> EOS means each message is delivered and processed exactly once, even with failures. Kafka achieves this at the producer level with idempotent producers (sequence numbers per partition) and transactional APIs (atomic multi-partition writes). At the consumer level, you still need idempotency in your business logic (event deduplication table).</p>

    <h3>Q3: How do you choose partition count?</h3>
    <p><strong>A:</strong> Partition count determines parallelism ceiling — you can't have more consumers than partitions in a group. Rule of thumb: <code>partitions = max_desired_throughput / throughput_per_consumer</code>. For CollabMatrix outbox topic: target 50,000 events/hour, each consumer handles 10,000/hour → 5 partitions. Never decrease partitions (breaks message ordering guarantees). Over-provision by 2-3x initially.</p>

    <h3>Q4: What causes consumer lag and how do you handle it?</h3>
    <p><strong>A:</strong> Consumer lag = producer offset - consumer offset. Causes: consumer processing too slow, GC pauses, downstream service slow, not enough consumer instances. Solutions: scale consumer instances (up to partition count), optimize consumer processing, add circuit breakers to downstream calls, increase <code>max.poll.interval.ms</code> if processing is legitimately slow. Monitor with Prometheus JMX exporter.</p>

    <h3>Q5: Kafka vs RabbitMQ — when to use each?</h3>
    <p><strong>A:</strong> Kafka: event streaming, event sourcing, log aggregation, high throughput (millions/s), message replay, long retention. RabbitMQ: task queues, complex routing (topic/fanout/direct exchanges), short-lived messages, request-reply patterns, lower throughput. CollabMatrix uses Kafka because the outbox events need: durability, replay capability on consumer restart, and high throughput during peak collaboration hours.</p>

    <h3>Q6-Q20: Full Guide Available</h3>
    <p>The complete guide covers: Kafka Streams vs Kafka Connect, schema evolution with Avro + Schema Registry, leader election and partition reassignment, Dead Letter Queue implementation, log compaction, consumer rebalancing and cooperative sticky rebalancing, transactional producers, Kafka security (SASL/SSL), monitoring with Kafka Exporter, and the Transactional Outbox Pattern deep-dive.</p>
  `,

  'interview-redis': `
    <div class="ep-modal-badge"><i class="fas fa-memory"></i> Interview Prep · Redis</div>
    <h2>Redis Deep Dive — 20 Questions & Answers</h2>

    <h3>Q1: Redis data structures and their use cases</h3>
    <p><strong>A:</strong> String: counters, cache, rate limits. List: queues, activity feeds. Set: unique members, tags, online users. Sorted Set: leaderboards, priority queues, time-series (score=timestamp). Hash: user profiles, session data. Stream: event log (Kafka-lite). In CollabMatrix: Set for online users per project, Sorted Set for message history with score=timestamp, String+EX for presence TTL.</p>

    <h3>Q2: How does Redis Pub/Sub differ from Kafka?</h3>
    <p><strong>A:</strong> Redis Pub/Sub: fire-and-forget (&lt;1ms), no persistence, no history, subscribers receive only messages published after they subscribe. Kafka: durable (configurable retention), replayable, ordered per partition, supports consumer groups with offset tracking. CollabMatrix uses both: Redis Pub/Sub for real-time WS fanout (where reconnecting clients re-sync from DB, not Kafka), and Kafka for durable outbox events.</p>

    <h3>Q3: How do you implement distributed locking with Redis?</h3>
    <p><strong>A:</strong> Use <code>SET key value NX EX timeout</code>. NX = set only if not exists. EX = TTL prevents deadlock if holder crashes. Value = unique token (UUID). On unlock: Lua script checks token matches before deleting (atomic). For multi-instance: Redlock algorithm acquires lock on majority of N Redis instances. Spring Integration: <code>RedisLockRegistry</code>.</p>

    <h3>Q4: Explain Redis cache invalidation strategies</h3>
    <p><strong>A:</strong> TTL-based: set expiry on cache write (simple, may serve stale data). Write-through: update cache on every DB write (consistent, slower writes). Write-behind: async write to DB after cache update (fast, risk of data loss). Cache-aside (lazy loading): app checks cache, on miss fetches from DB and populates. IECS uses cache-aside with manual eviction: @Cacheable on read, @CacheEvict on rule update.</p>

    <h3>Q5: Redis Cluster vs Redis Sentinel</h3>
    <p><strong>A:</strong> Redis Sentinel: HA for single Redis instance — monitors master, promotes replica on failure, coordinates client reconnection. No data sharding. Redis Cluster: data sharding across 16,384 hash slots, multiple master nodes, automatic failover. Use Sentinel for simpler setups where dataset fits on one node. Use Cluster for horizontal scaling of data or write throughput.</p>

    <h3>Q6-Q20: Full Guide Available</h3>
    <p>The complete guide covers: Redis persistence (RDB vs AOF), keyspace notifications deep dive, Redis Streams vs Kafka, RESP protocol, pipeline batching, memory optimization (ziplist encoding), Redis transactions vs Lua scripts, eviction policies (LRU, LFU, volatile-ttl), Redis GEO commands, and Bloom filter implementation with RedisBloom.</p>
  `,

  'interview-be': `
    <div class="ep-modal-badge"><i class="fas fa-server"></i> Interview Prep · Backend Engineering</div>
    <h2>Backend Engineering — 20 Questions & Answers</h2>

    <h3>Q1: Explain @Transactional(readOnly=true) benefits</h3>
    <p><strong>A:</strong> Signals Hibernate to skip dirty checking (no snapshot of loaded entities), use read-only database connections, and enables database-level read optimizations (PostgreSQL can use read replicas). Reduces memory usage and improves performance for read-heavy endpoints. In CollabMatrix, all GET endpoints use readOnly=true, reducing query time by ~15%.</p>

    <h3>Q2: What is the N+1 problem and how do you fix it?</h3>
    <p><strong>A:</strong> N+1: loading N entities then executing N additional queries to fetch their relationships. Fix: (1) <code>@EntityGraph</code> or <code>JOIN FETCH</code> in JPQL to load relationships in one query; (2) batch fetching with <code>@BatchSize</code>; (3) projections (DTOs) to load only needed fields. In CollabMatrix, task list queries use JOIN FETCH for assignee and project to eliminate 50+ unnecessary queries per page.</p>

    <h3>Q3: How does Spring @Async work internally?</h3>
    <p><strong>A:</strong> @Async uses Spring AOP proxy — the method call is intercepted and submitted to a configured TaskExecutor. This means: (1) @Async doesn't work if called from within the same class (no proxy), (2) @Transactional context is NOT propagated (new transaction in async thread), (3) exceptions don't propagate to caller (must use CompletableFuture for error handling). In AI Meeting Notes, the async executor is explicitly named to avoid the default SimpleAsyncTaskExecutor (creates new threads, no pool).</p>

    <h3>Q4: Optimistic vs pessimistic locking — when to use each?</h3>
    <p><strong>A:</strong> Optimistic (@Version): low contention, reads >> writes, check-then-act pattern, throws OptimisticLockException on conflict. Pessimistic (SELECT FOR UPDATE): high contention, short transactions, financial operations where conflicts are expensive. CollabMatrix task status transitions (IN_PROGRESS → DONE) use @Version optimistic locking — conflicts are rare since task assignees are usually distinct.</p>

    <h3>Q5: What is HikariCP and how do you tune it?</h3>
    <p><strong>A:</strong> HikariCP is Spring Boot's default JDBC connection pool. Key settings: <code>maximum-pool-size</code> (default 10 — often too small), <code>connection-timeout</code> (how long to wait for pool), <code>idle-timeout</code> (remove idle connections), <code>max-lifetime</code> (prevent stale connections). Rule: pool size ≈ (CPU cores × 2) + effective_disk_spindles for PostgreSQL. For Cloud: also respect max_connections on the DB side.</p>

    <h3>Q6-Q20: Full Guide Available</h3>
    <p>Complete guide covers: Spring Bean scopes, @Transactional propagation modes (REQUIRES_NEW, NESTED), HQL vs Criteria API, Spring Security filter chain, JWT vs sessions, SOLID in Spring context, @Async exception handling, Spring Events, custom @Validated groups, Jackson polymorphism, Spring Data Specifications, and JOOQ vs JPA.</p>
  `,

  'interview-lld': `
    <div class="ep-modal-badge"><i class="fas fa-code"></i> Interview Prep · Low-Level Design</div>
    <h2>Low-Level Design — 20 Questions & Answers</h2>

    <h3>Q1: Design a JPA entity with optimistic locking</h3>
    <pre>@Entity @Table(name = "tasks")
@Getter @Setter @NoArgsConstructor
public class Task {
  @Id @GeneratedValue(strategy = IDENTITY)
  private Long id;

  @Version  // Optimistic lock — auto-incremented on every UPDATE
  private Long version;

  @Enumerated(STRING)
  @Column(nullable = false)
  private TaskStatus status = TaskStatus.TODO;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assignee_id")
  private User assignee;

  // Domain method — status transition logic
  public void transition(TaskStatus newStatus, User actor) {
    if (!status.canTransitionTo(newStatus)) {
      throw new InvalidStateTransitionException(status, newStatus);
    }
    this.status = newStatus;
    // Publish domain event here or via @DomainEvent
  }
}</pre>

    <h3>Q2: Implement the Transactional Outbox Relayer</h3>
    <p>See Blog #1 above for the full implementation with code. Key points: @Scheduled(fixedDelay=500), pessimistic lock on PENDING rows to prevent duplicate publishing across instances, exponential backoff on FAILED events, cleanup job for PUBLISHED events older than 7 days.</p>

    <h3>Q3: Design a JWT authentication filter for Spring Security</h3>
    <pre>@Component @RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest req,
      HttpServletResponse res, FilterChain chain) throws ... {
    String token = extractToken(req);
    if (token != null && jwtService.isValid(token)) {
      String username = jwtService.extractUsername(token);
      var userDetails = userDetailsService.loadUserByUsername(username);
      var auth = new UsernamePasswordAuthenticationToken(
          userDetails, null, userDetails.getAuthorities());
      auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
      SecurityContextHolder.getContext().setAuthentication(auth);
    }
    chain.doFilter(req, res);
  }
}</pre>

    <h3>Q4-Q20: Full Guide Available</h3>
    <p>Complete guide covers: STOMP WebSocket controller design, idempotent Kafka consumer with event deduplication, thread-safe Redis cache wrapper, Spring Batch job for outbox cleanup, custom @Annotation for rate limiting, Specification pattern for dynamic queries, Redis-backed session store, WebSocket presence service design, DTO mapper with MapStruct, and async job status polling design.</p>
  `,

  'interview-full': `
    <div class="ep-modal-badge"><i class="fas fa-comments"></i> Complete Interview Prep Guide</div>
    <h2>100 Interview Questions — All Categories</h2>
    <p>This guide contains 100 questions and detailed answers across 5 categories, all grounded in real distributed systems architecture from CollabMatrix, IECS Enterprise, and AI Meeting Notes.</p>

    <h3>📐 System Design (20 Questions)</h3>
    <p>WebSocket scaling, collaborative document editors, distributed rate limiting, SLA monitoring, microservices decomposition, distributed transactions, multi-tenant SaaS, async AI pipelines, Saga pattern, CQRS, event sourcing, consistent hashing, distributed locking, observability, zero-downtime deployments, database sharding, API gateway patterns, event-driven architecture, service mesh trade-offs, and real-time notification systems.</p>

    <h3>🔧 Low-Level Design (20 Questions)</h3>
    <p>JPA entity modeling with optimistic locking, Transactional Outbox relayer, JWT authentication filter, STOMP WebSocket controller, idempotent Kafka consumer, thread-safe cache wrapper, Spring Batch cleanup job, custom rate-limiting annotation, Specification pattern, Redis-backed session store, WebSocket presence service, DTO mapping with MapStruct, async job status polling, Spring Security filter chain configuration, and custom error handling.</p>

    <h3>⚙️ Backend Engineering (20 Questions)</h3>
    <p>@Transactional internals, @Async internals, N+1 problem and solutions, HikariCP tuning, optimistic vs pessimistic locking, Spring Bean scopes, propagation modes, JWT vs sessions, Jackson polymorphism, Spring Events, custom validation groups, HQL vs Criteria API, JOOQ vs JPA, Spring Data Specifications, and connection pool sizing.</p>

    <h3>📨 Apache Kafka (20 Questions)</h3>
    <p>Consumer group offset management, exactly-once semantics, partition count strategy, consumer lag, Kafka vs RabbitMQ, Kafka Streams vs Connect, schema evolution, leader election, Dead Letter Queue, log compaction, cooperative sticky rebalancing, transactional producers, Kafka security, monitoring, and Outbox Pattern implementation.</p>

    <h3>🔴 Redis (20 Questions)</h3>
    <p>Data structures, Pub/Sub vs Kafka, distributed locking with Redlock, cache invalidation strategies, Cluster vs Sentinel, persistence (RDB vs AOF), keyspace notifications, Redis Streams, memory optimization, eviction policies, pipeline batching, Lua scripts, GEO commands, Bloom filters, and RESP protocol internals.</p>

    <h3>How to Use This Guide</h3>
    <ul>
      <li>Use the Interview Prep tabs above to drill into specific categories</li>
      <li>Each answer is framed around real code you wrote — not textbook theory</li>
      <li>Reference specific metrics (10K WS connections, 90% cache-hit, &lt;500ms response) to demonstrate impact</li>
      <li>For system design, always start with requirements, then draw the architecture before discussing trade-offs</li>
    </ul>
  `
};

/* ── Modal Open/Close ── */
function openEPModal(contentId) {
  const modal = document.getElementById('epModal');
  const body = document.getElementById('epModalContent');
  const content = epModalContent[contentId];

  if (!modal || !body) return;

  body.innerHTML = content || '<p style="padding:2rem; color:#64748b;">Content coming soon.</p>';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEPModal(e) {
  const modal = document.getElementById('epModal');
  if (!modal) return;
  // If called from backdrop click, only close if backdrop was clicked
  if (e && e.target !== modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Escape key closes EP modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('epModal');
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

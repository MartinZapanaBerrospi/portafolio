/* =============================================
   MAIN.JS — Martín Zapana Portfolio
   Core interactions, animations, and effects
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTypingAnimation();
    initScrollReveal();
    initParticles();
    initStatCounters();
    initContactForm();
});

/* ---------- Navbar ---------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar (optimizado con requestAnimationFrame)
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Iniciar ScrollSpy usando IntersectionObserver
    initScrollSpy(navLinks);

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded',
            navToggle.classList.contains('active'));
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initScrollSpy(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    
    // IntersectionObserver options map active section around the top/middle of screen
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Removes active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ---------- Typing Animation ---------- */
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const titles = [
        'Apasionado por la Tecnología',
        'Diseñador de soluciones digitales',
        'Entusiasta de Data Science & ML',
        'Futuro Analista de Datos',
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typingElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start after a short delay
    setTimeout(type, 1000);
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on sibling order
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let siblingIndex = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) siblingIndex = i;
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, siblingIndex * 100);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ---------- Particles Background ---------- */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 190 : 260; // cyan or violet
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction - subtle push
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ---------- Stat Counters ---------- */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });

    const homeStats = document.querySelector('.home-stats');
    if (homeStats) observer.observe(homeStats);
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 40;
    const duration = 1500;
    const stepTime = duration / 40;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

/* ---------- Contact Form (Web3Forms) ---------- */
// ⚠️ INSTRUCCIONES:
// 1. Ve a https://web3forms.com/
// 2. Ingresa tu email y te enviarán un Access Key
// 3. Reemplaza 'TU_ACCESS_KEY_AQUI' con ese key
const WEB3FORMS_KEY = '093faf99-d11c-4eaa-ba98-c7d814036811';

function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        // Validate fields
        if (!name || !email || !message) {
            showFormFeedback(submitBtn, '⚠ Completa todos los campos', 'error');
            return;
        }


        // Disable button while sending
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: `📩 Nuevo mensaje de contacto — ${name}`,
                    from_name: 'Portafolio de Martín',
                    replyto: email,
                    // Campos del formulario
                    'Nombre completo': name,
                    'Email de contacto': email,
                    'Mensaje': message,
                    // Metadata
                    'Enviado desde': window.location.href,
                    'Fecha': new Date().toLocaleString('es-ES', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                    })
                })
            });

            const data = await response.json();

            if (data.success) {
                showFormFeedback(submitBtn, '¡Mensaje enviado correctamente! ✓', 'success');
                form.reset();
            } else {
                throw new Error(data.message || 'Error al enviar');
            }
        } catch (error) {
            console.error('Error enviando formulario:', error);
            showFormFeedback(submitBtn, '✕ Error al enviar. Intenta de nuevo.', 'error');
        }
    });
}

function showFormFeedback(btn, message, type) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span>${message}</span>`;
    btn.disabled = true;

    if (type === 'success') {
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else {
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
}

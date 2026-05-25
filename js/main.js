// Custom Cursor Logic (Only on devices with a mouse/fine pointer)
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (hasFinePointer) {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay/easing handled by CSS transitions or animate
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Interactive Elements Hover Effect
    const interactives = document.querySelectorAll('a, button, .card, input, select');

    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Animation Observer
document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeUpElements = document.querySelectorAll('h1, h2, p, .btn, .card, .service-icon');

    fadeUpElements.forEach((el, index) => {
        el.classList.add('reveal-up');
        // Add subtle staggered delay based on index (if valid for grouping)
        // For simplicity, we stick to base reveal, CSS handles smoothness
        observer.observe(el);
    });

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    lenis.scrollTo(target);
                }
            }
        });
    });

    // Appointment Form to WhatsApp Integration
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('patient-name').value;
            const phone = document.getElementById('patient-phone').value;
            const treatment = document.getElementById('treatment-interest').value;
            const date = document.getElementById('preferred-date').value;
            
            // Format the WhatsApp message
            const message = `Hello Goyal Dental Clinic, I would like to request an appointment. Here are my details:\n\n` +
                            `👤 *Name:* ${name}\n` +
                            `📞 *Phone:* ${phone}\n` +
                            `🦷 *Treatment:* ${treatment}\n` +
                            `📅 *Preferred Date:* ${date}`;
            
            // Clinic WhatsApp Number (using +91 999 999 9999 -> 919999999999)
            const clinicWhatsApp = '919999999999';
            
            // Construct the URL
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${clinicWhatsApp}&text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
        });
    }
});

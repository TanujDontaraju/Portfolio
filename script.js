document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = getAnimationForElement(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function getAnimationForElement(element) {
    if (element.tagName === 'H2') {
        return 'slideInUp 0.8s ease forwards';
    } else if (element.classList.contains('project-card')) {
        return 'fadeIn 0.8s ease forwards';
    } else if (element.classList.contains('skill-category')) {
        return 'slideInLeft 0.8s ease forwards';
    }
    return 'fadeIn 0.8s ease forwards';
}

document.querySelectorAll('section h2, .project-card, .skill-category').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
        hero.style.backgroundPosition = `0 ${scrollY * 0.5}px`;
    }
});

document.querySelectorAll('.cta-button, .contact-links a').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1.02)';
    });
});

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = '#3498db';
            link.style.borderBottom = '2px solid #3498db';
        }
    });
});

function addFloatingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
            }
            50% {
                box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
            }
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        nav a.active {
            color: #3498db !important;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.3rem;
        }
    `;
    document.head.appendChild(style);
}

addFloatingAnimation();

function createHexagon() {
    const hex = document.createElement('div');
    hex.className = 'hexagon';

    const size = Math.random() * 60 + 20;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 20;

    hex.style.width = `${size}px`;
    hex.style.height = `${size * 1.15}px`;
    hex.style.left = `${left}%`;
    hex.style.animationDuration = `${duration}s`;
    hex.style.animationDelay = `-${delay}s`;
    
    return hex;
}

// Helper to dynamically adjust hexagon count
function updateHexagonCount() {
    const container = document.querySelector('.hexagon-container');
    if (!container) return;

    let targetCount = 150;

    if (window.innerWidth >= 2560) targetCount = 350; 
    else if (window.innerWidth >= 1920) targetCount = 250; 
    
    if (window.innerWidth <= 1024) targetCount = 100;
    if (window.innerWidth <= 768) targetCount = 50;
    if (window.innerWidth <= 480) targetCount = 25;

    const currentHexagons = container.querySelectorAll('.hexagon');
    const currentCount = currentHexagons.length;

    if (currentCount < targetCount) {
        for (let i = 0; i < (targetCount - currentCount); i++) {
            container.appendChild(createHexagon());
        }
    } else if (currentCount > targetCount) {
        for (let i = 0; i < (currentCount - targetCount); i++) {
            if (currentHexagons[i]) {
                container.removeChild(currentHexagons[i]);
            }
        }
    }
}

function addHexagonBackground() {
    const style = document.createElement('style');
    style.textContent = `
        .hexagon-container {
            position: fixed;
            top: -30vh;
            left: 0;
            width: 100vw;
            height: 130vh;
            z-index: 9999;
            overflow: hidden;
            pointer-events: none;
        }
        .hexagon {
            position: absolute;
            background-color: rgba(50, 50, 50, 0.2);
            -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            bottom: -150px;
            animation: floatUp linear infinite;
        }
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10%, 90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-150vh) rotate(360deg);
                opacity: 0;
            }
        }
        .hexagon-container.paused .hexagon {
            animation-play-state: paused !important;
        }
        .hexagon-container.reverse .hexagon {
            animation-direction: reverse !important;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'hexagon-container';
    document.body.prepend(container);

    updateHexagonCount();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateHexagonCount, 50);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHexagonBackground);
} else {
    addHexagonBackground();
}

window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.5s ease-in';
});

document.querySelectorAll('.dropdown summary').forEach(summary => {
    summary.addEventListener('click', function(e) {
        e.preventDefault();
        const details = this.parentElement;

        if (details.hasAttribute('open')) {
            details.classList.remove('is-active');
            setTimeout(() => {
                details.removeAttribute('open');
            }, 400); 
        } else {
            details.setAttribute('open', '');
            setTimeout(() => {
                details.classList.add('is-active');
            }, 10);
        }
    });
});

const pausePlayBtn = document.getElementById('pause-play-btn');
if (pausePlayBtn) {
    pausePlayBtn.addEventListener('click', () => {
        const hexContainer = document.querySelector('.hexagon-container');
        const icon = pausePlayBtn.querySelector('i');
        const miniIcon = document.getElementById('mini-pause-play');
        if (hexContainer) {
            hexContainer.classList.toggle('paused');
            if (hexContainer.classList.contains('paused')) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                if (miniIcon) { miniIcon.classList.remove('fa-pause'); miniIcon.classList.add('fa-play'); }
            } else {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                if (miniIcon) { miniIcon.classList.remove('fa-play'); miniIcon.classList.add('fa-pause'); }
            }
        }
    });
}

const darkModeBtn = document.getElementById('dark-mode-btn');
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkModeBtn.querySelector('i');
        const miniIcon = document.getElementById('mini-dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            if (miniIcon) { miniIcon.classList.remove('fa-moon'); miniIcon.classList.add('fa-sun'); }
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            if (miniIcon) { miniIcon.classList.remove('fa-sun'); miniIcon.classList.add('fa-moon'); }
        }
    });
}

const directionBtn = document.getElementById('direction-btn');
if (directionBtn) {
    directionBtn.addEventListener('click', () => {
        const hexContainer = document.querySelector('.hexagon-container');
        const icon = directionBtn.querySelector('i');
        const miniIcon = document.getElementById('mini-direction');
        if (hexContainer) {
            hexContainer.classList.toggle('reverse');
            if (hexContainer.classList.contains('reverse')) {
                icon.classList.remove('fa-arrow-down');
                icon.classList.add('fa-arrow-up');
                if (miniIcon) { miniIcon.classList.remove('fa-arrow-down'); miniIcon.classList.add('fa-arrow-up'); }
            } else {
                icon.classList.remove('fa-arrow-up');
                icon.classList.add('fa-arrow-down');
                if (miniIcon) { miniIcon.classList.remove('fa-arrow-up'); miniIcon.classList.add('fa-arrow-down'); }
            }
        }
    });
}

const folderTrigger = document.getElementById('folder-trigger');
if (folderTrigger) {
    folderTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderContent = document.getElementById('folder-content');
        if (folderContent) {
            folderContent.classList.toggle('show');
        }
    });
}

document.addEventListener('click', (e) => {
    const folderContent = document.getElementById('folder-content');
    const folderWidget = document.querySelector('.folder-widget');
    if (folderContent && folderContent.classList.contains('show') && folderWidget && !folderWidget.contains(e.target)) {
        folderContent.classList.remove('show');
    }
});

console.log('Portfolio animations loaded!');

// ===== ANIMATIONS.JS =====

// ===== SCROLL ANIMATIONS =====
const animationConfig = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const animationType = element.dataset.animation || 'fade-in';
      const delay = element.dataset.delay || 0;

      setTimeout(() => {
        element.classList.add(animationType);
        element.style.opacity = '1';
      }, delay);

      animationObserver.unobserve(element);
    }
  });
}, animationConfig);

// Observe all elements with data-animation attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-animation]').forEach((element) => {
    element.style.opacity = '0';
    animationObserver.observe(element);
  });

  // Add animation to service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animation = `slideInUp 0.8s ease forwards`;
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Add animation to event cards
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animation = `slideInUp 0.8s ease forwards`;
    card.style.animationDelay = `${index * 0.15}s`;
  });

  // Add animation to stat items
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animation = `scaleIn 0.8s ease forwards`;
    item.style.animationDelay = `${index * 0.1}s`;
  });
});

// ===== PARALLAX EFFECT =====
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    parallaxElements.forEach((element) => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = window.scrollY * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

document.addEventListener('DOMContentLoaded', initParallax);

// ===== HOVER ANIMATIONS =====
function addHoverAnimations() {
  const hoverElements = document.querySelectorAll('.hover-lift, .hover-scale, .hover-color');

  hoverElements.forEach((element) => {
    element.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
      if (this.classList.contains('hover-lift')) {
        this.style.transform = 'translateY(-8px)';
      } else if (this.classList.contains('hover-scale')) {
        this.style.transform = 'scale(1.05)';
      }
    });

    element.addEventListener('mouseleave', function() {
      this.style.transform = 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', addHoverAnimations);

// ===== TEXT FADE-IN ANIMATION =====
function animateTextOnScroll() {
  const textElements = document.querySelectorAll('p, h2, h3');
  
  textElements.forEach((element) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.8s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(element);
  });
}

document.addEventListener('DOMContentLoaded', animateTextOnScroll);

// ===== STAGGER ANIMATION HELPER =====
function staggerAnimation(elements, animationClass, staggerDelay = 100) {
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    setTimeout(() => {
      element.classList.add(animationClass);
      element.style.opacity = '1';
    }, staggerDelay * index);
  });
}

window.staggerAnimation = staggerAnimation;

// ===== ANIMATED NUMBER COUNTER =====
function createCounter(element, target, duration = 2000) {
  if (!element || isNaN(target)) return;

  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

window.createCounter = createCounter;

// ===== FADE IN ON LOAD =====
window.addEventListener('load', () => {
  const fadeElements = document.querySelectorAll('[data-fade-on-load]');
  fadeElements.forEach((element, index) => {
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.animation = 'fadeIn 0.6s ease forwards';
    }, index * 100);
  });
});

// ===== SCROLL REVEAL ANIMATION =====
class ScrollReveal {
  constructor(selector = '[data-reveal]', options = {}) {
    this.selector = selector;
    this.options = {
      duration: 0.6,
      delay: 0,
      distance: 30,
      origin: 'bottom',
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
      ...options
    };
    this.init();
  }

  init() {
    const elements = document.querySelectorAll(this.selector);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((el) => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  reveal(element) {
    const { duration, delay, distance, origin, easing } = this.options;
    
    let transform = '';
    switch (origin) {
      case 'left':
        transform = `translateX(${distance}px)`;
        break;
      case 'right':
        transform = `translateX(-${distance}px)`;
        break;
      case 'top':
        transform = `translateY(${distance}px)`;
        break;
      case 'bottom':
      default:
        transform = `translateY(-${distance}px)`;
    }

    element.style.transition = `all ${duration}s ${easing}`;
    element.style.transitionDelay = `${delay}s`;
    element.style.opacity = '1';
    element.style.transform = 'translate(0)';
  }
}

// Initialize scroll reveal on page load
document.addEventListener('DOMContentLoaded', () => {
  new ScrollReveal('[data-reveal]', {
    duration: 0.8,
    distance: 40,
    origin: 'bottom'
  });
});

// Export for external use
window.ScrollReveal = ScrollReveal;

// ===== ANIMATION UTILITIES =====
const AnimationUtils = {
  // Delay execution
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Add animation class and remove it after
  pulse: (element) => {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 1000);
  },

  // Bounce effect
  bounce: (element) => {
    element.classList.add('bounce');
    setTimeout(() => element.classList.remove('bounce'), 1000);
  },

  // Shake effect
  shake: (element) => {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => element.style.animation = '', 500);
  },

  // Rotate effect
  rotate: (element, degrees = 360) => {
    element.style.transition = 'transform 0.6s ease';
    element.style.transform = `rotate(${degrees}deg)`;
    setTimeout(() => element.style.transform = '', 600);
  }
};

window.AnimationUtils = AnimationUtils;

// Add shake animation style
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

console.log('%c✨ Animations loaded successfully!', 'color: #8B4513; font-weight: bold;');

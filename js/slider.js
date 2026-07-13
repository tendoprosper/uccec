// ===== SLIDER.JS - SWIPER CONFIGURATION =====

// Initialize hero slider
const heroSwiper = new Swiper('#hero .swiper-container', {
  loop: true,
  speed: 1000,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
});

// Initialize testimonials slider
const testimonialSwiper = new Swiper('#testimonials .swiper-container', {
  loop: true,
  speed: 800,
  slidesPerView: 1,
  spaceBetween: 30,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  breakpoints: {
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }
});

// Initialize gallery slider
const gallerySwiper = new Swiper('#gallery .swiper-container', {
  loop: true,
  speed: 600,
  slidesPerView: 2,
  spaceBetween: 20,
  centeredSlides: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  breakpoints: {
    480: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  },
  on: {
    slideChange: function() {
      console.log('Gallery slide changed: ' + this.activeIndex);
    }
  }
});

// Additional slider customization
document.addEventListener('DOMContentLoaded', () => {
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      heroSwiper.slidePrev();
    } else if (e.key === 'ArrowRight') {
      heroSwiper.slideNext();
    }
  });

  // Add touch gestures
  const sliders = document.querySelectorAll('.swiper-container');
  sliders.forEach(slider => {
    slider.addEventListener('touchend', (e) => {
      console.log('Touch end on slider');
    });
  });
});

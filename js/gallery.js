// ===== GALLERY.JS =====

class Gallery {
  constructor(selector = '.gallery-item') {
    this.items = document.querySelectorAll(selector);
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.createLightbox();
    this.attachEventListeners();
    this.addGalleryStyles();
  }

  createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-controls">
          <button class="lightbox-prev" title="Previous">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="lightbox-close" title="Close">
            <i class="fas fa-times"></i>
          </button>
          <button class="lightbox-next" title="Next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="lightbox-counter">
          <span class="current">1</span> / <span class="total">1</span>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  attachEventListeners() {
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
      item.style.cursor = 'pointer';
    });

    const lightbox = document.getElementById('lightbox');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    prevBtn.addEventListener('click', () => this.prevImage());
    nextBtn.addEventListener('click', () => this.nextImage());
    closeBtn.addEventListener('click', () => this.closeLightbox());

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
      if (e.key === 'Escape') this.closeLightbox();
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const image = lightbox.querySelector('.lightbox-image');
    const item = this.items[index];

    const src = item.dataset.src || item.querySelector('img')?.src || item.src;
    image.src = src;

    lightbox.querySelector('.current').textContent = index + 1;
    lightbox.querySelector('.total').textContent = this.items.length;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.openLightbox(this.currentIndex);
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.openLightbox(this.currentIndex);
  }

  addGalleryStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .lightbox {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }

      .lightbox.active {
        display: flex;
      }

      .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90vh;
        animation: zoomIn 0.3s ease;
      }

      .lightbox-image {
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
      }

      .lightbox-controls {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        pointer-events: none;
      }

      .lightbox-prev,
      .lightbox-next,
      .lightbox-close {
        background: rgba(255, 255, 255, 0.3);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        transition: all 0.3s ease;
        pointer-events: auto;
      }

      .lightbox-prev:hover,
      .lightbox-next:hover,
      .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.5);
        transform: scale(1.1);
      }

      .lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.3);
      }

      .lightbox-counter {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 10px 20px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
      }

      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @media (max-width: 768px) {
        .lightbox-prev,
        .lightbox-next,
        .lightbox-close {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }

        .lightbox-close {
          top: 10px;
          right: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.gallery-item').length > 0) {
    window.gallery = new Gallery('.gallery-item');
  }
});

// Export for external use
window.Gallery = Gallery;

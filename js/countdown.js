// ===== COUNTDOWN.JS =====

class Countdown {
  constructor(targetDate, elementId) {
    this.targetDate = new Date(targetDate).getTime();
    this.elementId = elementId;
    this.element = document.getElementById(elementId);
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (this.element) {
      this.element.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-value">${this.pad(days)}</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${this.pad(hours)}</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${this.pad(minutes)}</span>
          <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${this.pad(seconds)}</span>
          <span class="countdown-label">Seconds</span>
        </div>
      `;

      if (distance < 0) {
        clearInterval(this.interval);
        this.element.innerHTML = '<p style="text-align: center; font-size: 20px; font-weight: bold;">Event has started!</p>';
      }
    }
  }

  pad(num) {
    return String(num).padStart(2, '0');
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Initialize countdowns on page load
document.addEventListener('DOMContentLoaded', () => {
  // Example: Initialize countdown for next event
  const countdownElement = document.getElementById('countdown');
  
  if (countdownElement) {
    // Set your target date here (format: 'YYYY-MM-DD HH:mm:ss')
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now
    
    new Countdown(targetDate.toISOString(), 'countdown-content');
  }

  // Add countdown styling
  const style = document.createElement('style');
  style.textContent = `
    .countdown-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 20px;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .countdown-item {
      background: linear-gradient(135deg, #8B4513, #D2691E);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(139, 69, 19, 0.2);
      transition: transform 0.3s ease;
    }

    .countdown-item:hover {
      transform: translateY(-5px);
    }

    .countdown-value {
      display: block;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .countdown-label {
      display: block;
      font-size: 13px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    @media (max-width: 768px) {
      .countdown-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }

      .countdown-item {
        padding: 15px;
      }

      .countdown-value {
        font-size: 24px;
      }

      .countdown-label {
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .countdown-content {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .countdown-item {
        padding: 12px;
      }

      .countdown-value {
        font-size: 20px;
      }
    }
  `;
  document.head.appendChild(style);
});

// Create a wrapper element for countdown display
function initializeCountdown(targetDate, containerId = 'countdown') {
  const container = document.getElementById(containerId);
  
  if (container) {
    // Create content wrapper if it doesn't exist
    if (!container.querySelector('.countdown-content')) {
      const content = document.createElement('div');
      content.id = 'countdown-content';
      content.className = 'countdown-content';
      container.appendChild(content);
    }

    new Countdown(targetDate, 'countdown-content');
  }
}

// Export for external use
window.initializeCountdown = initializeCountdown;
window.Countdown = Countdown;

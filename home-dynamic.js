/* ================================================
   Home Page Interactions
   Carousel & Accordion Logic
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    // Service accordion is handled via inline onclick but we can enhance it here if needed
});

/* ===== Testimonial Carousel ===== */
function initCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const track = document.getElementById('testimonialTrack');
    const nextBtn = document.querySelector('.carousel-nav');

    if (!slides.length) return;

    let currentIndex = 0;
    const intervalTime = 6000; // 6 seconds
    let autoSlideInterval;

    // function to show slide
    function showSlide(index) {
        // Remove active class from all
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Add active to current
        slides[index].classList.add('active');
    }

    // Next slide logic
    function nextSlide() {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        showSlide(currentIndex);
    }

    // Auto play
    function startAutoPlay() {
        autoSlideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetAutoPlay() {
        clearInterval(autoSlideInterval);
        startAutoPlay();
    }

    // Event Listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    // Start
    startAutoPlay();
}

/* ===== Expandable Services Accordion ===== */
// Exposed to global scope for onclick handler
window.toggleService = function (card) {
    const body = card.querySelector('.service-body');
    const isActive = card.classList.contains('active');

    // Close all other cards
    document.querySelectorAll('.service-card').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('active');
            otherCard.querySelector('.service-body').style.height = '0';
        }
    });

    // Toggle current
    if (!isActive) {
        // Open
        card.classList.add('active');
        // Set height to scrollHeight to animate
        body.style.height = body.scrollHeight + 'px';
    } else {
        // Close
        card.classList.remove('active');
        body.style.height = '0';
    }
};


// Global Variables
let currentImageIndex = 0;
let calcDisplayValue = '0';
let shouldResetDisplay = false;
let musicGenres = ['House', 'Techno', 'Hip-Hop', 'Latin', 'Deep House', 'Progressive', 'Trance'];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCountdown();
    initializesessionStorage();
    initializeFormValidation();
    initializeGallery();

    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    if (document.getElementById('eventFilter')) {
        initializeEventFilter();
    }

    if (document.getElementById('calcDisplay')) {
        initializeCalculator();
    }

    const animatedElements = document.querySelectorAll('.feature, .event-card, .gallery-item, .info-item');
    animatedElements.forEach(el => observer.observe(el));
});


// Navigation Functions
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Countdown Timer Functions
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set target date (next Saturday at 21:00)
    const now = new Date();
    const nextEvent = new Date();
    nextEvent.setDate(now.getDate() + (6 - now.getDay() + 7) % 7); // Next Saturday
    nextEvent.setHours(21, 0, 0, 0);
    
    // If it's already past Saturday 21:00, set for next week
    if (nextEvent <= now) {
        nextEvent.setDate(nextEvent.getDate() + 7);
    }
    
    updateCountdown(nextEvent);
    
    // Update every second
    setInterval(() => updateCountdown(nextEvent), 1000);
}

function updateCountdown(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p>Event has started!</p>';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Session Storage Functions
function initializesessionStorage() {
    const userName = sessionStorage.getItem('userName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (userName && welcomeMessage) {
        welcomeMessage.innerHTML = `<p>Dobrodošli nazad, ${userName}! 🎉</p>`;
        welcomeMessage.style.display = 'block';
    }
}

function saveUserName(name) {
    sessionStorage.setItem('userName', name);
}

// Form Validation Functions
function initializeFormValidation() {
    const reservationForm = document.getElementById('reservationForm');
    const contactForm = document.getElementById('contactForm');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
        
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleReservationSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearErrorMessages();
    
    // Validate name (minimum 3 characters)
    if (name.length < 3) {
        showError('nameError', 'Ime mora imati najmanje 3 karaktera');
        isValid = false;
    }
    
    // Validate phone (Croatian format)
    const phoneRegex = /^(\+385|0)[0-9]{8,9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showError('phoneError', 'Unesite važeći broj telefona');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Unesite važeću email adresu');
        isValid = false;
    }
    
    if (isValid) {
        saveUserName(name);
        showSuccessMessage('Vaša rezervacija je uspješno poslana!');
        document.getElementById('reservationForm').reset();
        
        // Update welcome message
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `<p>Hvala vam, ${name}! Vaša rezervacija je zabilježena. 🎉</p>`;
            welcomeMessage.style.display = 'block';
        }
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearErrorMessages();
    
    // Validate name
    if (name.length < 2) {
        showError('contactNameError', 'Ime mora imati najmanje 2 karaktera');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('contactEmailError', 'Unesite važeću email adresu');
        isValid = false;
    }
    
    // Validate message
    if (message.length < 10) {
        showError('contactMessageError', 'Poruka mora imati najmanje 10 karaktera');
        isValid = false;
    }
    
    if (isValid) {
        showSuccessMessage('Vaša poruka je uspješno poslana! Odgovorit ćemo vam u najkraćem roku.');
        document.getElementById('contactForm').reset();
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4ecdc4, #44a08d);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Events Page Functions

function filterEvents() {
    const filterValue = document.getElementById('eventFilter').value;
    const tableRows = document.querySelectorAll('#eventsTable tbody tr');
    
    tableRows.forEach(row => {
        const eventType = row.getAttribute('data-type');
        
        if (filterValue === 'all' || eventType === filterValue) {
            row.style.display = '';
            row.classList.add('fade-in');
        } else {
            row.style.display = 'none';
            row.classList.remove('fade-in');
        }
    });
}

// Calculator Functions
function initializeCalculator() {
    updateCapacityStatus();
}

function appendToCalc(value) {
    const display = document.getElementById('calcDisplay');
    
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
    
    updateCapacityStatus();
}

function clearCalc() {
    document.getElementById('calcDisplay').value = '0';
    updateCapacityStatus();
}

function deleteLast() {
    const display = document.getElementById('calcDisplay');
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    updateCapacityStatus();
}

function calculate() {
    const display = document.getElementById('calcDisplay');
    try {
        // Replace display operators with JavaScript operators
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Evaluate the expression safely
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (isFinite(result)) {
            display.value = result.toString();
        } else {
            display.value = 'Error';
        }
    } catch (error) {
        display.value = 'Error';
    }
    
    shouldResetDisplay = true;
    updateCapacityStatus();
}

function updateCapacityStatus() {
    const display = document.getElementById('calcDisplay');
    const statusElement = document.getElementById('capacityStatus');
    
    if (display && statusElement) {
        const currentValue = parseFloat(display.value) || 0;
        const maxCapacity = 500;
        const percentage = Math.min((currentValue / maxCapacity) * 100, 100);
        
        statusElement.textContent = `Trenutna popunjenost: ${percentage.toFixed(1)}%`;
        
        // Change color based on capacity
        if (percentage < 50) {
            statusElement.style.color = '#4ecdc4';
        } else if (percentage < 80) {
            statusElement.style.color = '#ffa500';
        } else {
            statusElement.style.color = '#ff6b6b';
        }
    }
}

// Gallery Functions
function initializeGallery() {
    // Initialize gallery images array
    window.galleryImages = [
        'images/party1.jpeg',
        'images/party2.jpg',
        'images/party3.jpeg',
        'images/party4.jpg',
        'images/party5.jpg',
    ];
    
    // Add keyboard navigation for fullscreen modal
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('fullscreenModal');
        if (modal && modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeFullscreen();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

function openFullscreen(index) {
    currentImageIndex = index;
    const modal = document.getElementById('fullscreenModal');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const imageCounter = document.getElementById('imageCounter');
    
    if (modal && fullscreenImage && window.galleryImages) {
        fullscreenImage.src = window.galleryImages[currentImageIndex];
        imageCounter.textContent = `${currentImageIndex + 1} / ${window.galleryImages.length}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add fade-in animation
        fullscreenImage.classList.add('fade-in');
    }
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function nextImage() {
    if (window.galleryImages) {
        currentImageIndex = (currentImageIndex + 1) % window.galleryImages.length;
        updateFullscreenImage();
    }
}

function prevImage() {
    if (window.galleryImages) {
        currentImageIndex = (currentImageIndex - 1 + window.galleryImages.length) % window.galleryImages.length;
        updateFullscreenImage();
    }
}

function updateFullscreenImage() {
    const fullscreenImage = document.getElementById('fullscreenImage');
    const imageCounter = document.getElementById('imageCounter');
    
    if (fullscreenImage && imageCounter && window.galleryImages) {
        fullscreenImage.classList.remove('fade-in');
        
        setTimeout(() => {
            fullscreenImage.src = window.galleryImages[currentImageIndex];
            imageCounter.textContent = `${currentImageIndex + 1} / ${window.galleryImages.length}`;
            fullscreenImage.classList.add('fade-in');
        }, 150);
    }
}


// Smooth scrolling for anchor links
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

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Add CSS animation for success messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

console.log('XY Club website initialized successfully! 🎉');

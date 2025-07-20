// API Base URL
const API_BASE_URL = 'https://latihan1.pages.dev/api/contacts';

// Function to send data to the API
async function sendDataToAPI(tableName, data) {
    try {
        const response = await fetch(`${API_BASE_URL}?table=${tableName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error sending data to ${tableName}:`, errorData);
            return { success: false, message: errorData.message || 'Terjadi kesalahan saat mengirim data.' };
        }

        const result = await response.json();
        console.log(`Data successfully sent to ${tableName}:`, result);
        return { success: true, message: 'Data berhasil dikirim!' };

    } catch (error) {
        console.error(`Network or API error for ${tableName}:`, error);
        return { success: false, message: 'Gagal terhubung ke server. Mohon coba lagi.' };
    }
}

// 1. Send visitor data on page load
window.addEventListener('load', async () => {
    const currentUrl = window.location.href;
    const timestamp = new Date().toISOString();

    const visitorData = {
        x_01: currentUrl,
        x_02: timestamp,
        // Add more data points if needed, e.g., browser info, referrer
        x_03: navigator.userAgent, // User agent string
        x_04: document.referrer, // Referrer URL
    };

    const response = await sendDataToAPI('kunjungan', visitorData);
    if (!response.success) {
        console.warn('Gagal mencatat kunjungan:', response.message);
    }
});

// 2. Handle Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitButton = document.getElementById('submitButton');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengirim...';
            formMessage.textContent = '';
            formMessage.className = 'mt-3 text-center'; // Reset class

            const currentUrl = window.location.href;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            const formData = {
                x_01: currentUrl, // URL of the landing page
                x_02: name,
                x_03: email,
                x_04: phone,
                x_05: message,
            };

            const response = await sendDataToAPI('form', formData);

            if (response.success) {
                formMessage.textContent = 'Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.';
                formMessage.classList.add('text-success');
                contactForm.reset(); // Clear the form
            } else {
                formMessage.textContent = response.message;
                formMessage.classList.add('text-danger');
            }

            submitButton.disabled = false;
            submitButton.innerHTML = 'Kirim Pesan';
        });
    }

    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Navbar shrink function
    const navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Intersection Observer for image animations and lazy loading
    const imagesToAnimate = document.querySelectorAll('img.img-fade-in');

    const observerOptions = {
        root: null, // viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the image is visible
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('is-visible'); // Trigger fadeInUp

                // If the image should also float, add the float animation after the fade-in animation duration
                if (img.dataset.float === 'true') {
                    // Remove animate-float temporarily if it was somehow added, then re-add after fade-in
                    // This ensures the float animation starts fresh after the fade-in completes.
                    img.classList.remove('animate-float');
                    setTimeout(() => {
                        img.classList.add('animate-float');
                    }, 800); // 800ms matches fadeInUp duration
                }
                observer.unobserve(img); // Stop observing once animated
            }
        });
    }, observerOptions);

    imagesToAnimate.forEach(img => {
        imageObserver.observe(img);
    });
});

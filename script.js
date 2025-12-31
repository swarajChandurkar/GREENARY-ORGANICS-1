/**
 * Greenary Organics - Core Script
 * Handles animations, product rendering, and interactions.
 * Reads configuration from data.js
 */

// ===================================
// Initialization
// ===================================
// Check if data.js is loaded
if (typeof websiteData === 'undefined') {
    console.error("CRITICAL: data.js not loaded. Please ensure data.js is linked before script.js in index.html");
}

// ===================================
// 1. Render Product Grid
// ===================================
function initProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Clear existing content (if any placeholders existed)
    grid.innerHTML = '';

    websiteData.products.forEach(product => {
        // Create card element
        const card = document.createElement('a');
        card.href = product.url || '#';
        card.className = 'product-card';

        // Add subtle animation delay for staggered reveal
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        card.innerHTML = `
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/logo.jpg'"> 
                <div class="card-overlay">
                    <span class="view-btn">View Details</span>
                </div>
            </div>
            <div class="product-card-info">
                <h3>${product.name}</h3>
                <div class="product-card-price">
                    <span class="currency">₹</span>
                    <span class="amount">${product.price}</span>
                    <span class="unit">${product.unit}</span>
                </div>
                 <button class="btn-enquire" data-name="${product.name}">Enquire Now</button>
            </div>
        `;

        // Prevent button click from triggering card link
        const btn = card.querySelector('.btn-enquire');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const phone = websiteData.contact.phone;
                const message = encodeURIComponent(`Hey, I want to buy ${product.name}`);
                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            });
        }

        grid.appendChild(card);
    });

    // Initialize Global Floating Button
    const floatBtn = document.getElementById('whatsapp-float');
    if (floatBtn && websiteData.contact) {
        const phone = websiteData.contact.phone;
        const message = encodeURIComponent(websiteData.contact.whatsappMessage || "Hey, I want to buy");
        floatBtn.href = `https://wa.me/${phone}?text=${message}`;
    }

    // Reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // 100ms delay between cards
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    Array.from(grid.children).forEach(card => observer.observe(card));
}


// ===================================
// 2. Parallax Engine & Hero Logic
// ===================================
const config = {
    products: websiteData.hero.slides,
    currentVariant: 0,
};

// DOM Elements
const canvas = document.getElementById('parallax-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const percentText = document.getElementById('loading-percent');
const heroOverlay = document.querySelector('.hero-overlay');
const scrollPrompt = document.querySelector('.scroll-prompt');
const heroSocial = document.querySelector('.hero-social-bottom');

const elName = document.getElementById('product-name');
const elSubtitle = document.getElementById('product-subtitle');
const elDesc = document.getElementById('product-description');
const elIndex = document.getElementById('variant-index');
const elThemeToggle = document.getElementById('theme-toggle');
const elVariantLoader = document.getElementById('variant-loader');
const root = document.documentElement;

// State
let images = [];
let imagesLoaded = 0;
let totalImages = 0;
let currentFrameIndex = 0;
let isLoading = true;
let rafId = null;

// Experience Mode Check
const urlParams = new URLSearchParams(window.location.search);
const forcedId = urlParams.get('id');
const isExperienceMode = !!forcedId;
const elExploreBtn = document.getElementById('btn-explore-story');

// Canvas Setup
function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (images[currentFrameIndex]) {
        renderFrame(currentFrameIndex);
    }
}

if (canvas) {
    window.addEventListener('resize', resizeCanvas);
}

// Frame URL Generator
function getFrameUrl(frameDir, index) {
    const padIndex = String(index).padStart(3, '0');
    // NOTE: This assumes frames are in the same directory as index.html inside a 'frames' folder
    return `${frameDir}/frame_${padIndex}_delay-0.04s.webp`;
}

// Image Preloading
async function preloadImages(variantIndex, showFullLoader = true) {
    const product = config.products[variantIndex];
    if (!product) return; // Safety check

    images = [];
    imagesLoaded = 0;
    totalImages = product.frameCount;

    if (showFullLoader && loadingScreen) {
        if (progressBar) progressBar.style.width = '0%';
        if (percentText) percentText.textContent = '0%';
        loadingScreen.classList.remove('hidden');
    } else if (elVariantLoader) {
        elVariantLoader.classList.add('visible');
    }

    // Create all image load promises
    const loadPromises = [];

    // Limit concurrency for performance if needed, but modern browsers handle this okay for ~200 items usually
    for (let i = 0; i < totalImages; i++) {
        const promise = new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                images[i] = img;
                handleImageLoad(showFullLoader, resolve);
            };

            img.onerror = () => {
                console.warn(`Failed to load frame ${i} from ${getFrameUrl(product.frameDir, i)}`);
                // Fallback or just count as loaded to avoid hanging
                images[i] = null;
                handleImageLoad(showFullLoader, resolve);
            };

            img.src = getFrameUrl(product.frameDir, i);
        });

        loadPromises.push(promise);
    }

    await Promise.all(loadPromises);

    // Hide loader
    if (showFullLoader && loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            isLoading = false;
            resizeCanvas();
        }, 500);
    } else {
        if (elVariantLoader) elVariantLoader.classList.remove('visible');
        resizeCanvas();
    }
}

function handleImageLoad(showFullLoader, resolve) {
    imagesLoaded++;
    const percent = Math.round((imagesLoaded / totalImages) * 100);

    if (showFullLoader && progressBar && percentText) {
        progressBar.style.width = `${percent}%`;
        percentText.textContent = `${percent}%`;
    }
    resolve();
}

// Frame Rendering
function renderFrame(index) {
    const img = images[index];
    if (!img || !ctx) return;

    // Cover-style drawing
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } catch (e) {
        // Ignore draw errors if image is broken
    }
}

// Scroll Handler
function onScroll() {
    if (isLoading) return;

    const scrollY = window.scrollY;

    // Animate Frames
    if (canvas) {
        const maxScroll = window.innerHeight * 2.5; // 2.5 viewports for animation
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        const product = config.products[config.currentVariant];
        const frameIndex = Math.floor(progress * (product.frameCount - 1));

        if (frameIndex !== currentFrameIndex && images[frameIndex]) {
            currentFrameIndex = frameIndex;
            renderFrame(currentFrameIndex);
        }
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Hide hero overlay when scrolling into content
    if (heroOverlay) {
        const contentStart = window.innerHeight * 0.8; // Trigger bit earlier
        if (scrollY > contentStart) {
            heroOverlay.classList.add('hidden');
            if (scrollPrompt) scrollPrompt.style.opacity = '0';
            if (heroSocial) heroSocial.style.opacity = '0';
        } else {
            heroOverlay.classList.remove('hidden');
            if (scrollPrompt) scrollPrompt.style.opacity = '1';
            if (heroSocial) heroSocial.style.opacity = '1';
        }
    }
}

if (canvas) {
    window.addEventListener('scroll', () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(onScroll);
    }, { passive: true });
}

// UI Updates
function updateProductUI(variantIndex) {
    const product = config.products[variantIndex];
    if (!product) return;

    // Fade out elements
    const elements = [elName, elSubtitle, elDesc, elExploreBtn];
    elements.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
        }
    });

    setTimeout(() => {
        if (elName) elName.textContent = product.name;
        if (elSubtitle) elSubtitle.textContent = product.subtitle;
        if (elDesc) elDesc.textContent = product.description;
        if (elIndex) elIndex.textContent = String(variantIndex + 1).padStart(2, '0');

        // Update accent color
        root.style.setProperty('--accent', product.themeColor);

        // Fade in
        elements.forEach((el, i) => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 100);
            }
        });
        // Update Explore Button
        if (elExploreBtn) {
            if (product.experienceUrl) {
                elExploreBtn.href = product.experienceUrl;
                elExploreBtn.classList.remove('hidden');
            } else {
                elExploreBtn.classList.add('hidden');
            }
        }

    }, 400);
}

// Variant Switching
async function switchVariant(direction) {
    let newIndex = config.currentVariant + direction;
    if (newIndex < 0) newIndex = config.products.length - 1;
    if (newIndex >= config.products.length) newIndex = 0;

    config.currentVariant = newIndex;
    updateProductUI(newIndex);

    // Load new images for the variant
    if (canvas) {
        try {
            await preloadImages(newIndex, false); // false = don't show full screen loader, use mini loader
        } catch (e) {
            console.error("Failed to load new variant images", e);
        }
    }

    // Re-render current frame with new UI color context
    if (canvas) renderFrame(currentFrameIndex);
}

// Theme Toggle
function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }
}

// Smooth Scroll
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Event Listeners
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (prevBtn) prevBtn.addEventListener('click', () => switchVariant(-1));
if (nextBtn) nextBtn.addEventListener('click', () => switchVariant(1));
if (elThemeToggle) elThemeToggle.addEventListener('click', toggleTheme);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') switchVariant(-1);
    if (e.key === 'ArrowRight') switchVariant(1);
});

// Touch Swipe Logic
let touchStartX = 0;
let touchEndX = 0;
const heroSection = document.querySelector('.hero-section');

if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe Left -> Next
            switchVariant(1);
        } else {
            // Swipe Right -> Prev
            switchVariant(-1);
        }
    }
}

// ===================================
// New: Global Scroll Reveal logic
// ===================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===================================
// STARTUP
// ===================================
(async function init() {
    // console.log("Initializing Greenary Organics Engine...");
    loadSavedTheme();
    initProductGrid();
    initScrollReveal(); // Initialize general scroll animations

    // Determine Start Variant
    let startVariant = 0;

    // Mobile Swipe Hint
    if (window.innerWidth <= 768) {
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        const hero = document.getElementById('hero');
        if (hero) hero.appendChild(hint);

        // Remove hint after first interaction
        const removeHint = () => {
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 500);
            document.removeEventListener('touchstart', removeHint);
        };
        document.addEventListener('touchstart', removeHint);
    }

    // Initialize Floating Contact Menu
    const mainFab = document.getElementById('main-fab');
    const contactContainer = document.querySelector('.floating-contact-container');
    const waFloatBtn = document.getElementById('float-whatsapp-btn'); // Renamed ID in HTML

    // Set WhatsApp Link
    if (waFloatBtn && websiteData.contact) {
        const phone = websiteData.contact.phone || '919022166328';
        const message = encodeURIComponent(websiteData.contact.whatsappMessage || "Hi");
        waFloatBtn.href = `https://wa.me/${phone}?text=${message}`;
    }

    // Toggle Menu
    if (mainFab && contactContainer) {
        mainFab.addEventListener('click', (e) => {
            e.stopPropagation();
            contactContainer.classList.toggle('active');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!contactContainer.contains(e.target)) {
                contactContainer.classList.remove('active');
            }
        });
    }

    if (forcedId) {
        const foundIndex = websiteData.hero.slides.findIndex(s => s.id === forcedId);
        if (foundIndex !== -1) startVariant = foundIndex;

        // Hide Nav Controls in Experience Mode
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (elIndex) elIndex.parentElement.style.display = 'none';
    }

    config.currentVariant = startVariant;

    // Dynamic Hero Content Init (first load)
    if (websiteData.hero && websiteData.hero.slides.length > 0) {
        // Ensure UI matches first slide data
        // Update UI immediately without animation for initial load
        const slide = websiteData.hero.slides[startVariant];
        if (elName) elName.textContent = slide.name;
        if (elSubtitle) elSubtitle.textContent = slide.subtitle;
        if (elDesc) elDesc.textContent = slide.description;
        root.style.setProperty('--accent', slide.themeColor);

        // Initial Button State
        if (elExploreBtn) {
            if (slide.experienceUrl && !isExperienceMode) {
                elExploreBtn.href = slide.experienceUrl;
                elExploreBtn.classList.remove('hidden');
            } else {
                elExploreBtn.classList.add('hidden');
            }
        }
    }

    if (canvas) {
        resizeCanvas();
        try {
            await preloadImages(startVariant, true);
        } catch (e) {
            console.error("Error preloading images:", e);
            // Hide loader anyway so site is usable
            if (loadingScreen) loadingScreen.classList.add('hidden');
        }
    } else {
        console.warn("No parallax canvas found. Skipping animation init.");
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }
})();


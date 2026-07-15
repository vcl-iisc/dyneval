window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Interactive Figure 1 comparison carousel
function setupFigureOneExplorer() {
    const explorer = document.getElementById('figure1-explorer');
    if (!explorer) return;

    const evaluatorTabs = Array.from(explorer.querySelectorAll('[data-evaluator-tab]'));
    const evaluatorPanels = Array.from(explorer.querySelectorAll('[data-evaluator-panel]'));

    const supplementaryComparisons = {
        geneval: [
            { prompt: 'A photo of a blue book.', models: ['Real Image', 'DeepFloyd IF-I-XL'], images: ['geneval-09-book-real.png', 'geneval-10-book-deepfloyd-ifxl.png'], scores: [[0.80, 0.93, 0.00], [0.68, 0.80, 1.00]], preferred: [0, 0, 1] },
            { prompt: 'A photo of a green traffic light.', models: ['Real Image', 'Stable Diffusion 2.0'], images: ['geneval-11-traffic-light-real.png', 'geneval-12-traffic-light-sd2.png'], scores: [[0.76, 1.00, 0.00], [0.60, 0.80, 1.00]], preferred: [0, 0, 1] },
            { prompt: 'A photo of two trucks.', models: ['DeepFloyd IF-I-XL', 'Stable Diffusion 2.0'], images: ['geneval-13-trucks-deepfloyd-ifxl.png', 'geneval-14-trucks-sd2.png'], scores: [[0.76, 0.80, 0.00], [0.68, 0.70, 1.00]], preferred: [0, 0, 1] },
            { prompt: 'A photo of a pink car.', models: ['Real Image', 'DeepFloyd IF-I-XL'], images: ['geneval-15-pink-car-real.png', 'geneval-16-pink-car-deepfloyd-ifxl.png'], scores: [[0.72, 1.00, 0.00], [0.64, 0.60, 1.00]], preferred: [0, 0, 1] }
        ],
        evalmuse: [
            { prompt: 'Four stainless steel forks.', models: ['DALL-E 3', 'Midjourney 6'], images: ['evalmuse-09-forks-dalle3.png', 'evalmuse-10-forks-midjourney6.png'], scores: [[1.00, 1.00, 0.80], [0.73, 0.80, 0.87]], preferred: [0, 0, 1] },
            { prompt: 'A row of houses with chimneys, but no smoke coming out.', models: ['SDXL', 'Midjourney 6'], images: ['evalmuse-11-houses-sdxl.png', 'evalmuse-12-houses-midjourney6.png'], scores: [[1.00, 1.00, 0.52], [0.47, 0.80, 0.76]], preferred: [0, 0, 1] },
            { prompt: 'The iceman beats the heat with near-perfect form.', models: ['Hi-Dream', 'DALL-E 3'], images: ['evalmuse-13-iceman-hidream.png', 'evalmuse-14-iceman-dalle3.png'], scores: [[0.20, 0.57, 0.65], [0.80, 0.77, 0.44]], preferred: [1, 1, 0] },
            { prompt: "A man in a tuxedo doesn't adjust his tie.", models: ['DALL-E 3', 'Real Image'], images: ['evalmuse-15-tuxedo-dalle3.png', 'evalmuse-16-tuxedo-real.png'], scores: [[0.40, 0.80, 0.79], [1.00, 1.00, 0.41]], preferred: [1, 1, 0] }
        ],
        tifa: [
            { prompt: 'A cat jumping in the air to get onto a table.', models: ['Stable Diffusion 1.5', 'VQ-Diffusion'], images: ['tifa-09-cat-sd15.png', 'tifa-10-cat-vq-diffusion.png'], scores: [[1.00, 0.90, 0.57], [0.70, 0.65, 0.71]], preferred: [0, 0, 1] },
            { prompt: 'The people are flying the kites in the sky.', models: ['Stable Diffusion 1.5', 'VQ-Diffusion'], images: ['tifa-11-kites-sd15.png', 'tifa-12-kites-vq-diffusion.png'], scores: [[1.00, 0.90, 0.71], [0.60, 0.50, 1.00]], preferred: [0, 0, 1] },
            { prompt: 'Black and white photograph of a bed with a laptop on it.', models: ['DALL-E mini', 'Stable Diffusion 1.5'], images: ['tifa-13-bed-dalle-mini.png', 'tifa-14-bed-sd15.png'], scores: [[1.00, 0.80, 0.86], [0.70, 0.60, 1.00]], preferred: [0, 0, 1] },
            { prompt: 'A car and a truck sitting at a red light.', models: ['Stable Diffusion 1.5', 'Stable Diffusion 2.0'], images: ['tifa-15-car-truck-sd15.png', 'tifa-16-car-truck-sd2.png'], scores: [[0.50, 0.36, 0.60], [0.60, 0.66, 0.40]], preferred: [1, 1, 0] }
        ],
        dpgbench: [
            { prompt: 'On the left is a metal fork and on the right is a wooden spoon.', models: ['SDXL', 'DeepFloyd IF-I-XL'], images: ['dpgbench-09-fork-spoon-sdxl.png', 'dpgbench-10-fork-spoon-deepfloyd-ifxl.png'], scores: [[0.47, 0.47, 0.88], [1.00, 0.90, 0.76]], preferred: [1, 1, 0] },
            { prompt: 'A basketball to the left of two soccer balls on a gravel driveway.', models: ['DALL-E mini', 'Stable Diffusion 1.5'], images: ['dpgbench-11-balls-dalle-mini.png', 'dpgbench-12-balls-sd15.png'], scores: [[0.80, 0.63, 0.40], [0.60, 0.50, 0.60]], preferred: [0, 0, 1] },
            { prompt: 'An elephant with a colorful scarf and a beanie painting on a large canvas.', models: ['FLUX.2 Klein', 'Emu3'], images: ['dpgbench-13-elephant-flux2-klein.png', 'dpgbench-14-elephant-emu3.png'], scores: [[0.93, 1.00, 0.74], [0.60, 0.73, 0.71]], preferred: [0, 0, 0] },
            { prompt: 'Three vintage cars parked in a row, one with a white roof and two with green roofs.', models: ['DALL-E 3', 'SDXL'], images: ['dpgbench-15-vintage-cars-dalle3.png', 'dpgbench-16-vintage-cars-sdxl.png'], scores: [[0.87, 0.84, 0.57], [0.40, 0.55, 0.65]], preferred: [0, 0, 1] }
        ]
    };

    const evaluatorLabels = { geneval: 'GenEval', evalmuse: 'FGA-BLIP2', tifa: 'TIFA', dpgbench: 'DPG-Bench' };

    function scoreClass(metricIndex, imageIndex, preferred) {
        const classes = ['score-badge', metricIndex === 0 ? 'is-human' : metricIndex === 1 ? 'is-closest' : 'is-mismatch'];
        if (preferred[metricIndex] === imageIndex) classes.push('is-pair-winner');
        if (metricIndex === 2 && preferred[metricIndex] !== preferred[0] && preferred[metricIndex] === imageIndex) classes.push('is-disagreement');
        return classes.join(' ');
    }

    function comparisonGroupMarkup(item, evaluatorName, pairNumber) {
        const evaluatorLabel = evaluatorLabels[evaluatorName];
        const cards = item.models.map((model, imageIndex) => {
            const values = item.scores[imageIndex];
            return `<article class="result-card">
                <img src="static/images/figure1_sources/${item.images[imageIndex]}" alt="${item.prompt} - ${model}" loading="lazy">
                <div class="result-card-body"><h4>${model}</h4><dl class="score-list">
                    <div><dt>Human</dt><dd class="${scoreClass(0, imageIndex, item.preferred)}">${values[0].toFixed(2)}</dd></div>
                    <div><dt>DynEval-4B</dt><dd class="${scoreClass(1, imageIndex, item.preferred)}">${values[1].toFixed(2)}</dd></div>
                    <div><dt>${evaluatorLabel}</dt><dd class="${scoreClass(2, imageIndex, item.preferred)}">${values[2].toFixed(2)}</dd></div>
                </dl></div>
            </article>`;
        }).join('');
        const humanImage = item.preferred[0] + 1;
        const dynImage = item.preferred[1] + 1;
        const baselineImage = item.preferred[2] + 1;
        const baselineAgrees = item.preferred[2] === item.preferred[0];
        return `<section class="comparison-group" aria-labelledby="${evaluatorName}-prompt-${pairNumber}">
            <div class="comparison-prompt"><span class="prompt-number">${String(pairNumber).padStart(2, '0')}</span><h3 id="${evaluatorName}-prompt-${pairNumber}">“${item.prompt}”</h3></div>
            <div class="comparison-pair">${cards}</div>
            <div class="pair-trend" aria-label="Pairwise score direction from image 1 to image 2">
                <div class="pair-trend-heading"><span>Which image receives the higher score?</span></div>
                <div class="trend-row is-reference"><span>Humans prefer</span><b>Image ${humanImage}</b></div>
                <div class="trend-row is-aligned"><span>DynEval prefers</span><b>Image ${dynImage}</b><em>✓ Agrees</em></div>
                <div class="trend-row ${baselineAgrees ? 'is-aligned' : 'is-opposite'}"><span>${evaluatorLabel} prefers</span><b>Image ${baselineImage}</b><em>${baselineAgrees ? '✓ Agrees' : '✕ Disagrees'}</em></div>
            </div>
        </section>`;
    }

    Object.entries(supplementaryComparisons).forEach(([evaluatorName, comparisons]) => {
        const panel = explorer.querySelector(`[data-evaluator-panel="${evaluatorName}"]`);
        const carousel = panel?.querySelector('.comparison-carousel');
        const controls = carousel?.querySelector('.carousel-controls');
        const dots = controls?.querySelector('.carousel-dots');
        if (!carousel || !controls || !dots) return;

        for (let slideOffset = 0; slideOffset < 2; slideOffset += 1) {
            const slideIndex = slideOffset + 2;
            const items = comparisons.slice(slideOffset * 2, slideOffset * 2 + 2);
            const slide = document.createElement('article');
            slide.className = 'comparison-slide';
            slide.dataset.figureSlide = String(slideIndex);
            slide.setAttribute('aria-hidden', 'true');
            slide.innerHTML = `<div class="comparison-grid">${items.map((item, itemIndex) => comparisonGroupMarkup(item, evaluatorName, 5 + slideOffset * 2 + itemIndex)).join('')}</div>
                <p class="slide-takeaway"><b>Takeaway:</b> these supplementary examples further show whether each evaluator follows the direction of human preference.</p>`;
            carousel.insertBefore(slide, controls);

            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.type = 'button';
            dot.dataset.figureDot = String(slideIndex);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', 'false');
            dot.setAttribute('aria-label', `Show ${evaluatorLabels[evaluatorName]} examples ${5 + slideOffset * 2} and ${6 + slideOffset * 2}`);
            dots.appendChild(dot);
        }
    });

    function initializeCarousel(carousel) {
        const slides = Array.from(carousel.querySelectorAll('[data-figure-slide]'));
        const dots = Array.from(carousel.querySelectorAll('[data-figure-dot]'));
        const previousButton = carousel.querySelector('[data-figure-prev]');
        const nextButton = carousel.querySelector('[data-figure-next]');
        const status = carousel.querySelector('.carousel-status');
        let currentSlide = 0;
        let touchStartX = null;

        if (slides.length === 0) return;

        function showSlide(index) {
            currentSlide = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentSlide;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentSlide;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-selected', String(isActive));
            });

            if (status) {
                status.textContent = `${currentSlide + 1} / ${slides.length}`;
            }
        }

        previousButton?.addEventListener('click', () => showSlide(currentSlide - 1));
        nextButton?.addEventListener('click', () => showSlide(currentSlide + 1));

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        carousel.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showSlide(currentSlide - 1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showSlide(currentSlide + 1);
            }
        });

        carousel.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (event) => {
            if (touchStartX === null) return;
            const distance = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(distance) > 45) {
                showSlide(currentSlide + (distance < 0 ? 1 : -1));
            }
            touchStartX = null;
        }, { passive: true });

        showSlide(0);
    }

    function showEvaluator(evaluatorName) {
        evaluatorTabs.forEach((tab) => {
            const isActive = tab.dataset.evaluatorTab === evaluatorName;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });

        evaluatorPanels.forEach((panel) => {
            panel.hidden = panel.dataset.evaluatorPanel !== evaluatorName;
        });
    }

    explorer.querySelectorAll('.comparison-carousel').forEach(initializeCarousel);

    evaluatorTabs.forEach((tab) => {
        tab.addEventListener('click', () => showEvaluator(tab.dataset.evaluatorTab));
    });

    const initiallyActiveTab = evaluatorTabs.find((tab) => tab.classList.contains('is-active'));
    if (initiallyActiveTab) {
        showEvaluator(initiallyActiveTab.dataset.evaluatorTab);
    }
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    setupFigureOneExplorer();

})

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
            slide.innerHTML = `<div class="comparison-grid">${items.map((item, itemIndex) => comparisonGroupMarkup(item, evaluatorName, 5 + slideOffset * 2 + itemIndex)).join('')}</div>`;
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

    function reorderCarouselPages(evaluatorName, pageOrder) {
        const carousel = explorer.querySelector(`[data-evaluator-panel="${evaluatorName}"] .comparison-carousel`);
        const controls = carousel?.querySelector('.carousel-controls');
        const dotsContainer = controls?.querySelector('.carousel-dots');
        if (!carousel || !controls || !dotsContainer) return;

        const slides = Array.from(carousel.querySelectorAll('[data-figure-slide]'));
        const dots = Array.from(dotsContainer.querySelectorAll('[data-figure-dot]'));
        pageOrder.forEach((originalIndex, newIndex) => {
            const slide = slides[originalIndex];
            const dot = dots[originalIndex];
            if (slide) {
                slide.dataset.figureSlide = String(newIndex);
                carousel.insertBefore(slide, controls);
            }
            if (dot) {
                dot.dataset.figureDot = String(newIndex);
                dotsContainer.appendChild(dot);
            }
        });
    }

    reorderCarouselPages('tifa', [1, 2, 3, 0]);
    reorderCarouselPages('geneval', [1, 2, 3, 0]);

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

// DynEval-1K Leaderboard tab switching
function setupLeaderboardTabs() {
    const tabs = Array.from(document.querySelectorAll('[data-leaderboard-tab]'));
    const panels = Array.from(document.querySelectorAll('[data-leaderboard-panel]'));
    if (tabs.length === 0) return;

    function show(name) {
        tabs.forEach((tab) => {
            const isActive = tab.dataset.leaderboardTab === name;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });
        panels.forEach((panel) => {
            panel.hidden = panel.dataset.leaderboardPanel !== name;
            panel.classList.toggle('is-active', panel.dataset.leaderboardPanel === name);
        });
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.leaderboardTab)));
}

// Per-category leaderboard scores table
function setupCategoryScores() {
    const table = document.getElementById('category-scores-table');
    if (!table) return;

    const headers = [
        'single_object', 'multi_object', 'human_present', 'animal_present', 'vehicle_present',
        'food_present', 'plant_present', 'landmark_present', 'count_exact', 'count_approx',
        'count_multi_object', 'color_binding', 'shape_binding', 'material_binding', 'texture_binding',
        'size_binding', 'style_binding', 'attribute_binding_multi', 'spatial_2d', 'spatial_3d',
        'relative_position', 'perspective', 'object_interaction', 'comparative_relation', 'multi_relation',
        'human_action', 'animal_action', 'object_manipulation', 'indoor_scene', 'outdoor_scene',
        'urban_scene', 'natural_scene', 'art_style', 'photographic_style', 'artist_style',
        'genre_style', 'surreal_scene', 'anti_realism', 'fantasy_content', 'text_in_image',
        'symbol_rendering', 'logo_or_sign'
    ];

    const raw = `GPT-Image-1.5\t5 4.921765 4.520833 4.998 4.653846 4.850588 4.826923 4.811818 4.866389 4.852121 4.520488 4.956471 4.874062 4.628824 4.856875 4.013889 4.871429 4.773125 4.848 4.6316 4.801538 4.491429 4.783958 4.904146 4.806111 4.752045 4.808571 4.715217 4.716429 4.771071 4.773077 4.849643 4.7775 4.728611 4.665238 4.782647 4.508667 4.502143 4.585714 4.440667 4.935 4.796552
NanoBanana\t5 4.921765 4.43375 4.7815 4.730769 4.901176 4.416923 4.746364 4.920278 4.859091 4.208293 4.912353 4.759375 4.86 4.8575 4.464444 4.385714 4.815 4.764 4.5272 4.731154 4.5075 4.58125 4.762439 4.756111 4.599091 4.606 4.431304 4.669643 4.720357 4.746731 4.732232 4.567656 4.765556 4.447143 4.831176 4.522 4.641429 4.152381 4.848444 4.714167 4.748276
FLUX.2 [klein]\t5 4.892353 4.190833 3.927 4.146923 4.558824 4.602308 4.791818 4.873889 4.87303 3.889512 4.907059 4.8625 4.538235 4.74375 4.567222 4.845 4.79375 4.8498 4.538 4.653846 4.39 4.66875 4.830244 4.617222 4.666591 4.572286 4.632609 4.568929 4.671429 4.653654 4.632143 4.118594 4.461667 4.215 4.010588 3.956667 4.158571 4.234286 4.232 4.585 4.464655
FLUX.2 [dev]\t5 4.921765 4.212292 4.244 4.34 4.592941 4.230769 4.483636 4.482639 4.668788 4.087439 4.945294 4.90125 4.195882 4.781875 4.357222 4.871429 4.814375 4.6306 4.7624 4.766538 4.226429 4.515 4.298293 4.851667 4.544091 4.676286 4.396848 4.479286 4.6075 4.736538 4.683571 4.180313 3.872222 3.883333 3.971176 4.029333 4.212857 3.471905 4.495444 4.796875 4.452069
Fibo\t5 4.901765 4.163333 3.729 4.096154 4.585294 4.580769 4.613636 4.535556 4.782424 4.090244 4.821765 4.840312 4.421176 4.155625 3.691944 4.435714 4.72 4.784 4.6584 4.460385 3.667143 4.59625 4.720488 4.741389 4.592727 4.536286 4.514783 4.447143 4.638036 4.541538 4.596786 4.062188 4.255 3.677619 3.224118 3.774 4.319286 4.239524 3.573 4.531458 4.358276
LongCat-Image\t4.906 4.921765 4.172083 4.2565 3.981538 4.677647 4.531538 4.716364 4.474722 4.630606 4.142439 4.628824 4.734375 4.607647 4.37125 3.9525 4.108571 4.59 4.7236 4.4636 4.354615 3.895714 4.286667 4.695854 4.571111 4.322273 4.507143 4.212391 4.554643 4.598214 4.518846 4.578125 4.089062 3.936667 4.146667 4.111471 3.739333 3.917857 3.936667 3.662222 4.107292 4.353621
HiDream-I1\t4.833333 4.892353 4.251042 3.9215 4.192308 4.456471 4.298462 4.536364 4.582222 4.551061 3.763293 4.647059 4.642812 4.346471 4.084375 3.940278 4.6 4.60125 4.6852 4.408 4.52 4.19875 4.460625 4.608293 4.580833 4.402273 4.420857 4.365978 4.143929 4.447679 4.240865 4.528571 4.008594 4.280556 3.650476 3.326176 3.728667 4.21 4.238095 3.956667 4.367083 4.535517
Qwen-Image\t4.766667 4.745294 4.061458 3.858 3.865385 4.225294 4.086923 4.430909 3.266111 4.44 3.936463 4.467647 4.54 4.467059 4.088125 4.126111 3.947143 4.27 4.5844 4.5252 4.290769 3.611607 4.469375 4.575366 4.461667 4.19625 4.42 4.467174 4.301786 4.429107 4.353269 4.628929 3.812656 4.131667 3.530952 3.052941 3.332667 3.807143 4.155238 3.720556 4.211667 4.135517
Z-Image\t4.729333 4.701176 3.757083 3.4205 3.423077 4.086471 4.41 4.460909 4.793333 4.494545 3.908293 4.781176 4.610312 4.314706 4.10375 3.217778 4.2 4.604375 4.6598 4.2372 4.011538 3.474286 4.359062 4.624146 4.367778 4.374545 4.512571 4.447391 4.213571 4.306429 4.352308 4.503214 3.855625 3.628194 3.84 3.537353 3.46 3.797143 3.781429 3.355333 3.91875 3.992759
GLM-Image\t4.956667 4.833529 3.952917 3.727 4.013077 4.530588 4.089231 4.426818 4.390833 4.178182 3.937317 4.767647 4.23125 4.318235 3.8975 3.509722 4.271429 4.46125 4.0622 4.3896 4.425769 3.678571 3.944375 4.554146 4.475 4.220455 4.44 4.357826 4.108214 4.364643 4.438846 4.205 3.811094 3.667222 3.593333 4.030588 2.880667 2.897143 3.648095 4.016333 4.040208 3.728966
FLUX.1 [dev]\t4.733333 4.862941 4.065417 3.5525 3.506923 4.106471 3.602308 4.352727 4.781319 4.369697 3.470488 4.488824 4.34875 4.039412 4.258125 3.746389 4.328571 4.321875 4.5087 4.1612 4.003846 3.619643 4.090833 4.421951 4.2575 4.193409 4.333429 4.123478 4.042857 4.441429 4.264135 4.355357 3.842969 4.146111 3.528452 3.511471 3.467333 3.565 3.50381 4.03 4.203958 4.083276
Sana\t4.731333 4.872353 3.972083 3.504 3.987692 4.301765 4.089231 4.224091 4.806111 4.047879 3.58561 4.671765 4.211875 4.223529 4.014375 3.746389 4.714286 4.345 3.8934 4.3976 4.573846 4.056071 3.816146 4.377561 4.385556 4.021364 4.347429 4.15587 3.987143 4.267143 4.288462 4.219107 4.17625 3.737778 3.522857 4.031176 2.948 2.981429 3.81381 3.713111 4.397083 3.327241
UniPic\t4.988 4.921765 3.869167 3.8815 3.646923 4.601765 3.890769 4.58 4.795556 4.246667 3.734634 4.948235 4.4175 4.184118 4.0375 3.500833 4.189286 4.773125 4.1586 4.5884 4.850385 3.146429 3.893646 4.783902 4.457778 4.184773 4.372571 4.25587 4.089286 4.442857 4.434615 4.345357 3.925625 3.882222 3.412381 3.41 3.088667 2.834286 3.889524 3.103667 3.670833 2.856207
Stable Diffusion 3.5\t4.98 4.921765 4.272708 3.39 3.640769 4.516471 4.037692 4.116364 4.390625 4.416667 3.611585 4.722941 4.349375 3.991765 4.148125 3.985 4.355714 4.47375 4.3157 4.384 4.108462 3.742143 4.127604 3.973415 4.455 3.932045 4.315714 4.015 4.085 4.178214 4.229615 4.217143 3.933438 3.675 3.404881 3.615588 3.820667 3.696429 2.874762 3.751778 4.4125 4.005517
OmniGen2\t4.9 4.902353 3.873542 3.614 4.013077 4.592353 4.095385 4.196364 4.702639 4.388788 3.615366 4.854706 4.36 3.87 3.97125 3.780556 4.379286 4.666875 4.3238 4.3228 4.48 4.045893 4.001354 4.049268 4.469444 4.125455 4.188857 4.080109 4.029643 4.219286 4.198846 3.868214 3.611875 3.41 3.335 3.405 3.824667 3.844286 3.079048 3.577222 3.98125 4.134138
In-Context LoRA\t4.9 4.755294 3.727292 3.577 3.538462 3.972941 3.787692 4.081818 4.605417 4.362424 3.578415 4.538235 4.394375 3.753529 4.10375 3.787778 4.19 4.325 4.3561 4.3076 4.226923 3.785179 4.147292 4.010976 4.513611 4.122386 4.422 4.143152 4.199643 4.289286 4.268077 4.187143 3.6525 3.451111 3.32 3.391471 3.438 3.23 2.940476 3.748778 3.972917 4.143448
Bagel\t4.872667 4.608235 3.580417 3.064 3.455385 4.124118 3.429231 4.45 4.558889 4.540303 3.444146 4.601176 4.42375 4.305294 4.02125 3.726667 3.862143 4.664375 4.6128 4.2264 4.435 3.400893 4.008542 4.568293 4.330556 3.897273 4.263143 3.856739 4.211071 4.457143 4.205769 4.350536 3.685781 3.687222 3.717143 3.469412 3.587333 3.860714 3.67 3.35 3.789167 3.887414
OmniGen\t4.333333 4.480588 3.6575 3.2355 3.692308 4.21 3.371538 4.482727 3.754375 4.316364 3.419268 4.497059 4.083125 4.074706 3.809375 3.618889 4.133571 3.984375 4.4988 4.0968 4.035769 3.625714 4.048854 4.446829 4.444167 4.205909 4.186857 3.939239 3.988929 4.284643 4.252596 4.136429 3.620625 3.941667 3.66369 3.348529 3.362667 3.733571 3.609048 3.739333 3.907083 3.851552
Hunyuan-DiT\t4.447333 4.725294 3.642083 3.7495 3.686154 4.291176 4.140769 3.965455 2.7125 4.384848 3.422683 4.594706 3.9975 3.777059 3.1125 3.133889 4.442857 4.484375 4.1564 3.9388 4.003846 3.680714 4.098229 4.343902 4.045 4.133409 4.092571 4.146087 4.063214 4.264286 4.028654 4.226429 4.14875 3.96125 3.948095 3.900882 3.595333 4.272143 3.862857 2.632222 3.81375 3.545862
Show-o\t4.353333 3.695882 3.242083 3.331 3.493846 3.875294 3.563846 4.16 3.818194 4.144545 3.436707 4.326471 4.261875 3.898235 4.024375 3.830556 4.257143 4.096875 4.2474 4.3244 3.709615 3.356071 3.924583 3.961951 4.400278 3.741591 4.093714 3.915217 4.093929 4.171429 4.146538 4.213929 3.546094 3.287222 3.470357 3.274706 3.88 3.907857 2.89 3.457889 3.985 4.061034
X-Omni\t4.739333 4.627647 3.182917 3.1145 2.846154 3.638235 3.256154 4.413636 4.455556 4.356061 3.419268 4.722941 4.52875 4 3.54375 3.142222 3.448571 4.170625 4.3052 4.1464 4.288846 2.903571 3.924687 4.500732 4.323889 3.893409 3.957714 3.634783 3.975714 4.394286 3.949423 3.986339 3.484688 3.455 3.624762 3.317647 3.346 3.563571 3.40381 2.975778 3.51875 3.956207
Janus-Pro\t4.58 4.701176 3.333333 3.298 3.237692 4.311765 3.352308 4.150909 3.570139 3.913636 3.149512 4.325882 4.20625 3.752353 4.064375 3.669167 4.234286 4.515625 4.2625 3.7776 4.667308 3.366071 3.826458 4.268293 4.113333 3.728864 4.105714 3.650217 3.922857 4.037857 3.898654 3.946429 3.445 3.845556 3.488929 3.089706 3.792 3.9 3.528095 2.829556 3.426875 3.644224
Kolors\t4.678667 4.338235 3.51125 3.1605 3.359231 3.707059 4.057692 4.097273 3.853056 4.146667 3.132683 4.613529 4 3.995294 3.78375 3.373333 4.265714 3.430625 4.162 3.7748 3.576923 3.153393 3.810312 4.132439 3.986389 3.820227 4.052286 3.687826 3.861964 4.11 3.85 4.231071 3.823438 3.709444 3.723333 3.727353 3.528667 3.629286 3.71381 2.810444 3.508333 3.397241
PixArt-α\t4.393333 3.892353 3.894167 3.4565 3.557692 4.138824 3.794615 3.604545 3.857014 4.056364 3.051707 4.362941 3.99125 4.007647 3.80125 3.982778 4.283571 3.265625 3.8465 3.6648 3.313462 3.851071 3.709583 3.798049 3.716667 3.906591 3.702286 3.770435 3.585714 3.7775 3.764423 3.9875 3.983281 4.068889 3.597262 3.616471 3.625333 3.983571 3.603333 2.994222 3.975417 3.472069
Kandinsky 3\t4.602 4.127647 3.765 3.2265 3.583846 3.910588 3.986923 3.810909 4.080278 4.195758 3.109512 4.402941 3.89375 4.124118 3.761875 3.703056 3.817857 3.371875 3.8564 3.548 3.727692 3.79625 3.683646 3.88439 4.018889 3.835227 3.659429 3.564565 3.515 3.7875 3.664423 3.809464 3.898125 4.078333 3.724762 3.750588 3.725333 4.080714 3.494762 2.965889 3.679583 3.478966
UniWorld-V1\t4.952667 4.877647 3.892917 3.52 3.737692 4.566471 3.544615 4.199091 4.828889 3.975909 2.175122 4.841765 3.759062 3.969412 3.70625 3.318889 4.308571 4.565625 3.3036 3.4592 4.427308 3.5825 3.653229 3.033659 4.100278 4.048409 3.723714 3.527174 2.830357 3.080714 3.631346 3.555714 3.924219 4.00375 3.650952 3.789118 3.546 3.698571 3.550476 3.400889 3.946875 3.825172
Playground v2.5\t4.968667 4.564118 3.798333 3.446 3.756154 4.308824 4.076154 3.658182 4.415278 4.049091 2.178049 4.623529 3.625625 4.061176 3.840625 3.6275 3.932143 3.60625 3.0616 3.2204 3.610385 3.814286 3.427396 3.079512 3.967778 3.991591 3.254857 3.137609 2.94 2.920714 3.688654 3.454911 4.035 4.155 3.992857 3.900294 3.638667 4.243571 3.561905 3.279222 3.440208 3.815172
SSD-1B\t4.4 4.230588 3.849583 3.3015 3.25 3.894706 3.681538 3.785682 3.462778 3.963561 2.045244 4.415882 3.358125 3.570588 3.574375 3.61 4.355 3.108125 3.1312 3.3768 3.466538 3.548036 3.5525 2.850488 3.719444 3.680909 3.106286 3.086087 2.845357 2.940089 3.384327 3.341071 3.95625 4.21 3.397143 3.200588 3.452 4.029286 3.781429 3.192222 3.736875 3.77
DeepFloyd IF-XL\t4.306667 4.667059 3.508333 3.397 3.461538 4.024706 3.81 3.225909 4.244167 3.71197 2.867378 3.854706 3.615938 3.365882 3.13375 3.451111 4.014286 3.826875 3.6432 3.508 3.632692 3.708393 3.417083 3.53 3.5275 3.523977 3.204286 3.319348 2.958929 3.355714 2.726538 3.351429 3.100313 3.523333 2.82619 2.658824 2.768 2.98 3.241905 2.971111 3.793958 3.781897
Emu3\t4.327333 3.460588 3.257917 3.09675 2.986923 3.941176 3.467692 3.615682 2.943889 3.564848 2.951951 4.432353 3.4625 3.712353 3.3225 2.968333 4.015714 3.2175 3.3988 3.7024 3.394615 3.361429 3.172187 3.891463 3.6775 3.380455 3.713143 3.429565 3.366429 3.580357 3.595962 3.789286 3.562031 3.454444 3.174762 3.294118 2.695333 2.439286 3.340476 2.883167 3.467917 2.698621
SDXL-Turbo\t3.398 4.137647 3.774167 3.087 3.429231 3.783529 3.736923 3.509318 1.754167 3.445758 2.856829 4.1 3.46375 3.957059 3.373125 3.251944 3.875 3.45125 3.192 3.6304 3.644615 3.685357 3.075833 3.684634 3.745278 3.320455 3.452286 3.304783 3.405 3.421071 3.606346 3.595714 3.787969 3.483889 3.195238 3.698235 2.634 2.927143 3.771905 3.033889 3.511042 2.901724
Stable Diffusion XL\t2.941333 3.382353 2.975833 2.61 2.897692 3.085882 3.114615 3.728182 1.938056 3.920303 3.025122 3.592353 3.600625 3.676471 3.1925 2.364444 3.339286 2.8625 3.9896 3.5894 2.857692 2.736607 3.247083 3.730976 3.8275 3.808864 3.582857 3.213478 3.243036 3.783929 3.559038 3.486429 2.905156 2.940417 3.008571 2.825588 2.594667 2.986429 2.992381 2.647556 3.086042 3.403103
Stable Diffusion v2.1\t4.373333 3.642353 3.24 3.2075 3.462308 3.994118 3.653846 3.146364 3.105278 3.511212 1.897561 4.178235 2.833125 3.365882 3.1425 3.261667 3.636429 3.140625 2.7505 2.7788 3.253462 3.936429 2.876771 2.588537 3.082778 3.372045 2.582286 2.676304 2.468929 2.499643 2.997692 2.900357 3.332031 3.533333 3.135595 3.140588 3.175333 3.98 3.31381 2.818 2.872917 3.351552
Stable Diffusion v1.5\t3.952667 3.314118 2.601667 2.441 3.160769 3.454706 3.012308 2.620227 1.42 3.126667 2.540244 3.995882 2.500312 2.880588 2.4425 2.232222 3.657143 2.91625 2.732 3.1136 2.760769 3.181071 2.871562 3.115854 3.0975 2.961818 2.858286 2.875435 2.888214 3.145357 3.168462 3.144107 3.173125 3.176667 2.857143 3.282353 2.399333 2.112857 3.095714 2.967722 2.993125 2.595517
PixArt-σ\t4.646667 3.833529 2.784375 1.19 1.397692 2.488235 1.919231 3.871591 3.812778 3.878409 1.879756 4.471176 2.994062 3.006275 2.796875 2.718611 1.859286 2.98125 3.226 3.3648 3.322308 1.422321 2.553438 2.876341 3.318056 3.519375 2.967143 2.423478 2.318571 2.937321 3.361635 2.470357 1.945469 2.178333 2.525238 1.501765 1.985333 2.122857 1.92381 1.988667 2.335 2.391724
LlamaGen\t2.02 2.652353 2.120208 2.017 2.173077 2.414706 2.91 1.435455 2.347778 1.771515 1.379695 2.215294 1.779375 2.93 2.380625 2.97 2.578571 2.06875 1.703 1.6584 2.266154 2.575357 1.848125 1.33561 1.655 1.792273 1.586286 1.545652 1.819286 1.627143 1.719038 1.989286 1.905469 1.87 1.662619 1.895 2.000667 2.116429 1.808571 2.32 2.027292 2.082759`;

    const prettyHeader = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '<tr><th class="sticky-col">Model</th>' +
        headers.map((key) => `<th title="${key}">${prettyHeader(key)}</th>`).join('') + '</tr>';

    tbody.innerHTML = raw.trim().split('\n').map((line) => {
        const parts = line.split('\t');
        const model = parts[0];
        const values = parts[1].trim().split(/\s+/);
        const cells = values.map((value) => `<td>${Number(value).toFixed(2)}</td>`).join('');
        return `<tr><td class="sticky-col">${model}</td>${cells}</tr>`;
    }).join('');
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
    setupCategoryScores();
    setupLeaderboardTabs();

})

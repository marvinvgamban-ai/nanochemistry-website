/* ============================================
   PARTICLE SYSTEM & CANVAS
   ============================================ */

class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 4;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x - this.radius < 0 || this.x + this.radius > width) {
            this.vx *= -1;
            this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
            this.vy *= -1;
            this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
    }

    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

let particles = [];
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.canvas-container');

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        particles.push(new Particle(x, y, vx, vy));
    }
}

function drawConnections() {
    const maxDistance = 200;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const distance = particles[i].distanceTo(particles[j]);
            if (distance < maxDistance) {
                const opacity = 1 - distance / maxDistance;
                ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
    });

    drawConnections();
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initParticles();
animateParticles();

/* ============================================
   NAVIGATION & HAMBURGER MENU
   ============================================ */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('nav-link-active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('nav-link-active');
        }
    });
});

/* ============================================
   SIZE COMPARISON SLIDER
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeLabel = document.getElementById('sizeLabel');
    const particleDemo = document.getElementById('particleDemo');

    if (sizeSlider && particleDemo) {
        sizeSlider.addEventListener('input', function() {
            const val = parseInt(this.value);
            
            // 1. Update text
            sizeLabel.textContent = val + ' nm';

            // 2. Accurate Scaling
            // We multiply by 2 so it's visible on screens. 
            // At 1nm, width is 2px. At 100nm, width is 200px.
            // The ratio remains mathematically accurate.
            const displaySize = val * 2; 

            // 3. Force the style update
            particleDemo.style.width = displaySize + 'px';
            particleDemo.style.height = displaySize + 'px';
        });

        // Initialize at the current slider value on page load
        sizeSlider.dispatchEvent(new Event('input'));
    }
});

/* ============================================
   SURFACE AREA TO VOLUME RATIO
   ============================================ */

const cubeSlider = document.getElementById('cubeSlider');

cubeSlider.addEventListener('input', (e) => {
    const side = parseFloat(e.target.value);
    const surfaceArea = 6 * side * side;
    const volume = side * side * side;
    const ratio = surfaceArea / volume;

    document.getElementById('sideLength').textContent = side.toFixed(1);
    document.getElementById('surfaceArea').textContent = surfaceArea.toFixed(2);
    document.getElementById('volume').textContent = volume.toFixed(2);
    document.getElementById('ratioValue').textContent = ratio.toFixed(3);
});

// Initialize
cubeSlider.dispatchEvent(new Event('input'));

/* ============================================
   BROWNIAN MOTION SIMULATION
   ============================================ */

const diffusionCanvas = document.getElementById('diffusionCanvas');
const diffusionCtx = diffusionCanvas.getContext('2d');
let diffusionParticles = [];
let isPlaying = false;
let animationId = null;

class DiffusionParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.radius = 8;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        this.vx += (Math.random() - 0.5) * 1;
        this.vy += (Math.random() - 0.5) * 1;

        if (this.x - this.radius < 0 || this.x + this.radius > width) {
            this.vx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
            this.vy *= -1;
        }

        this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 217, 255, 0.8)';
        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initDiffusion() {
    diffusionParticles = [];
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * (diffusionCanvas.width - 40) + 20;
        const y = Math.random() * (diffusionCanvas.height - 40) + 20;
        diffusionParticles.push(new DiffusionParticle(x, y));
    }
}

function drawGrid() {
    const gridSize = 50;
    diffusionCtx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
    diffusionCtx.lineWidth = 1;

    for (let x = 0; x < diffusionCanvas.width; x += gridSize) {
        diffusionCtx.beginPath();
        diffusionCtx.moveTo(x, 0);
        diffusionCtx.lineTo(x, diffusionCanvas.height);
        diffusionCtx.stroke();
    }

    for (let y = 0; y < diffusionCanvas.height; y += gridSize) {
        diffusionCtx.beginPath();
        diffusionCtx.moveTo(0, y);
        diffusionCtx.lineTo(diffusionCanvas.width, y);
        diffusionCtx.stroke();
    }
}

function animateDiffusion() {
    diffusionCtx.fillStyle = 'rgba(15, 15, 46, 0.8)';
    diffusionCtx.fillRect(0, 0, diffusionCanvas.width, diffusionCanvas.height);

    drawGrid();

    diffusionParticles.forEach(particle => {
        particle.update(diffusionCanvas.width, diffusionCanvas.height);
        particle.draw(diffusionCtx);
    });

    if (isPlaying) {
        animationId = requestAnimationFrame(animateDiffusion);
    }
}

function startDiffusion() {
    if (!isPlaying) {
        isPlaying = true;
        document.getElementById('playBtn').textContent = '⏸ Pause';
        animateDiffusion();
    } else {
        isPlaying = false;
        document.getElementById('playBtn').textContent = '▶ Play';
    }
}

function resetDiffusion() {
    isPlaying = false;
    document.getElementById('playBtn').textContent = '▶ Play';
    cancelAnimationFrame(animationId);
    initDiffusion();
    diffusionCtx.fillStyle = 'rgba(15, 15, 46, 0.8)';
    diffusionCtx.fillRect(0, 0, diffusionCanvas.width, diffusionCanvas.height);
    drawGrid();
    diffusionParticles.forEach(particle => particle.draw(diffusionCtx));
}

initDiffusion();
resetDiffusion();

/* ============================================
   VIDEO MODAL
   ============================================ */

const modal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const closeBtn = document.querySelector('.close');

const videoLinks = {
    intro: 'https://www.youtube.com/embed/j_wQgy97Pi4',
    materials: 'https://www.youtube.com/embed/PNElByWIGNc',
    medicine: 'https://www.youtube.com/embed/oSsRdFuHeWQ',
    future: 'https://www.youtube.com/embed/TltwRAhZ6Qk'
};

function playVideo(videoId) {
    if (videoLinks[videoId]) {
        videoFrame.src = videoLinks[videoId] + '?autoplay=1';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeVideo() {
    modal.style.display = 'none';
    videoFrame.src = '';
    document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeVideo);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeVideo();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeVideo();
    }
});

/* ============================================
   QUIZ FUNCTIONALITY
   ============================================ */
const questions = [
    {
        question: "What is the typical size range of nanomaterials?",
        options: ["1 - 100 nm", "100 - 500 nm", "1 - 100 μm", "10 - 1000 nm"],
        correct: 0,
        explanation: "Nanomaterials are 1–100 nm in size."
    },
    {
        question: "Which nanomaterial is a single layer of carbon atoms?",
        options: ["Carbon Nanotube", "Graphene", "Fullerene", "Quantum Dot"],
        correct: 1,
        explanation: "Graphene is a single layer of carbon atoms."
    },
    {
        question: "What happens to surface area as size decreases?",
        options: ["Decreases", "Same", "Increases", "Zero"],
        correct: 2,
        explanation: "Smaller particles have higher surface area-to-volume ratio."
    }
      // Add the rest of your 10 questions following this same format... 
   ];

let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let hasChecked = false;

function loadQuestion() {
    hasChecked = false;
    selectedOptionIndex = null;

    const question = questions[currentQuestionIndex];

    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCount').textContent = currentQuestionIndex + 1;

    document.getElementById('progressFill').style.width =
        ((currentQuestionIndex + 1) / questions.length * 100) + '%';

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });

    // ✅ RESET EXPLANATION
    const explanationBox = document.getElementById('explanationBox');
    explanationBox.textContent = "";
    explanationBox.classList.remove('show');

    document.getElementById('checkBtn').classList.remove('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
}

function selectOption(index) {
    if (hasChecked) return;

    selectedOptionIndex = index;

    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    options[index].classList.add('selected');
}

document.getElementById('checkBtn').addEventListener('click', () => {

    if (selectedOptionIndex === null) {
        alert("Select an answer first!");
        return;
    }

    hasChecked = true;

    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    const explanationBox = document.getElementById('explanationBox');

    if (selectedOptionIndex === question.correct) {
        options[selectedOptionIndex].classList.add('correct');
        score++;
    } else {
        options[selectedOptionIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }

    // ✅ SHOW EXPLANATION
    explanationBox.textContent = question.explanation;
    explanationBox.classList.add('show');

    // ✅ SCORE MESSAGE
    const percentage = (score / questions.length) * 100;

    let message = '';
    if (percentage === 100) {
        message = 'Perfect Score!';
    } else if (percentage >= 80) {
        message = 'Excellent!';
    } else if (percentage >= 60) {
        message = 'Good job!';
    } else {
        message = 'Keep practicing!';
    }

    document.getElementById('scoreMessage').textContent = message;

    document.getElementById('checkBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');
});

document.getElementById('nextBtn').addEventListener('click', () => {

    // ✅ CLEAR EXPLANATION (important)
    const explanationBox = document.getElementById('explanationBox');
    explanationBox.textContent = "";
    explanationBox.classList.remove('show');

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    document.querySelector('.quiz-container').innerHTML = `
        <h2>Quiz Finished!</h2>
        <p>Your score: ${score} / ${questions.length}</p>
    `;
}

// START QUIZ
loadQuestion();

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.about-card, .app-card, .video-card, .gallery-item').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

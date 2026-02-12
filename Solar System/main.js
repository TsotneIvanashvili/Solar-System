 const planets = [
        {
            name: 'Mercury',
            class: 'mercury',
            orbitRadius: 70,
            speed: 4.15,
            size: 8,
            info: 'Smallest planet. Surface temperatures swing from -180C to 430C. A year lasts just 88 Earth days.'
        },
        {
            name: 'Venus',
            class: 'venus',
            orbitRadius: 105,
            speed: 1.62,
            size: 14,
            info: 'Hottest planet at 465C due to runaway greenhouse effect. Rotates backwards compared to most planets.'
        },
        {
            name: 'Earth',
            class: 'earth',
            orbitRadius: 145,
            speed: 1.0,
            size: 16,
            hasMoon: true,
            info: 'Our home. The only known planet with liquid water on the surface and confirmed life.'
        },
        {
            name: 'Mars',
            class: 'mars',
            orbitRadius: 190,
            speed: 0.53,
            size: 12,
            info: 'The Red Planet. Home to Olympus Mons, the tallest volcano in the solar system at 21km high.'
        },
        {
            name: 'Jupiter',
            class: 'jupiter',
            orbitRadius: 260,
            speed: 0.084,
            size: 34,
            info: 'Largest planet. The Great Red Spot is a storm larger than Earth that has raged for centuries.'
        },
        {
            name: 'Saturn',
            class: 'saturn',
            orbitRadius: 330,
            speed: 0.034,
            size: 28,
            hasRing: true,
            info: 'Famous for its rings made of ice and rock. So light it would float in water if you had a big enough bathtub.'
        },
        {
            name: 'Uranus',
            class: 'uranus',
            orbitRadius: 395,
            speed: 0.012,
            size: 20,
            info: 'An ice giant tilted 98 degrees on its side. It essentially rolls around the Sun.'
        },
        {
            name: 'Neptune',
            class: 'neptune',
            orbitRadius: 450,
            speed: 0.006,
            size: 19,
            info: 'Fastest winds in the solar system at 2,100 km/h. Takes 165 years to orbit the Sun.'
        }
    ];

    const solarSystem = document.getElementById('solarSystem');
    const infoPanel = document.getElementById('infoPanel');
    const infoName = document.getElementById('infoName');
    const infoDesc = document.getElementById('infoDesc');
    const speedSlider = document.getElementById('speedSlider');
    const pauseBtn = document.getElementById('pauseBtn');

    let speedMultiplier = 1;
    let paused = false;
    let angles = planets.map(() => Math.random() * 360);

    // Create orbit rings and planet elements
    const planetElements = [];

    planets.forEach((planet, i) => {
        // Orbit ring
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        const d = planet.orbitRadius * 2;
        orbit.style.width = d + 'px';
        orbit.style.height = d + 'px';
        solarSystem.appendChild(orbit);

        // Planet container (for positioning)
        const wrapper = document.createElement('div');
        wrapper.className = 'planet-orbit';
        wrapper.style.width = '0';
        wrapper.style.height = '0';

        // Planet body
        const el = document.createElement('div');
        el.className = 'planet ' + planet.class;
        el.style.width = planet.size + 'px';
        el.style.height = planet.size + 'px';
        el.style.marginLeft = (-planet.size / 2) + 'px';
        el.style.marginTop = (-planet.size / 2) + 'px';

        // Click for info
        el.addEventListener('click', () => showInfo(planet));
        el.addEventListener('mouseenter', () => showInfo(planet));
        el.addEventListener('mouseleave', hideInfo);

        wrapper.appendChild(el);

        // Moon for Earth
        if (planet.hasMoon) {
            const moonOrbit = document.createElement('div');
            moonOrbit.className = 'moon-orbit';
            const moon = document.createElement('div');
            moon.className = 'moon';
            moonOrbit.appendChild(moon);
            wrapper.appendChild(moonOrbit);
        }

        // Saturn ring
        if (planet.hasRing) {
            const ring = document.createElement('div');
            ring.className = 'saturn-ring';
            wrapper.appendChild(ring);
        }

        // Label
        const label = document.createElement('div');
        label.className = 'planet-label';
        label.textContent = planet.name;
        label.style.top = (-planet.size / 2 - 16) + 'px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        wrapper.appendChild(label);

        el.addEventListener('mouseenter', () => label.style.opacity = '1');
        el.addEventListener('mouseleave', () => label.style.opacity = '0');

        solarSystem.appendChild(wrapper);
        planetElements.push({ wrapper, planet });
    });

    // Sun info
    document.getElementById('sun').addEventListener('mouseenter', () => {
        showInfo({
            name: 'Sun',
            info: 'A G-type main-sequence star. Contains 99.86% of the solar system\'s mass. Surface temperature: 5,500C.'
        });
    });
    document.getElementById('sun').addEventListener('mouseleave', hideInfo);

    function showInfo(planet) {
        infoName.textContent = planet.name;
        infoDesc.textContent = planet.info;
        infoPanel.classList.add('visible');
    }

    function hideInfo() {
        infoPanel.classList.remove('visible');
    }

    // Animation loop
    let lastTime = performance.now();

    function animate(time) {
        const dt = (time - lastTime) / 1000;
        lastTime = time;

        if (!paused) {
            planetElements.forEach(({ wrapper, planet }, i) => {
                angles[i] += planet.speed * speedMultiplier * dt * 40;
                const rad = angles[i] * Math.PI / 180;
                const x = Math.cos(rad) * planet.orbitRadius;
                const y = Math.sin(rad) * planet.orbitRadius;
                wrapper.style.transform = `translate(${x}px, ${y}px)`;
            });
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Controls
    speedSlider.addEventListener('input', (e) => {
        speedMultiplier = parseFloat(e.target.value);
    });

    pauseBtn.addEventListener('click', () => {
        paused = !paused;
        pauseBtn.textContent = paused ? 'Play' : 'Pause';
    });

    // Starfield with canvas
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate stars
    const stars = [];
    for (let i = 0; i < 600; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            brightness: Math.random(),
            twinkleSpeed: Math.random() * 2 + 1
        });
    }

    function drawStars(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            const flicker = 0.5 + 0.5 * Math.sin(time * 0.001 * star.twinkleSpeed + star.brightness * 10);
            const alpha = 0.3 + 0.7 * star.brightness * flicker;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(drawStars);
    }

    requestAnimationFrame(drawStars);

    // Falling stars (full-screen canvas)
    const fsCanvas = document.getElementById('fallingStars');
    const fsCtx = fsCanvas.getContext('2d');

    function resizeFsCanvas() {
        fsCanvas.width = window.innerWidth;
        fsCanvas.height = window.innerHeight;
    }
    resizeFsCanvas();
    window.addEventListener('resize', resizeFsCanvas);

    const fallingStars = [];
    const starColors = [
        [255, 255, 255],
        [180, 210, 255],
        [255, 240, 200],
        [200, 180, 255],
    ];

    function spawnFallingStar() {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
        const speed = 300 + Math.random() * 500;
        fallingStars.push({
            x: Math.random() * fsCanvas.width * 1.2 - fsCanvas.width * 0.1,
            y: -10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: 0.6 + Math.random() * 0.8,
            trailLen: 60 + Math.random() * 100,
            size: 1 + Math.random() * 1.5,
            color
        });
    }

    let nextSpawn = 0;

    function drawFallingStars(time) {
        fsCtx.clearRect(0, 0, fsCanvas.width, fsCanvas.height);
        const dt = 1 / 60;

        if (time * 0.001 > nextSpawn) {
            spawnFallingStar();
            nextSpawn = time * 0.001 + 0.3 + Math.random() * 2.5;
        }

        for (let i = fallingStars.length - 1; i >= 0; i--) {
            const s = fallingStars[i];
            s.life += dt;
            s.x += s.vx * dt;
            s.y += s.vy * dt;

            if (s.life > s.maxLife || s.y > fsCanvas.height + 20 || s.x > fsCanvas.width + 20) {
                fallingStars.splice(i, 1);
                continue;
            }

            const progress = s.life / s.maxLife;
            const fade = progress < 0.15 ? progress / 0.15 : 1 - ((progress - 0.15) / 0.85);
            const alpha = Math.max(0, fade);

            const tailX = s.x - (s.vx * dt * s.trailLen * 0.15);
            const tailY = s.y - (s.vy * dt * s.trailLen * 0.15);

            const grad = fsCtx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, 0)`);
            grad.addColorStop(1, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${alpha})`);

            fsCtx.beginPath();
            fsCtx.moveTo(tailX, tailY);
            fsCtx.lineTo(s.x, s.y);
            fsCtx.strokeStyle = grad;
            fsCtx.lineWidth = s.size;
            fsCtx.lineCap = 'round';
            fsCtx.stroke();

            // Glow at the head
            fsCtx.beginPath();
            fsCtx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
            fsCtx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${alpha * 0.4})`;
            fsCtx.fill();
        }

        requestAnimationFrame(drawFallingStars);
    }

    requestAnimationFrame(drawFallingStars);

    // Resize star positions on window resize
    window.addEventListener('resize', () => {
        stars.forEach(star => {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
        });
    });

    // Zoom & Pan state
    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;
    const minZoom = 0.55;
    const maxZoom = 4;

    function applyTransform() {
        solarSystem.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    }

    // Smooth scroll zoom toward mouse — re-centers when zooming out
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const oldZoom = zoomLevel;
        const zoomingIn = e.deltaY < 0;

        if (zoomingIn) {
            zoomLevel = Math.min(maxZoom, zoomLevel + zoomSpeed * zoomLevel);
        } else {
            zoomLevel = Math.max(minZoom, zoomLevel - zoomSpeed * zoomLevel);
        }

        if (zoomingIn) {
            // Zoom toward mouse cursor
            const vcx = window.innerWidth / 2;
            const vcy = window.innerHeight / 2;
            const mouseX = e.clientX - vcx;
            const mouseY = e.clientY - vcy;
            const worldX = (mouseX - panX) / oldZoom;
            const worldY = (mouseY - panY) / oldZoom;
            panX = mouseX - worldX * zoomLevel;
            panY = mouseY - worldY * zoomLevel;
        } else {
            // Ease pan back toward center when zooming out
            const ease = Math.max(0, 1 - (zoomLevel - minZoom) / (1 - minZoom));
            const centerPull = 0.25 + ease * 0.75;
            panX *= (1 - centerPull);
            panY *= (1 - centerPull);
            // Snap to center once close enough or at/below default zoom
            if (zoomLevel <= 1.05) {
                panX = 0;
                panY = 0;
            }
        }

        applyTransform();
    }, { passive: false });

    // Mouse drag to pan
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragPanStartX = 0;
    let dragPanStartY = 0;

    window.addEventListener('mousedown', (e) => {
        if (e.target.closest('.controls') || e.target.closest('.info-panel')) return;
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragPanStartX = panX;
        dragPanStartY = panY;
        solarSystem.classList.add('dragging');
        // Disable transition during drag for instant feedback
        solarSystem.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = dragPanStartX + (e.clientX - dragStartX);
        panY = dragPanStartY + (e.clientY - dragStartY);
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        solarSystem.classList.remove('dragging');
        // Restore smooth transition
        solarSystem.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    });

    // Loading screen
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1800);
    });
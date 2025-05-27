document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('mainContainer');
    const particleContainer = document.getElementById('particle-container');
    const sakuraCanvas = document.getElementById('sakuraCanvas');
    const ctx = sakuraCanvas.getContext('2d');

    const funnyQuoteElement = document.getElementById('funnyQuote');
    const nextQuoteBtn = document.getElementById('nextQuoteBtn');

    // --- Colores desde las variables CSS ---
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    let petalColor = getCssVar('--petal-color');
    let petalOutlineColor = getCssVar('--petal-outline-color');

    // Array con los nuevos colores para los corazones al hacer clic
    const clickHeartColors = [
        getCssVar('--click-heart-color-1'),
        getCssVar('--click-heart-color-2'),
        getCssVar('--click-heart-color-3'),
        getCssVar('--click-heart-color-4'),
        getCssVar('--click-heart-color-5'),
        getCssVar('--click-heart-color-6')
    ];

    // Optimización de rendimiento para dispositivos móviles
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const maxPetals = isMobile ? 50 : 100; // Reducir pétalos en móviles

    // Throttling para eventos de mouse
    let lastMouseMove = 0;
    const throttleDelay = 16; // ~60fps

    // Función para redimensionar todos los canvas
    function resizeCanvases() {
        sakuraCanvas.width = window.innerWidth;
        sakuraCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvases);


    // --- Animación de Pétalos Cayendo ---
    const petals = [];
    let animationFrameId = null;

    class Petal {
        constructor(x, y, size, angle, rotationSpeed, windStrength, swaySpeed, swayAmplitude) {
            this.x = x;
            this.y = y;
            this.initialX = x; // Para el efecto de oscilación
            this.size = size;
            this.angle = angle;
            this.rotationSpeed = rotationSpeed;
            this.velocityY = Math.random() * 0.5 + 0.2; // Velocidad de caída más variada y lenta
            this.windStrength = Math.random() * 0.5 + 0.1; // Fuerza del viento variada
            this.swaySpeed = Math.random() * 0.8 + 0.3; // Velocidad de oscilación más variada
            this.swayAmplitude = Math.random() * 40 + 15; // Amplitud de oscilación más variada
            this.swayOffset = Math.random() * Math.PI * 2; // Fase de oscilación aleatoria
            this.opacity = Math.random() * 0.5 + 0.5; // Opacidad inicial variada
            this.fadeSpeed = Math.random() * 0.005 + 0.002; // Velocidad de desvanecimiento más lenta y variada

            // Propiedades para un movimiento más natural
            this.drag = 0.98; // Fricción del aire
            this.angularVelocity = Math.random() * 0.05 - 0.025; // Velocidad angular para rotación
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity; // Usar la opacidad calculada

            // Dibujar una forma de pétalo más detallada (ejemplo simple)
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
            ctx.closePath();

            ctx.fillStyle = petalColor;
            ctx.fill();
            ctx.strokeStyle = petalOutlineColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
            ctx.globalAlpha = 1; // Restablecer la opacidad global
        }

        update() {
            // Aplicar fuerza del viento (horizontal)
            const wind = Math.sin(Date.now() * 0.0005) * this.windStrength;
            this.x += wind;

            // Aplicar gravedad y fricción (vertical)
            this.velocityY += 0.01; // Gravedad simulada
            this.velocityY *= this.drag;
            this.y += this.velocityY;

            // Aplicar oscilación (sway)
            this.x = this.initialX + Math.sin(this.swayOffset + Date.now() * 0.001 * this.swaySpeed) * this.swayAmplitude;

            // Aplicar rotación
            this.angularVelocity *= this.drag; // Fricción en la rotación
            this.angle += this.angularVelocity;

            // Desvanecer con el tiempo
            this.opacity -= this.fadeSpeed;
            if (this.opacity < 0) this.opacity = 0;

            // Reiniciar si sale de la pantalla o se desvanece completamente
            if (this.y > sakuraCanvas.height + this.size * 2 || this.opacity <= 0) {
                this.reset();
            }
        }

        reset() {
            this.x = Math.random() * sakuraCanvas.width;
            this.y = -Math.random() * sakuraCanvas.height * 0.5; // Aparecer más arriba
            this.initialX = this.x;
            this.size = Math.random() * 10 + 5; // Tamaño más variado
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.03 - 0.015); // Velocidad de rotación más variada
            this.velocityY = Math.random() * 0.5 + 0.2;
            this.windStrength = Math.random() * 0.5 + 0.1;
            this.swaySpeed = Math.random() * 0.8 + 0.3;
            this.swayAmplitude = Math.random() * 40 + 15;
            this.swayOffset = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;

            this.angularVelocity = Math.random() * 0.05 - 0.025;
        }
    }

    function initPetals() {
        for (let i = 0; i < maxPetals; i++) {
            const petal = new Petal(0, 0, 0, 0, 0, 0, 0, 0);
            petal.reset();
            petals.push(petal);
        }
    }

    function animatePetals() {
        ctx.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height);
        petals.forEach(petal => {
            petal.update();
            petal.draw(ctx);
        });
        animationFrameId = requestAnimationFrame(animatePetals);
    }


    // --- Lógica de Frases Graciosas y Consejos de Mamá Latina ---
    const funnyQuotes = [
        "Consejo de Mamá: 'Señor, dame paciencia, porque si me das fuerza... ¡los mato!'",
        "Humor de Mamá: '¿Te vas a ir así? ¡No te has puesto el suéter!' (Aunque haga calor)",
        "Recomendación: 'Mientras vivas bajo este techo, ¡mis reglas! Cuando tengas tu casa, mandas tú.'",
        "Sabiduría de Mamá: 'Cuando tengas hijos, te vas a acordar de mí. ¡Y vas a entenderlo todo!'",
        "Consejo Vital: 'No estás haciendo nada y te cansas. Si de verdad te pones a hacer algo, ¡qué te pasará!'",
        "Verdad de Mamá: 'Te eduqué para ser independiente, ¡no para que vivas en tu mundo de fantasía todo el día!'",
        "Humor de Mamá: 'Busca ese coso que está en... ¡ahí! ¡Sí, ahí mismo! Yo insisto que está ahí, pero nunca lo encuentras.'",
        "Recomendación: '¿Y la ropa limpia? ¿Y ese cuarto que parece zona de guerra?'",
        "Consejo de vida: 'El día que pagues tus propias cuentas, entenderás por qué apago las luces que dejas encendidas.'",
        "Sabiduría para la vida: '¡En esta casa no es un hotel, es tu hogar! Y los servicios se pagan.'",
        "Humor de Mamá: '¿Me vas a ayudar o vas a seguir haciendo la pose de 'pensador' en el sofá?'",
        "Recomendación: '¡Y no me contestes! Que soy tu madre y punto. (Aunque a veces me equivoque).'",
        "Consejo de Mamá: 'No importa la edad que tengas, para mí siempre serás mi bebé... ¡pero ese plato no se va a lavar solo!'",
        "Consejo clave: 'No te pido que hagas las cosas, ¡te pido que las termines y que queden bien a la primera!'",
        "Humor de Mamá: 'Ya sé que eres grande, pero ¿ya comiste? ¿Tienes frío? ¿Te pusiste el gorro? ¿No andas descalzo?'",
        "Recomendación: '¿Vas a salir con esa facha? ¡Qué dirán de mí si te ven así!'",
        "Verdad de Mamá: 'Mi vida es un constante: '¿Qué buscas?' y '¡Está ahí, donde siempre lo dejo!'",
        "Sabiduría para la prosperidad: 'Lo que no sirve, se bota. Incluida la pereza. ¡A ponerle ganas a la vida!'",
        "Consejo Universal: '¡Qué Dios te bendiga! Y pórtate bien. Y me llamas cuando llegues, ¿eh? ¡Y me avisas si vas a tardar!'",
        "Humor de Mamá: 'Si no me vas a ayudar, al menos no estorbes. Y si vas a estorbar, ¡que sea trayendo un café y una galleta!'",
        "Recomendación: 'No dejes para mañana lo que puedes hacer hoy... ¡especialmente si es tender tu cama!'",
        "La ley de Mamá: 'Si abres la refri y no te gusta lo que hay, ¡cierra y ábrela de nuevo como si fuera a aparecer un banquete!'",
        "Consejo de Mamá: '¡No me hagas que vaya yo! Porque si voy yo, ¡encuentro hasta lo que no se había perdido!'"
    ];

    let currentQuoteIndex = 0;

    function displayNextQuote() {
        funnyQuoteElement.style.opacity = '0';
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % funnyQuotes.length;
            funnyQuoteElement.textContent = funnyQuotes[currentQuoteIndex];
            funnyQuoteElement.style.opacity = '1';
        }, 500);
    }

    funnyQuoteElement.textContent = funnyQuotes[currentQuoteIndex];
    
    nextQuoteBtn.addEventListener('click', displayNextQuote);


    // --- Funciones para partículas al mover el cursor y corazones al clic ---

    function createTrailHeart(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('sakura-petal');
        particleContainer.appendChild(particle);

        // Tamaño para los pétalos de sakura (más alargados y sutiles)
        const width = Math.random() * 10 + 15; // Entre 15px y 25px de ancho
        const height = width * 1.5; // Altura proporcional para forma de pétalo
        particle.style.width = `${width}px`;
        particle.style.height = `${height}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Colores más tenues y naturales para los pétalos de sakura del rastro
        const trailPetalColors = [
            'rgba(255, 182, 193, 0.6)', // Sakura pink clásico tenue
            'rgba(255, 150, 170, 0.55)', // Sakura pink profundo tenue
            'rgba(255, 130, 150, 0.5)',  // Sakura pink oscuro tenue
            'rgba(255, 160, 180, 0.55)', // Sakura pink medio tenue
            'rgba(255, 170, 190, 0.6)',  // Sakura pink claro tenue
            'rgba(255, 140, 160, 0.5)'   // Sakura pink intenso tenue
        ];
        const randomColor = trailPetalColors[Math.floor(Math.random() * trailPetalColors.length)];
        particle.style.backgroundColor = randomColor;
        particle.style.boxShadow = `0 0 15px ${randomColor}`;

        // Movimiento más natural para pétalos
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1; // Velocidad más suave y lenta
        const lifespan = Math.random() * 2500 + 1500; // Menor duración para que desaparezcan más rápido

        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;

        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.setProperty('--lifespan', `${lifespan}ms`);

        // Rotación inicial aleatoria
        const rotation = Math.random() * 360;
        particle.style.transform = `rotate(${rotation}deg)`;

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // Efecto de clic con pétalos de sakura
    document.addEventListener('click', (e) => {
        const numPetals = 20 + Math.floor(Math.random() * 15); // Entre 20 y 34 pétalos
        // Paleta de colores variada para el clic (puedes ajustar estos si quieres más variedad)
        const clickPetalColors = [
            'rgba(255, 105, 180, 0.7)', // Hot pink
            'rgba(255, 20, 147, 0.7)',  // Deep pink
            'rgba(255, 192, 203, 0.8)', // Pink pastel
            'rgba(255, 165, 0, 0.6)',   // Orange (for contrast, adjust opacity)
            'rgba(238, 130, 238, 0.7)', // Violet
            'rgba(255, 99, 71, 0.6)',   // Tomato (for contrast, adjust opacity)
            'rgba(255, 182, 193, 0.8)', // Light pink (más opaco)
            'rgba(218, 112, 214, 0.7)', // Orchid
            'rgba(199, 21, 133, 0.8)'   // Medium violet red
        ];

        for (let i = 0; i < numPetals; i++) {
            const offsetX = (Math.random() - 0.5) * 120; // Mayor dispersión
            const offsetY = (Math.random() - 0.5) * 120; // Mayor dispersión
            const petal = document.createElement('div');
            petal.classList.add('sakura-petal');
            particleContainer.appendChild(petal);

            // Tamaño más grande para el efecto de clic (pero ajustado para sutilidad)
            const width = Math.random() * 15 + 20; // Entre 20px y 35px de ancho
            const height = width * 1.5; // Altura proporcional
            petal.style.width = `${width}px`;
            petal.style.height = `${height}px`;
            petal.style.left = `${e.clientX + offsetX}px`;
            petal.style.top = `${e.clientY + offsetY}px`;

            const randomColor = clickPetalColors[Math.floor(Math.random() * clickPetalColors.length)];
            petal.style.backgroundColor = randomColor;
            petal.style.boxShadow = `0 0 20px ${randomColor}`;

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2; // Velocidad variada
            const lifespan = Math.random() * 3000 + 2000; // Duración variada

            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;

            petal.style.setProperty('--dx', `${dx}px`);
            petal.style.setProperty('--dy', `${dy}px`);
            petal.style.setProperty('--lifespan', `${lifespan}ms`);

            // Rotación inicial aleatoria
            const rotation = Math.random() * 360;
            petal.style.transform = `rotate(${rotation}deg)`;

            petal.addEventListener('animationend', () => {
                petal.remove();
            });
        }
    });

    // Función de throttling
    function throttle(callback, delay) {
        return function(...args) {
            const now = Date.now();
            if (now - lastMouseMove >= delay) {
                callback.apply(this, args);
                lastMouseMove = now;
            }
        };
    }

    // Manejo del tema
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('gold-theme');
        // Actualizar colores después del cambio de tema
        petalColor = getCssVar('--petal-color');
        petalOutlineColor = getCssVar('--petal-outline-color');
    });

    // Throttling para eventos de mouse
    const throttledMouseMove = throttle((e) => {
        if (Math.random() > 0.2) { // 80% de probabilidad de crear un pétalo
            createTrailHeart(e.clientX, e.clientY);
        }
    }, 30); // Más lento para mejor rendimiento

    document.addEventListener('mousemove', throttledMouseMove);

    // Mejora de la accesibilidad del teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement === nextQuoteBtn) {
                displayNextQuote();
            } else if (activeElement === themeToggle) {
                themeToggle.click();
            }
        }
    });

    // Iniciar todos los canvas y animaciones al cargar la página
    resizeCanvases(); // Redimensiona los canvas
    initPetals();
    animatePetals();
});
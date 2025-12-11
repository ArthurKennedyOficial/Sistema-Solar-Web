// =============================================
// CONFIGURAÇÃO - MODIFIQUE AQUI
// =============================================

const CONFIG = {
    // CONFIGURAÇÃO DE TEXTURAS - Altere os caminhos para suas imagens
    textures: {
        sun: 'assets/textures/sun.jpg',
        mercury: 'assets/textures/mercury.jpg',
        venus: 'assets/textures/venus.jpg',
        earth: 'assets/textures/earth.jpg',
        mars: 'assets/textures/mars.jpg',
        jupiter: 'assets/textures/jupiter.jpg',
        saturn: 'assets/textures/saturn.jpg',
        saturnRing: 'assets/textures/saturn_ring.png',
        uranus: 'assets/textures/uranus.jpg',
        neptune: 'assets/textures/neptune.jpg'
    },
    
    // CONFIGURAÇÃO DE ÁUDIOS - Altere os URLs para seus arquivos de áudio
    audios: {
        background: 'assets/sounds/background.mp3',
        planetSelect: '',
        curiosity: 'assets/sounds/curiosity-open.mp3'
    },
    
    // CONFIGURAÇÃO DO SISTEMA SOLAR
    solarSystem: {
        baseOrbitSpeed: 0.00005,   // Velocidade base das órbitas (100x mais rápido que antes)
        baseRotationSpeed: 0.001,  // Velocidade base das rotações
        showLabels: false          // Nomes dos planetas desativados
    },
    
    // CURIOSIDADES SOBRE INTERESTELAR
    curiosities: {
        sun: "No filme Interestelar, a estrela Gargantua é um buraco negro supermassivo. Os efeitos visuais foram baseados em equações da relatividade geral de Einstein, resultando em uma das representações mais precisas já criadas.",
        mercury: "A dilatação temporal mostrada em Interestelar ocorre perto de objetos massivos. Em Mercúrio, o efeito é mínimo, mas próximo de Gargantua, uma hora equivalia a 7 anos na Terra.",
        venus: "A atmosfera densa de Vênus lembra as nuvens geladas do planeta Mann em Interestelar. No filme, os planetas gelados representavam a luta pela sobrevivência em condições extremas.",
        earth: "A Terra em Interestelar sofre com crises agrícolas. O milho é a última cultura sobrevivente, simbolizando a resiliência da vida - tema central do filme.",
        mars: "A paisagem árida de Marte reflete a Terra morrendo em Interestelar. A busca por um novo lar impulsiona a missão da nave Endurance.",
        jupiter: "A gravidade de Júpiter é usada como 'estilingue' em missões espaciais reais. Em Interestelar, a nave usa buracos de minhoca para viagens interestelares - conceito teórico na física.",
        saturn: "Saturno é onde o buraco de minhoca aparece em Interestelar. Os anéis simbolizam os ciclos do tempo, tema central do filme.",
        uranus: "Urano gira de lado, diferente dos outros planetas. Em Interestelar, a nave Endurance precisa se adaptar a diferentes ambientes planetários para sobreviver.",
        neptune: "Netuno, o planeta mais distante, representa a fronteira final. Interestelar explora o conceito de que a humanidade não foi feita para morrer na Terra."
    }
};

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================

let scene, camera, renderer, controls;
let solarSystem;
let planets = {};
let selectedPlanet = null;
let isAudioEnabled = false;
let speedMultiplier = 0.5; // Começa em 50%

// Elementos DOM
const solarSystemContainer = document.getElementById('solarSystem');
const curiosityModal = document.getElementById('curiosityModal');
const planetTitle = document.getElementById('planetTitle');
const curiosityText = document.getElementById('curiosityText');
const closeBtn = document.querySelector('.close-btn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

// Elementos de áudio
const backgroundAudio = document.getElementById('backgroundAudio');
const planetSelectSound = document.getElementById('planetSelectSound');
const curiositySound = document.getElementById('curiositySound');

// Controles
const resetViewBtn = document.getElementById('resetView');
const toggleAudioBtn = document.getElementById('toggleAudio');
const helpBtn = document.getElementById('helpBtn');

// =============================================
// INICIALIZAÇÃO PRINCIPAL
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Sistema Solar Interestelar...");
    init();
});

function init() {
    // Configurar áudios com URLs do CONFIG
    setupAudio();
    
    // Inicializar Three.js
    initThreeJS();
    
    // Criar sistema solar com texturas
    createSolarSystem();
    
    // Configurar eventos
    setupEventListeners();
    
    // Iniciar animação
    animate();
    
    console.log("✅ Sistema Solar Interestelar inicializado!");
}

// =============================================
// CONFIGURAÇÃO THREE.JS
// =============================================

function initThreeJS() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 40, 150);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    solarSystemContainer.appendChild(renderer.domElement);
    
    // Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.rotateSpeed = 0.3;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI;
    
    // Luzes
    const ambientLight = new THREE.AmbientLight(0x222233);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);
    
    // Redimensionamento da janela
    window.addEventListener('resize', onWindowResize);
}

// =============================================
// CRIAÇÃO DO SISTEMA SOLAR COM TEXTURAS
// =============================================

function createSolarSystem() {
    solarSystem = new THREE.Group();
    scene.add(solarSystem);
    
    createSun();
    createPlanets();
}

function createSun() {
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
        CONFIG.textures.sun,
        // Sucesso
        (texture) => {
            console.log("✅ Textura do Sol carregada");
            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                emissive: 0xff6600,
                emissiveIntensity: 0.3
            });
            
            const sun = new THREE.Mesh(geometry, material);
            finishSunCreation(sun);
        },
        // Progresso
        undefined,
        // Erro
        (error) => {
            console.warn("⚠️ Erro ao carregar textura do Sol, usando cor sólida");
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xffff00,
                emissive: 0xff6600,
                emissiveIntensity: 0.3
            });
            
            const sun = new THREE.Mesh(geometry, material);
            finishSunCreation(sun);
        }
    );
}

function finishSunCreation(sun) {
    sun.userData = { 
        type: 'sun', 
        name: 'Sol',
        rotationSpeed: 0.0005
    };
    
    solarSystem.add(sun);
    planets.sun = sun;
    
    // Luz do sol
    const sunLight = new THREE.PointLight(0xffffaa, 1, 300);
    sun.add(sunLight);
    
    // Marcador de curiosidade
    addCuriosityMarker(sun, 'sun');
}

function createPlanets() {
    // Dados dos planetas com velocidades orbitais ajustadas (100x mais rápido que a versão anterior)
    const planetData = [
        { name: 'mercury', radius: 1.5, distance: 30, orbitSpeedMultiplier: 4.0, rotationSpeedMultiplier: 1.5, label: 'Mercúrio' },
        { name: 'venus', radius: 3.8, distance: 45, orbitSpeedMultiplier: 1.5, rotationSpeedMultiplier: 0.9, label: 'Vênus' },
        { name: 'earth', radius: 4, distance: 60, orbitSpeedMultiplier: 1.0, rotationSpeedMultiplier: 1.0, label: 'Terra' },
        { name: 'mars', radius: 2.5, distance: 75, orbitSpeedMultiplier: 0.8, rotationSpeedMultiplier: 0.9, label: 'Marte' },
        { name: 'jupiter', radius: 9, distance: 105, orbitSpeedMultiplier: 0.2, rotationSpeedMultiplier: 2.5, label: 'Júpiter' },
        { name: 'saturn', radius: 8, distance: 135, orbitSpeedMultiplier: 0.09, rotationSpeedMultiplier: 2.0, label: 'Saturno' },
        { name: 'uranus', radius: 6, distance: 165, orbitSpeedMultiplier: 0.04, rotationSpeedMultiplier: 1.3, label: 'Urano' },
        { name: 'neptune', radius: 6, distance: 195, orbitSpeedMultiplier: 0.01, rotationSpeedMultiplier: 1.4, label: 'Netuno' }
    ];
    
    const textureLoader = new THREE.TextureLoader();
    
    planetData.forEach((data, index) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // Carregar textura do planeta
        textureLoader.load(
            CONFIG.textures[data.name],
            // Sucesso
            (texture) => {
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.8,
                    metalness: 0.2
                });
                
                const planet = new THREE.Mesh(geometry, material);
                setupPlanet(planet, data, index);
            },
            // Progresso
            undefined,
            // Erro
            (error) => {
                console.warn(`⚠️ Erro ao carregar textura de ${data.name}, usando cor sólida`);
                const material = new THREE.MeshStandardMaterial({
                    color: getPlanetColor(data.name),
                    roughness: 0.8,
                    metalness: 0.2
                });
                
                const planet = new THREE.Mesh(geometry, material);
                setupPlanet(planet, data, index);
            }
        );
    });
}

function setupPlanet(planet, data, index) {
    const angle = (index / 8) * Math.PI * 2;
    planet.position.x = Math.cos(angle) * data.distance;
    planet.position.z = Math.sin(angle) * data.distance;
    
    planet.userData = {
        type: 'planet',
        name: data.name,
        displayName: data.label,
        orbitSpeed: CONFIG.solarSystem.baseOrbitSpeed * data.orbitSpeedMultiplier,
        rotationSpeed: CONFIG.solarSystem.baseRotationSpeed * data.rotationSpeedMultiplier,
        originalDistance: data.distance,
        angle: angle,
        initialRotation: Math.random() * Math.PI * 2
    };
    
    solarSystem.add(planet);
    planets[data.name] = planet;
    
    // Adicionar marcador de curiosidade
    addCuriosityMarker(planet, data.name);
    
    // Anéis de Saturno
    if (data.name === 'saturn') {
        const textureLoader = new THREE.TextureLoader();
        const ringGeometry = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.2, 32);
        
        textureLoader.load(
            CONFIG.textures.saturnRing,
            // Sucesso
            (texture) => {
                const ringMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                planet.add(ring);
            },
            // Erro
            (error) => {
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffdd99,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.6
                });
                
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                planet.add(ring);
            }
        );
    }
}

function getPlanetColor(planetName) {
    const colors = {
        mercury: 0x8c7853,
        venus: 0xffaa66,
        earth: 0x2266cc,
        mars: 0xff3300,
        jupiter: 0xffcc99,
        saturn: 0xffdd99,
        uranus: 0x99ffff,
        neptune: 0x4d4dff
    };
    return colors[planetName] || 0x888888;
}

function addCuriosityMarker(planet, planetName) {
    const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3
    });
    
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.y = planet.geometry.parameters.radius + 1;
    marker.userData = {
        type: 'marker',
        planet: planetName,
        isMarker: true
    };
    
    planet.add(marker);
    planet.userData.marker = marker;
}

// =============================================
// ANIMAÇÃO COM CONTROLE DE VELOCIDADE
// =============================================

let lastTime = 0;

function animate(currentTime = 0) {
    requestAnimationFrame(animate);
    
    const deltaTime = Math.min(currentTime - lastTime, 100);
    lastTime = currentTime;
    
    // Aplicar animações com velocidade controlada pelo slider
    Object.values(planets).forEach(body => {
        if (!body || !body.userData) return;
        
        // Rotação do corpo
        if (body.userData.rotationSpeed) {
            body.rotation.y += body.userData.rotationSpeed * speedMultiplier * deltaTime;
        }
        
        // Animação do marcador
        if (body.userData.marker) {
            const marker = body.userData.marker;
            marker.rotation.y += 0.001 * speedMultiplier * deltaTime;
            
            // Pulsação suave
            const pulse = Math.sin(currentTime * 0.001) * 0.1 + 1;
            marker.scale.set(pulse, pulse, pulse);
        }
        
        // Movimento orbital
        if (body.userData.type === 'planet' && body.userData.orbitSpeed) {
            const newAngle = body.userData.angle + (body.userData.orbitSpeed * speedMultiplier * deltaTime);
            
            body.position.x = Math.cos(newAngle) * body.userData.originalDistance;
            body.position.z = Math.sin(newAngle) * body.userData.originalDistance;
            
            body.userData.angle = newAngle;
        }
    });
    
    // Atualizar controles e renderizar
    controls.update();
    renderer.render(scene, camera);
}

// =============================================
// INTERAÇÕES
// =============================================

function setupEventListeners() {
    // Clique em objetos 3D
    renderer.domElement.addEventListener('click', onObjectClick, false);
    
    // Modal
    closeBtn.addEventListener('click', () => {
        curiosityModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === curiosityModal) {
            curiosityModal.style.display = 'none';
        }
    });
    
    // Controles
    resetViewBtn.addEventListener('click', resetView);
    toggleAudioBtn.addEventListener('click', toggleAudio);
    helpBtn.addEventListener('click', showHelp);
    
    // Controle de velocidade
    speedSlider.addEventListener('input', function() {
        speedMultiplier = this.value / 100;
        speedValue.textContent = this.value + '%';
    });
    
    // Iniciar áudio com primeiro clique
    document.addEventListener('click', initAudio, { once: true });
}

function onObjectClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const clickableObjects = [];
    Object.values(planets).forEach(planet => {
        if (planet) {
            clickableObjects.push(planet);
            if (planet.userData.marker) {
                clickableObjects.push(planet.userData.marker);
            }
        }
    });
    
    const intersects = raycaster.intersectObjects(clickableObjects, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        if (clickedObject.userData.isMarker) {
            openCuriosity(clickedObject.userData.planet);
            
            // Efeito visual
            clickedObject.material.color.setHex(0xff00ff);
            setTimeout(() => {
                clickedObject.material.color.setHex(0x00ffff);
            }, 300);
            
            // Som
            if (isAudioEnabled) {
                curiositySound.currentTime = 0;
                curiositySound.play().catch(e => console.log("Erro de áudio:", e));
            }
            
        } else if (clickedObject.userData.type === 'planet' || clickedObject.userData.type === 'sun') {
            selectPlanet(clickedObject);
            
            // Som
            if (isAudioEnabled) {
                planetSelectSound.currentTime = 0;
                planetSelectSound.play().catch(e => console.log("Erro de áudio:", e));
            }
        }
    }
}

function selectPlanet(planet) {
    if (selectedPlanet === planet) {
        selectedPlanet = null;
        controls.target.set(0, 0, 0);
        controls.maxDistance = 500;
    } else {
        selectedPlanet = planet;
        
        const planetSize = planet.geometry.parameters.radius;
        const zoomDistance = planetSize * 8;
        
        const cameraPosition = planet.position.clone();
        cameraPosition.x += zoomDistance * 0.8;
        cameraPosition.y += zoomDistance * 0.4;
        cameraPosition.z += zoomDistance;
        
        controls.target.copy(planet.position);
        camera.position.copy(cameraPosition);
        
        controls.maxDistance = zoomDistance * 2;
    }
}

function openCuriosity(planetName) {
    const planetNames = {
        'sun': 'Sol',
        'mercury': 'Mercúrio',
        'venus': 'Vênus',
        'earth': 'Terra',
        'mars': 'Marte',
        'jupiter': 'Júpiter',
        'saturn': 'Saturno',
        'uranus': 'Urano',
        'neptune': 'Netuno'
    };
    
    planetTitle.textContent = planetNames[planetName];
    curiosityText.textContent = CONFIG.curiosities[planetName];
    curiosityModal.style.display = 'block';
}

// =============================================
// CONTROLES E CONFIGURAÇÃO DE ÁUDIO
// =============================================

function setupAudio() {
    // Configurar as fontes de áudio com base no CONFIG
    if (CONFIG.audios.background) {
        backgroundAudio.src = CONFIG.audios.background;
    }
    
    if (CONFIG.audios.planetSelect) {
        planetSelectSound.src = CONFIG.audios.planetSelect;
    }
    
    if (CONFIG.audios.curiosity) {
        curiositySound.src = CONFIG.audios.curiosity;
    }
    
    // Configurar volumes
    backgroundAudio.volume = 0.2;
    planetSelectSound.volume = 0.4;
    curiositySound.volume = 0.5;
}

function initAudio() {
    if (!isAudioEnabled) {
        backgroundAudio.play()
            .then(() => {
                isAudioEnabled = true;
                updateAudioUI();
            })
            .catch(error => {
                console.log("Áudio requer interação do usuário");
            });
    }
}

function toggleAudio() {
    if (isAudioEnabled) {
        backgroundAudio.pause();
        isAudioEnabled = false;
    } else {
        backgroundAudio.play()
            .then(() => {
                isAudioEnabled = true;
            })
            .catch(error => {
                alert("Clique em qualquer lugar da página para ativar o áudio primeiro.");
            });
    }
    updateAudioUI();
}

function updateAudioUI() {
    const icon = toggleAudioBtn.querySelector('i');
    if (isAudioEnabled) {
        icon.className = 'fas fa-volume-up';
        toggleAudioBtn.classList.add('active');
    } else {
        icon.className = 'fas fa-volume-mute';
        toggleAudioBtn.classList.remove('active');
    }
}

function resetView() {
    selectedPlanet = null;
    camera.position.set(0, 40, 150);
    controls.target.set(0, 0, 0);
    controls.maxDistance = 500;
    controls.update();
}

function showHelp() {
    alert("SISTEMA SOLAR INTERESTELAR\n\n" +
          "COMO USAR:\n" +
          "• Clique em um PLANETA para dar zoom\n" +
          "• Clique no MARCADOR AZUL para ver curiosidades sobre o filme Interestelar\n" +
          "• Use o MOUSE para rotacionar a câmera\n" +
          "• Use a RODA DO MOUSE para fazer zoom\n" +
          "• Use a BARRA DE VELOCIDADE para ajustar a velocidade das órbitas (0% a 100%)\n\n" +
          "CONTROLES:\n" +
          "🌍 Resetar vista\n" +
          "🔊 Ligar/desligar som\n" +
          "🚀 Controlar velocidade\n" +
          "❓ Ajuda");
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}


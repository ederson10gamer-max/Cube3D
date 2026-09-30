// 1. Seleção dos nós do DOM
const cubo = document.querySelector('.cubo');
const hudFps = document.querySelector('#debug-fps');
const hudRotX = document.querySelector('#debug-rot-x');
const hudRotY = document.querySelector('#debug-rot-y');
const hudStatus = document.querySelector('#debug-status');
// Sincronizado para bater exatamente com o ID do botão no HTML
const botao = document.querySelector('#btn-auto-rotate'); 

// 2. Estados de Orientação Angular Globais
let anguloX = -20;
let anguloY = 30;
let beRotate = false; // Estado que dita se a rotação automática está ativa

// 3. Estados de Controle de Interação (Mouse e Touch)
let isInteracting = false;
let previousX = 0;
let previousY = 0;

// 4. Telemetria de Performance (Cálculo de FPS)
let ultimoCarimboTempo = performance.now();
let framesAcumulados = 0;
let tempoAcumulado = 0;

/**
 * MOTOR DE LOOP DE RENDERIZAÇÃO (Centralizador de Estado)
 */
function cicloPrincipal(tempoAtual) {
    const deltaTime = tempoAtual - ultimoCarimboTempo;
    ultimoCarimboTempo = tempoAtual;

    tempoAcumulado += deltaTime;
    framesAcumulados++;

    if (tempoAcumulado >= 1000) {
        hudFps.textContent = framesAcumulados;
        framesAcumulados = 0;
        tempoAcumulado = 0;
    }

    // INTERAÇÃO AUTOMÁTICA: Incrementa os ângulos apenas se o botão permitir E o usuário não estiver arrastando
    if (beRotate && !isInteracting) {
        anguloY += 0.5; // Rotação automatica constante no eixo Y
    }

    // MUTAÇÃO VISUAL ÚNICA: O DOM é atualizado aqui uma vez por frame de forma otimizada
    cubo.style.transform = `rotateX(${anguloX}deg) rotateY(${anguloY}deg)`;

    // Atualização do HUD de Debug
    hudRotX.textContent = `${Math.round(anguloX)}°`;
    hudRotY.textContent = `${Math.round(anguloY)}°`;
    hudStatus.textContent = isInteracting ? "Interagindo" : (beRotate ? "Auto-Rodando" : "Estático");

    requestAnimationFrame(cicloPrincipal);
}
requestAnimationFrame(cicloPrincipal);

/**
 * INTERRUPTOR DA ROTAÇÃO AUTOMÁTICA
 */
botao.addEventListener('click', () => {
    beRotate = !beRotate; // Inversão de estado lógico (Toggle)
});

/**
 * IMPLEMENTAÇÃO: MOUSE EVENTS (DESKTOP)
 */
window.addEventListener('mousedown', (e) => {
    isInteracting = true;
    previousX = e.clientX;
    previousY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
    if (!isInteracting) return;
    processarMovimento(e.clientX, e.clientY);
});

/**
 * IMPLEMENTAÇÃO: TOUCH EVENTS (MOBILE)
 */
window.addEventListener('touchstart', (e) => {
    isInteracting = true;
    previousX = e.touches[0].clientX;
    previousY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (!isInteracting) return;
    e.preventDefault(); 
    processarMovimento(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

// Finalizadores de estado unificados
const finalizarInteracao = () => isInteracting = false;
window.addEventListener('mouseup', finalizarInteracao);
window.addEventListener('mouseleave', finalizarInteracao);
window.addEventListener('touchend', finalizarInteracao);
window.addEventListener('touchcancel', finalizarInteracao);

/**
 * FUNÇÃO ABSTRATA: Apenas calcula os dados matemáticos dos deltas
 */
function processarMovimento(atualX, atualY) {
    const deltaX = atualX - previousX;
    const deltaY = atualY - previousY;

    anguloY += deltaX * 0.4;
    anguloX -= deltaY * 0.4;

    previousX = atualX;
    previousY = atualY;
}

/**
 * IMPLEMENTAÇÃO: TECLADO
 */
window.addEventListener('keydown', (e) => {
    const passo = 5;
    switch (e.key) {
        case 'ArrowUp':    anguloX += passo; break;
        case 'ArrowDown':  anguloX -= passo; break;
        case 'ArrowLeft':  anguloY -= passo; break;
        case 'ArrowRight': anguloY += passo; break;
        default: return;
    }
    e.preventDefault();
});

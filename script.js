// ... (Código anterior de inicialização do canvas e carregamento da imagem) ...

// --- VARIÁVEIS DE CAPTURA DE VÍDEO ---
let capturer = null;
const FRAME_RATE = 30; // 30 quadros por segundo é o padrão
const ANIMATION_DURATION_SECONDS = 5; // Duração total da animação (e do vídeo)

// Referência ao novo botão
const gerarVideoBtn = document.getElementById('gerarVideoBtn');

// 7. Configuração e Inicialização da Captura
gerarVideoBtn.addEventListener('click', function() {
    const nomeDigitado = nomeInput.value.trim();
    if (!nomeDigitado) {
        alert('Por favor, digite um nome antes de gerar o vídeo!');
        return;
    }

    // 1. Ocultar o objeto de texto original (para começar do zero na animação)
    nomeTextObject.set({ opacity: 0 }); 
    canvas.renderAll();

    // 2. Criar o objeto CCapture
    capturer = new CCapture({
        format: 'webm', // Usando WebM (mais simples e rápido)
        framerate: FRAME_RATE,
        verbose: true,
        name: `Convite_Video_${nomeDigitado.replace(/\s/g, '_')}`
    });

    console.log("Iniciando a captura do vídeo...");
    capturer.start(); // Inicia a captura
    
    // Desabilitar botões para evitar cliques durante a captura
    gerarVideoBtn.disabled = true;
    gerarConviteBtn.disabled = true;

    // 3. Iniciar o Loop da Animação
    animate(0); // Passamos 0 como tempo inicial
});


// 8. O Loop da Animação e Captura
let startTime = null;

function animate(timestamp) {
    if (!startTime) {
        startTime = timestamp; // Define o tempo inicial no primeiro quadro
    }
    
    // Tempo decorrido desde o início (em milissegundos)
    const elapsed = timestamp - startTime; 
    
    // Porcentagem do progresso (de 0.0 a 1.0)
    const progress = Math.min(1.0, elapsed / (ANIMATION_DURATION_SECONDS * 1000)); 

    // --- LÓGICA DE ANIMAÇÃO: Fade-in do Nome ---
    // Queremos que a opacidade vá de 0 a 100%
    const opacity = progress; 
    
    if (nomeTextObject) {
        nomeTextObject.set({ opacity: opacity });
        canvas.renderAll(); // Redesenha o canvas com a nova opacidade
    }
    // ---------------------------------------------
    
    // 9. Capturar o Quadro
    capturer.capture(canvas.getElement());
    
    // 10. Decidir se continua ou finaliza
    if (progress < 1.0) {
        // Continua a animação no próximo quadro
        requestAnimationFrame(animate); 
    } else {
        // A animação terminou
        console.log("Captura finalizada. Gerando arquivo...");
        capturer.stop(); // Para a captura
        
        // Finaliza o vídeo e força o download
        capturer.save(); 
        
        // Resetar e habilitar botões
        capturer = null;
        startTime = null;
        nomeTextObject.set({ opacity: 1.0 }); // Deixa o nome visível após o download
        canvas.renderAll();
        gerarVideoBtn.disabled = false;
        gerarConviteBtn.disabled = false;
        alert('Vídeo Convite gerado com sucesso! Verifique a pasta de downloads.');
    }
}
// ... (Código anterior de exportação PNG) ...

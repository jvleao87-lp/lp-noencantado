/**
 * Componente CardPeca - Cards minimalistas para peças de crochê
 * Implementa alternância automática de imagens e design responsivo
 */

class CardPeca {
    constructor(peca, container) {
        this.peca = peca;
        this.container = container;
        this.imagens = this.getImagens();
        this.imagemAtual = 0;
        this.intervalId = null;
        
        this.render();
        this.iniciarAlternancia();
    }

    /**
     * Obtém a lista de imagens da peça
     * @returns {Array} Array de URLs das imagens
     */
    getImagens() {
        if (this.peca.pecas_imagens && this.peca.pecas_imagens.length > 0) {
            return this.peca.pecas_imagens.map(img => img.url);
        }
        return [this.peca.imagem || 'assets/images/bags.jpg'];
    }

    /**
     * Renderiza o card no container
     */
    render() {
        const cardHTML = `
            <div class="card-peca" data-peca-id="${this.peca.id}">
                <div class="card-peca-imagem">
                    <img src="${this.imagens[0]}" alt="${this.peca.titulo}" class="card-peca-img">
                    ${this.imagens.length > 1 ? '<div class="card-peca-indicadores"></div>' : ''}
                </div>
                <div class="card-peca-titulo">
                    <h3 class="card-peca-nome">${this.peca.titulo}</h3>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', cardHTML);
        this.cardElement = this.container.querySelector(`[data-peca-id="${this.peca.id}"]`);
        
        // Adicionar evento de clique
        this.cardElement.addEventListener('click', () => this.aoClicar());
        
        // Criar indicadores se houver múltiplas imagens
        if (this.imagens.length > 1) {
            this.criarIndicadores();
        }
    }

    /**
     * Cria os indicadores de imagem
     */
    criarIndicadores() {
        const containerIndicadores = this.cardElement.querySelector('.card-peca-indicadores');
        
        this.imagens.forEach((_, index) => {
            const indicador = document.createElement('div');
            indicador.className = `card-peca-indicador ${index === 0 ? 'ativo' : ''}`;
            indicador.addEventListener('click', (e) => {
                e.stopPropagation();
                this.irParaImagem(index);
            });
            containerIndicadores.appendChild(indicador);
        });
    }

    /**
     * Inicia a alternância automática de imagens
     */
    iniciarAlternancia() {
        if (this.imagens.length <= 1) return;
        
        this.intervalId = setInterval(() => {
            this.proximaImagem();
        }, 2500); // 2.5 segundos
    }

    /**
     * Para a alternância automática
     */
    pararAlternancia() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Avança para a próxima imagem
     */
    proximaImagem() {
        this.imagemAtual = (this.imagemAtual + 1) % this.imagens.length;
        this.atualizarImagem();
    }

    /**
     * Vai para uma imagem específica
     * @param {number} index - Índice da imagem
     */
    irParaImagem(index) {
        this.imagemAtual = index;
        this.atualizarImagem();
        
        // Reinicia o temporizador
        this.pararAlternancia();
        this.iniciarAlternancia();
    }

    /**
     * Atualiza a imagem exibida e os indicadores
     */
    atualizarImagem() {
        const img = this.cardElement.querySelector('.card-peca-img');
        const indicadores = this.cardElement.querySelectorAll('.card-peca-indicador');
        
        // Transição suave da imagem
        img.style.opacity = '0';
        
        setTimeout(() => {
            img.src = this.imagens[this.imagemAtual];
            img.style.opacity = '1';
        }, 150);
        
        // Atualizar indicadores
        indicadores.forEach((indicador, index) => {
            indicador.classList.toggle('ativo', index === this.imagemAtual);
        });
    }

    /**
     * Manipulador de clique no card - navega para página da peça
     */
    aoClicar() {
        // Construir URL da página da peça
        let pecaUrl;
        
        // Priorizar slug se existir, senão usar ID
        if (this.peca.slug) {
            pecaUrl = `peca.html?slug=${encodeURIComponent(this.peca.slug)}`;
        } else {
            pecaUrl = `peca.html?id=${encodeURIComponent(this.peca.id)}`;
        }
        
        // Navegar para página da peça
        window.location.href = pecaUrl;
    }

    /**
     * Destroi o componente e limpa recursos
     */
    destroy() {
        this.pararAlternancia();
        if (this.cardElement) {
            this.cardElement.remove();
        }
    }
}

/**
 * Função utilitária para renderizar múltiplos cards
 * @param {Array} pecas - Array de peças
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderizarCardsPeca(pecas, container) {
    // Limpar container
    container.innerHTML = '';
    
    // Criar grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'cards-peca-grid';
    
    pecas.forEach(peca => {
        new CardPeca(peca, gridContainer);
    });
    
    container.appendChild(gridContainer);
}

/**
 * Função para atualizar a seção "Nossas Peças" com o novo design
 */
async function atualizarNossasPecas() {
    const container = document.getElementById('all-pieces-container');
    if (!container) return;
    
    try {
        // Mostrar loader
        container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
        
        // Buscar peças
        const pecas = await fetchAllActivePieces();
        
        if (pecas.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Nenhuma peça encontrada no momento.</p></div>';
            return;
        }
        
        // Renderizar cards
        renderizarCardsPeca(pecas, container);
        
        console.log(`✅ Seção "Nossas Peças" atualizada com ${pecas.length} cards no novo design`);
        
    } catch (error) {
        console.error('❌ Erro ao atualizar seção "Nossas Peças":', error);
        container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Não foi possível carregar as peças no momento.</p></div>';
    }
}

// Exportar funções para uso global
window.CardPeca = CardPeca;
window.renderizarCardsPeca = renderizarCardsPeca;
window.atualizarNossasPecas = atualizarNossasPecas;

/**
 * Página individual da peça - Galeria, zoom e navegação
 * Implementa funcionalidades para visualização detalhada de peças
 */

class PecaPage {
    constructor() {
        this.peca = null;
        this.imagens = [];
        this.imagemAtual = 0;
        this.lightboxOpen = false;
        
        this.init();
    }

    /**
     * Inicializa a página
     */
    async init() {
        try {
            // Obter ID ou slug da URL
            const pecaId = this.getPecaIdFromUrl();
            
            if (!pecaId) {
                throw new Error('ID da peça não encontrado na URL');
            }

            // Carregar dados da peça
            await this.carregarPeca(pecaId);
            
            // Renderizar conteúdo
            this.renderPeca();
            
            // Inicializar galeria
            this.inicializarGaleria();
            
            // Inicializar lightbox
            this.inicializarLightbox();
            
            // Configurar botão de encomenda
            this.configurarBotaoEncomenda();
            
            // Esconder loading e mostrar conteúdo
            this.mostrarConteudo();
            
            // Atualizar metadata
            this.atualizarMetadata();
            
        } catch (error) {
            console.error('Erro ao inicializar página da peça:', error);
            this.mostrarErro();
        }
    }

    /**
     * Obtém o ID da peça da URL
     */
    getPecaIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const slug = urlParams.get('slug');
        
        // Prioriza slug, senão usa ID
        return slug || id;
    }

    /**
     * Carrega os dados da peça do Supabase
     */
    async carregarPeca(pecaId) {
        try {
            // Usar função auxiliar do supabase-data.js
            this.peca = await window.fetchPecaByIdentifier(pecaId);
            
            if (!this.peca) {
                throw new Error('Peça não encontrada');
            }

            this.imagens = this.processarImagens(this.peca.pecas_imagens);
            
        } catch (error) {
            console.error('Erro ao carregar peça:', error);
            throw error;
        }
    }

    /**
     * Processa e ordena as imagens da peça
     */
    processarImagens(pecasImagens) {
        if (!pecasImagens || pecasImagens.length === 0) {
            // Imagem fallback
            return [{
                url: this.peca.imagem || 'assets/images/bags.jpg',
                alt: this.peca.titulo,
                ordem: 0
            }];
        }

        // Ordenar por ordem, senão manter ordem original
        return pecasImagens
            .map(img => ({
                url: img.url,
                alt: img.categoria || this.peca.titulo,
                ordem: img.ordem || 0
            }))
            .sort((a, b) => a.ordem - b.ordem);
    }

    /**
     * Renderiza os dados da peça na página
     */
    renderPeca() {
        // Título da página
        document.title = `${this.peca.titulo} | Nó Encantado`;
        document.getElementById('page-title').textContent = `${this.peca.titulo} | Nó Encantado`;
        
        // Breadcrumb
        document.getElementById('peca-breadcrumb').textContent = this.peca.titulo;
        
        // Informações principais
        document.getElementById('peca-titulo').textContent = this.peca.titulo;
        document.getElementById('peca-descricao').textContent = this.peca.descricao || 'Peça única feita com amor e dedicação.';
        
        // Categoria
        const categoriaEl = document.getElementById('peca-categoria');
        if (this.peca.colecoes) {
            categoriaEl.textContent = `${this.peca.colecoes.emoji} ${this.peca.colecoes.nome}`;
            categoriaEl.style.display = 'inline-block';
        } else {
            categoriaEl.style.display = 'none';
        }
        
        // Disponibilidade
        const disponibilidadeEl = document.getElementById('peca-disponibilidade');
        if (this.peca.disponivel !== false) {
            disponibilidadeEl.textContent = '✓ Disponível para encomenda';
            disponibilidadeEl.className = 'peca-disponibilidade';
        } else {
            disponibilidadeEl.textContent = '✗ Indisponível';
            disponibilidadeEl.className = 'peca-disponibilidade indisponivel';
        }
        
        // Imagem principal
        const mainImage = document.getElementById('main-image');
        mainImage.src = this.imagens[0].url;
        mainImage.alt = this.imagens[0].alt;
        
        // Renderizar miniaturas
        this.renderMiniaturas();
    }

    /**
     * Renderiza as miniaturas da galeria
     */
    renderMiniaturas() {
        const container = document.getElementById('thumbnails-container');
        container.innerHTML = '';
        
        this.imagens.forEach((imagem, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.dataset.index = index;
            
            const img = document.createElement('img');
            img.src = imagem.url;
            img.alt = imagem.alt;
            img.loading = 'lazy';
            
            thumbnail.appendChild(img);
            container.appendChild(thumbnail);
            
            // Evento de clique
            thumbnail.addEventListener('click', () => this.selecionarImagem(index));
        });
    }

    /**
     * Inicializa a galeria de imagens
     */
    inicializarGaleria() {
        // Botão de zoom
        const zoomBtn = document.getElementById('zoom-btn');
        zoomBtn.addEventListener('click', () => this.abrirLightbox());
        
        // Clique na imagem principal
        const mainImage = document.getElementById('main-image');
        mainImage.addEventListener('click', () => this.abrirLightbox());
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (this.lightboxOpen) {
                if (e.key === 'ArrowLeft') this.anteriorImagem();
                if (e.key === 'ArrowRight') this.proximaImagem();
                if (e.key === 'Escape') this.fecharLightbox();
            }
        });
    }

    /**
     * Seleciona uma imagem na galeria
     */
    selecionarImagem(index) {
        this.imagemAtual = index;
        
        // Atualizar imagem principal
        const mainImage = document.getElementById('main-image');
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = this.imagens[index].url;
            mainImage.alt = this.imagens[index].alt;
            mainImage.style.opacity = '1';
        }, 150);
        
        // Atualizar miniaturas
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Scroll para miniatura ativa no mobile
        const activeThumb = document.querySelector('.thumbnail.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    /**
     * Inicializa o lightbox
     */
    inicializarLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        
        // Fechar lightbox
        lightboxClose.addEventListener('click', () => this.fecharLightbox());
        
        // Navegação no lightbox
        lightboxPrev.addEventListener('click', () => this.anteriorImagem());
        lightboxNext.addEventListener('click', () => this.proximaImagem());
        
        // Clique no fundo para fechar
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.fecharLightbox();
            }
        });
    }

    /**
     * Abre o lightbox
     */
    abrirLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        lightboxImage.src = this.imagens[this.imagemAtual].url;
        lightboxImage.alt = this.imagens[this.imagemAtual].alt;
        
        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
        
        this.lightboxOpen = true;
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fecha o lightbox
     */
    fecharLightbox() {
        const lightbox = document.getElementById('lightbox');
        
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
        
        this.lightboxOpen = false;
        document.body.style.overflow = '';
    }

    /**
     * Navega para a imagem anterior
     */
    anteriorImagem() {
        const newIndex = this.imagemAtual > 0 ? this.imagemAtual - 1 : this.imagens.length - 1;
        this.selecionarImagem(newIndex);
        
        if (this.lightboxOpen) {
            const lightboxImage = document.getElementById('lightbox-image');
            lightboxImage.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImage.src = this.imagens[newIndex].url;
                lightboxImage.alt = this.imagens[newIndex].alt;
                lightboxImage.style.opacity = '1';
            }, 150);
        }
    }

    /**
     * Navega para a próxima imagem
     */
    proximaImagem() {
        const newIndex = this.imagemAtual < this.imagens.length - 1 ? this.imagemAtual + 1 : 0;
        this.selecionarImagem(newIndex);
        
        if (this.lightboxOpen) {
            const lightboxImage = document.getElementById('lightbox-image');
            lightboxImage.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImage.src = this.imagens[newIndex].url;
                lightboxImage.alt = this.imagens[newIndex].alt;
                lightboxImage.style.opacity = '1';
            }, 150);
        }
    }

    /**
     * Configura o botão de encomenda
     */
    configurarBotaoEncomenda() {
        const encomendarBtn = document.getElementById('encomendar-btn');
        
        encomendarBtn.addEventListener('click', () => {
            const mensagem = encodeURIComponent(`Olá! Tenho interesse em encomendar a peça "${this.peca.titulo}".`);
            const whatsappUrl = `https://wa.me/${SiteConfig.phoneRaw}?text=${mensagem}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    /**
     * Mostra o conteúdo e esconde o loading
     */
    mostrarConteudo() {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('peca-content').style.display = 'block';
    }

    /**
     * Mostra mensagem de erro
     */
    mostrarErro() {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'flex';
    }

    /**
     * Atualiza metadata da página
     */
    atualizarMetadata() {
        // Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        if (ogTitle) ogTitle.content = `${this.peca.titulo} | Nó Encantado`;
        if (ogDescription) ogDescription.content = this.peca.descricao || `Peça de crochê artesanal feita à mão em Pernambuco`;
        if (ogImage && this.imagens.length > 0) ogImage.content = this.imagens[0].url;
        if (ogUrl) ogUrl.content = window.location.href;
        
        // Twitter Card
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        
        if (twitterTitle) twitterTitle.content = `${this.peca.titulo} | Nó Encantado`;
        if (twitterDescription) twitterDescription.content = this.peca.descricao || `Peça de crochê artesanal feita à mão em Pernambuco`;
        if (twitterImage && this.imagens.length > 0) twitterImage.content = this.imagens[0].url;
        
        // Canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = window.location.href;
    }
}

/**
 * Inicializa a página da peça quando o DOM estiver carregado
 */
function initializePecaPage() {
    new PecaPage();
}

// Exportar para uso global
window.initializePecaPage = initializePecaPage;

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
            this.mostrarErro(error);
        }
    }

    /**
     * Obtém o ID da peça da URL - VERSÃO ROBUSTA
     */
    getPecaIdFromUrl() {
        console.log('🔍 DEBUG: Extraindo ID da URL...');
        console.log('🔍 DEBUG: URL completa:', window.location.href);
        
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const slug = urlParams.get('slug');
        
        console.log('🔍 DEBUG: Parâmetros extraídos:');
        console.log('  - id:', id);
        console.log('  - slug:', slug);
        
        // Para URL atual, priorizar ID (conforme contexto do usuário)
        const identifier = id || slug;
        
        console.log('🔍 DEBUG: Identifier escolhido:', identifier);
        
        if (!identifier) {
            console.error('❌ DEBUG: Nenhum ID ou slug encontrado na URL');
        }
        
        return identifier;
    }

    /**
     * Carrega os dados da peça do Supabase - VERSÃO ROBUSTA
     */
    async carregarPeca(pecaId) {
        console.log('🔍 DEBUG: Iniciando carregamento da peça...');
        console.log('🔍 DEBUG: ID recebido:', pecaId);
        
        try {
            // Validação do ID
            if (!pecaId) {
                throw new Error('ID da peça não fornecido');
            }

            if (typeof pecaId !== 'string') {
                throw new Error('ID da peça deve ser uma string');
            }

            // Usar função auxiliar do supabase-data.js com logs detalhados
            console.log('🔍 DEBUG: Chamando fetchPecaByIdentifier...');
            this.peca = await window.fetchPecaByIdentifier(pecaId);
            
            console.log('🔍 DEBUG: Resultado de fetchPecaByIdentifier:', this.peca);
            
            if (!this.peca) {
                console.error('❌ DEBUG: fetchPecaByIdentifier retornou null');
                throw new Error('Peça não encontrada ou não está ativa');
            }

            // Validar estrutura da peça
            if (!this.peca.id) {
                console.error('❌ DEBUG: Peça não tem ID');
                throw new Error('Dados da peça inválidos: sem ID');
            }

            if (!this.peca.titulo) {
                console.error('❌ DEBUG: Peça não tem título');
                throw new Error('Dados da peça inválidos: sem título');
            }

            console.log('✅ DEBUG: Peça básica validada:', this.peca.titulo);
            console.log('🔍 DEBUG: Dados completos da peça:', this.peca);

            // Processar imagens
            console.log('🔍 DEBUG: Processando imagens...');
            this.imagens = this.processarImagens(this.peca.pecas_imagens);
            console.log('✅ DEBUG: Imagens processadas:', this.imagens.length, 'imagens');
            
        } catch (error) {
            console.error('❌ DEBUG: Erro ao carregar peça:', error);
            console.error('❌ DEBUG: Tipo do erro:', error.constructor.name);
            console.error('❌ DEBUG: Mensagem:', error.message);
            console.error('❌ DEBUG: Stack:', error.stack);
            
            // Diferenciar tipos de erro
            if (error.message.includes('Peça não encontrada')) {
                throw new Error('Peça não encontrada');
            } else if (error.message.includes('ID da peça')) {
                throw new Error('ID inválido na URL');
            } else if (error.message.includes('Dados da peça inválidos')) {
                throw new Error('Dados da peça corrompidos');
            } else {
                throw new Error('Erro ao carregar dados da peça');
            }
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
     * Mostra mensagem de erro específica - VERSÃO ROBUSTA
     */
    mostrarErro(error = null) {
        console.log('🔍 DEBUG: Mostrando tela de erro...');
        console.log('🔍 DEBUG: Erro recebido:', error);
        
        const loadingState = document.getElementById('loading-state');
        const errorState = document.getElementById('error-state');
        const errorContent = errorState.querySelector('.error-content');
        
        // Esconder loading
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Personalizar mensagem de erro
        let titulo = 'Peça não encontrada';
        let mensagem = 'Desculpe, não conseguimos encontrar a peça que você está procurando.';
        
        if (error) {
            console.log('🔍 DEBUG: Personalizando mensagem para:', error.message);
            
            if (error.message.includes('ID inválido na URL')) {
                titulo = 'URL inválida';
                mensagem = 'O ID da peça na URL está incorreto. Verifique o link e tente novamente.';
            } else if (error.message.includes('Dados da peça corrompidos')) {
                titulo = 'Dados corrompidos';
                mensagem = 'Os dados desta peça estão corrompidos. Entre em contato conosco para ajuda.';
            } else if (error.message.includes('Erro ao carregar dados')) {
                titulo = 'Erro de conexão';
                mensagem = 'Não foi possível carregar os dados da peça. Tente recarregar a página.';
            } else if (error.message.includes('ID da peça não encontrado na URL')) {
                titulo = 'URL incompleta';
                mensagem = 'A URL está incompleta. É necessário especificar o ID da peça.';
            }
        }
        
        // Atualizar conteúdo do erro
        const tituloEl = errorContent.querySelector('h2');
        const mensagemEl = errorContent.querySelector('p.text-muted');
        
        if (tituloEl) tituloEl.textContent = titulo;
        if (mensagemEl) mensagemEl.textContent = mensagem;
        
        // Mostrar tela de erro
        errorState.style.display = 'flex';
        
        console.log('✅ DEBUG: Tela de erro exibida com mensagem:', titulo);
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

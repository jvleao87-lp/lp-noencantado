/**
 * Integração com Supabase para buscar peças de crochê
 * Usa a estrutura HTML existente do site
 */

// Inicialização do cliente Supabase com chave pública anon
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://cdofbumzwaclviriaxhc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb2ZidW16d2FjbHZpcmlheGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODE5MzQsImV4cCI6MjA4OTA1NzkzNH0.wGo1Q1ZzkkXWAmDIpIArdAUPIyakoHVPr-ufPVry1lM'
);

/**
 * Busca peças em destaque com imagens e coleções
 * @returns {Promise<Array>} Lista de peças em destaque
 */
async function fetchFeaturedPieces() {
    try {
        const { data, error } = await supabaseClient
            .from('pecas')
            .select(`
                *,
                colecoes (nome, emoji, ativa),
                pecas_imagens (url, categoria)
            `)
            .eq('ativa', true)
            .eq('destaque', true)
            .eq('colecoes.ativa', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar peças em destaque:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Erro inesperado ao buscar peças em destaque:', err);
        return [];
    }
}

/**
 * Busca todas as peças ativas com paginação
 * @param {number} offset - Offset para paginação
 * @param {number} limit - Limite de itens por página
 * @returns {Promise<Array>} Lista de peças ativas
 */
async function fetchAllPiecesPaginated(offset = 0, limit = 6) {
    try {
        const { data, error } = await supabaseClient
            .from('pecas')
            .select(`
                *,
                colecoes (nome, emoji, ativa),
                pecas_imagens (url, categoria)
            `)
            .eq('ativa', true)
            .eq('colecoes.ativa', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Erro ao buscar peças paginadas:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Erro inesperado ao buscar peças paginadas:', err);
        return [];
    }
}

/**
 * Busca todas as peças ativas com imagens e coleções
 * @returns {Promise<Array>} Lista de peças ativas
 */
async function fetchAllActivePieces() {
    try {
        const { data, error } = await supabaseClient
            .from('pecas')
            .select(`
                *,
                colecoes (nome, emoji, ativa),
                pecas_imagens (url, categoria)
            `)
            .eq('ativa', true)
            .eq('colecoes.ativa', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar peças ativas:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Erro inesperado ao buscar peças:', err);
        return [];
    }
}

/**
 * Busca peças ativas da coleção verão
 * @returns {Promise<Array>} Lista de peças da coleção verão
 */
async function fetchSummerPieces() {
    try {
        const { data, error } = await supabaseClient
            .from('pecas')
            .select(`
                *,
                colecoes (nome, emoji, ativa),
                pecas_imagens (url, categoria)
            `)
            .eq('ativa', true)
            .eq('colecao_id', '68cc9fe8-845e-4c81-91fc-dce7b6e0b46f')
            .eq('colecoes.ativa', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar peças da coleção verão:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Erro inesperado ao buscar peças da coleção verão:', err);
        return [];
    }
}

/**
 * Renderiza uma peça em destaque no estilo mobile-first
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderFeaturedPiece(piece, container) {
    const firstImage = piece.pecas_imagens && piece.pecas_imagens.length > 0 
        ? piece.pecas_imagens[0].url 
        : 'assets/images/bags.jpg';

    const pieceHTML = `
        <div class="col-6 col-lg-3 mb-4">
            <div class="gallery-item">
                <div class="gallery-img" style="background-image: url('${firstImage}');">
                    <div class="gallery-overlay">
                        <h3 class="h6">${piece.colecoes?.emoji || '⭐'} ${piece.titulo}</h3>
                        <p class="gallery-variations small">${piece.descricao || 'Peça especial'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', pieceHTML);
}

/**
 * Renderiza uma peça em destaque para o grid simples
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderFeaturedPieceGrid(piece, container) {
    const firstImage = piece.pecas_imagens && piece.pecas_imagens.length > 0 
        ? piece.pecas_imagens[0].url 
        : 'assets/images/bags.jpg';

    const pieceHTML = `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="gallery-item">
                <div class="gallery-img" style="background-image: url('${firstImage}');">
                    <div class="gallery-overlay">
                        <h3>${piece.colecoes?.emoji || '⭐'} ${piece.titulo}</h3>
                        <p>${piece.descricao || 'Peça especial em destaque'}</p>
                    </div>
                </div>
                <div class="gallery-caption">
                    <h3 class="mb-1">${piece.colecoes?.emoji || '⭐'} ${piece.titulo}</h3>
                    <p class="mb-0">${piece.descricao || 'Peça especial da coleção'}</p>
                    ${piece.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ''}
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', pieceHTML);
}

/**
 * Renderiza uma peça na lista completa com estilo mobile-first
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderAllPiece(piece, container) {
    const firstImage = piece.pecas_imagens && piece.pecas_imagens.length > 0 
        ? piece.pecas_imagens[0].url 
        : 'assets/images/bags.jpg';

    const pieceHTML = `
        <div class="col-6 col-md-6 col-lg-4 mb-4">
            <div class="gallery-item">
                <div class="gallery-img" style="background-image: url('${firstImage}');">
                    <div class="gallery-overlay">
                        <h3>${piece.colecoes?.emoji || '🧶'} ${piece.titulo}</h3>
                        <p class="gallery-variations">${piece.descricao || 'Peça única feita com amor'}</p>
                        ${piece.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ''}
                    </div>
                </div>
                <div class="piece-title mt-2 text-center">
                    <h5 class="h6 mb-1">${piece.colecoes?.emoji || '🧶'} ${piece.titulo}</h5>
                    ${piece.descricao ? `<p class="small text-muted mb-0">${piece.descricao}</p>` : ''}
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', pieceHTML);
}

/**
 * Renderiza uma peça na estrutura de gallery-item existente
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderGalleryPiece(piece, container) {
    const firstImage = piece.pecas_imagens && piece.pecas_imagens.length > 0 
        ? piece.pecas_imagens[0].url 
        : 'assets/images/bags.jpg';

    const pieceHTML = `
        <div class="col-md-6 col-lg-3">
            <div class="gallery-item">
                <div class="gallery-img" style="background-image: url('${firstImage}');">
                    <div class="gallery-overlay">
                        <h3>${piece.colecoes?.emoji || '🧶'} ${piece.titulo}</h3>
                        <p class="gallery-variations">${piece.descricao || 'Peça única feita com amor'}</p>
                        ${piece.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', pieceHTML);
}

/**
 * Renderiza TODAS as imagens de TODAS as peças da coleção verão
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} swiperWrapper - Container do swiper onde renderizar
 */
function renderAllSummerImages(piece, swiperWrapper) {
    // Se não há imagens, não renderiza nada
    if (!piece.pecas_imagens || piece.pecas_imagens.length === 0) {
        return;
    }

    // Renderiza CADA imagem da peça como um slide separado
    piece.pecas_imagens.forEach((image, index) => {
        const imageHTML = `
            <div class="swiper-slide">
                <div class="gallery-item h-100">
                    <div class="gallery-img" style="background-image: url('${image.url}');">
                        <div class="gallery-overlay"></div>
                    </div>
                    <div class="gallery-caption">
                        <h3 class="mb-1">${piece.colecoes?.emoji || '☀️'} ${piece.titulo}</h3>
                        <p class="mb-0">${piece.descricao || 'Peça especial da coleção de verão'}</p>
                        ${piece.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ''}
                        ${piece.pecas_imagens.length > 1 ? `<small class="text-muted d-block mt-1">Imagem ${index + 1} de ${piece.pecas_imagens.length}</small>` : ''}
                    </div>
                </div>
            </div>
        `;
        swiperWrapper.insertAdjacentHTML('beforeend', imageHTML);
    });
}

/**
 * Renderiza uma peça no carrossel de verão existente (mantida para compatibilidade)
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} swiperWrapper - Container do swiper onde renderizar
 */
function renderSummerPiece(piece, swiperWrapper) {
    const firstImage = piece.pecas_imagens && piece.pecas_imagens.length > 0 
        ? piece.pecas_imagens[0].url 
        : 'assets/images/verao1.jpeg'; // fallback para imagem existente

    const pieceHTML = `
        <div class="swiper-slide">
            <div class="gallery-item h-100">
                <div class="gallery-img" style="background-image: url('${firstImage}');">
                    <div class="gallery-overlay"></div>
                </div>
                <div class="gallery-caption">
                    <h3 class="mb-1">${piece.colecoes?.emoji || '☀️'} ${piece.titulo}</h3>
                    <p class="mb-0">${piece.descricao || 'Peça especial da coleção de verão'}</p>
                    ${piece.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ''}
                </div>
            </div>
        </div>
    `;

    swiperWrapper.insertAdjacentHTML('beforeend', pieceHTML);
}

/**
 * Inicializa a seção de peças em destaque
 */
async function initializeFeaturedPieces() {
    const container = document.getElementById('featured-pieces-container');
    if (!container) return;

    try {
        const pieces = await fetchFeaturedPieces();
        
        if (pieces.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Nenhuma peça em destaque no momento.</p></div>';
            return;
        }

        const row = container.querySelector('.row') || document.createElement('div');
        row.className = 'row';
        row.innerHTML = '';
        
        pieces.forEach(piece => {
            renderFeaturedPiece(piece, row);
        });

        if (!container.contains(row)) {
            container.appendChild(row);
        }

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

        console.log(`Seção de destaque atualizada com ${pieces.length} peças`);

    } catch (err) {
        console.error('Erro ao inicializar peças em destaque:', err);
        container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Erro ao carregar peças em destaque.</p></div>';
    }
}

/**
 * Atualiza a galeria principal com dados do Supabase (apenas peças em destaque)
 */
async function updateGalleryWithSupabaseData() {
    console.log('🔍 DEBUG: Iniciando updateGalleryWithSupabaseData()');
    
    // Simple Grid for all screen sizes
    const featuredGrid = document.getElementById('featured-pieces-grid');
    
    console.log('🔍 DEBUG: Grid de destaque encontrado:', !!featuredGrid);

    if (!featuredGrid) {
        console.error('❌ Container da galeria de destaque não encontrado');
        return;
    }

    try {
        console.log('🔍 DEBUG: Buscando peças em destaque...');
        // Buscar apenas peças em destaque
        const pieces = await fetchFeaturedPieces();
        
        console.log('🔍 DEBUG: Peças em destaque recebidas:', pieces.length);
        
        if (pieces.length === 0) {
            console.log('🔍 DEBUG: Nenhuma peça em destaque encontrada, mostrando mensagem vazia');
            featuredGrid.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Nenhuma peça em destaque no momento.</p></div>';
            return;
        }

        // Limpar conteúdo atual
        featuredGrid.innerHTML = '';

        // Renderizar peças em destaque no grid
        pieces.forEach(piece => {
            console.log(`🔍 DEBUG: Renderizando peça: ${piece.titulo}`);
            renderFeaturedPieceGrid(piece, featuredGrid);
        });

        console.log(`✅ Sucesso: Galeria atualizada com ${pieces.length} peças em destaque do Supabase`);

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

    } catch (err) {
        console.error('❌ Erro ao atualizar galeria com peças em destaque:', err);
        console.error('❌ Stack trace:', err.stack);
        featuredGrid.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Não foi possível carregar as peças em destaque.</p></div>';
    }
}

// Variável para controle de paginação
let allPiecesOffset = 0;
const ALL_PIECES_LIMIT = 6;
let hasMoreAllPieces = true;

/**
 * Inicializa a seção de todas as peças com carregamento progressivo (grid)
 */
async function initializeAllPiecesSection() {
    console.log('🔍 DEBUG: Iniciando initializeAllPiecesSection()');
    
    const container = document.getElementById('all-pieces-container');
    const loadMoreBtn = document.getElementById('load-more-pieces');
    
    console.log('🔍 DEBUG: Container encontrado:', !!container);
    console.log('🔍 DEBUG: Botão encontrado:', !!loadMoreBtn);
    
    if (!container) {
        console.error('❌ Container #all-pieces-container não encontrado');
        return;
    }

    try {
        console.log('🔍 DEBUG: Mostrando loader...');
        // Mostrar loader apenas durante a requisição
        container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
        
        console.log('🔍 DEBUG: Buscando peças paginadas...');
        // Carregar primeiras peças (todas as peças ativas)
        const pieces = await fetchAllPiecesPaginated(allPiecesOffset, ALL_PIECES_LIMIT);
        
        console.log('🔍 DEBUG: Peças recebidas:', pieces.length);
        console.log('🔍 DEBUG: Dados da primeira peça:', pieces[0]);
        
        // Esconder loader imediatamente após a resposta
        container.innerHTML = '';
        
        if (pieces.length === 0) {
            console.log('🔍 DEBUG: Nenhuma peça encontrada, mostrando mensagem vazia');
            container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Nenhuma peça encontrada no momento.</p></div>';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        console.log('🔍 DEBUG: Criando row e renderizando peças...');
        const row = document.createElement('div');
        row.className = 'row';
        
        pieces.forEach((piece, index) => {
            console.log(`🔍 DEBUG: Renderizando peça ${index + 1}:`, piece.titulo);
            renderAllPiece(piece, row);
        });

        console.log('🔍 DEBUG: Adicionando row ao container...');
        container.appendChild(row);

        allPiecesOffset += pieces.length;
        hasMoreAllPieces = pieces.length === ALL_PIECES_LIMIT;

        console.log('🔍 DEBUG: Controlando botão "Mostrar mais"...');
        // Controlar botão "Mostrar mais"
        if (loadMoreBtn) {
            loadMoreBtn.style.display = hasMoreAllPieces ? 'inline-block' : 'none';
        }

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

        console.log(`✅ Sucesso: Seção todas peças atualizada com ${pieces.length} peças (total: ${allPiecesOffset})`);

    } catch (err) {
        console.error('❌ Erro ao inicializar seção todas peças:', err);
        console.error('❌ Stack trace:', err.stack);
        // Esconder loader e mostrar mensagem de erro
        container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Não foi possível carregar as peças no momento.</p></div>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

/**
 * Carrega mais peças na seção completa
 */
async function loadMorePieces() {
    const loadMoreBtn = document.getElementById('load-more-pieces');
    if (!loadMoreBtn || !hasMoreAllPieces) return;

    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Carregando...';

    try {
        const pieces = await fetchAllPiecesPaginated(allPiecesOffset, ALL_PIECES_LIMIT);
        
        if (pieces.length === 0) {
            hasMoreAllPieces = false;
            loadMoreBtn.style.display = 'none';
            return;
        }

        const container = document.getElementById('all-pieces-container');
        const row = container.querySelector('.row');
        
        pieces.forEach(piece => {
            renderAllPiece(piece, row);
        });

        allPiecesOffset += pieces.length;
        hasMoreAllPieces = pieces.length === ALL_PIECES_LIMIT;

        loadMoreBtn.style.display = hasMoreAllPieces ? 'inline-block' : 'none';
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = 'Mostrar mais';

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

        console.log(`Carregadas mais ${pieces.length} peças (total: ${allPiecesOffset})`);

    } catch (err) {
        console.error('Erro ao carregar mais peças:', err);
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = 'Mostrar mais';
    }
}

/**
 * Atualiza a coleção de verão com dados do Supabase
 */
async function updateSummerCollectionWithSupabaseData() {
    const summerSwiperWrapper = document.querySelector('.summer-swiper .swiper-wrapper');
    if (!summerSwiperWrapper) return;

    try {
        const pieces = await fetchSummerPieces();
        
        if (pieces.length === 0) {
            console.log('Nenhuma peça da coleção verão encontrada no Supabase, mantendo conteúdo estático');
            return;
        }

        // Limpar conteúdo atual
        summerSwiperWrapper.innerHTML = '';

        let totalImages = 0;

        // Renderizar TODAS as imagens de TODAS as peças da coleção verão
        pieces.forEach(piece => {
            renderAllSummerImages(piece, summerSwiperWrapper);
            if (piece.pecas_imagens) {
                totalImages += piece.pecas_imagens.length;
            }
        });

        // Re-inicializar swiper de verão se existir
        if (window.summerSwiper) {
            window.summerSwiper.update();
        }

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

        console.log(`Coleção verão atualizada: ${pieces.length} peças, ${totalImages} imagens totais`);

    } catch (err) {
        console.error('Erro ao atualizar coleção verão:', err);
    }
}

/**
 * Inicializa todas as atualizações quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os scripts foram carregados
    setTimeout(() => {
        updateGalleryWithSupabaseData();
        updateSummerCollectionWithSupabaseData();
        initializeAllPiecesSection();
    }, 500);
});

// Exportar funções para uso global se necessário
window.updateGalleryWithSupabaseData = updateGalleryWithSupabaseData;
window.updateSummerCollectionWithSupabaseData = updateSummerCollectionWithSupabaseData;
window.initializeAllPiecesSection = initializeAllPiecesSection;

// Tornar loadMorePieces global para acesso via onclick
window.loadMorePieces = loadMorePieces;

/*
NOTA: Este código depende das políticas RLS (Row Level Security) do Supabase.
Para que as leituras funcionem no frontend, é necessário configurar políticas RLS
que permitam operações SELECT para usuários anon (anon) nas tabelas:
- pecas
- colecoes  
- pecas_imagens

Exemplo de política RLS necessária:
CREATE POLICY "Enable read access for all users" ON pecas FOR SELECT USING (true);
*/

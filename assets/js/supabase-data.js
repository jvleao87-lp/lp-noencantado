/**
 * Integração com Supabase para buscar peças de crochê
 * Somente usando a chave pública anon para segurança
 */

// Inicialização do cliente Supabase com chave pública anon
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://cdofbumzwaclviriaxhc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb2ZidW16d2FjbHZpcmlheGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODE5MzQsImV4cCI6MjA4OTA1NzkzNH0.wGo1Q1ZzkkXWAmDIpIArdAUPIyakoHVPr-ufPVry1lM'
);

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
 * Renderiza uma peça no container especificado
 * @param {Object} piece - Dados da peça
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderPiece(piece, container) {
    const firstImage = piece.pecas_imagens && piece.pecas_imagens.length > 0 
        ? piece.pecas_imagens[0].url 
        : null;

    const pieceHTML = `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 ${piece.destaque ? 'border-warning' : ''}">
                ${firstImage ? `
                    <img src="${firstImage}" class="card-img-top" alt="${piece.titulo}" 
                         style="height: 200px; object-fit: cover;">
                ` : ''}
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${piece.titulo}</h5>
                        ${piece.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ''}
                    </div>
                    <p class="card-text flex-grow-1">${piece.descricao || ''}</p>
                    <div class="text-muted small mb-3">
                        <span>${piece.colecoes?.emoji || ''}</span> ${piece.colecoes?.nome || 'Sem coleção'}
                    </div>
                    <a href="#" data-whatsapp-link class="btn btn-primary btn-sm mt-auto">
                        <i class="fab fa-whatsapp me-2"></i>Encomendar
                    </a>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', pieceHTML);
}

/**
 * Renderiza mensagem de estado vazio
 * @param {HTMLElement} container - Container onde renderizar
 * @param {string} message - Mensagem a exibir
 */
function renderEmptyState(container, message) {
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="text-muted">
                <i class="fas fa-inbox fa-3x mb-3"></i>
                <p class="h5">${message}</p>
            </div>
        </div>
    `;
}

/**
 * Inicializa e renderiza todas as peças ativas
 */
async function initializeAllPieces() {
    const container = document.getElementById('pecas-container');
    if (!container) return;

    try {
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
        
        const pieces = await fetchAllActivePieces();
        
        if (pieces.length === 0) {
            renderEmptyState(container, 'Nenhuma peça encontrada no momento.');
            return;
        }

        container.innerHTML = '<div class="row"></div>';
        const row = container.querySelector('.row');
        
        pieces.forEach(piece => {
            renderPiece(piece, row);
        });

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

    } catch (err) {
        console.error('Erro ao inicializar peças:', err);
        renderEmptyState(container, 'Erro ao carregar as peças. Tente novamente mais tarde.');
    }
}

/**
 * Inicializa e renderiza peças da coleção verão
 */
async function initializeSummerPieces() {
    const container = document.getElementById('pecas-verao-container');
    if (!container) return;

    try {
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
        
        const pieces = await fetchSummerPieces();
        
        if (pieces.length === 0) {
            renderEmptyState(container, 'Nenhuma peça da coleção verão encontrada.');
            return;
        }

        container.innerHTML = '<div class="row"></div>';
        const row = container.querySelector('.row');
        
        pieces.forEach(piece => {
            renderPiece(piece, row);
        });

        // Re-injeta configurações do site após renderização dinâmica
        if (window.injectSiteConfig) {
            window.injectSiteConfig();
        }

    } catch (err) {
        console.error('Erro ao inicializar peças da coleção verão:', err);
        renderEmptyState(container, 'Erro ao carregar as peças da coleção verão. Tente novamente mais tarde.');
    }
}

/**
 * Inicializa todas as funções quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o site-config.js foi carregado
    setTimeout(() => {
        initializeAllPieces();
        initializeSummerPieces();
    }, 100);
});

// Exportar funções para uso global se necessário
window.SupabaseData = {
    fetchAllActivePieces,
    fetchSummerPieces,
    initializeAllPieces,
    initializeSummerPieces
};

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

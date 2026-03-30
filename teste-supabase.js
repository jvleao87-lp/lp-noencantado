/**
 * Script de teste direto para depuração do Supabase
 * Execute este script no console do navegador na página principal
 */

// Função para testar conexão básica com Supabase
async function testSupabaseConnection() {
    console.log('🧪 TESTE: Conexão básica com Supabase');
    
    try {
        // Testar conexão básica
        const { data, error } = await supabaseClient
            .from('pecas')
            .select('id, titulo, ativa')
            .limit(1);
        
        console.log('📊 Resultado conexão básica:');
        console.log('  - Data:', data);
        console.log('  - Error:', error);
        
        if (error) {
            console.error('❌ Erro na conexão básica:', error);
            return false;
        }
        
        console.log('✅ Conexão básica funcionando');
        return true;
        
    } catch (err) {
        console.error('❌ Erro inesperado na conexão:', err);
        return false;
    }
}

// Função para testar busca do UUID específico
async function testSpecificUUID() {
    const testUUID = '956afe38-b6b7-40ce-8b1f-b9370e9b6483';
    console.log(`🧪 TESTE: Busca UUID específico: ${testUUID}`);
    
    try {
        // Testar busca simples
        console.log('🔍 Busca simples (apenas campos básicos)...');
        const { data: simpleData, error: simpleError } = await supabaseClient
            .from('pecas')
            .select('*')
            .eq('id', testUUID)
            .maybeSingle();
        
        console.log('📊 Resultado busca simples:');
        console.log('  - Data:', simpleData);
        console.log('  - Error:', simpleError);
        
        if (simpleError) {
            console.error('❌ Erro na busca simples:', simpleError);
            console.error('❌ Detalhes:', {
                message: simpleError.message,
                details: simpleError.details,
                hint: simpleError.hint,
                code: simpleError.code
            });
            return false;
        }
        
        if (!simpleData) {
            console.log('❌ Peça não encontrada com busca simples');
            return false;
        }
        
        console.log('✅ Peça encontrada com busca simples:', simpleData.titulo);
        
        // Testar busca com imagens
        console.log('🔍 Busca com imagens...');
        const { data: imagensData, error: imagensError } = await supabaseClient
            .from('pecas_imagens')
            .select('*')
            .eq('peca_id', testUUID);
        
        console.log('📊 Resultado busca imagens:');
        console.log('  - Data:', imagensData);
        console.log('  - Error:', imagensError);
        
        if (imagensError) {
            console.error('❌ Erro na busca de imagens:', imagensError);
        } else {
            console.log('✅ Imagens encontradas:', imagensData?.length || 0);
        }
        
        // Testar busca com coleção
        if (simpleData.colecao_id) {
            console.log('🔍 Busca com coleção...');
            const { data: colecaoData, error: colecaoError } = await supabaseClient
                .from('colecoes')
                .select('*')
                .eq('id', simpleData.colecao_id)
                .maybeSingle();
            
            console.log('📊 Resultado busca coleção:');
            console.log('  - Data:', colecaoData);
            console.log('  - Error:', colecaoError);
            
            if (colecaoError) {
                console.error('❌ Erro na busca de coleção:', colecaoError);
            } else {
                console.log('✅ Coleção encontrada:', colecaoData?.nome);
            }
        }
        
        return true;
        
    } catch (err) {
        console.error('❌ Erro inesperado no teste UUID:', err);
        return false;
    }
}

// Função para testar a função fetchPecaByIdentifier
async function testFetchFunction() {
    const testUUID = '956afe38-b6b7-40ce-8b1f-b9370e9b6483';
    console.log(`🧪 TESTE: Função fetchPecaByIdentifier com: ${testUUID}`);
    
    try {
        if (!window.fetchPecaByIdentifier) {
            console.error('❌ Função fetchPecaByIdentifier não encontrada');
            console.log('💡 Certifique-se de que supabase-data.js foi carregado');
            return false;
        }
        
        const result = await window.fetchPecaByIdentifier(testUUID);
        
        console.log('📊 Resultado da função:');
        console.log('  - Result:', result);
        
        if (!result) {
            console.log('❌ Função retornou null');
            return false;
        }
        
        console.log('✅ Função funcionou:', result.titulo);
        console.log('📊 Dados completos:', result);
        
        return true;
        
    } catch (err) {
        console.error('❌ Erro ao testar função:', err);
        return false;
    }
}

// Função para testar estrutura das tabelas
async function testTableStructure() {
    console.log('🧪 TESTE: Estrutura das tabelas');
    
    try {
        // Testar tabela pecas
        console.log('🔍 Testando tabela pecas...');
        const { data: pecasColumns, error: pecasError } = await supabaseClient
            .from('pecas')
            .select('*')
            .limit(0);
        
        if (pecasError) {
            console.error('❌ Erro na tabela pecas:', pecasError);
        } else {
            console.log('✅ Tabela pecas acessível');
        }
        
        // Testar tabela pecas_imagens
        console.log('🔍 Testando tabela pecas_imagens...');
        const { data: imagensColumns, error: imagensError } = await supabaseClient
            .from('pecas_imagens')
            .select('*')
            .limit(0);
        
        if (imagensError) {
            console.error('❌ Erro na tabela pecas_imagens:', imagensError);
        } else {
            console.log('✅ Tabela pecas_imagens acessível');
        }
        
        // Testar tabela colecoes
        console.log('🔍 Testando tabela colecoes...');
        const { data: colecoesColumns, error: colecoesError } = await supabaseClient
            .from('colecoes')
            .select('*')
            .limit(0);
        
        if (colecoesError) {
            console.error('❌ Erro na tabela colecoes:', colecoesError);
        } else {
            console.log('✅ Tabela colecoes acessível');
        }
        
    } catch (err) {
        console.error('❌ Erro ao testar estrutura:', err);
    }
}

// Função principal que executa todos os testes
async function runAllTests() {
    console.log('🚀 INICIANDO TESTES COMPLETOS DO SUPABASE');
    console.log('=' .repeat(50));
    
    const test1 = await testSupabaseConnection();
    console.log('');
    
    const test2 = await testTableStructure();
    console.log('');
    
    const test3 = await testSpecificUUID();
    console.log('');
    
    const test4 = await testFetchFunction();
    console.log('');
    
    console.log('=' .repeat(50));
    console.log('📊 RESUMO DOS TESTES:');
    console.log(`  - Conexão básica: ${test1 ? '✅' : '❌'}`);
    console.log(`  - Estrutura tabelas: ${test2 ? '✅' : '❌'}`);
    console.log(`  - UUID específico: ${test3 ? '✅' : '❌'}`);
    console.log(`  - Função fetchPeca: ${test4 ? '✅' : '❌'}`);
    
    if (test1 && test2 && test3 && test4) {
        console.log('🎉 TODOS OS TESTES PASSARAM!');
    } else {
        console.log('⚠️ ALGUNS TESTES FALHARAM - VERIFIQUE OS LOGS ACIMA');
    }
}

// Disponibilizar funções no console
window.testSupabaseConnection = testSupabaseConnection;
window.testSpecificUUID = testSpecificUUID;
window.testFetchFunction = testFetchFunction;
window.testTableStructure = testTableStructure;
window.runAllTests = runAllTests;

console.log('🧪 Funções de teste disponíveis:');
console.log('  - testSupabaseConnection()');
console.log('  - testSpecificUUID()');
console.log('  - testFetchFunction()');
console.log('  - testTableStructure()');
console.log('  - runAllTests()');
console.log('');
console.log('💡 Execute runAllTests() para testar tudo!');

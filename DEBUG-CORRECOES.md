# 🔍 Debug e Correções - Páginas Individuais de Peças

## 🎯 Problema Identificado

A página da peça retornava "Peça não encontrada" mesmo com UUID existente no Supabase, mostrando erro 400 na busca.

## 🛠️ Soluções Implementadas

### 1. **Separação de Queries (Principal Causa)**
- **Problema**: JOIN com relações do Supabase causando erro 400
- **Solução**: Separar em 3 queries independentes:
  1. Buscar dados básicos da peça
  2. Buscar coleção (se existir)
  3. Buscar imagens da peça

### 2. **Robustez na Busca**
- Trocado `.single()` por `.maybeSingle()` para evitar erros
- Validação de UUID vs Slug melhorada
- Tratamento específico para cada tipo de erro

### 3. **Logs Detalhados de Debug**
```javascript
console.log('🔍 DEBUG: Iniciando busca da peça com identifier:', identifier);
console.log('🔍 DEBUG: Identifier é UUID?', isUuid);
console.log('🔍 DEBUG: Resultado da busca da peça:', data);
console.log('❌ DEBUG: Detalhes do erro:', error);
```

### 4. **Tratamento de Erros Específicos**
- ID ausente → "URL incompleta"
- ID inválido → "URL inválida"
- Peça não encontrada → "Peça não encontrada"
- Erro de conexão → "Erro de conexão"
- Dados corrompidos → "Dados corrompidos"

## 📁 Arquivos Modificados

### `assets/js/supabase-data.js`
- ✅ Função `fetchPecaByIdentifier` reescrita com robustez
- ✅ Separação de queries em 3 etapas
- ✅ Logs detalhados em cada etapa
- ✅ Validação de dados e tratamento de erros

### `assets/js/peca.js`
- ✅ Método `getPecaIdFromUrl` com logs detalhados
- ✅ Método `carregarPeca` com validações robustas
- ✅ Método `mostrarErro` com mensagens específicas
- ✅ Priorização de ID sobre slug (conforme URL atual)

## 🧪 Ferramentas de Debug Criadas

### `debug-peca.html`
Página completa para testar o UUID específico e outros cenários:
- Teste com UUID: `956afe38-b6b7-40ce-8b1f-b9370e9b6483`
- Teste com ID inválido
- Teste com ID vazio
- Teste sem parâmetros
- Teste com slug

### `teste-supabase.js`
Script com funções de teste para o console:
- `testSupabaseConnection()` - Testa conexão básica
- `testSpecificUUID()` - Testa UUID específico
- `testFetchFunction()` - Testa função completa
- `testTableStructure()` - Testa estrutura das tabelas
- `runAllTests()` - Executa todos os testes

## 🔍 Como Usar as Ferramentas de Debug

### Método 1: Página de Debug
1. Acesse: `http://localhost:8080/debug-peca.html`
2. Abra o console (F12)
3. Clique nos links de teste
4. Observe os logs 🔍 DEBUG

### Método 2: Script de Teste
1. Acesse qualquer página do site
2. Abra o console (F12)
3. Carregue o script: `<script src="teste-supabase.js"></script>`
4. Execute: `runAllTests()`

## 🚀 Fluxo de Debug Sugerido

### 1. Verificar Conexão Básica
```javascript
testSupabaseConnection()
```
- Se falhar → Problema de conexão ou RLS

### 2. Verificar Estrutura das Tabelas
```javascript
testTableStructure()
```
- Se falhar → Tabela ou coluna não existe

### 3. Testar UUID Específico
```javascript
testSpecificUUID()
```
- Se falhar → UUID não existe ou política RLS

### 4. Testar Função Completa
```javascript
testFetchFunction()
```
- Se falhar → Erro na lógica da função

## 🐛 Possíveis Causas do Erro 400

### 1. **Tabela Inexistente**
- Verificar se `pecas`, `pecas_imagens`, `colecoes` existem
- Verificar nomes exatos das colunas

### 2. **Políticas RLS**
- Configurar RLS para permitir `SELECT` público:
```sql
-- Exemplo de política RLS
CREATE POLICY "Peças públicas" ON pecas
FOR SELECT USING (ativa = true);
```

### 3. **Relacionamentos Quebrados**
- Verificar se `peca_id` existe em `pecas_imagens`
- Verificar se `colecao_id` existe em `pecas`

### 4. **UUID Inválido**
- Verificar formato do UUID
- Testar com UUID conhecido que existe

## 📋 Checklist de Verificação

- [ ] Conexão com Supabase funcionando
- [ ] Tabelas `pecas`, `pecas_imagens`, `colecoes` existem
- [ ] Políticas RLS configuradas para acesso público
- [ ] UUID `956afe38-b6b7-40ce-8b1f-b9370e9b6483` existe na tabela `pecas`
- [ ] Peça está com `ativa = true`
- [ ] Logs mostrando cada etapa da busca

## 🎯 Resultado Esperado

Após as correções:
1. ✅ Logs detalhados mostrando cada etapa
2. ✅ Mensagens de erro específicas
3. ✅ Separação de queries para evitar erro 400
4. ✅ Tratamento robusto de todos os cenários
5. ✅ Ferramentas de debug funcionais

## 🚀 Próximos Passos

1. **Executar testes**: Use `debug-peca.html` ou `runAllTests()`
2. **Verificar logs**: Observe os 🔍 DEBUG no console
3. **Identificar causa**: Veja onde exatamente ocorre o erro
4. **Corrigir configuração**: Ajuste RLS ou estrutura se necessário
5. **Validar solução**: Confirme que a página funciona

---

**Status**: ✅ **Correções Implementadas**  
**Pronto para teste**: Sim  
**Ferramentas de debug**: Disponíveis  
**Documentação**: Completa

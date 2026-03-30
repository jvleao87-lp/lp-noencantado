# Páginas Individuais de Peças - Documentação

## Overview

Implementação de páginas individuais para cada peça de crochê, substituindo o modal por uma experiência de navegação completa com rota dinâmica.

## Estrutura de Arquivos

### Novos Arquivos
- `peca.html` - Template da página individual da peça
- `assets/css/peca.css` - Estilos específicos para página da peça
- `assets/js/peca.js` - Funcionalidades da página da peça
- `teste-peca.html` - Página de testes

### Arquivos Modificados
- `assets/js/card-peca.js` - Atualizado para navegar em vez de abrir modal
- `assets/js/supabase-data.js` - Adicionada função `fetchPecaByIdentifier`

## Funcionalidades Implementadas

### 1. Navegação Dinâmica
- **URL Pattern**: `peca.html?id=[uuid]` ou `peca.html?slug=[slug]`
- **Prioridade**: Slug se disponível, senão ID
- **SEO Friendly**: URLs amigáveis com slugs

### 2. Galeria de Imagens
- **Imagem Principal**: Grande e destacada
- **Miniaturas**: Scroll horizontal com navegação
- **Transições Suaves**: Opacity e transform animados
- **Responsivo**: Adaptável para mobile/tablet/desktop

### 3. Lightbox/Zoom
- **Clique na Imagem**: Abre visualização ampliada
- **Navegação**: Setas e teclado (← → ESC)
- **Mobile Optimized**: Funciona bem em touch devices
- **Performance**: Lazy loading nas miniaturas

### 4. Informações da Peça
- **Título**: Typography personalizada
- **Categoria**: Badge com emoji da coleção
- **Disponibilidade**: Status visual claro
- **Descrição**: Texto formatado e legível

### 5. Botão de Encomenda
- **WhatsApp Integration**: Mensagem pré-preenchida
- **Personalização**: Inclui nome da peça
- **Call-to-Action**: Destaque visual claro

### 6. SEO e Metadata
- **Título Dinâmico**: `[Nome da Peça] | Nó Encantado`
- **Open Graph**: Facebook/WhatsApp preview
- **Twitter Cards**: Compartilhamento otimizado
- **Canonical URL**: Evita conteúdo duplicado

## Estrutura de Dados

### Tabela `pecas`
```sql
CREATE TABLE pecas (
    id UUID PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE, -- opcional, para URLs amigáveis
    descricao TEXT,
    categoria TEXT,
    disponivel BOOLEAN DEFAULT true,
    destaque BOOLEAN DEFAULT false,
    ativa BOOLEAN DEFAULT true,
    imagem TEXT, -- fallback image
    colecao_id UUID REFERENCES colecoes(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela `pecas_imagens`
```sql
CREATE TABLE pecas_imagens (
    id UUID PRIMARY KEY,
    peca_id UUID REFERENCES pecas(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    categoria TEXT, -- legenda ou alt text
    ordem INTEGER DEFAULT 0, -- para ordenação
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Componentização

### 1. CardPeca (assets/js/card-peca.js)
- **Responsabilidade**: Renderizar cards na listagem
- **Navegação**: Redireciona para página individual
- **Alternância**: Auto-rotate imagens (se múltiplas)

### 2. PecaPage (assets/js/peca.js)
- **Responsabilidade**: Controlar página individual
- **Carregamento**: Busca dados do Supabase
- **Galeria**: Controle de imagens e lightbox
- **SEO**: Atualiza metadata dinamicamente

### 3. Supabase Integration (assets/js/supabase-data.js)
- **fetchPecaByIdentifier**: Busca por ID ou slug
- **Relacionamentos**: Inclui coleções e imagens
- **Ordenação**: Por campo `ordem` nas imagens

## UX/UI Features

### Loading States
- **Skeleton Loading**: Indicador visual durante carregamento
- **Error States**: Mensagem amigável para peças não encontradas
- **Empty States**: Fallback para conteúdo ausente

### Mobile Experience
- **Touch Friendly**: Botões e controles otimizados
- **Responsive Layout**: Adaptável para todos os tamanhos
- **Performance**: Lazy loading e otimizações

### Accessibility
- **Keyboard Navigation**: Setas, ESC, Tab
- **Screen Reader**: ARIA labels e semântica HTML
- **Focus States**: Indicadores visuais claros

## URL Examples

### Com Slug (Preferido)
```
https://noencantado.shop/peca.html?slug=bolsa-croche-verao
```

### Com ID (Fallback)
```
https://noencantado.shop/peca.html?id=123e4567-e89b-12d3-a456-426614174000
```

## Integration Points

### 1. Listagem de Peças
```javascript
// No card-peca.js
aoClicar() {
    const pecaUrl = this.peca.slug 
        ? `peca.html?slug=${this.peca.slug}`
        : `peca.html?id=${this.peca.id}`;
    window.location.href = pecaUrl;
}
```

### 2. Busca no Supabase
```javascript
// No supabase-data.js
async function fetchPecaByIdentifier(identifier) {
    const isUuid = /^[0-9a-f]{8}-/.test(identifier);
    let query = supabaseClient.from('pecas').select('...');
    
    if (isUuid) {
        query = query.eq('id', identifier);
    } else {
        query = query.eq('slug', identifier);
    }
    
    return await query.single();
}
```

## Performance Optimizations

### 1. Lazy Loading
- Miniaturas carregam sob demanda
- Imagens principais com loading="lazy"
- Skeleton screens durante carregamento

### 2. Image Optimization
- WebP support (se disponível)
- Responsive images com srcset
- Compressão automática

### 3. Caching
- Browser cache para assets estáticos
- Supabase cache para queries frequentes
- Service Worker (futuro)

## Testing

### Test Page
Acesse `teste-peca.html` para testar diferentes cenários:
- Links com ID válido
- Links com slug válido  
- Links inválidos (erro handling)

### Manual Testing Checklist
- [ ] Carregamento da página com ID
- [ ] Carregamento da página com slug
- [ ] Navegação entre imagens
- [ ] Funcionalidade do lightbox
- [ ] Botão de encomenda (WhatsApp)
- [ ] Responsividade mobile
- [ ] SEO metadata
- [ ] Error states
- [ ] Loading states

## Future Enhancements

### 1. Next.js Migration
- App Router com rotas `/pecas/[slug]`
- Server-side rendering para SEO
- Static generation para peças estáticas

### 2. Advanced Features
- Variações de produtos (cores/tamanhos)
- Sistema de avaliações
- Related products
- Wishlist functionality

### 3. Performance
- Image CDN integration
- Progressive loading
- Service Worker implementation

## Deployment Notes

### Static Hosting (Vercel/Netlify)
- Todos os arquivos são estáticos
- Supabase funciona via CDN
- Não requer build step

### SEO Configuration
- Adicionar ao sitemap.xml
- Configurar redirects se necessário
- Monitorar Google Search Console

## Troubleshooting

### Common Issues

1. **Peça não encontrada**
   - Verificar se ID/slug está correto
   - Confirmar que peça está `ativa = true`
   - Checar políticas RLS no Supabase

2. **Imagens não carregam**
   - Verificar URLs no Supabase
   - Confirmar CORS configuration
   - Checar se `pecas_imagens` tem dados

3. **Lightbox não funciona**
   - Verificar se JavaScript carregou
   - Checar conflitos com outros scripts
   - Testar em diferentes browsers

### Debug Mode
Adicione `?debug=true` à URL para ver logs detalhados no console.

---

## Conclusão

Esta implementação proporciona uma experiência completa de página individual para peças, com foco em SEO, performance e UX, mantendo a identidade visual artesanal do Nó Encantado.

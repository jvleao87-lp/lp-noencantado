# Estrutura Completa do Projeto Nó Encantado

## Descrição Geral
Landing page para a marca Nó Encantado, especializada em peças de crochê artesanais feitas à mão em Pernambuco. O projeto é um site estático desenvolvido com HTML, CSS e JavaScript puro, otimizado para SEO e responsivo.

## Estrutura de Diretórios

```
lp-noencantado/
├── .git/                     # Controle de versão Git
├── README.md                 # Documentação do projeto
├── _redirects                # Configurações de redirecionamento (provavelmente para Netlify/Vercel)
├── sitemap.xml              # Sitemap para SEO
├── index.html               # Página principal (38KB)
├── index.html.backup        # Backup da página principal (28KB)
├── admin/                   # Diretório vazio (possível área administrativa)
├── pages/                   # Páginas secundárias
│   ├── about.html          # Página Sobre (7.5KB)
│   ├── contact.html        # Página de Contato (13.8KB)
│   ├── cotacao.html        # Página de Cotação (13.6KB)
│   └── services.html       # Página de Serviços (9.8KB)
└── assets/                 # Recursos estáticos
    ├── css/                # Estilos
    │   └── style.css       # CSS principal (53KB)
    ├── js/                 # JavaScript
    │   └── main.js         # JavaScript principal (17KB)
    └── images/             # Imagens e mídias
        ├── anna-beatriz.png      # Foto da artesã (946KB)
        ├── bags.jpg              # Imagem de bolsas (2.7MB)
        ├── bolsas.jpg            # Imagem de bolsas (282KB)
        ├── chapeus.jpg           # Imagem de chapéus (152KB)
        ├── croppeds.jpg          # Imagem de croppeds (163KB)
        ├── favicon.png           # Favicon do site (584KB)
        ├── hero-bg-desktop.png   # Background hero desktop (1.6MB)
        ├── hero-bg-mobile.png    # Background hero mobile (1.9MB)
        ├── logo-no-encantado.png # Logo da marca (236KB)
        ├── verao.mp4             # Vídeo de verão (1.6MB)
        ├── verao1.jpeg           # Imagem verão 1 (366KB)
        ├── verao2.jpeg           # Imagem verão 2 (295KB)
        ├── verao3.jpeg           # Imagem verão 3 (402KB)
        ├── verao4.jpeg           # Imagem verão 4 (234KB)
        ├── verao5.jpeg           # Imagem verão 5 (256KB)
        └── verao6.jpeg           # Imagem verão 6 (238KB)
```

## Detalhes dos Arquivos Principais

### index.html (38KB)
- **Funcionalidade**: Página principal e landing page
- **Conteúdo**: 
  - Metatags completas para SEO
  - Open Graph para redes sociais
  - Twitter Cards
  - Dados estruturados JSON-LD para LocalBusiness
  - Seções: Hero, Produtos, Sobre, Contato
- **Tecnologias**: HTML5 semântico, Bootstrap 5

### assets/css/style.css (53KB)
- **Funcionalidade**: Estilos personalizados do projeto
- **Características**: 
  - Design responsivo
  - Cores customizadas (#E6B8A2 como tema principal)
  - Animações e transições
  - Otimização para mobile

### assets/js/main.js (17KB)
- **Funcionalidade**: Interações JavaScript
- **Recursos**:
  - Validação de formulários
  - Animações de scroll
  - Modal de produtos
  - Funcionalidades de navegação

### Páginas Secundárias
- **about.html**: Página sobre a artesã e história da marca
- **contact.html**: Formulário de contato e informações
- **cotacao.html**: Sistema de cotação de produtos
- **services.html**: Descrição dos serviços oferecidos

## Recursos de Mídia

### Imagens de Produto
- **Bags**: Imagem principal de bolsas (2.7MB)
- **Categorias**: Bolsas, chapéus, croppeds em formatos separados
- **Coleção Verão**: 6 imagens JPEG da coleção de verão
- **Hero Background**: Imagens específicas para desktop e mobile

### Identidade Visual
- **Logo**: logo-no-encantado.png (236KB)
- **Favicon**: favicon.png (584KB)
- **Artesã**: Foto pessoal da Anna Beatriz

### Vídeo
- **vera.mp4**: Vídeo promocional da coleção de verão (1.6MB)

## Configurações de Deploy

### _redirects
Arquivo de configuração para redirecionamentos (provavelmente para Netlify ou Vercel)

### sitemap.xml
Sitemap XML para otimização de SEO com todas as páginas do site

## Características Técnicas

### SEO
- Metatags completas e otimizadas
- Dados estruturados JSON-LD
- Sitemap.xml
- Open Graph e Twitter Cards
- URLs amigáveis

### Performance
- Imagens otimizadas para web
- CSS e JavaScript minificados
- Design responsivo mobile-first
- Lazy loading de imagens

### Tecnologias Utilizadas
- **HTML5**: Semântico e acessível
- **CSS3**: Flexbox, Grid, animações
- **JavaScript ES6+**: Moderno e otimizado
- **Bootstrap 5**: Framework CSS para componentes
- **Schema.org**: Dados estruturados

## Informações de Negócio

### Nó Encantado
- **Segmento**: Artesanato de crochê
- **Localização**: Pernambuco, Brasil
- **Produtos**: Bolsas, tops, acessórios de crochê
- **Artesã**: Anna Beatriz
- **Contato**: +55 81 99266-4924
- **Website**: https://noencantado.shop/

### Público-Alvo
- Clientes que valorizam produtos artesanais
- Interessados em moda sustentável
- Apoiadores de pequenos negócios locais
- Mercado de moda e acessórios no Brasil

## Manutenção e Atualizações

### Facilidade de Manutenção
- Código bem estruturado e comentado
- Separação clara de responsabilidades
- Assets organizados por tipo
- Backup dos arquivos principais

### Pontos de Atenção
- Otimização contínua de imagens
- Atualização de conteúdo sazonal
- Monitoramento de performance
- Atualizações de segurança

## Próximos Passos Sugeridos

1. **Otimização de Performance**: Comprimir imagens adicionalmente
2. **Analytics**: Implementar Google Analytics
3. **E-commerce**: Integrar sistema de vendas
4. **Blog**: Adicionar seção de conteúdo
5. **Testes A/B**: Para otimização de conversão

---

## Registro de Mudanças (Changelog)

### 29/03/2026 - Criação do Documento de Estrutura
- **Criado**: Arquivo `ESTRUTURA_PROJETO.md` com documentação completa
- **Motivo**: Necessidade de documentar estrutura atual do projeto
- **Responsável**: Sistema de IA Cascade
- **Status**: Concluído

### 29/03/2026 - Refatoração para Configuração Centralizada
- **Tipo**: Refatoração/Otimização
- **Arquivos afetados**: 
  - `assets/js/site-config.js` (criado)
  - `index.html`
  - `pages/cotacao.html`
  - `pages/about.html`
  - `pages/services.html`
  - `pages/contact.html`
- **Descrição**: Centralizou todas as informações de contato (WhatsApp, telefone, Instagram) em um único arquivo de configuração para facilitar manutenção futura
- **Motivo**: Eliminar duplicação de informações de contato hardcoded em múltiplos arquivos
- **Impacto**: Facilita atualizações futuras - basta alterar um arquivo para atualizar todo o site
- **Dependências**: Criado novo arquivo JavaScript de configuração
- **Responsável**: Sistema de IA Cascade
- **Status**: Concluído
- **Testes realizados**: Verificação de todos os data attributes e links em todas as páginas
- **Próximos passos**: Monitorar funcionamento dos links dinâmicos

### [Data] - [Título da Mudança]
- **Tipo**: [Adição/Modificação/Remoção/Correção]
- **Arquivos afetados**: [Lista de arquivos]
- **Descrição**: [Detalhes da mudança]
- **Motivo**: [Por que a mudança foi necessária]
- **Responsável**: [Quem fez a mudança]
- **Status**: [Em progresso/Concluído/Testando]

---

## Template para Registro de Novas Mudanças

Copie e preencha este template para cada nova modificação:

```markdown
### [DD/MM/AAAA] - [Título da Mudança]
- **Tipo**: [Adição/Modificação/Remoção/Correção/Otimização]
- **Arquivos afetados**: 
  - `arquivo1.ext`
  - `arquivo2.ext`
  - `pasta/arquivo3.ext`
- **Descrição**: [Descrição detalhada do que foi alterado]
- **Motivo**: [Justificativa da mudança]
- **Impacto**: [Como isso afeta o projeto/usuários]
- **Dependências**: [Dependências criadas ou removidas]
- **Responsável**: [Nome ou responsável]
- **Status**: [Em progresso/Concluído/Testando/Aguardando aprovação]
- **Testes realizados**: [Lista de testes feitos]
- **Próximos passos**: [O que precisa ser feito depois]
```

---

## Instruções de Uso

1. **Sempre atualize este documento** quando fizer qualquer alteração no projeto
2. **Use o template acima** para manter consistência nos registros
3. **Seja específico** na descrição das mudanças
4. **Registre datas corretamente** no formato DD/MM/AAAA
5. **Mantenha ordem cronológica** (mais recente no topo)
6. **Atualize a estrutura geral** se adicionar/remover pastas ou arquivos importantes

---

## Controle de Versão

- **Versão atual**: 1.0.0
- **Data de criação**: 29/03/2026
- **Última atualização**: 29/03/2026
- **Próxima versão planejada**: [A definir]

---

## Notas Importantes

- Este documento deve ser mantido atualizado juntamente com o controle de versão Git
- Qualquer mudança significativa deve ser registrada aqui antes do commit
- Use mensagens de commit consistentes com as descrições registradas aqui

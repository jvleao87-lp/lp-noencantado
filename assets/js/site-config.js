/**
 * Configurações centralizadas do site Nó Encantado
 * Todas as informações de contato e redes sociais em um único lugar
 */

const SiteConfig = {
    // Informações do negócio
    businessName: "Nó Encantado",
    
    // Telefone
    phoneDisplay: "(81) 9523-2597",
    phoneRaw: "558195232597",
    
    // WhatsApp
    whatsappMessage: "Olá! Vim pelo site e quero saber mais sobre as peças.",
    get whatsappUrl() {
        return `https://wa.me/${this.phoneRaw}?text=${encodeURIComponent(this.whatsappMessage)}`;
    },
    
    // Instagram
    instagramUrl: "https://www.instagram.com/_noencantado",
    instagramHandle: "@_noencantado",
    
    // Website
    websiteUrl: "https://noencantado.shop",
    
    // Redes sociais adicionais (para futura expansão)
    socialMedia: {
        instagram: {
            url: this.instagramUrl,
            handle: this.instagramHandle
        },
        whatsapp: {
            url: this.whatsappUrl,
            phone: this.phoneRaw
        }
    }
};

// Função para injetar configurações nos elementos HTML
function injectSiteConfig() {
    // Injetar links de WhatsApp
    const whatsappElements = document.querySelectorAll('[data-whatsapp-link]');
    whatsappElements.forEach(element => {
        element.href = SiteConfig.whatsappUrl;
        element.setAttribute('href', SiteConfig.whatsappUrl);
    });
    
    // Injetar números de telefone para exibição
    const phoneDisplayElements = document.querySelectorAll('[data-phone-display]');
    phoneDisplayElements.forEach(element => {
        element.textContent = SiteConfig.phoneDisplay;
        element.innerText = SiteConfig.phoneDisplay;
    });
    
    // Injetar links do Instagram
    const instagramElements = document.querySelectorAll('[data-instagram-link]');
    instagramElements.forEach(element => {
        element.href = SiteConfig.instagramUrl;
        element.setAttribute('href', SiteConfig.instagramUrl);
    });
    
    // Injetar handles do Instagram
    const instagramHandleElements = document.querySelectorAll('[data-instagram-handle]');
    instagramHandleElements.forEach(element => {
        element.textContent = SiteConfig.instagramHandle;
        element.innerText = SiteConfig.instagramHandle;
    });
    
    // Injetar nome do negócio
    const businessNameElements = document.querySelectorAll('[data-business-name]');
    businessNameElements.forEach(element => {
        element.textContent = SiteConfig.businessName;
        element.innerText = SiteConfig.businessName;
    });
    
    // Injetar URL do website
    const websiteUrlElements = document.querySelectorAll('[data-website-url]');
    websiteUrlElements.forEach(element => {
        element.href = SiteConfig.websiteUrl;
        element.setAttribute('href', SiteConfig.websiteUrl);
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', injectSiteConfig);

// Também executar imediatamente caso o DOM já esteja carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSiteConfig);
} else {
    injectSiteConfig();
}

// Exportar para uso em outros scripts se necessário
window.SiteConfig = SiteConfig;

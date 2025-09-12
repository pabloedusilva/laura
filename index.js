/**
 * ==========================================
 * LAURA'S BURGUER - SISTEMA DE LANCHONETE
 * ==========================================
 * 
 * Site moderno e responsivo para lanchonete
 * Funcionalidades: Carrinho interativo, localStorage, responsivo
 * Produtos: Hambúrguer, Batata Frita, Refrigerante
 * 
 * @author GitHub Copilot
 * @version 1.0
 */

// ===========================================
// DADOS DOS PRODUTOS
// ===========================================
const produtos = [
    {
        id: 1,
        nome: 'Hambúrguer Artesanal',
        descricao: 'Pão brioche artesanal, blend premium 150g, queijo cheddar derretido, alface crocante, tomate fresco e nosso molho especial da casa',
        preco: 25.90,
        icone: 'sandwich',
        imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Principais'
    },
    {
        id: 2,
        nome: 'Batata Frita Premium',
        descricao: 'Batatas rústicas selecionadas, cortadas na medida certa, temperadas com ervas finas e sal marinho. Crocantes por fora, macias por dentro',
        preco: 12.90,
        icone: 'french-fries',
        imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Acompanhamentos'
    },
    {
        id: 3,
        nome: 'Refrigerantes',
        descricao: 'Escolha sua bebida favorita! Servido gelado em taça de vidro com gelo e limão - 350ml',
        icone: 'glass-water',
        categoria: 'Bebidas',
        isVariant: true,
        opcoes: [
            {
                id: 'coca-cola',
                nome: 'Coca-Cola',
                preco: 6.90,
                imagem: 'https://img.freepik.com/fotos-premium/coca-cola-gelada-com-gelo-e-gotas-de-agua-no-fundo-branco_185193-90515.jpg'
            },
            {
                id: 'pepsi',
                nome: 'Pepsi',
                preco: 6.90,
                imagem: 'https://img.freepik.com/fotos-premium/lata-de-pepsi-com-gelo-e-agua-no-fundo_185193-90516.jpg'
            },
            {
                id: 'fanta-laranja',
                nome: 'Fanta Laranja',
                preco: 6.90,
                imagem: 'https://img.freepik.com/fotos-premium/refrigerante-laranja-fanta-gelado-com-gelo_185193-90517.jpg'
            },
            {
                id: 'sprite',
                nome: 'Sprite',
                preco: 6.90,
                imagem: 'https://img.freepik.com/fotos-premium/sprite-gelado-com-gelo-e-limao_185193-90518.jpg'
            },
            {
                id: 'guarana',
                nome: 'Guaraná Antártica',
                preco: 6.90,
                imagem: 'https://img.freepik.com/fotos-premium/guarana-antarctica-gelado-com-gelo_185193-90519.jpg'
            },
            {
                id: 'coca-zero',
                nome: 'Coca-Cola Zero',
                preco: 6.90,
                imagem: 'https://img.freepik.com/fotos-premium/coca-cola-zero-gelada-com-gelo_185193-90520.jpg'
            }
        ],
        opcaoSelecionada: 'coca-cola' // Opção padrão
    }
];

// ===========================================
// VARIÁVEIS GLOBAIS
// ===========================================
let carrinho = [];
let carrinhoAberto = false;
let pedidos = [];
let pedidosAberto = false;

// ===========================================
// ELEMENTOS DOM
// ===========================================
const menuGrid = document.getElementById('menuGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const successModal = document.getElementById('successModal');
const ordersToggle = document.getElementById('ordersToggle');
const ordersSidebar = document.getElementById('ordersSidebar');
const ordersOverlay = document.getElementById('ordersOverlay');
const ordersClose = document.getElementById('ordersClose');
const ordersContent = document.getElementById('ordersContent');

// ===========================================
// INICIALIZAÇÃO
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    carregarProdutos();
    carregarCarrinhoDoLocalStorage();
    carregarPedidosDoLocalStorage();
    configurarEventListeners();
    atualizarContadorCarrinho();
    atualizarCarrinhoUI();
    atualizarPedidosUI();
    
    // Animação de entrada dos produtos
    setTimeout(() => {
        animarProdutos();
    }, 100);
}

// ===========================================
// RENDERIZAÇÃO DOS PRODUTOS
// ===========================================
function carregarProdutos() {
    menuGrid.innerHTML = '';
    
    produtos.forEach((produto, index) => {
        if (produto.isVariant) {
            // Produto com variantes (refrigerantes)
            const opcaoAtual = produto.opcoes.find(opcao => opcao.id === produto.opcaoSelecionada);
            
            const produtoHTML = `
                <div class="menu-item variant-product" data-index="${index}" data-product-id="${produto.id}">
                    <div class="menu-item-image-container">
                        <img src="${opcaoAtual.imagem}" alt="${opcaoAtual.nome}" class="menu-item-image variant-main-image" loading="lazy">
                        <div class="menu-item-overlay"></div>
                    </div>
                    <div class="menu-item-content">
                        <h3 class="menu-item-title">${produto.nome}</h3>
                        <p class="menu-item-description">${produto.descricao}</p>
                        
                        <!-- Seletor de variantes -->
                        <div class="variant-selector">
                            ${produto.opcoes.map(opcao => `
                                <div class="variant-option ${opcao.id === produto.opcaoSelecionada ? 'selected' : ''}" 
                                     data-variant-id="${opcao.id}" 
                                     data-product-id="${produto.id}"
                                     onclick="selecionarVariante(${produto.id}, '${opcao.id}')">
                                    <img src="${opcao.imagem}" alt="${opcao.nome}" class="variant-thumb">
                                    <span class="variant-name">${opcao.nome}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="menu-item-price variant-price">R$ ${opcaoAtual.preco.toFixed(2).replace('.', ',')}</div>
                        <button class="add-to-cart" onclick="adicionarVarianteAoCarrinho(${produto.id})">
                            <i data-lucide="plus"></i>
                            <span>Adicionar ao Carrinho</span>
                        </button>
                    </div>
                </div>
            `;
            
            menuGrid.innerHTML += produtoHTML;
        } else {
            // Produto normal
            const produtoHTML = `
                <div class="menu-item" data-index="${index}">
                    <div class="menu-item-image-container">
                        <img src="${produto.imagem}" alt="${produto.nome}" class="menu-item-image" loading="lazy">
                        <div class="menu-item-overlay"></div>
                    </div>
                    <div class="menu-item-content">
                        <h3 class="menu-item-title">${produto.nome}</h3>
                        <p class="menu-item-description">${produto.descricao}</p>
                        <div class="menu-item-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                        <button class="add-to-cart" onclick="adicionarAoCarrinho(${produto.id})">
                            <i data-lucide="plus"></i>
                            <span>Adicionar ao Carrinho</span>
                        </button>
                    </div>
                </div>
            `;
            
            menuGrid.innerHTML += produtoHTML;
        }
    });
    
    // Reinicializar ícones após adicionar novo conteúdo
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// ===========================================
// ANIMAÇÕES
// ===========================================
function animarProdutos() {
    const items = document.querySelectorAll('.menu-item');
    
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 150);
    });
}

function scrollToMenu() {
    const menuSection = document.getElementById('menu');
    menuSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// ===========================================
// GERENCIAMENTO DO CARRINHO
// ===========================================
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) return;
    
    // Para produtos normais (não variantes), usar apenas o ID do produto
    const itemExistente = carrinho.find(item => 
        !item.isVariant && item.id === produtoId
    );
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1,
            uniqueId: null // Produtos normais não têm uniqueId
        });
    }
    
    atualizarCarrinhoUI();
    atualizarContadorCarrinho();
    salvarCarrinhoNoLocalStorage();
    
    // Feedback visual
    mostrarFeedbackAdicao();
}

function selecionarVariante(produtoId, varianteId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto || !produto.isVariant) return;
    
    // Atualizar a opção selecionada
    produto.opcaoSelecionada = varianteId;
    
    // Encontrar a opção atual
    const opcaoAtual = produto.opcoes.find(opcao => opcao.id === varianteId);
    if (!opcaoAtual) return;
    
    // Atualizar a UI
    const menuItem = document.querySelector(`[data-product-id="${produtoId}"]`);
    if (menuItem) {
        // Atualizar imagem principal
        const mainImage = menuItem.querySelector('.variant-main-image');
        if (mainImage) {
            mainImage.src = opcaoAtual.imagem;
            mainImage.alt = opcaoAtual.nome;
        }
        
        // Atualizar preço
        const priceElement = menuItem.querySelector('.variant-price');
        if (priceElement) {
            priceElement.textContent = `R$ ${opcaoAtual.preco.toFixed(2).replace('.', ',')}`;
        }
        
        // Atualizar seleção visual
        const allOptions = menuItem.querySelectorAll('.variant-option');
        allOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.variantId === varianteId) {
                option.classList.add('selected');
            }
        });
    }
}

function adicionarVarianteAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto || !produto.isVariant) return;
    
    const opcaoAtual = produto.opcoes.find(opcao => opcao.id === produto.opcaoSelecionada);
    if (!opcaoAtual) return;
    
    // Criar ID único para a variante
    const itemId = `${produtoId}_${opcaoAtual.id}`;
    
    const itemExistente = carrinho.find(item => item.uniqueId === itemId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produtoId,
            uniqueId: itemId,
            nome: opcaoAtual.nome,
            preco: opcaoAtual.preco,
            imagem: opcaoAtual.imagem,
            quantidade: 1,
            categoria: produto.categoria,
            isVariant: true,
            variantId: opcaoAtual.id
        });
    }
    
    atualizarCarrinhoUI();
    atualizarContadorCarrinho();
    salvarCarrinhoNoLocalStorage();
    
    // Feedback visual
    mostrarFeedbackAdicao();
}

function removerDoCarrinho(itemId) {
    const index = carrinho.findIndex(item => 
        item.uniqueId ? item.uniqueId === itemId : item.id === itemId
    );
    
    if (index !== -1) {
        carrinho.splice(index, 1);
        atualizarCarrinhoUI();
        atualizarContadorCarrinho();
        salvarCarrinhoNoLocalStorage();
    }
}

function alterarQuantidade(itemId, novaQuantidade) {
    const item = carrinho.find(item => 
        item.uniqueId ? item.uniqueId === itemId : item.id === itemId
    );
    
    if (item) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(itemId);
        } else {
            item.quantidade = novaQuantidade;
            atualizarCarrinhoUI();
            atualizarContadorCarrinho();
            salvarCarrinhoNoLocalStorage();
        }
    }
}

function alterarQuantidadePorIndice(itemIndex, novaQuantidade) {
    if (itemIndex < 0 || itemIndex >= carrinho.length) return;
    
    const item = carrinho[itemIndex];
    
    if (novaQuantidade <= 0) {
        carrinho.splice(itemIndex, 1);
    } else {
        item.quantidade = novaQuantidade;
    }
    
    atualizarCarrinhoUI();
    atualizarContadorCarrinho();
    salvarCarrinhoNoLocalStorage();
}

function limparCarrinho() {
    if (carrinho.length === 0) return;
    
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        carrinho = [];
        atualizarCarrinhoUI();
        atualizarContadorCarrinho();
        salvarCarrinhoNoLocalStorage();
    }
}

// ===========================================
// INTERFACE DO CARRINHO
// ===========================================
function atualizarCarrinhoUI() {
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i data-lucide="shopping-cart" style="width: 48px; height: 48px; color: #cbd5e0;"></i>
                </div>
                <p style="color: #718096; margin-top: 1rem; font-weight: 500;">Seu carrinho está vazio</p>
                <p style="color: #a0aec0; font-size: 0.9rem;">Adicione alguns itens deliciosos!</p>
            </div>
        `;
        cartTotal.textContent = '0,00';
        
        // Reinicializar ícones
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
        return;
    }
    
    let html = '';
    let total = 0;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        const itemId = item.uniqueId || item.id;
        const itemIndex = carrinho.indexOf(item);
        
        html += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image" loading="lazy">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="alterarQuantidadePorIndice(${itemIndex}, ${item.quantidade - 1})" title="Diminuir quantidade">
                        <i data-lucide="minus" style="width: 12px; height: 12px;"></i>
                    </button>
                    <span class="quantity" style="color: #4a5568; font-weight: 600; min-width: 24px; text-align: center;">${item.quantidade}</span>
                    <button class="quantity-btn" onclick="alterarQuantidadePorIndice(${itemIndex}, ${item.quantidade + 1})" title="Aumentar quantidade">
                        <i data-lucide="plus" style="width: 12px; height: 12px;"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
    
    // Reinicializar ícones após atualizar carrinho
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
    
    // Animação do contador
    if (totalItens > 0) {
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

function mostrarFeedbackAdicao() {
    const button = event.target.closest('.add-to-cart');
    const originalHTML = button.innerHTML;
    
    button.innerHTML = `
        <i data-lucide="check" style="width: 18px; height: 18px;"></i>
        <span>Adicionado!</span>
    `;
    button.classList.add('added');
    
    // Reinicializar ícones do botão
    lucide.createIcons();
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('added');
        lucide.createIcons();
    }, 1500);
}

// ===========================================
// CONTROLES DO CARRINHO
// ===========================================
function abrirCarrinho() {
    carrinhoAberto = true;
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
    carrinhoAberto = false;
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function toggleCarrinho() {
    if (carrinhoAberto) {
        fecharCarrinho();
    } else {
        abrirCarrinho();
    }
}

// ===========================================
// CHECKOUT E FINALIZAÇÃO
// ===========================================
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Criar pedido
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const novoPedido = {
        id: Date.now(),
        numero: `#${String(pedidos.length + 1).padStart(4, '0')}`,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        itens: [...carrinho],
        total: total,
        status: 'preparando'
    };
    
    // Adicionar pedido ao histórico
    pedidos.unshift(novoPedido);
    salvarPedidosNoLocalStorage();
    atualizarPedidosUI();
    
    // Limpar carrinho
    carrinho = [];
    atualizarCarrinhoUI();
    atualizarContadorCarrinho();
    salvarCarrinhoNoLocalStorage();
    
    // Fechar carrinho
    fecharCarrinho();
    
    // Mostrar modal de sucesso
    mostrarModalSucesso();
}

function mostrarModalSucesso() {
    successModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    successModal.classList.remove('open');
    document.body.style.overflow = '';
}

// ===========================================
// GERENCIAMENTO DE PEDIDOS
// ===========================================
function abrirPedidos() {
    pedidosAberto = true;
    ordersSidebar.classList.add('open');
    ordersOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function fecharPedidos() {
    pedidosAberto = false;
    ordersSidebar.classList.remove('open');
    ordersOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function togglePedidos() {
    if (pedidosAberto) {
        fecharPedidos();
    } else {
        abrirPedidos();
    }
}

function atualizarPedidosUI() {
    if (pedidos.length === 0) {
        ordersContent.innerHTML = `
            <div class="empty-orders">
                <div class="empty-orders-icon">
                    <i data-lucide="clipboard-list" style="width: 48px; height: 48px; color: #cbd5e0;"></i>
                </div>
                <h3>Nenhum pedido encontrado</h3>
                <p>Seus pedidos anteriores aparecerão aqui</p>
            </div>
        `;
        
        // Reinicializar ícones
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
        return;
    }
    
    let html = '';
    
    pedidos.forEach(pedido => {
        const statusClass = `status-${pedido.status}`;
        const statusText = pedido.status === 'preparando' ? 'Preparando' : 
                          pedido.status === 'entregue' ? 'Entregue' : 'Cancelado';
        
        html += `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <div class="order-number">${pedido.numero}</div>
                        <div class="order-date">${pedido.data} às ${pedido.hora}</div>
                    </div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                </div>
                <div class="order-items">
        `;
        
        pedido.itens.forEach(item => {
            html += `
                <div class="order-item-detail">
                    <div>
                        <div class="order-item-name">${item.nome}</div>
                        <div class="order-item-quantity">${item.quantidade}x</div>
                    </div>
                    <div class="order-item-price">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="order-total">
                    <span>Total</span>
                    <span>R$ ${pedido.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        `;
    });
    
    ordersContent.innerHTML = html;
}

// ===========================================
// PERSISTÊNCIA DE DADOS (localStorage)
// ===========================================
function salvarCarrinhoNoLocalStorage() {
    try {
        localStorage.setItem('laurasBurger_carrinho', JSON.stringify(carrinho));
    } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
    }
}

function carregarCarrinhoDoLocalStorage() {
    try {
        const carrinhoSalvo = localStorage.getItem('laurasBurger_carrinho');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        carrinho = [];
    }
}

function salvarPedidosNoLocalStorage() {
    try {
        localStorage.setItem('laurasBurger_pedidos', JSON.stringify(pedidos));
    } catch (error) {
        console.error('Erro ao salvar pedidos:', error);
    }
}

function carregarPedidosDoLocalStorage() {
    try {
        const pedidosSalvos = localStorage.getItem('laurasBurger_pedidos');
        if (pedidosSalvos) {
            pedidos = JSON.parse(pedidosSalvos);
            // Simular alguns pedidos como entregues para pedidos antigos
            pedidos.forEach(pedido => {
                const dataPedido = new Date(pedido.data.split('/').reverse().join('-'));
                const hoje = new Date();
                const diffDays = (hoje - dataPedido) / (1000 * 60 * 60 * 24);
                
                if (diffDays > 1 && pedido.status === 'preparando') {
                    pedido.status = 'entregue';
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        pedidos = [];
    }
}

// ===========================================
// EVENT LISTENERS
// ===========================================
function configurarEventListeners() {
    // Controles do carrinho
    cartToggle.addEventListener('click', toggleCarrinho);
    cartClose.addEventListener('click', fecharCarrinho);
    cartOverlay.addEventListener('click', fecharCarrinho);
    
    // Controles dos pedidos
    ordersToggle.addEventListener('click', togglePedidos);
    ordersClose.addEventListener('click', fecharPedidos);
    ordersOverlay.addEventListener('click', fecharPedidos);
    
    // Botões do carrinho
    checkoutBtn.addEventListener('click', finalizarPedido);
    clearCartBtn.addEventListener('click', limparCarrinho);
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (successModal.classList.contains('open')) {
                closeModal();
            } else if (pedidosAberto) {
                fecharPedidos();
            } else if (carrinhoAberto) {
                fecharCarrinho();
            }
        }
    });
    
    // Prevenir scroll do body quando carrinho estiver aberto
    cartSidebar.addEventListener('wheel', function(e) {
        e.stopPropagation();
    });
    
    // Prevenir scroll do body quando pedidos estiver aberto
    ordersSidebar.addEventListener('wheel', function(e) {
        e.stopPropagation();
    });
    
    // Animação de scroll para produtos
    window.addEventListener('scroll', function() {
        const items = document.querySelectorAll('.menu-item:not(.visible)');
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                item.classList.add('visible');
            }
        });
        
        // Efeito parallax sutil no header
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        if (scrolled > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(25px)';
            header.style.borderBottom = '1px solid rgba(52, 152, 219, 0.2)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(52, 152, 219, 0.1)';
        }
    });
    
    // Responsividade - ajustar carrinho em resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && carrinhoAberto) {
            cartSidebar.style.right = '0';
        }
        if (window.innerWidth > 768 && pedidosAberto) {
            ordersSidebar.style.right = '0';
        }
    });
}

// ===========================================
// UTILITÁRIOS
// ===========================================
function formatarPreco(preco) {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// ===========================================
// TRATAMENTO DE ERROS
// ===========================================
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.error);
});

// ===========================================
// PERFORMANCE E OTIMIZAÇÃO
// ===========================================
// Debounce para resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Ações de resize otimizadas
        atualizarCarrinhoUI();
    }, 250);
});

// ===========================================
// MODAL HISTÓRIA
// ===========================================
function abrirModalHistoria() {
    const modal = document.getElementById('modalHistoria');
    const video = document.getElementById('videoHistoria');
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Reiniciar o vídeo
    video.currentTime = 0;
    video.play().catch(e => console.log('Auto-play bloqueado:', e));
    
    // Reinicializar ícones após mostrar modal
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function fecharModalHistoria() {
    const modal = document.getElementById('modalHistoria');
    const video = document.getElementById('videoHistoria');
    
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Pausar o vídeo
    video.pause();
}

// Fechar modal clicando fora do vídeo
document.getElementById('modalHistoria').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModalHistoria();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModalHistoria();
    }
});

// ===========================================
// NAVBAR GLASSMORPHISM
// ===========================================
// Navbar moderna com efeito glassmorphism sempre ativo

// ===========================================
// INICIALIZAÇÃO FINAL
// ===========================================
console.log('🍔 Laura\'s Burguer - Sistema iniciado com sucesso!');
console.log('📱 Site 100% responsivo (320px - 2560px+)');
console.log('💾 Dados persistidos no localStorage');
console.log('🛒 Carrinho interativo ativo');
console.log('📋 Histórico de pedidos implementado');
console.log('🎥 Modal de história implementado');
console.log('🎨 Navbar dinâmica ativa');

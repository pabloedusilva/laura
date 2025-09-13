/**
 * ==========================================
 * DASHBOARD ADMIN - LAURA'S BURGUER
 * ==========================================
 * 
 * Sistema administrativo para gerenciar produtos e pedidos
 * Funcionalidades: CRUD de produtos, visualização de pedidos
 * 
 * @author GitHub Copilot
 * @version 1.0
 */

// ===========================================
// DADOS E VARIÁVEIS GLOBAIS
// ===========================================
let produtos = [];
let pedidos = [];
let editingProductId = null;
let refriEditSnapshot = null; // snapshot para modal de refrigerantes

// ===========================================
// ELEMENTOS DOM
// ===========================================
const productsGrid = document.getElementById('productsGrid');
const ordersList = document.getElementById('ordersList');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const productType = document.getElementById('productType');
const modalTitle = document.getElementById('modalTitle');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const statusFilter = document.getElementById('statusFilter');
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
// Elementos do modal de refrigerantes
const refrigerantesModal = document.getElementById('refrigerantesModal');
const closeRefrigerantesModal = document.getElementById('closeRefrigerantesModal');
const cancelRefrigerantesBtn = document.getElementById('cancelRefrigerantesBtn');
const saveRefrigerantesBtn = document.getElementById('saveRefrigerantesBtn');
const refrigerantesList = document.getElementById('refrigerantesList');
const refriAddName = document.getElementById('refriAddName');
const refriAddPrice = document.getElementById('refriAddPrice');
const refriAddImage = document.getElementById('refriAddImage');
const refriAddBtn = document.getElementById('refriAddBtn');

// Estatísticas
const totalProdutos = document.getElementById('totalProdutos');
const totalPedidos = document.getElementById('totalPedidos');
const pedidosPreparando = document.getElementById('pedidosPreparando');

// Campos do formulário
const normalFields = document.getElementById('normalFields');
const refrigeranteFields = document.getElementById('refrigeranteFields');
const comboFields = document.getElementById('comboFields');

// ===========================================
// INICIALIZAÇÃO
// ===========================================
function inicializarDashboard() {
    carregarDados();
    configurarEventListeners();
    atualizarEstatisticas();
    renderizarProdutos();
    renderizarPedidos();
    bindUploadPreviews();
    
    console.log('🔧 Dashboard Admin iniciado com sucesso!');
}

// ===========================================
// GERENCIAMENTO DE DADOS
// ===========================================
function carregarDados() {
    // Carregar produtos do localStorage ou usar dados padrão
    try {
        const produtosSalvos = localStorage.getItem('laurasBurger_produtos_admin');
        if (produtosSalvos) {
            produtos = JSON.parse(produtosSalvos);
        } else {
            // Produtos padrão baseados no index
            produtos = [
                {
                    id: 1,
                    nome: 'Hambúrguer Artesanal',
                    descricao: 'Pão brioche artesanal, blend premium 150g, queijo cheddar derretido, alface crocante, tomate fresco e nosso molho especial da casa',
                    preco: 25.90,
                    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    categoria: 'Principais',
                    tipo: 'normal'
                },
                {
                    id: 2,
                    nome: 'Batata Frita Premium',
                    descricao: 'Batatas rústicas selecionadas, cortadas na medida certa, temperadas com ervas finas e sal marinho. Crocantes por fora, macias por dentro',
                    preco: 12.90,
                    imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    categoria: 'Acompanhamentos',
                    tipo: 'normal'
                }
            ];
        }

        // Carregar refrigerantes
        const refrigerantesSalvos = localStorage.getItem('laurasBurger_refrigerantes_admin');
        if (refrigerantesSalvos) {
            const refrigerantes = JSON.parse(refrigerantesSalvos);
            // Adicionar aos produtos se não existir produto de refrigerantes
            const hasRefrigerantes = produtos.find(p => p.tipo === 'refrigerante-container');
            if (!hasRefrigerantes && refrigerantes.length > 0) {
                produtos.push({
                    id: Date.now(),
                    nome: 'Refrigerantes',
                    descricao: 'Escolha sua bebida favorita! Servido gelado em taça de vidro com gelo e limão - 350ml',
                    categoria: 'Bebidas',
                    tipo: 'refrigerante-container',
                    opcoes: refrigerantes,
                    opcaoSelecionada: refrigerantes[0]?.id || null
                });
            }
        }

        // Carregar pedidos
        const pedidosSalvos = localStorage.getItem('laurasBurger_pedidos');
        if (pedidosSalvos) {
            pedidos = JSON.parse(pedidosSalvos);
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        produtos = [];
        pedidos = [];
    }
}

function salvarProdutos() {
    try {
        localStorage.setItem('laurasBurger_produtos_admin', JSON.stringify(produtos));
        
        // Salvar refrigerantes separadamente
        const refrigerantes = [];
        produtos.forEach(produto => {
            if (produto.tipo === 'refrigerante-container' && produto.opcoes) {
                refrigerantes.push(...produto.opcoes);
            }
        });
        localStorage.setItem('laurasBurger_refrigerantes_admin', JSON.stringify(refrigerantes));
        
        console.log('✅ Produtos salvos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
    }
}

// ===========================================
// GERENCIAMENTO DE ABAS
// ===========================================
function configurarEventListeners() {
    // Navegação por abas
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Modal
    addProductBtn.addEventListener('click', abrirModalAdicionar);
    closeModal.addEventListener('click', fecharModal);
    cancelBtn.addEventListener('click', fecharModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) fecharModal();
    });

    // Formulário
    productType.addEventListener('change', handleProductTypeChange);
    productForm.addEventListener('submit', handleFormSubmit);

    // Filtros
    statusFilter.addEventListener('change', renderizarPedidos);
}

function switchTab(tabName) {
    // Atualizar navegação
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Atualizar conteúdo
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
}

// ===========================================
// GERENCIAMENTO DE PRODUTOS
// ===========================================
function renderizarProdutos() {
    if (produtos.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="package"></i>
                <h3>Nenhum produto cadastrado</h3>
                <p>Clique em "Adicionar Produto" para começar</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let html = '';
    produtos.forEach(produto => {
        if (produto.tipo === 'refrigerante-container') {
            // Mostrar container de refrigerantes
            html += `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="https://images.unsplash.com/photo-1527960471264-932f39eb5846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="${produto.nome}" class="product-image">
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${produto.nome}</h3>
                        <p class="product-description">${produto.descricao}</p>
                        <p class="product-price">Variações: ${produto.opcoes?.length || 0}</p>
                        <div class="product-actions">
                            <button class="btn-edit" onclick="editarProduto(${produto.id})">
                                <i data-lucide="edit"></i>
                                Ver Refrigerantes
                            </button>
                            <button class="btn-danger" onclick="removerProduto(${produto.id})">
                                <i data-lucide="trash-2"></i>
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Produto normal
            html += `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${produto.nome}</h3>
                        <p class="product-description">${produto.descricao}</p>
                        <p class="product-price">R$ ${produto.preco?.toFixed(2).replace('.', ',')}</p>
                        <div class="product-actions">
                            <button class="btn-edit" onclick="editarProduto(${produto.id})">
                                <i data-lucide="edit"></i>
                                Editar
                            </button>
                            <button class="btn-danger" onclick="removerProduto(${produto.id})">
                                <i data-lucide="trash-2"></i>
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    productsGrid.innerHTML = html;
    lucide.createIcons();
}

function abrirModalAdicionar() {
    editingProductId = null;
    modalTitle.textContent = 'Adicionar Produto';
    productForm.reset();
    handleProductTypeChange();
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    bindUploadPreviews();
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    if (produto.tipo === 'refrigerante-container') {
        abrirModalRefrigerantes(produto);
        return;
    }

    editingProductId = id;
    modalTitle.textContent = 'Editar Produto';

    // preencher campos
    productType.value = produto.tipo || 'normal';
    handleProductTypeChange();
    if (produto.tipo === 'combo') {
        document.getElementById('comboName').value = produto.nome;
        document.getElementById('comboDescription').value = produto.descricao;
        document.getElementById('comboPrice').value = produto.preco;
        document.getElementById('comboImage').value = produto.imagem;
    } else {
        document.getElementById('productName').value = produto.nome;
        document.getElementById('productDescription').value = produto.descricao;
        document.getElementById('productPrice').value = produto.preco;
        document.getElementById('productImage').value = produto.imagem;
        document.getElementById('productCategory').value = produto.categoria;
    }

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    bindUploadPreviews();
}

function removerProduto(id) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
        produtos = produtos.filter(p => p.id !== id);
        salvarProdutos();
        renderizarProdutos();
        atualizarEstatisticas();
    }
}

function handleProductTypeChange() {
    const tipo = productType.value;
    
    // Esconder todos os campos
    normalFields.style.display = 'none';
    refrigeranteFields.style.display = 'none';
    comboFields.style.display = 'none';
    
    // Mostrar campos relevantes
    switch (tipo) {
        case 'normal':
            normalFields.style.display = 'block';
            break;
        case 'refrigerante':
            refrigeranteFields.style.display = 'block';
            break;
        case 'combo':
            comboFields.style.display = 'block';
            break;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const tipo = productType.value;
    let produto = {};

    switch (tipo) {
        case 'normal':
            produto = {
                id: editingProductId || Date.now(),
                nome: document.getElementById('productName').value,
                descricao: document.getElementById('productDescription').value,
                preco: parseFloat(document.getElementById('productPrice').value),
                imagem: document.getElementById('productImage').value,
                categoria: document.getElementById('productCategory').value,
                tipo: 'normal'
            };
            break;
            
        case 'refrigerante':
            // Adicionar à lista de refrigerantes existente ou criar nova
            const nome = document.getElementById('refriName').value;
            const preco = parseFloat(document.getElementById('refriPrice').value);
            const imagem = document.getElementById('refriImage').value;
            
            adicionarRefrigerante({ nome, preco, imagem });
            fecharModal();
            return;
            
        case 'combo':
            produto = {
                id: editingProductId || Date.now(),
                nome: document.getElementById('comboName').value,
                descricao: document.getElementById('comboDescription').value,
                preco: parseFloat(document.getElementById('comboPrice').value),
                imagem: document.getElementById('comboImage').value,
                categoria: 'Combos',
                tipo: 'combo'
            };
            break;
            
        default:
            alert('Selecione um tipo de produto válido');
            return;
    }

    if (editingProductId) {
        // Editar produto existente
        const index = produtos.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            produtos[index] = produto;
        }
    } else {
        // Adicionar novo produto
        produtos.push(produto);
    }

    salvarProdutos();
    renderizarProdutos();
    atualizarEstatisticas();
    fecharModal();
}

function adicionarRefrigerante(novoRefri) {
    // Encontrar ou criar container de refrigerantes
    let containerRefri = produtos.find(p => p.tipo === 'refrigerante-container');
    
    if (!containerRefri) {
        containerRefri = {
            id: Date.now(),
            nome: 'Refrigerantes',
            descricao: 'Escolha sua bebida favorita! Servido gelado em taça de vidro com gelo e limão - 350ml',
            categoria: 'Bebidas',
            tipo: 'refrigerante-container',
            opcoes: [],
            opcaoSelecionada: null
        };
        produtos.push(containerRefri);
    }

    // Adicionar novo refrigerante
    const refriId = `refri-${Date.now()}`;
    containerRefri.opcoes.push({
        id: refriId,
        nome: novoRefri.nome,
        preco: novoRefri.preco,
        imagem: novoRefri.imagem
    });

    if (!containerRefri.opcaoSelecionada) {
        containerRefri.opcaoSelecionada = refriId;
    }

    salvarProdutos();
    renderizarProdutos();
    atualizarEstatisticas();
}

function fecharModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
    editingProductId = null;
}

// ===========================================
// GERENCIAMENTO DE PEDIDOS
// ===========================================
function renderizarPedidos() {
    const filtroStatus = statusFilter.value;
    const pedidosFiltrados = filtroStatus ? 
        pedidos.filter(p => p.status === filtroStatus) : 
        pedidos;

    if (pedidosFiltrados.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i data-lucide="clipboard-list"></i>
                <h3>Nenhum pedido encontrado</h3>
                <p>Os pedidos dos clientes aparecerão aqui</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let html = '';
    pedidosFiltrados.forEach(pedido => {
        const statusClass = `status-${pedido.status}`;
        const statusText = pedido.status === 'preparando' ? 'Preparando' : 
                          pedido.status === 'entregue' ? 'Entregue' : 'Cancelado';

        html += `
            <div class="order-card">
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
                <div class="order-actions">
                    ${pedido.status === 'preparando' ? 
                        `<button class="btn-primary" onclick="marcarComoEntregue(${pedido.id})">
                            <i data-lucide="check"></i>
                            Marcar como Entregue
                        </button>` : 
                        ''
                    }
                    ${pedido.status === 'preparando' ? 
                        `<button class="btn-danger" onclick="cancelarPedido(${pedido.id})">
                            <i data-lucide="x"></i>
                            Cancelar Pedido
                        </button>` : 
                        ''
                    }
                </div>
            </div>
        `;
    });

    ordersList.innerHTML = html;
    lucide.createIcons();
}

function marcarComoEntregue(pedidoId) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.status = 'entregue';
        salvarPedidos();
        renderizarPedidos();
        atualizarEstatisticas();
    }
}

function cancelarPedido(pedidoId) {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
        const pedido = pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.status = 'cancelado';
            salvarPedidos();
            renderizarPedidos();
            atualizarEstatisticas();
        }
    }
}

function salvarPedidos() {
    try {
        localStorage.setItem('laurasBurger_pedidos', JSON.stringify(pedidos));
    } catch (error) {
        console.error('Erro ao salvar pedidos:', error);
    }
}

// ===========================================
// ESTATÍSTICAS
// ===========================================
function atualizarEstatisticas() {
    totalProdutos.textContent = produtos.length;
    totalPedidos.textContent = pedidos.length;
    pedidosPreparando.textContent = pedidos.filter(p => p.status === 'preparando').length;
}

// ===========================================
// FUNCIONALIDADE DE LOGOUT
// ===========================================
function configurarLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
                // Redirecionar para a página principal
                window.location.href = '../index.html';
            }
        });
    }
}

// ===========================================
// UPLOADS E IMAGENS
// ===========================================
// Bind image file inputs to previews and URL fields
function bindUploadPreviews() {
  const pairs = [
    { file: 'productImageFile', url: 'productImage', img: 'productImagePreview' },
    { file: 'refriImageFile', url: 'refriImage', img: 'refriImagePreview' },
    { file: 'comboImageFile', url: 'comboImage', img: 'comboImagePreview' }
  ];

  pairs.forEach(({ file, url, img }) => {
    const fileEl = document.getElementById(file);
    const urlEl = document.getElementById(url);
    const imgEl = document.getElementById(img);
    if (!fileEl || !urlEl || !imgEl) return;

    const updatePreviewFromUrl = () => {
      const v = (urlEl.value || '').trim();
      imgEl.src = v || '';
      imgEl.style.display = v ? 'block' : 'none';
    };

    urlEl.addEventListener('input', updatePreviewFromUrl);
    updatePreviewFromUrl();

    fileEl.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        urlEl.value = dataUrl; // embed as data URL to persist in localStorage
        imgEl.src = dataUrl;
        imgEl.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  });

  // Add-new refri bind
  const addFile = document.getElementById('refriAddImageFile');
  const addUrl = document.getElementById('refriAddImage');
  const addImg = document.getElementById('refriAddImagePreview');
  if (addFile && addUrl && addImg) {
    const updateAddPreview = () => {
      const v = (addUrl.value || '').trim();
      addImg.src = v || '';
      addImg.style.display = v ? 'block' : 'none';
    };
    addUrl.addEventListener('input', updateAddPreview);
    updateAddPreview();

    addFile.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        addUrl.value = dataUrl;
        addImg.src = dataUrl;
        addImg.style.display = 'block';
      };
      reader.readAsDataURL(f);
    });
  }
}

// When rendering refrigerantes editor rows, also attach per-row uploads
function renderizarRefrigerantesEditor(container) {
  if (!container.opcoes) container.opcoes = [];
  if (container.opcoes.length === 0) {
    refrigerantesList.innerHTML = `
      <div class="empty-state">
        <i data-lucide="cup-soda"></i>
        <h3>Nenhum refrigerante cadastrado</h3>
        <p>Adicione suas bebidas favoritas abaixo</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  let html = '';
  container.opcoes.forEach((refri, idx) => {
    const fileId = `refri-row-file-${idx}`;
    const urlId = `refri-row-url-${idx}`;
    const imgId = `refri-row-img-${idx}`;
    html += `
      <div class="refri-row">
        <div class="refri-img">
          <div class="image-preview small">
            <img id="${imgId}" src="${refri.imagem}" alt="${refri.nome}">
          </div>
        </div>
        <input class="form-input refri-name" data-index="${idx}" value="${refri.nome}" placeholder="Nome">
        <input class="form-input refri-price" data-index="${idx}" type="number" step="0.01" value="${Number(refri.preco || 0).toFixed(2)}" placeholder="Preço">
        <div>
          <input id="${urlId}" class="form-input refri-image" data-index="${idx}" value="${refri.imagem}" placeholder="URL da imagem">
          <input id="${fileId}" type="file" class="form-input" accept="image/*" style="margin-top:8px">
        </div>
        <div class="refri-actions">
          <button class="btn-secondary" data-action="up" data-index="${idx}" title="Mover para cima">▲</button>
          <button class="btn-secondary" data-action="down" data-index="${idx}" title="Mover para baixo">▼</button>
          <button class="btn-danger" data-action="remove" data-index="${idx}">
            <i data-lucide="trash-2"></i>
            Remover
          </button>
        </div>
      </div>`;
  });
  refrigerantesList.innerHTML = html;
  lucide.createIcons();

  // inline edits
  refrigerantesList.querySelectorAll('.refri-name').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const i = Number(e.target.dataset.index);
      container.opcoes[i].nome = e.target.value;
    });
  });
  refrigerantesList.querySelectorAll('.refri-price').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const i = Number(e.target.dataset.index);
      container.opcoes[i].preco = parseFloat(e.target.value || '0');
    });
  });
  refrigerantesList.querySelectorAll('.refri-image').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const i = Number(e.target.dataset.index);
      container.opcoes[i].imagem = e.target.value;
      const img = document.getElementById(`refri-row-img-${i}`);
      img.src = e.target.value;
    });
  });

  // file uploads per row
  container.opcoes.forEach((_, i) => {
    const fileEl = document.getElementById(`refri-row-file-${i}`);
    const urlEl = document.getElementById(`refri-row-url-${i}`);
    const imgEl = document.getElementById(`refri-row-img-${i}`);
    if (!fileEl || !urlEl || !imgEl) return;
    fileEl.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        urlEl.value = dataUrl;
        imgEl.src = dataUrl;
        container.opcoes[i].imagem = dataUrl;
      };
      reader.readAsDataURL(f);
    });
  });

  // actions
  refrigerantesList.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = Number(e.currentTarget.dataset.index);
      container.opcoes.splice(i, 1);
      if (container.opcaoSelecionada && !container.opcoes.find(o => o.id === container.opcaoSelecionada)) {
        container.opcaoSelecionada = container.opcoes[0]?.id || null;
      }
      renderizarRefrigerantesEditor(container);
    });
  });
  refrigerantesList.querySelectorAll('[data-action="up"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = Number(e.currentTarget.dataset.index);
      if (i > 0) {
        [container.opcoes[i-1], container.opcoes[i]] = [container.opcoes[i], container.opcoes[i-1]];
        renderizarRefrigerantesEditor(container);
      }
    });
  });
  refrigerantesList.querySelectorAll('[data-action="down"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = Number(e.currentTarget.dataset.index);
      if (i < container.opcoes.length - 1) {
        [container.opcoes[i+1], container.opcoes[i]] = [container.opcoes[i], container.opcoes[i+1]];
        renderizarRefrigerantesEditor(container);
      }
    });
  });
}

// Hook bindings when refrigerantes modal opens
function abrirModalRefrigerantes(container) {
  refriEditSnapshot = JSON.parse(JSON.stringify(container));
  refrigerantesModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderizarRefrigerantesEditor(container);
}

// Eventos do modal de refrigerantes
if (closeRefrigerantesModal) closeRefrigerantesModal.addEventListener('click', () => fecharModalRefrigerantes(true));
if (cancelRefrigerantesBtn) cancelRefrigerantesBtn.addEventListener('click', () => fecharModalRefrigerantes(true));
if (refrigerantesModal) refrigerantesModal.addEventListener('click', (e) => { if (e.target === refrigerantesModal) fecharModalRefrigerantes(true); });
if (saveRefrigerantesBtn) saveRefrigerantesBtn.addEventListener('click', () => { salvarProdutos(); fecharModalRefrigerantes(false); });

// Adicionar novo refrigerante pelo formulário do modal
if (refriAddBtn) refriAddBtn.addEventListener('click', () => {
    const nome = (refriAddName?.value || '').trim();
    const preco = parseFloat(refriAddPrice?.value || '0');
    const imagem = (refriAddImage?.value || '').trim();
    if (!nome || !imagem || isNaN(preco) || preco <= 0) {
        alert('Preencha nome, preço (>0) e URL/Imagem válida.');
        return;
    }
    let container = produtos.find(p => p.tipo === 'refrigerante-container');
    if (!container) {
        container = { id: Date.now(), nome: 'Refrigerantes', descricao: 'Escolha sua bebida favorita! Servido gelado em taça de vidro com gelo e limão - 350ml', categoria: 'Bebidas', tipo: 'refrigerante-container', opcoes: [], opcaoSelecionada: null };
        produtos.push(container);
    }
    const id = `refri-${Date.now()}`;
    container.opcoes.push({ id, nome, preco, imagem });
    if (!container.opcaoSelecionada) container.opcaoSelecionada = id;
    if (refriAddName) refriAddName.value = '';
    if (refriAddPrice) refriAddPrice.value = '';
    if (refriAddImage) refriAddImage.value = '';
    const addPreview = document.getElementById('refriAddImagePreview');
    if (addPreview) { addPreview.src = ''; addPreview.style.display = 'none'; }
    renderizarRefrigerantesEditor(container);
});

// Inicialização final
document.addEventListener('DOMContentLoaded', function() {
    inicializarDashboard();
    configurarLogout();
});

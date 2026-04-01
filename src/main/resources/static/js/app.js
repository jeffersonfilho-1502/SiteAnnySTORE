const products = [
    { id: "tshirt-basic-rose", name: "T-shirt Basic Rose", category: "tshirts", flavor: "Algodao premium", description: "T-shirt basica feminina com toque macio e caimento leve para uso diario.", price: 79.9, image: "./img/blusa-canelada-elegance.svg", sizes: ["PP", "P", "M", "G", "GG"], colors: ["rosa", "off-white"], isWeeklyNew: true, isBestSeller: true },
    { id: "tshirt-zara-classic", name: "T-shirt Zara Classic", category: "tshirts-zara", flavor: "Algodao fio penteado", description: "Modelagem reta com acabamento premium para looks urbanos sofisticados.", price: 119.9, image: "./img/camisa-satin-soft.svg", sizes: ["P", "M", "G", "GG"], colors: ["off-white", "preto"], isWeeklyNew: true, isBestSeller: true },
    { id: "tshirt-zara-oversized", name: "T-shirt Zara Oversized", category: "tshirts-zara", flavor: "Malha encorpada", description: "Silhueta oversized e toque macio para combinar conforto e estilo.", price: 129.9, image: "./img/vestido-envelope-lilas.svg", sizes: ["P", "M", "G", "GG"], colors: ["lilas", "rosa"], isWeeklyNew: true, isBestSeller: false },
    { id: "regata-canelada-soft", name: "Regata Canelada Soft", category: "regatas", flavor: "Malha canelada", description: "Regata ajustada e confortavel para compor looks leves de verao.", price: 59.9, image: "./img/cropped-tricot-lux.svg", sizes: ["PP", "P", "M", "G"], colors: ["rosa", "bege"], isWeeklyNew: true, isBestSeller: true },
    { id: "regata-zara-fit", name: "Regata Zara Fit", category: "regatas", flavor: "Viscolycra premium", description: "Regata feminina com corte moderno e excelente caimento no corpo.", price: 69.9, image: "./img/vestido-midi-rose.svg", sizes: ["PP", "P", "M", "G", "GG"], colors: ["off-white", "preto"], isWeeklyNew: false, isBestSeller: false },
    { id: "pijama-longo-soft", name: "Pijama Longo Soft", category: "pijamas", flavor: "Malha soft touch", description: "Pijama longo com blusa manga comprida e calca confortavel para noites frias.", price: 149.9, image: "./img/conjunto-linho-natural.svg", sizes: ["P", "M", "G", "GG"], colors: ["rosa", "lilas"], isWeeklyNew: true, isBestSeller: true },
    { id: "pijama-curto-comfort", name: "Pijama Curto Comfort", category: "pijamas", flavor: "Algodao respiravel", description: "Conjunto curto leve para dormir com frescor e liberdade de movimento.", price: 119.9, image: "./img/conjunto-alfaiataria-rose.svg", sizes: ["PP", "P", "M", "G"], colors: ["rosa", "off-white"], isWeeklyNew: true, isBestSeller: false },
    { id: "pijama-estampado-love", name: "Pijama Estampado Love", category: "pijamas", flavor: "Malha estampada", description: "Pijama feminino estampado com modelagem moderna e tecido super macio.", price: 129.9, image: "./img/saia-plissada-romance.svg", sizes: ["PP", "P", "M", "G", "GG"], colors: ["rosa", "bege"], isWeeklyNew: false, isBestSeller: false }
];

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const CART_KEY = "cacauBrasilCart";
const THEME_KEY = "cacauBrasilTheme";
const ORDER_HISTORY_KEY = "cacauBrasilOrders";
const MAX_QTY = 20;
const PRODUCTS_PER_PAGE = 4;
const FREE_SHIPPING_THRESHOLD = 35;
const FREE_SHIPPING_STRICT_MIN = FREE_SHIPPING_THRESHOLD + 0.01;
const BASE_SHIPPING = 12;
const EXPRESS_SURCHARGE = 14;
const ORDER_FLOW = ["preparo", "enviado", "entregue"];

const state = { query: "", category: "all", size: "all", color: "all", sort: "featured", visibleCount: PRODUCTS_PER_PAGE };

const grid = document.getElementById("productGrid");
const detail = document.getElementById("productDetail");
const relatedProducts = document.getElementById("relatedProducts");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const weeklyGrid = document.getElementById("weeklyGrid");
const weeklyEmpty = document.getElementById("weeklyEmpty");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartShipping = document.getElementById("cartShipping");
const cartShippingHint = document.getElementById("cartShippingHint");
const cartTotal = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sizeSelect = document.getElementById("sizeSelect");
const colorSelect = document.getElementById("colorSelect");
const sortSelect = document.getElementById("sortSelect");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector(".nav");

const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutShipping = document.getElementById("checkoutShipping");
const checkoutMessage = document.getElementById("checkoutMessage");
const phoneInput = document.getElementById("phone");
const zipCodeInput = document.getElementById("zipCode");
const deliveryTypeSelect = document.getElementById("deliveryType");

const ordersList = document.getElementById("ordersList");
const clearOrdersBtn = document.getElementById("clearOrdersBtn");
const orderStatusFilter = document.getElementById("orderStatusFilter");

const newsletterForm = document.getElementById("newsletterForm");

let toastTimer;
let whatsappDelayTimer;

function showToast(message) {
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    if (themeToggle) {
        themeToggle.textContent = theme === "dark" ? "Tema: Escuro" : "Tema: Claro";
    }
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === "dark" ? "dark" : "light");
}

function toggleTheme() {
    const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
}

function findProduct(id) {
    return products.find((product) => product.id === id);
}

function normalizeCart(cart) {
    if (!Array.isArray(cart)) {
        return [];
    }
    return cart
        .map((item) => ({ id: String(item.id || ""), qty: Number(item.qty) || 0 }))
        .filter((item) => findProduct(item.id) && item.qty > 0)
        .map((item) => ({ ...item, qty: Math.min(MAX_QTY, Math.floor(item.qty)) }));
}

function loadCart() {
    try {
        return normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(normalizeCart(cart)));
}

function loadOrders() {
    try {
        const parsed = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(Array.isArray(orders) ? orders : []));
}

function setCartOpen(isOpen) {
    if (!cartDrawer || !overlay) {
        return;
    }
    cartDrawer.classList.toggle("open", isOpen);
    overlay.classList.toggle("show", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
    document.body.classList.toggle("cart-open", isOpen);
    if (isOpen) {
        clearTimeout(whatsappDelayTimer);
        document.body.classList.remove("whatsapp-delay");
    } else {
        clearTimeout(whatsappDelayTimer);
        document.body.classList.add("whatsapp-delay");
        whatsappDelayTimer = setTimeout(() => {
            document.body.classList.remove("whatsapp-delay");
        }, 500);
    }
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
    if (openCartBtn) {
        openCartBtn.setAttribute("aria-expanded", String(isOpen));
    }
    if (isOpen && closeCartBtn) {
        closeCartBtn.focus();
    }
}

function getCartPricing(cart, deliveryType) {
    const subtotal = cart.reduce((total, item) => {
        const product = findProduct(item.id);
        return product ? total + product.price * item.qty : total;
    }, 0);

    if (subtotal === 0) {
        return { subtotal: 0, shipping: 0, total: 0, freeShippingGap: FREE_SHIPPING_STRICT_MIN };
    }

    const baseShipping = subtotal >= FREE_SHIPPING_STRICT_MIN ? 0 : BASE_SHIPPING;
    const expressExtra = deliveryType === "expressa" ? EXPRESS_SURCHARGE : 0;
    const shipping = baseShipping + expressExtra;
    return {
        subtotal,
        shipping,
        total: subtotal + shipping,
        freeShippingGap: Math.max(0, FREE_SHIPPING_STRICT_MIN - subtotal)
    };
}

function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) {
        showToast("Produto indisponivel.");
        return;
    }
    const cart = loadCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
        existing.qty = Math.min(MAX_QTY, existing.qty + 1);
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    showToast(`${product.name} adicionado ao carrinho.`);
}

function removeFromCart(productId) {
    const product = findProduct(productId);
    saveCart(loadCart().filter((item) => item.id !== productId));
    renderCart();
    if (product) {
        showToast(`${product.name} removido.`);
    }
}

function changeQuantity(productId, delta) {
    const cart = loadCart();
    const item = cart.find((entry) => entry.id === productId);
    if (!item) {
        return;
    }
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }
    item.qty = Math.min(MAX_QTY, item.qty);
    saveCart(cart);
    renderCart();
}

function clearCart() {
    saveCart([]);
    renderCart();
    showToast("Carrinho limpo.");
}

function getFilteredProducts() {
    const query = state.query.trim().toLowerCase();
    let result = products.filter((product) => {
        const matchesQuery =
            query.length === 0 ||
            product.name.toLowerCase().includes(query) ||
            product.flavor.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query);
        const matchesCategory = state.category === "all" || product.category === state.category;
        const matchesSize = state.size === "all" || (Array.isArray(product.sizes) && product.sizes.includes(state.size));
        const matchesColor = state.color === "all" || (Array.isArray(product.colors) && product.colors.includes(state.color));
        return matchesQuery && matchesCategory && matchesSize && matchesColor;
    });

    if (state.sort === "price-asc") {
        result = result.sort((a, b) => a.price - b.price);
    } else if (state.sort === "price-desc") {
        result = result.sort((a, b) => b.price - a.price);
    } else if (state.sort === "name-asc") {
        result = result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
}

function isSearchPage() {
    return window.location.pathname.endsWith("/busca.html") || window.location.pathname.endsWith("busca.html");
}

function syncSearchUrl() {
    if (!isSearchPage()) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    if (state.query) {
        params.set("q", state.query);
    } else {
        params.delete("q");
    }
    if (state.category !== "all") {
        params.set("cat", state.category);
    } else {
        params.delete("cat");
    }
    if (state.size !== "all") {
        params.set("size", state.size);
    } else {
        params.delete("size");
    }
    if (state.color !== "all") {
        params.set("color", state.color);
    } else {
        params.delete("color");
    }
    if (state.sort !== "featured") {
        params.set("sort", state.sort);
    } else {
        params.delete("sort");
    }
    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
}

function initSearchFromUrl() {
    if (!searchInput) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    const category = params.get("cat") || "all";
    const size = params.get("size") || "all";
    const color = params.get("color") || "all";
    const sort = params.get("sort") || "featured";

    state.query = query;
    state.category = ["all", "tshirts", "tshirts-zara", "regatas", "pijamas"].includes(category) ? category : "all";
    state.size = ["all", "PP", "P", "M", "G", "GG"].includes(size) ? size : "all";
    state.color = ["all", "rosa", "lilas", "off-white", "preto", "bege"].includes(color) ? color : "all";
    state.sort = ["featured", "price-asc", "price-desc", "name-asc"].includes(sort) ? sort : "featured";
    state.visibleCount = PRODUCTS_PER_PAGE;

    searchInput.value = state.query;
    if (categorySelect) {
        categorySelect.value = state.category;
    }
    if (sizeSelect) {
        sizeSelect.value = state.size;
    }
    if (colorSelect) {
        colorSelect.value = state.color;
    }
    if (sortSelect) {
        sortSelect.value = state.sort;
    }
}

function rangeFromSizes(sizes) {
    if (!Array.isArray(sizes) || sizes.length === 0) {
        return "PP-GG";
    }
    return sizes.join(" • ");
}

function productCardTemplate(item) {
    return `
        <article class="product">
            <img class="product-thumb" src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
            ${item.isBestSeller ? '<span class="best-seller-badge">Mais vendido</span>' : ""}
            <span class="badge">${item.category}</span>
            <h3>${item.name}</h3>
            <p>${item.flavor}</p>
            <p class="size-line">Tamanhos: ${rangeFromSizes(item.sizes)}</p>
            <p class="size-line">Cores: ${(item.colors || []).join(" • ")}</p>
            <p class="price">${BRL.format(item.price)}</p>
            <div class="product-actions">
                <a class="btn btn-light-dark" href="./product.html?id=${item.id}">Ver detalhes</a>
                <button class="btn btn-primary" data-add-to-cart="${item.id}">Adicionar</button>
            </div>
        </article>
    `;
}

function renderGrid() {
    if (!grid) {
        return;
    }
    const filteredProducts = getFilteredProducts();
    const visibleProducts = filteredProducts.slice(0, state.visibleCount);

    if (resultCount) {
        resultCount.textContent = `${filteredProducts.length} produto(s) encontrado(s)`;
    }
    if (emptyState) {
        emptyState.hidden = filteredProducts.length !== 0;
    }
    if (loadMoreBtn) {
        loadMoreBtn.hidden = visibleProducts.length >= filteredProducts.length;
    }

    grid.innerHTML = visibleProducts.map((item) => productCardTemplate(item)).join("");
}

function renderWeeklyProducts() {
    if (!weeklyGrid) {
        return;
    }
    const weeklyProducts = products.filter((item) => item.isWeeklyNew).slice(0, 4);
    weeklyGrid.innerHTML = weeklyProducts.map((item) => productCardTemplate(item)).join("");
    if (weeklyEmpty) {
        weeklyEmpty.hidden = weeklyProducts.length !== 0;
    }
}

function renderRelatedProducts(product) {
    if (!relatedProducts || !product) {
        return;
    }
    const related = products
        .filter((item) => item.id !== product.id && (item.category === product.category || item.price <= product.price + 20))
        .slice(0, 4);

    relatedProducts.innerHTML = related.length
        ? related.map((item) => productCardTemplate(item)).join("")
        : "<p>Nenhuma sugestao no momento.</p>";
}

function renderProductDetail() {
    if (!detail) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const product = findProduct(params.get("id") || "");

    if (!product) {
        detail.innerHTML = `
            <article class="product-detail-card">
                <div>
                    <h1>Produto nao encontrado</h1>
                    <p>O item solicitado nao existe ou foi removido.</p>
                    <a class="btn btn-primary" href="./index.html#destaques">Voltar aos destaques</a>
                </div>
            </article>
        `;
        renderRelatedProducts(null);
        return;
    }

    detail.innerHTML = `
        <article class="product-detail-card">
            <div class="product-placeholder">
                <img src="${product.image}" alt="${product.name}" loading="eager" decoding="async">
            </div>
            <div>
                <span class="badge">${product.category}</span>
                <h1>${product.name}</h1>
                <p class="detail-flavor">${product.flavor}</p>
                <p>${product.description}</p>
                <p class="size-line"><strong>Tamanhos:</strong> ${rangeFromSizes(product.sizes)}</p>
                <p class="size-line"><strong>Cores:</strong> ${(product.colors || []).join(" • ")}</p>
                <p class="price detail-price">${BRL.format(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary" data-add-to-cart="${product.id}">Adicionar ao carrinho</button>
                    <a class="btn btn-light-dark" href="./index.html#destaques">Continuar comprando</a>
                </div>
            </div>
        </article>
    `;

    renderRelatedProducts(product);
}

function renderCart() {
    const cart = loadCart();
    const itemCount = cart.reduce((total, item) => total + item.qty, 0);
    const pricing = getCartPricing(cart, "normal");

    if (cartCount) {
        cartCount.textContent = String(itemCount);
    }

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = "<p>Seu carrinho esta vazio.</p>";
        } else {
            cartItems.innerHTML = cart
                .map((item) => {
                    const product = findProduct(item.id);
                    if (!product) {
                        return "";
                    }
                    return `
                        <article class="cart-item">
                            <div>
                                <strong>${product.name}</strong>
                                <p>${BRL.format(product.price)}</p>
                                <div class="qty-controls" aria-label="Controle de quantidade">
                                    <button class="qty-btn" data-qty-decrease="${product.id}" aria-label="Diminuir quantidade">-</button>
                                    <span class="qty-value">${item.qty}</span>
                                    <button class="qty-btn" data-qty-increase="${product.id}" aria-label="Aumentar quantidade">+</button>
                                </div>
                            </div>
                            <div>
                                <p><strong>${BRL.format(product.price * item.qty)}</strong></p>
                                <button class="btn btn-light-dark" data-remove-item="${product.id}">Remover</button>
                            </div>
                        </article>
                    `;
                })
                .join("");
        }
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = `Subtotal: ${BRL.format(pricing.subtotal)}`;
    }
    if (cartShipping) {
        cartShipping.textContent = `Frete: ${BRL.format(pricing.shipping)}`;
    }
    if (cartShippingHint) {
        if (pricing.subtotal === 0) {
            cartShippingHint.textContent = "Adicione itens para calcular o frete.";
        } else if (pricing.freeShippingGap > 0) {
            cartShippingHint.textContent = `Faltam ${BRL.format(pricing.freeShippingGap)} para frete gratis.`;
        } else {
            cartShippingHint.textContent = "Parabens! Voce desbloqueou frete gratis.";
        }
    }
    if (cartTotal) {
        cartTotal.textContent = `Total: ${BRL.format(pricing.total)}`;
    }
}

function handleCheckoutMock() {
    if (loadCart().length === 0) {
        showToast("Adicione itens antes de finalizar.");
        return;
    }
    window.location.href = "./checkout.html";
}

function renderCheckoutPage() {
    if (!checkoutItems || !checkoutTotal) {
        return;
    }
    const cart = loadCart();
    const deliveryType = deliveryTypeSelect ? deliveryTypeSelect.value : "normal";

    if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>Seu carrinho esta vazio. Volte para a vitrine e adicione itens.</p>";
        if (checkoutShipping) {
            checkoutShipping.textContent = "Frete: R$ 0,00";
        }
        checkoutTotal.textContent = "Total: R$ 0,00";
        return;
    }

    const pricing = getCartPricing(cart, deliveryType);
    checkoutItems.innerHTML = cart
        .map((item) => {
            const product = findProduct(item.id);
            if (!product) {
                return "";
            }
            return `<div class="checkout-line"><span>${item.qty}x ${product.name}</span><strong>${BRL.format(item.qty * product.price)}</strong></div>`;
        })
        .join("");

    if (checkoutShipping) {
        checkoutShipping.textContent = `Frete: ${BRL.format(pricing.shipping)}`;
    }
    checkoutTotal.textContent = `Total: ${BRL.format(pricing.total)}`;
}

function formatPhone(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 6) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatZip(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
    return digits.length <= 5 ? digits : `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function validateCheckoutFields() {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const zipCode = document.getElementById("zipCode");
    const address = document.getElementById("address");
    const paymentMethod = document.getElementById("paymentMethod");

    const fields = [fullName, email, phone, zipCode, address, paymentMethod];
    if (fields.some((field) => !field || !String(field.value || "").trim())) {
        return "Preencha todos os campos obrigatorios.";
    }
    if (String(fullName.value || "").trim().length < 5) {
        return "Informe o nome completo.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email.value || ""))) {
        return "Email invalido.";
    }
    if (String(phone.value).replace(/\D/g, "").length < 10) {
        return "Telefone invalido.";
    }
    if (String(zipCode.value).replace(/\D/g, "").length !== 8) {
        return "CEP invalido. Use 00000-000.";
    }
    if (String(address.value || "").trim().length < 6) {
        return "Endereco muito curto.";
    }
    return "";
}

function saveOrderFromCart() {
    const cart = loadCart();
    const paymentMethod = document.getElementById("paymentMethod");
    const deliveryType = document.getElementById("deliveryType");
    const pricing = getCartPricing(cart, deliveryType ? deliveryType.value : "normal");
    const orders = loadOrders();

    orders.unshift({
        id: `PED-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "preparo",
        paymentMethod: paymentMethod ? paymentMethod.value : "nao informado",
        deliveryType: deliveryType ? deliveryType.value : "normal",
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        total: pricing.total,
        items: cart
            .map((item) => {
                const product = findProduct(item.id);
                if (!product) {
                    return null;
                }
                return { id: product.id, name: product.name, qty: item.qty, subtotal: item.qty * product.price };
            })
            .filter(Boolean)
    });

    saveOrders(orders);
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    if (!checkoutForm) {
        return;
    }
    const error = validateCheckoutFields();
    if (error) {
        if (checkoutMessage) {
            checkoutMessage.textContent = error;
        }
        return;
    }
    if (loadCart().length === 0) {
        if (checkoutMessage) {
            checkoutMessage.textContent = "Seu carrinho esta vazio.";
        }
        return;
    }

    saveOrderFromCart();
    saveCart([]);
    renderCart();
    renderCheckoutPage();
    if (checkoutMessage) {
        checkoutMessage.textContent = "Pedido confirmado com sucesso (mock). Veja em Meus pedidos.";
    }
    checkoutForm.reset();
    if (deliveryTypeSelect) {
        deliveryTypeSelect.value = "normal";
    }
    showToast("Pedido confirmado com sucesso.");
}

function normalizeOrderStatus(status) {
    return String(status || "").toLowerCase();
}

function getOrderStepIndex(order) {
    const normalized = normalizeOrderStatus(order.status);
    const staticIndex = ORDER_FLOW.indexOf(normalized);
    if (staticIndex >= 0) {
        return staticIndex;
    }

    const createdAt = new Date(order.createdAt).getTime();
    const elapsedHours = Number.isFinite(createdAt) ? (Date.now() - createdAt) / (1000 * 60 * 60) : 0;
    if (elapsedHours >= 24) {
        return 2;
    }
    if (elapsedHours >= 2) {
        return 1;
    }
    return 0;
}

function getOrderCurrentStatus(order) {
    const index = getOrderStepIndex(order);
    return ORDER_FLOW[index] || "preparo";
}

function formatStatusLabel(status) {
    if (status === "preparo") {
        return "Em preparo";
    }
    if (status === "enviado") {
        return "Enviado";
    }
    if (status === "entregue") {
        return "Entregue";
    }
    if (status === "confirmado") {
        return "Confirmado";
    }
    return "Em preparo";
}

function renderOrderTrack(order) {
    const currentIndex = getOrderStepIndex(order);
    const labels = ["Em preparo", "Enviado", "Entregue"];
    return labels
        .map((label, index) => {
            const doneClass = index < currentIndex ? " is-done" : "";
            const activeClass = index === currentIndex ? " is-active" : "";
            return `<div class="order-track-step${doneClass}${activeClass}">${label}</div>`;
        })
        .join("");
}

function renderOrdersPage() {
    if (!ordersList) {
        return;
    }
    const orders = loadOrders();
    const selectedStatus = orderStatusFilter ? orderStatusFilter.value : "all";
    const visibleOrders = selectedStatus === "all"
        ? orders
        : orders.filter((order) => {
            const currentStatus = getOrderCurrentStatus(order);
            if (selectedStatus === "confirmado") {
                return currentStatus === "preparo" || normalizeOrderStatus(order.status) === "confirmado";
            }
            return currentStatus === selectedStatus;
        });

    if (visibleOrders.length === 0) {
        ordersList.innerHTML = "<p>Nenhum pedido encontrado com os filtros atuais.</p>";
        return;
    }

    ordersList.innerHTML = visibleOrders
        .map((order) => {
            const date = new Date(order.createdAt).toLocaleString("pt-BR");
            const currentStatus = getOrderCurrentStatus(order);
            const itemsHtml = (order.items || [])
                .map((item) => `<li>${item.qty}x ${item.name} - ${BRL.format(item.subtotal || 0)}</li>`)
                .join("");
            return `
                <article class="order-card">
                    <h3>${order.id}</h3>
                    <p><strong>Status:</strong> ${formatStatusLabel(currentStatus)}</p>
                    <p><strong>Data:</strong> ${date}</p>
                    <p><strong>Entrega:</strong> ${(order.deliveryType || "normal") === "expressa" ? "Expressa" : "Normal"}</p>
                    <p><strong>Pagamento:</strong> ${(order.paymentMethod || "nao informado").toUpperCase()}</p>
                    <div class="order-track" aria-label="Acompanhamento do pedido">${renderOrderTrack(order)}</div>
                    <ul class="order-items">${itemsHtml}</ul>
                    <p><strong>Total:</strong> ${BRL.format(order.total || 0)}</p>
                    <button class="btn btn-light-dark" data-repeat-order="${order.id}">Comprar novamente</button>
                </article>
            `;
        })
        .join("");
}

function repeatOrder(orderId) {
    const orders = loadOrders();
    const order = orders.find((entry) => entry.id === orderId);
    if (!order || !Array.isArray(order.items) || order.items.length === 0) {
        showToast("Pedido sem itens para repetir.");
        return;
    }

    const cart = loadCart();
    order.items.forEach((item) => {
        const id = item.id || products.find((product) => product.name === item.name)?.id;
        if (!id || !findProduct(id)) {
            return;
        }
        const current = cart.find((entry) => entry.id === id);
        if (current) {
            current.qty = Math.min(MAX_QTY, current.qty + Math.max(1, Number(item.qty) || 1));
        } else {
            cart.push({ id, qty: Math.min(MAX_QTY, Math.max(1, Number(item.qty) || 1)) });
        }
    });

    saveCart(cart);
    renderCart();
    setCartOpen(true);
    showToast("Itens do pedido adicionados ao carrinho.");
}

function clearOrders() {
    saveOrders([]);
    renderOrdersPage();
    showToast("Historico de pedidos limpo.");
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) {
        return;
    }
    const emailInput = event.target.querySelector("#newsletterEmail");
    const value = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showToast("Digite um email valido para receber novidades.");
        return;
    }
    event.target.reset();
    showToast("Cadastro realizado. Em breve voce recebera nossas ofertas.");
}

function renderWhatsAppFloat() {
    if (document.querySelector(".whatsapp-float")) {
        return;
    }
    const link = document.createElement("a");
    link.className = "whatsapp-float";
    link.href = "https://wa.me/558394056292?text=Oi!%20Quero%20ajuda%20com%20tamanho%20e%20pedido.";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Atendimento via WhatsApp");
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.1A9.9 9.9 0 0 0 3.5 16.9L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2.1Zm0 17.9c-1.4 0-2.8-.4-4-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 1 1 12 20Zm4.6-6.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.8-.1.1-.3.2-.5.1-.2-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.6-.1-.2 0-.3.1-.4l.3-.3.2-.3c.1-.1.1-.2.2-.3.1-.1 0-.3 0-.4l-.5-1.3c-.1-.3-.3-.3-.5-.3h-.4c-.1 0-.3.1-.5.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5.6.3 1 .4 1.4.5.6.2 1.2.2 1.6.1.5-.1 1.2-.5 1.3-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z"/></svg>';
    document.body.appendChild(link);
}

function runSmokeTests() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("smoke") !== "1") {
        return;
    }
    const tests = [];
    tests.push({ name: "Produtos carregados", ok: Array.isArray(products) && products.length >= 8 });
    tests.push({ name: "Busca por produto", ok: Boolean(findProduct("tshirt-basic-rose")) });
    saveCart([{ id: "tshirt-basic-rose", qty: 2 }]);
    tests.push({ name: "Carrinho persistido", ok: loadCart().length === 1 && loadCart()[0].qty === 2 });
    const pricing = getCartPricing(loadCart(), "normal");
    tests.push({ name: "Frete calculado", ok: pricing.total >= pricing.subtotal });
    saveOrders([{ id: "PED-1", createdAt: new Date().toISOString(), status: "Confirmado", total: 10, items: [] }]);
    tests.push({ name: "Historico persistido", ok: loadOrders().length === 1 });
    saveCart([]);
    saveOrders([]);
    const failed = tests.filter((test) => !test.ok);
    showToast(failed.length === 0 ? "Smoke test: OK" : `Smoke test: ${failed.length} falha(s)`);
    console.table(tests);
}

document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    if (target.dataset.addToCart) {
        addToCart(target.dataset.addToCart);
        setCartOpen(true);
    }
    if (target.dataset.removeItem) {
        removeFromCart(target.dataset.removeItem);
    }
    if (target.dataset.qtyIncrease) {
        changeQuantity(target.dataset.qtyIncrease, 1);
    }
    if (target.dataset.qtyDecrease) {
        changeQuantity(target.dataset.qtyDecrease, -1);
    }
    if (target.dataset.repeatOrder) {
        repeatOrder(target.dataset.repeatOrder);
    }
});

if (openCartBtn) {
    openCartBtn.addEventListener("click", () => setCartOpen(true));
}
if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
        setCartOpen(false);
        if (openCartBtn) {
            openCartBtn.focus();
        }
    });
}
if (overlay) {
    overlay.addEventListener("click", () => setCartOpen(false));
}
if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
}
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckoutMock);
}
if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}
if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
}
if (phoneInput) {
    phoneInput.addEventListener("input", () => {
        phoneInput.value = formatPhone(phoneInput.value);
    });
}
if (zipCodeInput) {
    zipCodeInput.addEventListener("input", () => {
        zipCodeInput.value = formatZip(zipCodeInput.value);
    });
}
if (deliveryTypeSelect) {
    deliveryTypeSelect.addEventListener("change", renderCheckoutPage);
}
if (clearOrdersBtn) {
    clearOrdersBtn.addEventListener("click", clearOrders);
}
if (orderStatusFilter) {
    orderStatusFilter.addEventListener("change", renderOrdersPage);
}
if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit);
}

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        const next = !nav.classList.contains("open");
        nav.classList.toggle("open", next);
        menuBtn.setAttribute("aria-expanded", String(next));
    });
    nav.querySelectorAll("a").forEach((link) =>
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        })
    );
}

if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        state.query = event.target.value;
        state.visibleCount = PRODUCTS_PER_PAGE;
        syncSearchUrl();
        renderGrid();
    });
}
if (categorySelect) {
    categorySelect.addEventListener("change", (event) => {
        state.category = event.target.value;
        state.visibleCount = PRODUCTS_PER_PAGE;
        syncSearchUrl();
        renderGrid();
    });
}
if (sizeSelect) {
    sizeSelect.addEventListener("change", (event) => {
        state.size = event.target.value;
        state.visibleCount = PRODUCTS_PER_PAGE;
        syncSearchUrl();
        renderGrid();
    });
}
if (colorSelect) {
    colorSelect.addEventListener("change", (event) => {
        state.color = event.target.value;
        state.visibleCount = PRODUCTS_PER_PAGE;
        syncSearchUrl();
        renderGrid();
    });
}
if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
        state.sort = event.target.value;
        syncSearchUrl();
        renderGrid();
    });
}
if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
        state.query = "";
        state.category = "all";
        state.size = "all";
        state.color = "all";
        state.sort = "featured";
        state.visibleCount = PRODUCTS_PER_PAGE;
        if (searchInput) {
            searchInput.value = "";
        }
        if (categorySelect) {
            categorySelect.value = "all";
        }
        if (sizeSelect) {
            sizeSelect.value = "all";
        }
        if (colorSelect) {
            colorSelect.value = "all";
        }
        if (sortSelect) {
            sortSelect.value = "featured";
        }
        syncSearchUrl();
        renderGrid();
    });
}
if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
        state.visibleCount += PRODUCTS_PER_PAGE;
        renderGrid();
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setCartOpen(false);
        if (menuBtn && nav) {
            nav.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        }
    }
});

initSearchFromUrl();
renderGrid();
renderWeeklyProducts();
renderProductDetail();
renderCart();
renderCheckoutPage();
renderOrdersPage();
initTheme();
runSmokeTests();
renderWhatsAppFloat();


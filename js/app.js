const CART_KEY = "edinorok-cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  renderCart();
}

function cartCount() {
  return readCart().reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(productId, size = "M", qty = 1) {
  const product = getProduct(productId);
  if (!product) return;
  const items = readCart();
  const existing = items.find((item) => item.id === productId && item.size === size);
  if (existing) existing.qty += qty;
  else items.push({ id: productId, size, qty });
  writeCart(items);
  toast(`${product.name} · ${size} в корзине`);
  openCart();
}

function updateQty(index, delta) {
  const items = readCart();
  if (!items[index]) return;
  items[index].qty += delta;
  if (items[index].qty <= 0) items.splice(index, 1);
  writeCart(items);
}

function removeItem(index) {
  const items = readCart();
  items.splice(index, 1);
  writeCart(items);
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-visible"), 2400);
}

function headerMarkup(page) {
  const link = (href, id, label) =>
    `<a class="nav__link${page === id ? " is-active" : ""}" href="${href}">${label}</a>`;
  return `
    <div class="header__bar">
      <button class="icon-btn header__menu" data-open-menu aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
      <a class="logo" href="index.html">
        <img src="assets/img/logo.jpg" alt="Единорок">
        <span>Единорок</span>
      </a>
      <nav class="nav">
        ${link("index.html", "home", "Главная")}
        ${link("catalog.html", "catalog", "Каталог")}
        ${link("about.html", "about", "О нас")}
        ${link("contacts.html", "contacts", "Контакты")}
      </nav>
      <div class="header__actions">
        <button class="icon-btn" data-open-search aria-label="Поиск">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
        <button class="icon-btn cart-btn" data-open-cart aria-label="Корзина">
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.5L5 4H3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/></svg>
          <span class="cart-btn__count" data-cart-count>0</span>
        </button>
      </div>
    </div>
    <div class="mobile-nav" data-mobile-nav>
      ${link("index.html", "home", "Главная")}
      ${link("catalog.html", "catalog", "Каталог")}
      ${link("about.html", "about", "О нас")}
      ${link("contacts.html", "contacts", "Контакты")}
    </div>
  `;
}

function footerMarkup() {
  return `
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="assets/img/logo.jpg" alt="">
        <p class="footer__claim">Независимый характер</p>
        <p>Одежда в твоём ритме.</p>
      </div>
      <div>
        <h3>Магазин</h3>
        <a href="index.html">Главная</a>
        <a href="catalog.html">Каталог</a>
        <a href="about.html">О нас</a>
        <a href="contacts.html">Контакты</a>
      </div>
      <div>
        <h3>Контакты</h3>
        <a href="https://vk.com" target="_blank" rel="noreferrer">ВКонтакте ↗</a>
        <a href="https://t.me" target="_blank" rel="noreferrer">Telegram ↗</a>
        <a href="mailto:${STORE.email}">${STORE.email}</a>
        <p>${STORE.address}</p>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} Единорок</span>
      <span>Учебный магазин. Все контакты условные.</span>
    </div>
  `;
}

function overlayMarkup() {
  return `
    <div class="search" data-search>
      <div class="search__panel">
        <input type="search" placeholder="Поиск по каталогу" data-search-input>
        <button class="icon-btn" data-close-search aria-label="Закрыть">✕</button>
      </div>
      <div class="search__results" data-search-results></div>
    </div>
    <aside class="cart" data-cart>
      <div class="cart__head">
        <h2>Корзина</h2>
        <button class="icon-btn" data-close-cart aria-label="Закрыть">✕</button>
      </div>
      <div class="cart__body" data-cart-body></div>
      <div class="cart__foot">
        <div class="cart__sum"><span>Итого</span><strong data-cart-sum>0 ₽</strong></div>
        <button class="btn btn--primary" data-checkout>Оформить</button>
      </div>
    </aside>
    <div class="backdrop" data-backdrop></div>
    <div class="toast" id="toast"></div>
  `;
}

function renderCart() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.classList.toggle("is-on", n > 0);
  });
  const body = document.querySelector("[data-cart-body]");
  const sumEl = document.querySelector("[data-cart-sum]");
  if (!body) return;
  const items = readCart();
  if (!items.length) {
    body.innerHTML = `<p class="cart__empty">Пока пусто. Выбирай свой ритм в каталоге.</p>`;
    if (sumEl) sumEl.textContent = formatPrice(0);
    return;
  }
  let total = 0;
  body.innerHTML = items
    .map((item, index) => {
      const product = getProduct(item.id);
      if (!product) return "";
      total += product.price * item.qty;
      return `
        <article class="cart-item">
          <img src="${product.images[0]}" alt="">
          <div>
            <h3>${product.name}</h3>
            <p>Размер ${item.size}</p>
            <div class="qty">
              <button data-qty="${index}" data-d="-1">−</button>
              <span>${item.qty}</span>
              <button data-qty="${index}" data-d="1">+</button>
            </div>
          </div>
          <div class="cart-item__side">
            <strong>${formatPrice(product.price * item.qty)}</strong>
            <button data-remove="${index}">Удалить</button>
          </div>
        </article>
      `;
    })
    .join("");
  if (sumEl) sumEl.textContent = formatPrice(total);
}

function openCart() {
  document.querySelector("[data-cart]")?.classList.add("is-open");
  document.querySelector("[data-backdrop]")?.classList.add("is-open");
}
function closeOverlays() {
  document.querySelector("[data-cart]")?.classList.remove("is-open");
  document.querySelector("[data-search]")?.classList.remove("is-open");
  document.querySelector("[data-backdrop]")?.classList.remove("is-open");
  document.querySelector("[data-mobile-nav]")?.classList.remove("is-open");
}

function productCard(product) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  return `
    <a class="card" href="product.html?id=${product.id}">
      <div class="card__media">
        <img src="${product.images[0]}" alt="${product.name}">
      </div>
      <div class="card__body">
        <span>${cat ? cat.name : ""}</span>
        <h3>${product.name}</h3>
        <strong>${formatPrice(product.price)}</strong>
      </div>
    </a>
  `;
}

function renderHome() {
  const featured = document.querySelector("[data-featured]");
  if (featured) featured.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
}

function renderCatalog() {
  const grid = document.querySelector("[data-catalog]");
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  let cat = params.get("cat") || "all";
  let sort = params.get("sort") || "popular";
  let q = (params.get("q") || "").trim().toLowerCase();

  const filters = document.querySelector("[data-filters]");
  if (filters) {
    filters.innerHTML = CATEGORIES.map(
      (item) =>
        `<button class="chip${item.id === cat ? " is-active" : ""}" data-cat="${item.id}">${item.name}</button>`
    ).join("");
  }

  const shown = document.querySelector("[data-shown]");
  let list = PRODUCTS.filter((p) => (cat === "all" ? true : p.category === cat));
  if (q) list = list.filter((p) => (p.name + p.excerpt).toLowerCase().includes(q));
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  grid.innerHTML = list.map(productCard).join("") || `<p class="empty">Ничего не нашли. Сбрось фильтры.</p>`;
  if (shown) shown.textContent = `Показано ${list.length} из ${PRODUCTS.length}`;

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    const url = new URL(location.href);
    url.searchParams.set("cat", btn.dataset.cat);
    history.replaceState({}, "", url);
    renderCatalog();
  });

  const sortEl = document.querySelector("[data-sort]");
  if (sortEl && !sortEl.dataset.bound) {
    sortEl.dataset.bound = "1";
    sortEl.value = sort;
    sortEl.addEventListener("change", () => {
      const url = new URL(location.href);
      url.searchParams.set("sort", sortEl.value);
      history.replaceState({}, "", url);
      renderCatalog();
    });
  }
}

function renderProduct() {
  const root = document.querySelector("[data-product]");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id") || PRODUCTS[0].id;
  const product = getProduct(id) || PRODUCTS[0];
  const related = getRelated(product);
  let size = "M";
  let image = 0;

  const paint = () => {
    root.innerHTML = `
      <nav class="crumbs">
        <a href="index.html">Главная</a>
        <span>/</span>
        <a href="catalog.html">Каталог</a>
        <span>/</span>
        <a href="catalog.html?cat=${product.category}">${CATEGORIES.find((c) => c.id === product.category)?.name}</a>
        <span>/</span>
        <span>${product.name}</span>
      </nav>
      <div class="product">
        <div class="product__gallery">
          <div class="product__stage">
            <img src="${product.images[image]}" alt="${product.name}">
          </div>
          <div class="product__thumbs">
            ${product.images
              .map(
                (src, i) =>
                  `<button class="${i === image ? "is-active" : ""}" data-img="${i}"><img src="${src}" alt=""></button>`
              )
              .join("")}
          </div>
        </div>
        <div class="product__info">
          <p class="eyebrow">${CATEGORIES.find((c) => c.id === product.category)?.name} / ${product.color}</p>
          <h1>${product.name}</h1>
          <p class="product__price">${formatPrice(product.price)}</p>
          <p>${product.description}</p>
          <dl class="meta">
            <div><dt>Ткань</dt><dd>${product.fabric}</dd></div>
            <div><dt>Цвет</dt><dd>${product.color}</dd></div>
            <div><dt>Посадка</dt><dd>${product.fit}</dd></div>
          </dl>
          <p class="label">Размер</p>
          <div class="sizes">
            ${SIZES.map((s) => `<button class="${s === size ? "is-active" : ""}" data-size="${s}">${s}</button>`).join("")}
          </div>
          <button class="btn btn--primary btn--full" data-add>В корзину</button>
          <section class="care">
            <h2>Уход</h2>
            <ul>
              <li>Стирать, вывернув наизнанку</li>
              <li>Не отбеливать</li>
              <li>Не скручивать в машине</li>
            </ul>
          </section>
        </div>
      </div>
      <section class="sizes-table wrap">
        <h2>Таблица размеров</h2>
        <p>Вид спереди / вид сзади. Сантиметры.</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Размер</th><th>Грудь</th><th>Длина</th><th>Рукав</th></tr></thead>
            <tbody>
              <tr><td>XS</td><td>50</td><td>68</td><td>20</td></tr>
              <tr><td>S</td><td>52</td><td>70</td><td>21</td></tr>
              <tr><td>M</td><td>56</td><td>73</td><td>22</td></tr>
              <tr><td>L</td><td>60</td><td>75</td><td>23</td></tr>
              <tr><td>XL</td><td>64</td><td>77</td><td>24</td></tr>
              <tr><td>XXL</td><td>68</td><td>79</td><td>25</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="section wrap">
        <div class="section__head"><h2>Похожие товары</h2></div>
        <div class="grid">${related.map(productCard).join("")}</div>
      </section>
    `;
  };
  paint();
  root.addEventListener("click", (e) => {
    const imgBtn = e.target.closest("[data-img]");
    const sizeBtn = e.target.closest("[data-size]");
    if (imgBtn) {
      image = Number(imgBtn.dataset.img);
      paint();
    }
    if (sizeBtn) {
      size = sizeBtn.dataset.size;
      paint();
    }
    if (e.target.closest("[data-add]")) addToCart(product.id, size);
  });
}

function bindChrome() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-cart]")) openCart();
    if (e.target.closest("[data-close-cart]") || e.target.closest("[data-backdrop]")) closeOverlays();
    if (e.target.closest("[data-open-menu]")) {
      document.querySelector("[data-mobile-nav]")?.classList.toggle("is-open");
    }
    if (e.target.closest("[data-open-search]")) {
      document.querySelector("[data-search]")?.classList.add("is-open");
      document.querySelector("[data-search-input]")?.focus();
    }
    if (e.target.closest("[data-close-search]")) closeOverlays();
    const qty = e.target.closest("[data-qty]");
    if (qty) updateQty(Number(qty.dataset.qty), Number(qty.dataset.d));
    const remove = e.target.closest("[data-remove]");
    if (remove) removeItem(Number(remove.dataset.remove));
    if (e.target.closest("[data-checkout]")) {
      if (!readCart().length) return toast("Корзина пуста");
      writeCart([]);
      closeOverlays();
      toast("Заявка принята. Это учебный магазин.");
    }
  });

  const searchInput = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      results.innerHTML = "";
      return;
    }
    const hits = PRODUCTS.filter((p) => (p.name + p.excerpt).toLowerCase().includes(q));
    results.innerHTML = hits.map(productCard).join("") || `<p class="empty">Ничего не нашли</p>`;
  });

  const form = document.querySelector("[data-contact-form]");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const agree = form.querySelector("[name=agree]");
    if (agree && !agree.checked) {
      toast("Нужно согласие на обработку данных");
      return;
    }
    form.reset();
    toast("Сообщение отправлено. Ответим в течение рабочего дня.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const footer = document.querySelector("[data-footer]");
  if (header) header.innerHTML = headerMarkup(document.body.dataset.page);
  if (footer) footer.innerHTML = footerMarkup();
  document.body.insertAdjacentHTML("beforeend", overlayMarkup());
  bindChrome();
  renderCart();
  renderHome();
  renderCatalog();
  renderProduct();
});

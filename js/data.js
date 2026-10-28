const STORE = {
  name: "Единорок",
  tagline: "Независимый характер. Одежда в твоём ритме.",
  phone: "+7 (999) 013-13-13",
  email: "hello@edinorok.ru",
  address: "Москва, ул. Роковая, д. 13",
  addressNote: "Условный адрес шоурума · по записи",
  social: {
    vk: "https://vk.com",
    tg: "https://t.me",
  },
};

const CATEGORIES = [
  { id: "all", name: "Все товары" },
  { id: "tees", name: "Футболки" },
  { id: "hoodies", name: "Худи" },
  { id: "longsleeves", name: "Лонгсливы" },
  { id: "jackets", name: "Куртки" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PRODUCTS = [
  {
    id: "beliy-shum",
    name: "Футболка «Белый шум»",
    category: "tees",
    price: 2900,
    images: ["assets/img/tee-no-heroes.jpg", "assets/img/tee-back.jpg", "assets/img/tee-blank.jpg"],
    excerpt: "Плотный хлопок, выстиранный чёрный, принт, который держит сцену.",
    description:
      "Футболка свободного кроя из плотного хлопка. Принт «Белый шум» собран как афиша ночного города: череп, корона и японские иероглифы. Сидит спокойно, носится громко.",
    fabric: "100% хлопок, 220 г/м²",
    color: "Выстиранный чёрный",
    fit: "Oversize",
  },
  {
    id: "high-voltage",
    name: "Футболка «Высокое напряжение»",
    category: "tees",
    price: 3200,
    images: ["assets/img/tee-blank.jpg", "assets/img/tee-back.jpg"],
    excerpt: "Минимализм с характером: карман на молнии и тяжёлая посадка.",
    description:
      "Чёрная футболка без лишнего шума. Карман на молнии, плотная резинка ворота, свободные плечи. Для тех, кому достаточно силуэта.",
    fabric: "100% хлопок, 240 г/м²",
    color: "Выстиранный чёрный",
    fit: "Relaxed",
  },
  {
    id: "svoboda",
    name: "Худи «Свобода»",
    category: "hoodies",
    price: 5900,
    images: ["assets/img/hoodie-svoboda.jpg", "assets/img/hoodie-tokyo.jpg"],
    excerpt: "Тяжёлое худи Urban Dystopia. Город, который не просит разрешения.",
    description:
      "Оверсайз-худи с капюшоном, спущенной линией плеча и принтом «Urban Dystopia». Тёплый футер, который переживает репетиции, дорогу и ночные съёмки.",
    fabric: "Хлопок / полиэстер, футер 3-нитка",
    color: "Выстиранный чёрный",
    fit: "Oversize",
  },
  {
    id: "garage",
    name: "Худи «Гараж»",
    category: "hoodies",
    price: 6200,
    images: ["assets/img/hoodie-flowers.jpg", "assets/img/hoodie-svoboda.jpg"],
    excerpt: "Цветы, змея и пустота. Худи для тех, кто играет после полуночи.",
    description:
      "Графический принт «Empty Flowers» на плотном худи. Капюшон глубокий, карман кенгуру, манжеты держат форму.",
    fabric: "Хлопок / полиэстер, футер 3-нитка",
    color: "Выстиранный чёрный",
    fit: "Oversize",
  },
  {
    id: "ritm",
    name: "Лонгслив «Ритм»",
    category: "longsleeves",
    price: 3600,
    images: ["assets/img/longsleeve-ritm.jpg", "assets/img/longsleeve-rebels.jpg"],
    excerpt: "Ночной бунт на рукавах. Лонгслив, с которым выходят на сцену.",
    description:
      "Лонгслив с демоном на груди и вертикальной графикой на рукаве. Свободный крой, плотный кулир, посадка ниже бедра.",
    fabric: "100% хлопок, 200 г/м²",
    color: "Выстиранный чёрный",
    fit: "Oversize",
  },
  {
    id: "night-rebels",
    name: "Лонгслив «Гараж»",
    category: "longsleeves",
    price: 3800,
    images: ["assets/img/longsleeve-rebels.jpg", "assets/img/longsleeve-ritm.jpg"],
    excerpt: "Night Rebels. Street culture Tokyo — без приглашения.",
    description:
      "Двухслойная графика: дракон, иероглифы, надпись Night Rebels. Лонгслив для зала, улицы и первого ряда.",
    fabric: "100% хлопок, 200 г/м²",
    color: "Выстиранный чёрный",
    fit: "Regular",
  },
  {
    id: "midnight",
    name: "Куртка «После полуночи»",
    category: "jackets",
    price: 12900,
    images: ["assets/img/jacket-midnight.jpg", "assets/img/about-band.jpg"],
    excerpt: "Классика байкерского кроя. Кожа, металл, ночь.",
    description:
      "Косуха с асимметричной молнией, ремнём и металлической фурнитурой. Сидит по фигуре, живёт десятилетиями.",
    fabric: "Натуральная кожа / подклад вискоза",
    color: "Чёрный",
    fit: "Regular",
  },
  {
    id: "backstage",
    name: "Куртка «Бэкстейдж»",
    category: "jackets",
    price: 11800,
    images: ["assets/img/about-band.jpg", "assets/img/jacket-midnight.jpg"],
    excerpt: "Потёртая кожа, которая уже была на концерте.",
    description:
      "Винтажная косуха с естественными заломами. Для тех, кто выбирает характер вместо глянца.",
    fabric: "Натуральная кожа",
    color: "Чёрный винтаж",
    fit: "Relaxed",
  },
];

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function getProduct(id) {
  return PRODUCTS.find((item) => item.id === id);
}

function getRelated(product, limit = 4) {
  return PRODUCTS.filter((item) => item.id !== product.id).slice(0, limit);
}

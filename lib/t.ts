export const translations = {
  en: {
    // Directory filters
    searchPlaceholder: "Search a name, street or craving",
    searchLabel: "Search places",
    areaLabel: "Area",
    everywhere: "Everywhere",
    typeLabel: "Type of place",
    placesSingular: "place",
    placesPlural: "places",
    noResults: "Nothing matches that yet.",
    clearFilters: "Clear filters",
    showMore: (n: number) => `Show more (${n} left)`,
    // Footer
    footerNote: "An independent guide. Hours and photos live on each venue\u2019s own Instagram and Google Maps pages.",
    footerContact: "Your place is listed and something\u2019s wrong?",
    footerContactLink: "Tell us",
    // Blog
    placesInArticle: "Places in this article",
    allArticles: "\u2190 All articles",
    // Tabs
    tabHome: "Home",
    tabMoods: "Moods",
    tabMap: "Map",
    tabBlog: "Blog",
    // Site name
    siteName: "Palma Food Guide",
    // Surprise
    surpriseMe: "Surprise me",
    surpriseMeAgain: "Surprise me again",
    rolling: "Rolling",
    youreGoingTo: "You\u2019re going to",
    showMe: "Show me",
    // Home page
    heroHeading: (n: number) => `Hungry in Palma?`,
    heroLede: (n: number) => `${n} hand-picked spots across Palma and the rest of Mallorca. Pick a mood, or let the dice decide.`,
    allPlaces: "All the places",
    freshFromBlog: "Fresh from the blog",
    allArticlesShort: "All articles",
    regionPlaces: (n: number) => n === 1 ? "1 place" : `${n} places`,
    // Categories page
    categoriesHeading: "Pick a mood",
    categoriesLede: "What do you fancy? Tap one to see every place that does it.",
    // Category page
    allMoods: "\u2190 All moods",
    categoryLede: (n: number, name: string) => `${n === 1 ? "1 place" : `${n} places`} in Palma and the rest of Mallorca.`,
    // Region page
    onTheMap: "On the map",
    nothingHereYet: "Nothing here yet. New places are added as they are checked.",
    // Map page
    mapHeading: "Find somewhere",
    mapLede: "Every verified spot on one map.",
    // Category names
    categories: {
      "Bakery": "Bakery",
      "Bar": "Bar",
      "Beach restaurant": "Beach restaurant",
      "Bodega / wine bar": "Bodega / wine bar",
      "Burger restaurant": "Burger restaurant",
      "Caf\u00e9": "Caf\u00e9",
      "Cocktail bar": "Cocktail bar",
      "Craft beer bar": "Craft beer bar",
      "Japanese fusion restaurant": "Japanese fusion restaurant",
      "Korean restaurant": "Korean restaurant",
      "Mediterranean restaurant": "Mediterranean restaurant",
      "Restaurant": "Restaurant",
      "Steakhouse": "Steakhouse",
      "Tapas bar": "Tapas bar",
      "Vegan restaurant": "Vegan restaurant",
      "Winery": "Winery",
    } as Record<string, string>,
  },
  es: {
    // Directory filters
    searchPlaceholder: "Busca un nombre, calle o antojo",
    searchLabel: "Buscar lugares",
    areaLabel: "\u00c1rea",
    everywhere: "En todas partes",
    typeLabel: "Tipo de lugar",
    placesSingular: "lugar",
    placesPlural: "lugares",
    noResults: "Nada coincide con eso todav\u00eda.",
    clearFilters: "Borrar filtros",
    showMore: (n: number) => `Mostrar m\u00e1s (${n} restantes)`,
    // Footer
    footerNote: "Una gu\u00eda independiente. Los horarios y fotos viven en el Instagram y Google Maps de cada local.",
    footerContact: "\u00bfTu local est\u00e1 listado y algo es incorrecto?",
    footerContactLink: "Cu\u00e9ntanos",
    // Blog
    placesInArticle: "Lugares en este art\u00edculo",
    allArticles: "\u2190 Todos los art\u00edculos",
    // Tabs
    tabHome: "Inicio",
    tabMoods: "Ambiente",
    tabMap: "Mapa",
    tabBlog: "Blog",
    // Site name
    siteName: "Gu\u00eda Gastron\u00f3mica de Palma",
    // Surprise
    surpriseMe: "Sorpr\u00e9ndeme",
    surpriseMeAgain: "Sorpr\u00e9ndeme de nuevo",
    rolling: "Buscando",
    youreGoingTo: "Vas a ir a",
    showMe: "Llévame",
    // Home page
    heroHeading: (n: number) => `\u00bfHambre en Palma?`,
    heroLede: (n: number) => `${n} locales seleccionados en Palma y el resto de Mallorca. Elige el ambiente o deja que los dados decidan.`,
    allPlaces: "Todos los lugares",
    freshFromBlog: "Del blog",
    allArticlesShort: "Todos los art\u00edculos",
    regionPlaces: (n: number) => n === 1 ? "1 lugar" : `${n} lugares`,
    // Categories page
    categoriesHeading: "Elige el ambiente",
    categoriesLede: "\u00bfQu\u00e9 te apetece? Toca uno para ver todos los locales.",
    // Category page
    allMoods: "\u2190 Todos los ambientes",
    categoryLede: (n: number, name: string) => `${n === 1 ? "1 lugar" : `${n} lugares`} en Palma y el resto de Mallorca.`,
    // Region page
    onTheMap: "En el mapa",
    nothingHereYet: "Nada todav\u00eda. Se a\u00f1aden nuevos locales a medida que se verifican.",
    // Map page
    mapHeading: "Encuentra un lugar",
    mapLede: "Todos los locales verificados en un mapa.",
    // Category names
    categories: {
      "Bakery": "Panader\u00eda",
      "Bar": "Bar",
      "Beach restaurant": "Chiringuito",
      "Bodega / wine bar": "Bodega / bar de vinos",
      "Burger restaurant": "Hamburgueser\u00eda",
      "Caf\u00e9": "Caf\u00e9",
      "Cocktail bar": "Coctelar\u00eda",
      "Craft beer bar": "Bar de cerveza artesanal",
      "Japanese fusion restaurant": "Restaurante japon\u00e9s fusión",
      "Korean restaurant": "Restaurante coreano",
      "Mediterranean restaurant": "Restaurante mediterr\u00e1neo",
      "Restaurant": "Restaurante",
      "Steakhouse": "Asador",
      "Tapas bar": "Bar de tapas",
      "Vegan restaurant": "Restaurante vegano",
      "Winery": "Bodega",
    } as Record<string, string>,
  },
} as const;

export type Lang = keyof typeof translations;
export type T = (typeof translations)[Lang];

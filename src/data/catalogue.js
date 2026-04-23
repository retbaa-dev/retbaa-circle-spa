// Retbaa — Catalogue Officiel
// Source: Product list for registration (Excel officiel + Le Recueil 2026)
// Pyramide stratégique validée par Massata NIANG — Avr 2026

export const collections = [
  {
    id: 'atmosphere',
    name: { fr: 'Atmosphère', en: 'Atmosphere' },
    tagline: { fr: 'Le parfum comme langage du temps', en: 'Perfume as the language of time' },
    description: {
      fr: "Dans l'univers Atmosphère, Retbaa aborde le parfum comme un langage du temps. Chaque création devient un lieu, un fragment d'Afrique, une mémoire en mouvement.",
      en: "In the Atmosphere universe, Retbaa approaches perfume as the language of time. Each creation becomes a place, a fragment of Africa, a memory in motion."
    },
    icon: '🕯️',
    color: '#1A3A6B',
    subcategories: [
      {
        id: 'candles',
        name: { fr: 'Bougies', en: 'Candles' },
        tagline: { fr: 'Fabriquées en France, cire végétale (soja)', en: 'Made in France from vegetable wax (soy)' },
        products: [
          // ICON — produit signature absolu de la Maison
          { color: 'Black', name: { fr: 'Yasuke', en: 'Yasuke' }, formats: ['90g', '150g', '250g'], tier: 'icon', origin: 'France',
            notes: { fr: 'Bougie exclusive — signature de la Maison', en: 'Exclusive candle — House signature' } },
          // HÉROS — piliers commerciaux
          { color: 'Turquoise', name: { fr: 'Ataya', en: 'Ataya' }, formats: ['90g', '150g', '250g'], tier: 'hero', origin: 'France' },
          { color: 'Blue',      name: { fr: 'Brise de Dakar', en: 'Breeze of Dakar' }, formats: ['90g', '150g', '250g'], tier: 'hero', origin: 'France' },
          { color: 'Green',     name: { fr: 'Colline du Cap', en: 'Hill of the Cape' }, formats: ['90g', '150g', '250g'], tier: 'hero', origin: 'France' },
          // CHALLENGERS — rest of collection
          { color: 'Pink',    name: { fr: "Jardin d'Atlas", en: 'Garden of Atlas' }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
          { color: 'Yellow',  name: { fr: 'Vallée de Sambarino', en: 'Valley of Sambarino' }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
          { color: 'Orange',  name: { fr: "Marché d'Adjamé", en: "Market of Adjamé" }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
          { color: 'Black',   name: { fr: 'Murmures de Méroë', en: 'Whispers of Meroë' }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
          { color: 'Red',     name: { fr: 'Baiser de Carthage', en: 'Kiss of Carthage' }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
          { color: 'Purple',  name: { fr: 'Étoiles de Nabta', en: 'Stars of Nabta' }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
          { color: 'Beige',   name: { fr: "L'Âme de Kilwa", en: 'The Soul of Kilwa' }, formats: ['90g', '150g', '250g'], tier: 'challenger', origin: 'France' },
        ]
      },
      {
        id: 'diffusers',
        name: { fr: 'Diffuseurs Afya', en: 'Afya Diffusers' },
        tagline: { fr: 'Santé, équilibre, harmonie — en swahili', en: 'Health, balance, harmony — in Swahili' },
        products: [
          // HÉROS — référence principale
          { color: 'Black', name: { fr: 'Afya Noir L', en: 'Afya Black L' }, formats: ['L'], tier: 'hero', origin: 'France' },
          // CHALLENGERS
          { color: 'Gold',  name: { fr: 'Afya Or L',   en: 'Afya Gold L'   }, formats: ['L'],  tier: 'challenger', origin: 'France' },
          { color: 'Black', name: { fr: 'Afya Noir XL', en: 'Afya Black XL' }, formats: ['XL'], tier: 'challenger', origin: 'France' },
          { color: 'Gold',  name: { fr: 'Afya Or XL',   en: 'Afya Gold XL'  }, formats: ['XL'], tier: 'challenger', origin: 'France' },
        ]
      }
    ]
  },
  {
    id: 'kemia',
    name: { fr: 'Kemia', en: 'Kemia' },
    tagline: { fr: 'La mémoire suspendue du parfum', en: 'The suspended memory of perfume' },
    description: {
      fr: "KEMIA incarne un parfum sans feu ni bruit, qui habite l'air avec délicatesse. Son nom évoque l'alchimie, le lien entre matière et esprit. Le médaillon en céramique, le ruban de satin et la perle dorée lui donnent l'allure d'un bijou.",
      en: "KEMIA embodies a perfume without fire or noise, inhabiting the air with delicacy. Its name evokes alchemy, the link between matter and spirit. The ceramic medallion, satin ribbon and golden pearl give it the allure of jewelry."
    },
    icon: '💎',
    color: '#EFC0D4',
    subcategories: [
      {
        id: 'medaillons',
        name: { fr: 'Médaillons sensoriels', en: 'Sensory Lockets' },
        tagline: { fr: 'Céramique + flacon spray 10ml, fabriqué en France', en: 'Ceramic + 10ml spray bottle, made in France' },
        products: [
          // HÉROS — le médaillon Kemia, référence de l'univers
          { color: 'Turquoise', name: { fr: 'Kemia', en: 'Kemia' }, formats: ['Céramique + spray 10ml'], tier: 'hero', origin: 'France',
            notes: { fr: 'Médaillon sensoriel — pièce unique de la Maison', en: 'Sensory locket — House signature piece' } },
          // CHALLENGERS — déclinaisons coloris
          { color: 'Pink',  name: { fr: 'Kemia Rose',  en: 'Kemia Pink'  }, formats: ['Céramique + spray 10ml'], tier: 'challenger', origin: 'France' },
          { color: 'Green', name: { fr: 'Kemia Vert',  en: 'Kemia Green' }, formats: ['Céramique + spray 10ml'], tier: 'challenger', origin: 'France' },
          { color: 'Blue',  name: { fr: 'Kemia Bleu',  en: 'Kemia Blue'  }, formats: ['Céramique + spray 10ml'], tier: 'challenger', origin: 'France' },
          { color: 'Red',   name: { fr: 'Kemia Rouge', en: 'Kemia Red'   }, formats: ['Céramique + spray 10ml'], tier: 'challenger', origin: 'France' },
        ]
      }
    ]
  },
  {
    id: 'gourmet',
    name: { fr: 'Gourmet', en: 'Gourmet' },
    tagline: { fr: "L'art du goût africain sublimé", en: 'The art of elevated African taste' },
    description: {
      fr: "Retbaa sélectionne, mélange et sublime des sels rares, des épices et des chocolats artisanaux — une expérience gustative raffinée, de Penja à Zanzibar.",
      en: "Retbaa carefully selects, blends, and enhances rare salts, spices, and artisanal chocolates, delivering refined and elevated taste experiences from Penja to Zanzibar."
    },
    icon: '🧂',
    color: '#C8A96E',
    subcategories: [
      {
        id: 'salts-spices',
        name: { fr: 'Sels & Épices', en: 'Salts & Spices' },
        tagline: { fr: 'Origine Afrique', en: 'Origin Africa' },
        products: [
          // HÉROS — signature gustative
          { color: 'Blue', name: { fr: 'Fleur de Sel Graines de Paradis', en: 'Sea Salt with Grains of Paradise' }, formats: ['75g', '125g'], tier: 'hero', origin: 'Afrique',
            notes: { fr: 'Épice rare d\'Afrique de l\'Ouest', en: 'Rare West African spice' } },
          // CHALLENGERS
          { color: 'Pink',       name: { fr: 'Fleur de Sel Nature', en: 'Sea Salt Flakes' }, formats: ['75g', '125g'], tier: 'challenger', origin: 'Afrique' },
          { color: 'Warm Red',   name: { fr: 'Fleur de Sel Épices Secrètes', en: 'Sea Salt with Secret Spices' }, formats: ['75g', '125g'], tier: 'challenger', origin: 'Afrique' },
          { color: 'Green',      name: { fr: 'Fleur de Sel Poivre Vert Madagascar', en: 'Sea Salt with Madagascar Green Pepper' }, formats: ['75g', '125g'], tier: 'challenger', origin: 'Afrique' },
          { color: 'Deep Red',   name: { fr: "Fleur de Sel Fleur d'Hibiscus", en: 'Sea Salt with Hibiscus Flower' }, formats: ['75g', '125g'], tier: 'challenger', origin: 'Afrique' },
          { color: 'Green',      name: { fr: 'Poivre du Penja', en: 'Penja Pepper' }, formats: ['300g', '500g'], tier: 'challenger', origin: 'Afrique' },
          { color: 'Pink',       name: { fr: 'Sel Rose de l\'Himalaya', en: 'Pink Himalayan Salt' }, formats: ['300g', '500g'], tier: 'challenger', origin: 'Afrique' },
        ]
      },
      {
        id: 'chocolate',
        name: { fr: 'Chocolats Artisanaux', en: 'Artisanal Chocolates' },
        tagline: { fr: 'Fabriqués en France', en: 'Made in France' },
        products: [
          // HÉROS — barre signature
          { color: 'Red', name: { fr: 'Le Grain', en: 'Le Grain' }, formats: ['30g'], tier: 'hero', origin: 'France',
            notes: { fr: 'Barre chocolat lait praliné noisette', en: 'Milk chocolate bar with hazelnut praline' } },
          // CHALLENGERS
          { color: 'Blue',    name: { fr: 'Le Grain Noir', en: 'Le Grain Noir' }, formats: ['30g'], tier: 'challenger', origin: 'France',
            notes: { fr: 'Chocolat noir praliné sarrasin vegan', en: 'Dark chocolate buckwheat praline vegan' } },
          { color: 'Rose',    name: { fr: 'Le Grain Cacahuète', en: 'Le Grain Peanut' }, formats: ['30g'], tier: 'challenger', origin: 'France' },
          { color: 'Green',   name: { fr: 'Le Grain Vert', en: 'Le Grain Vert' }, formats: ['30g'], tier: 'challenger', origin: 'France',
            notes: { fr: 'Chocolat lait praliné pistache', en: 'Milk chocolate pistachio praline' } },
          { color: 'Orange',  name: { fr: 'Orangettes', en: 'Orangettes' }, formats: ['120g'], tier: 'challenger', origin: 'France' },
          { color: 'Royal Blue', name: { fr: 'Praliné Chocolat Noir de Tanzanie', en: 'Dark Chocolate from Tanzania Spread' }, formats: ['240g'], tier: 'challenger', origin: 'France' },
        ]
      },
      {
        id: 'giftboxes',
        name: { fr: 'Coffrets', en: 'Gift Boxes' },
        tagline: { fr: "L'art d'offrir — primés Pentawards 2025", en: 'The art of giving — Pentawards 2025 awarded' },
        products: [
          { color: 'Black/Gold/Pink', name: { fr: 'Coffret Signature 5×75g', en: 'Signature Gift Box 5×75g' }, formats: ['5×75g'], tier: 'hero',
            notes: { fr: 'Primé Pentawards 2025', en: 'Pentawards 2025 winner' } },
          { color: 'Blue',            name: { fr: 'Coffret 150g', en: 'Gift Box 150g' }, formats: ['150g'], tier: 'challenger' },
          { color: 'Black/Blue/Zebra',name: { fr: 'Coffret Duo 2×75g', en: 'Duo Gift Box 2×75g' }, formats: ['2×75g'], tier: 'challenger' },
        ]
      }
    ]
  }
];

export const tierLabels = {
  icon: {
    fr: 'Icons',
    en: 'Icons',
    description: { fr: 'La signature absolue de la Maison', en: 'The absolute House signature' },
    color: '#1A3A6B'
  },
  hero: {
    fr: 'Héros',
    en: 'Heroes',
    description: { fr: 'Les piliers commerciaux — 1 à 3 par univers', en: 'Commercial pillars — 1 to 3 per universe' },
    color: '#C8A96E'
  },
  challenger: {
    fr: 'Challengers',
    en: 'Challengers',
    description: { fr: 'Nouveautés & extensions de gamme', en: 'New arrivals & range extensions' },
    color: '#EFC0D4'
  },
};

export const brandTagline = {
  fr: 'Sensory Odyssey',
  en: 'Sensory Odyssey'
};

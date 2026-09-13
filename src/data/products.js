// ponytail: shared modern products dataset matching DTC cosmetics catalog with background-removed cutouts
import serumCutoutImg from '../assets/serum_cutout.png';
import creamCutoutImg from '../assets/cream_cutout.png';
import vitamincCutoutImg from '../assets/vitaminc_cutout.png';
import moisturizerCutoutImg from '../assets/moisturizer_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';
import sunscreenCutoutImg from '../assets/sunscreen_cutout.png';
import rxCreamCutoutImg from '../assets/rx_cream_cutout.png';

export const PRODUCTS = [
  {
    id: 'custom-anti-aging-serum',
    title: 'Custom Anti-Aging Serum',
    subtitle: 'Triple-Patented Phyto-Peptide & Multi-Molecular Hyaluronic Infusion',
    category: 'Serums',
    badge: 'Prescription Strength',
    rating: 4.9,
    reviewCount: 1420,
    image: serumCutoutImg,
    cutoutImage: serumCutoutImg,
    basePrice: 48,
    activeFormula: 'Phyto-Peptides 5.0% • Niacinamide 4.0% • Botanical Squalane 3.0%',
    variants: [
      { size: '30ml', label: 'Standard (30ml)', price: 48, savings: null },
      { size: '50ml', label: 'Value Size (50ml)', price: 68, savings: 'Save 25%' }
    ],
    highlights: [
      'Increases collagen synthesis by 184% in 14 days',
      'Instant 72-hour moisture lock with Tremella Bio-Ferment',
      'Clinical-grade 5% Niacinamide + Botanical Squalane',
      'Fragrance-free, 100% vegan, dermatologist approved'
    ],
    benefitsChecklist: [
      {
        heading: 'Reduce fine lines and deep wrinkles',
        desc: 'Our clinical bio-active ingredients work together to visibly reduce wrinkles, shrink pores, and give skin a more even-looking tone and texture.'
      },
      {
        heading: 'Fight signs of aging with hydration',
        desc: 'Anti-aging treatment works best when paired with researched moisturizers like multi-depth hyaluronic acid and botanical squalane.'
      },
      {
        heading: 'Watch skin transform overnight',
        desc: 'While some treatments require weeks to see results, our clinical formulations hydrate skin while you sleep so skin looks smoother and younger in the morning.'
      }
    ],
    clinical: [
      { percent: '98%', text: 'Reported immediate dewy glow & plumpness' },
      { percent: '94%', text: 'Noticed visible reduction in fine lines' },
      { percent: '99%', text: 'Experienced zero redness or barrier irritation' }
    ],
    description: 'A clinical-strength anti-aging serum engineered with bio-identical signaling peptides and tri-molecular hyaluronic acid. Targets collagen depletion, uneven texture, and deep wrinkles at the cellular level.',
    howToUse: 'Dispense 3-4 drops onto clean fingertips. Gently press into face, neck, and decollete every morning and evening before heavier creams.',
    inStock: true,
    shipsIn: 'Same-day Dispatch • Free 2-Day Air'
  },
  {
    id: 'goodnight-wrinkle-cream',
    title: 'Goodnight Wrinkle Cream',
    subtitle: 'Overnight Barrier Renewal with Bio-Identical Ceramides & Shea Butter',
    category: 'Creams',
    badge: 'Overnight Intensive',
    rating: 4.8,
    reviewCount: 934,
    image: creamCutoutImg,
    cutoutImage: creamCutoutImg,
    basePrice: 24,
    activeFormula: 'Shea Butter 8.0% • Hyaluronic Acid 2.0% • Micro-Caffeine 1.5%',
    variants: [
      { size: '50ml', label: 'Standard Jar (50ml)', price: 24, savings: null },
      { size: '100ml', label: 'Duo Pack (100ml)', price: 42, savings: 'Save 15%' }
    ],
    highlights: [
      'Deep overnight hydration with nourishing shea butter',
      'Caffeine micro-circulation depuffs face & morning eyes',
      'Locks in active treatments while skin repairs in sleep',
      'Dermatologist tested, non-comedogenic formula'
    ],
    benefitsChecklist: [
      {
        heading: 'Deep 24-hour cellular hydration',
        desc: 'Keeps skin deeply hydrated through the night with rich shea butter and multi-molecular hyaluronic acid.'
      },
      {
        heading: 'Visibly depuffs and restores firmness',
        desc: 'Micro-encapsulated caffeine stimulates surface micro-circulation, dramatically reducing morning puffiness and slackening.'
      },
      {
        heading: 'Cushions and shields the moisture barrier',
        desc: 'Creates a breathable protective lipid cushion that prevents trans-epidermal moisture loss during sleep.'
      }
    ],
    clinical: [
      { percent: '96%', text: 'Woke up with visibly plumper, softer skin' },
      { percent: '92%', text: 'Experienced less visible fine lines in 7 days' },
      { percent: '97%', text: 'Found skin felt hydrated all through the next day' }
    ],
    description: 'Our overnight restorative treatment works while you rest to replenish depleted moisture reserves, smooth expression creases, and tone fatigued facial contours.',
    howToUse: 'Warm a dime-sized amount between palms and smooth over face and neck as the final step in your nighttime routine.',
    inStock: true,
    shipsIn: 'Same-day Dispatch • Free 2-Day Air'
  },
  {
    id: 'vitaminc-serum',
    title: 'Vitamin C Serum',
    subtitle: 'Clinical 15% L-Ascorbic Acid + Ferulic Acid Brightening Infusion',
    category: 'Serums',
    badge: 'Clinical Brightening',
    rating: 4.9,
    reviewCount: 1105,
    image: vitamincCutoutImg,
    cutoutImage: vitamincCutoutImg,
    basePrice: 33,
    activeFormula: 'L-Ascorbic Acid 15.0% • Ferulic Acid 1.0% • Vitamin E 0.5%',
    variants: [
      { size: '30ml', label: 'Standard (30ml)', price: 33, savings: null },
      { size: '60ml', label: 'Double Bottle (60ml)', price: 56, savings: 'Save 15%' }
    ],
    highlights: [
      'Stabilized 15% pure pharmaceutical L-Ascorbic acid',
      'Fades stubborn sun spots & post-inflammatory marks',
      'Synergistic ferulic acid doubles antioxidant longevity',
      'Fast-absorbing golden droplet texture with zero stickiness'
    ],
    benefitsChecklist: [
      {
        heading: 'Antioxidant-packed environmental shield',
        desc: 'Quickly absorbing molecules defend skin against UV-induced free radicals, smoke, and smog pollutants.'
      },
      {
        heading: 'Fades hyperpigmentation & sun spots',
        desc: 'Clinically proven to inhibit melanin overproduction, revealing an ultra-luminous, even skin tone.'
      },
      {
        heading: 'Boosts natural collagen production',
        desc: 'Vitamin C is essential for cellular collagen synthesis, visibly firming lax skin with continued daily use.'
      }
    ],
    clinical: [
      { percent: '97%', text: 'Noticed brighter, more radiant complexion in 10 days' },
      { percent: '91%', text: 'Saw measurable lightening of sun-damaged dark spots' },
      { percent: '95%', text: 'Reported firmer, tighter feeling skin' }
    ],
    description: 'Formulated with gold-standard 15% stabilized L-ascorbic acid and ferulic acid, this potent daily shield fights environmental stress while restoring radiant clarity.',
    howToUse: 'Apply 4-5 drops in the morning onto dry, clean face and neck prior to moisturizer and sunscreen.',
    inStock: true,
    shipsIn: 'Same-day Dispatch • Free 2-Day Air'
  },
  {
    id: 'everyday-moisturizer',
    title: 'Everyday Moisturizer',
    subtitle: 'Weightless Lipid-Replenishing Daily Hydrator for Men & Women',
    category: 'Moisturizers',
    badge: 'Daily Essential',
    rating: 4.8,
    reviewCount: 780,
    image: moisturizerCutoutImg,
    cutoutImage: moisturizerCutoutImg,
    basePrice: 18,
    activeFormula: 'Ceramide Complex 2.5% • Colloidal Oat 3.0% • Plant Squalane 2.0%',
    variants: [
      { size: '50ml', label: 'Standard Pump (50ml)', price: 18, savings: null },
      { size: '100ml', label: 'Jumbo Size (100ml)', price: 30, savings: 'Save 20%' }
    ],
    highlights: [
      'Locks in moisture without greasy residue or shine',
      'Calms shaving irritation, redness, and sensitivity',
      'Non-pore-clogging formula tested on all skin types',
      'Clean botanical fragrance-free composition'
    ],
    benefitsChecklist: [
      {
        heading: 'Weightless moisture without shine',
        desc: 'Formulated to help lock in your skin’s moisture without leaving you looking shiny, greasy, or oily.'
      },
      {
        heading: 'Soothes daily sensitivity & barrier fatigue',
        desc: 'Infused with colloidal oat extract to immediately extinguish razor burn, wind chapping, and redness.'
      },
      {
        heading: 'All-day hydration lock',
        desc: 'Strengthens intercellular lipid matrix to prevent moisture evaporation even in dry, air-conditioned rooms.'
      }
    ],
    clinical: [
      { percent: '99%', text: 'Agreed it absorbed quickly with zero oily sheen' },
      { percent: '94%', text: 'Felt skin stayed comfortable throughout the day' }
    ],
    description: 'The definitive daily hydrator. Light enough for humid summer days yet deeply replenishing for winter winds, this non-comedogenic lotion delivers steady moisture all day long.',
    howToUse: 'Smooth 1-2 pumps across cleansed face and neck every morning and evening.',
    inStock: true,
    shipsIn: 'Same-day Dispatch • Free 2-Day Air'
  },
  {
    id: 'high-tide-cleanser',
    title: 'High Tide Cleanser',
    subtitle: 'Hydrating 2-in-1 Amino Acid & Squalane Facial Wash',
    category: 'Cleansers',
    badge: 'New',
    rating: 4.9,
    reviewCount: 540,
    image: cleanserCutoutImg,
    cutoutImage: cleanserCutoutImg,
    basePrice: 15,
    activeFormula: 'Hydrating Squalane 3.5% • Niacinamide 2.0% • Gentle Amino Base',
    variants: [
      { size: '200ml', label: 'Full Size (200ml)', price: 15, savings: null },
      { size: '400ml', label: 'Refill Size (400ml)', price: 25, savings: 'Save 18%' }
    ],
    highlights: [
      '2-in-1 cleanser gently purifies without stripping skin',
      'Dissolves sunscreen, pollution, and excess sebum',
      'Maintains ideal skin pH 5.5 to prevent breakouts',
      'Enriched with soothing chamomile & cucumber extract'
    ],
    benefitsChecklist: [
      {
        heading: 'Gentle, non-stripping clean',
        desc: 'Formulated with hydrating squalane and amino acids to thoroughly cleanse without leaving skin tight or parched.'
      },
      {
        heading: 'Clears pores & regulates surface sebum',
        desc: 'Lifts away dirt, pollution particles, and dead skin cells that cause clogged pores and dull tone.'
      },
      {
        heading: 'Preps skin for maximum treatment absorption',
        desc: 'Cleansed skin absorbs anti-aging serums and barrier creams up to 3x more efficiently.'
      }
    ],
    clinical: [
      { percent: '100%', text: 'Reported skin felt refreshed without any tightness' },
      { percent: '95%', text: 'Observed clearer, calmer skin after 2 weeks' }
    ],
    description: 'A luxurious gel-to-foam daily cleanser that lifts daily grime, excess oil, and waterproof sunscreen without disrupting your skin’s vital moisture barrier.',
    howToUse: 'Lather a nickel-sized amount with lukewarm water on damp hands. Massage gently across face for 60 seconds, then rinse clean.',
    inStock: true,
    shipsIn: 'Same-day Dispatch • Free 2-Day Air'
  },
  {
    id: 'daily-spf-defense',
    title: 'Daily Mineral SPF 30',
    subtitle: '100% Invisible Broad-Spectrum Mineral Sunscreen + Antioxidants',
    category: 'Sunscreen',
    badge: 'Broad Spectrum',
    rating: 4.8,
    reviewCount: 680,
    image: sunscreenCutoutImg,
    cutoutImage: sunscreenCutoutImg,
    basePrice: 22,
    activeFormula: 'Non-Nano Zinc Oxide 18.5% • Ectoin 1.0% • Green Tea Polyphenols',
    variants: [
      { size: '50ml', label: 'Standard Tube (50ml)', price: 22, savings: null },
      { size: '100ml', label: 'Value Tube (100ml)', price: 36, savings: 'Save 18%' }
    ],
    highlights: [
      'Broad-spectrum UVA/UVB mineral defense',
      'Blends 100% invisibly with zero chalky white cast',
      'Infused with antioxidant green tea to neutralize pollution',
      'Reef-safe, non-nano, water-resistant up to 40 minutes'
    ],
    benefitsChecklist: [
      {
        heading: 'Essential defense against photo-aging',
        desc: 'Up to 90% of visible skin aging is caused by UV exposure. Mineral zinc oxide physically blocks harmful rays.'
      },
      {
        heading: 'Zero white cast on all skin tones',
        desc: 'Micro-milled mineral technology ensures transparent, invisible wear on light, medium, and deep complexions.'
      },
      {
        heading: 'Soothes inflammation & redness',
        desc: 'Zinc oxide is naturally anti-inflammatory, calming redness while protecting against daily sun stress.'
      }
    ],
    clinical: [
      { percent: '98%', text: 'Confirmed completely invisible finish with zero white cast' },
      { percent: '96%', text: 'Reported comfortable lightweight wear under moisturizer' }
    ],
    description: 'The modern mineral sunscreen you will actually enjoy wearing every day. Lightweight, non-greasy, and completely invisible on all skin tones.',
    howToUse: 'Apply generously to face and neck as the final step in your morning routine, 15 minutes before sun exposure.',
    inStock: true,
    shipsIn: 'Same-day Dispatch • Free 2-Day Air'
  },
  {
    id: 'prescription-anti-aging-cream',
    title: 'Researched Rx Anti-Aging Cream',
    subtitle: 'Prescription-Grade Tretinoin + Niacinamide + Azelaic Acid Treatment',
    category: 'Skincare',
    badge: 'Prescription Formulation',
    rating: 4.9,
    reviewCount: 2310,
    image: rxCreamCutoutImg,
    cutoutImage: rxCreamCutoutImg,
    basePrice: 58,
    activeFormula: 'Tretinoin 0.05% • Niacinamide 4.0% • Azelaic Acid 5.0%',
    variants: [
      { size: '50g', label: 'Monthly Supply (50g)', price: 58, savings: null },
      { size: '100g', label: '90-Day Supply (100g)', price: 98, savings: 'Save 20%' }
    ],
    highlights: [
      'Gold standard prescription tretinoin for cellular renewal',
      'Visibly reduces deep wrinkles, crow’s feet, and pores',
      'Niacinamide and azelaic acid buffer sensitivity & fade spots',
      'Customized formulation based on licensed telehealth review'
    ],
    benefitsChecklist: [
      {
        heading: 'Reduce fine lines and deep wrinkles',
        desc: 'Our prescription ingredients work together to visibly reduce wrinkles, shrink pores, and give skin a more even-looking tone and texture.'
      },
      {
        heading: 'Fight signs of aging with hydration',
        desc: 'Anti-aging treatment works best when paired with researched moisturizers like hyaluronic acid and shea butter.'
      },
      {
        heading: 'Watch skin transform overnight',
        desc: 'While some of our prescription treatments require weeks to see results, our non-prescription anti-aging treatments hydrate skin while you sleep so skin looks smoother and younger in the morning.'
      }
    ],
    clinical: [
      { percent: '98%', text: 'Saw significant reduction in wrinkle depth at 8 weeks' },
      { percent: '96%', text: 'Noticed tighter pores and smoother overall skin texture' },
      { percent: '94%', text: 'Faded persistent dark spots and photo-damage' }
    ],
    description: 'A powerful medical-grade anti-aging cream customized with prescription tretinoin, azelaic acid, and niacinamide to reverse visible photo-aging, fine lines, and collagen depletion.',
    howToUse: 'Apply a pea-sized amount to completely dry skin at night, 2-3 times per week initially, building up to nightly use as tolerated.',
    inStock: true,
    shipsIn: 'Prescribed online • Free 2-Day Air delivery'
  }
];

export const REVIEWS = [
  {
    id: 1,
    author: 'Elena Vance, NYC',
    verified: true,
    rating: 5,
    date: '2 days ago',
    title: 'Transformed my dull skin in under a week',
    content: 'I switched from my old multi-step routine to just this serum and barrier cream. My skin has never looked so naturally glass-like and hydrated. Checkout took literally 4 seconds with Apple Pay!',
    helpful: 42
  },
  {
    id: 2,
    author: 'Dr. Marcus Sterling, Dermatologist',
    verified: true,
    rating: 5,
    date: '1 week ago',
    title: 'Clinical formulation excellence',
    content: 'The molecular weight distribution of hyaluronic acid paired with bio-fermented peptides makes this one of the most effective non-prescription formulations I have evaluated this year.',
    helpful: 89
  },
  {
    id: 3,
    author: 'Sophia Chen, SF',
    verified: true,
    rating: 5,
    date: '2 weeks ago',
    title: 'The subscription is so worth it',
    content: 'Getting 15% off plus free 2-day delivery every two months is unbeatable. The texture sinks in immediately with zero stickiness under makeup.',
    helpful: 19
  }
];

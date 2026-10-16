// Catalog used by `pnpm seed`. Images are photographs from Wikimedia Commons;
// author + license are pulled from Commons at seed time and stored on each product.

export const products = [
  // ── Ornamental Houseplants ────────────────────────────────────────────────
  {
    slug: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    botanicalName: 'Monstera deliciosa',
    category: 'Ornamental Houseplants',
    price: 899,
    isFeatured: true,
    commonsFile: 'File:Monstera deliciosa2.jpg',
    care: { light: 'Bright, indirect', water: 'Weekly, when top 5 cm is dry', level: 'Easy' },
    description:
      'The Swiss cheese plant that started the indoor-jungle movement. Glossy, heart-shaped leaves split into dramatic fenestrations as it matures, turning any corner into a statement. Ships in a 20 cm nursery pot with a coir moss pole so it can climb from day one.'
  },
  {
    slug: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    botanicalName: 'Ficus lyrata',
    category: 'Ornamental Houseplants',
    price: 1299,
    isFeatured: true,
    commonsFile: 'File:Fiddle leaf fig 2.jpg',
    care: { light: 'Bright, filtered', water: 'Every 7–10 days', level: 'Moderate' },
    description:
      'Big, violin-shaped leaves with deep veining make the fiddle leaf fig the designer favourite for living rooms. It loves a bright spot near an east-facing window and rewards consistency with a tall, sculptural silhouette. Supplied at roughly 60–75 cm tall.'
  },
  {
    slug: 'chinese-money-plant',
    name: 'Chinese Money Plant',
    botanicalName: 'Pilea peperomioides',
    category: 'Ornamental Houseplants',
    price: 449,
    commonsFile: 'File:Pilea peperomioides Chinese money plant.jpg',
    care: { light: 'Bright, indirect', water: 'When soil is dry halfway', level: 'Easy' },
    description:
      'Coin-shaped leaves on slender stems give the pilea its cheerful, polka-dot look. It is famously generous with baby offshoots, so one plant soon becomes a windowsill full to share with friends. Rotate weekly to keep it growing symmetrical.'
  },
  {
    slug: 'calathea-orbifolia',
    name: 'Calathea Orbifolia',
    botanicalName: 'Goeppertia orbifolia',
    category: 'Ornamental Houseplants',
    price: 649,
    commonsFile: 'File:Calathea orbifolia 2.jpg',
    care: { light: 'Medium, indirect', water: 'Keep evenly moist', level: 'Moderate' },
    description:
      'Broad, round leaves painted with silver-green stripes — the orbifolia is the showpiece of the prayer-plant family. It thrives in humid bathrooms and kitchens and gently lifts its leaves each evening. Use filtered or rested tap water for the crispest edges.'
  },

  // ── Flowering Bedding Plants ──────────────────────────────────────────────
  {
    slug: 'african-marigold',
    name: 'African Marigold',
    botanicalName: 'Tagetes erecta',
    category: 'Flowering Bedding Plants',
    price: 129,
    commonsFile: 'File:Tagetes x erecta1.jpg',
    care: { light: 'Full sun', water: 'Every 2–3 days', level: 'Easy' },
    description:
      'Big, pom-pom blooms in saffron and gold that flower for months with almost no fuss. Marigolds are the backbone of Indian festive gardens and naturally deter pests around vegetables. Supplied as a healthy, budding plant in a 10 cm pot.'
  },
  {
    slug: 'petunia',
    name: 'Petunia',
    botanicalName: 'Petunia × atkinsiana',
    category: 'Flowering Bedding Plants',
    price: 149,
    commonsFile: "File:Petúnia (do tupi petyma, 'tabaco').jpg",
    care: { light: 'Full sun', water: 'Daily in summer', level: 'Easy' },
    description:
      'Trumpet-shaped flowers that tumble over balcony rails and hanging baskets in waves of colour. Petunias love the winter sun of the Indian plains and keep blooming if you pinch off spent flowers. Colours vary by batch for a cheerful mix.'
  },
  {
    slug: 'busy-lizzie',
    name: 'Busy Lizzie',
    botanicalName: 'Impatiens walleriana',
    category: 'Flowering Bedding Plants',
    price: 159,
    commonsFile: 'File:Impatienswalleriana.jpg',
    care: { light: 'Partial shade', water: 'Keep moist', level: 'Easy' },
    description:
      'One of the few flowers that blooms happily in shade. Busy Lizzie covers itself in soft, flat flowers from spring to the first chill — perfect for north-facing balconies and under trees where nothing else will flower.'
  },
  {
    slug: 'zinnia',
    name: 'Zinnia',
    botanicalName: 'Zinnia elegans',
    category: 'Flowering Bedding Plants',
    price: 139,
    commonsFile: 'File:Zinnienblüte Zinnia elegans stack15 20190722-RM-7222254.jpg',
    care: { light: 'Full sun', water: 'Every 2 days', level: 'Easy' },
    description:
      'Layered, dahlia-like blooms on sturdy stems that make excellent cut flowers. Zinnias handle heat beautifully and are a magnet for butterflies — the more you cut, the more they bloom.'
  },

  // ── Herbs and Edible Plants ───────────────────────────────────────────────
  {
    slug: 'holy-basil-tulsi',
    name: 'Holy Basil (Tulsi)',
    botanicalName: 'Ocimum tenuiflorum',
    category: 'Herbs and Edible Plants',
    price: 179,
    isFeatured: true,
    commonsFile: 'File:Tulsi or Tulasi Holy basil.jpg',
    care: { light: 'Full sun', water: 'Every 1–2 days', level: 'Easy' },
    description:
      'The sacred, clove-scented basil found in courtyards across India. Brew the leaves into kadha and chai, or simply enjoy the aroma on a sunny windowsill. Pinch the flower spikes to keep it bushy and leafy all year.'
  },
  {
    slug: 'sweet-basil',
    name: 'Sweet Basil',
    botanicalName: 'Ocimum basilicum',
    category: 'Herbs and Edible Plants',
    price: 169,
    commonsFile: 'File:Ocimum basilicum 8zz.jpg',
    care: { light: 'Full sun', water: 'Keep evenly moist', level: 'Easy' },
    description:
      'The Italian kitchen essential for pesto, pasta and caprese. Soft, fragrant leaves grow fast in warm weather — harvest from the top to encourage a fuller plant and a steady supply.'
  },
  {
    slug: 'spearmint',
    name: 'Spearmint (Pudina)',
    botanicalName: 'Mentha spicata',
    category: 'Herbs and Edible Plants',
    price: 149,
    commonsFile: 'File:Minze.jpg',
    care: { light: 'Sun to part shade', water: 'Keep moist', level: 'Easy' },
    description:
      'Fresh pudina for chutneys, raita and nimbu pani, right outside your kitchen. Mint is vigorous and almost impossible to kill — keep it in its own pot so it does not take over its neighbours.'
  },
  {
    slug: 'rosemary',
    name: 'Rosemary',
    botanicalName: 'Salvia rosmarinus',
    category: 'Herbs and Edible Plants',
    price: 299,
    commonsFile: 'File:Rosemary in bloom.JPG',
    care: { light: 'Full sun', water: 'When soil is dry', level: 'Moderate' },
    description:
      'Woody, pine-scented sprigs for roast vegetables, focaccia and infused oils. Rosemary prefers to dry out between waterings and loves a hot, breezy balcony. Pale blue flowers appear in the cooler months.'
  },
  {
    slug: 'curry-leaf',
    name: 'Curry Leaf Plant',
    botanicalName: 'Murraya koenigii',
    category: 'Herbs and Edible Plants',
    price: 249,
    commonsFile: 'File:Murraya koenigii leaves.jpg',
    care: { light: 'Full sun', water: 'Twice a week', level: 'Easy' },
    description:
      'Kadi patta, fresh from the pot, for the tadka that makes South Indian cooking sing. A young, well-rooted sapling that grows into a small, aromatic shrub — feed it buttermilk-diluted water once a month for lush growth.'
  },

  // ── Succulents and Cacti ──────────────────────────────────────────────────
  {
    slug: 'aloe-vera',
    name: 'Aloe Vera',
    botanicalName: 'Aloe barbadensis miller',
    category: 'Succulents and Cacti',
    price: 249,
    commonsFile: 'File:Aloe vera pot.jpg',
    care: { light: 'Bright light', water: 'Every 2–3 weeks', level: 'Easy' },
    description:
      'A first-aid kit that grows on your windowsill. The plump leaves hold a soothing gel for sunburn and skin care, and the plant asks for little more than sunshine and the occasional drink.'
  },
  {
    slug: 'echeveria',
    name: 'Echeveria Elegans',
    botanicalName: 'Echeveria elegans',
    category: 'Succulents and Cacti',
    price: 199,
    commonsFile: 'File:Echeveria elegans - 1.jpg',
    care: { light: 'Bright light', water: 'When fully dry', level: 'Easy' },
    description:
      'Perfect powder-blue rosettes, often called Mexican snowball. Echeverias stay compact, look like living sculptures on a desk, and slowly form clusters of pups around the mother plant.'
  },
  {
    slug: 'zebra-haworthia',
    name: 'Zebra Haworthia',
    botanicalName: 'Haworthiopsis attenuata',
    category: 'Succulents and Cacti',
    price: 229,
    commonsFile: 'File:Winterbourne - Haworthia attenuata (6120983526).jpg',
    care: { light: 'Bright, indirect', water: 'Every 2–3 weeks', level: 'Easy' },
    description:
      'Spiky, dark-green leaves banded with raised white stripes. Unlike most succulents the zebra plant tolerates lower light, making it the ideal desk companion for offices and study tables.'
  },
  {
    slug: 'jade-plant',
    name: 'Jade Plant',
    botanicalName: 'Crassula ovata',
    category: 'Succulents and Cacti',
    price: 349,
    isFeatured: true,
    commonsFile: 'File:Crassula ovata 700.jpg',
    care: { light: 'Bright light', water: 'When soil is dry', level: 'Easy' },
    description:
      'Thick, glossy, coin-like leaves on a sturdy trunk — the classic good-luck plant. Jade grows slowly into a miniature tree and can live for decades, making it a lovely housewarming gift.'
  },
  {
    slug: 'pincushion-cactus',
    name: 'Pincushion Cactus',
    botanicalName: 'Mammillaria sp.',
    category: 'Succulents and Cacti',
    price: 199,
    commonsFile: 'File:Mammillaria tayloriorum.jpg',
    care: { light: 'Full sun', water: 'Every 3 weeks', level: 'Easy' },
    description:
      'A neat, globe-shaped cactus wrapped in soft white spines. Given plenty of sun it crowns itself with a ring of tiny pink flowers each spring. Supplied in gritty cactus mix for perfect drainage.'
  },

  // ── Fruit Trees and Bushes ────────────────────────────────────────────────
  {
    slug: 'dwarf-lemon-tree',
    name: 'Dwarf Lemon Tree',
    botanicalName: 'Citrus limon',
    category: 'Fruit Trees and Bushes',
    price: 799,
    isFeatured: true,
    commonsFile: 'File:P1030323.JPG',
    care: { light: 'Full sun', water: 'Twice a week', level: 'Moderate' },
    description:
      'A grafted, container-friendly lemon that fruits within a year of planting. Fragrant white blossoms appear several times a year, followed by juicy lemons for your nimbu pani. Ideal for terraces and sunny balconies.'
  },
  {
    slug: 'pomegranate',
    name: 'Pomegranate Plant',
    botanicalName: 'Punica granatum',
    category: 'Fruit Trees and Bushes',
    price: 549,
    commonsFile: 'File:Cracked pomegranate on a tree.jpg',
    care: { light: 'Full sun', water: 'Twice a week', level: 'Easy' },
    description:
      'Bright orange-red flowers followed by ruby-seeded fruit. This grafted Bhagwa variety is heat- and drought-tolerant and stays compact enough for a large pot on the terrace.'
  },
  {
    slug: 'guava',
    name: 'Guava Plant',
    botanicalName: 'Psidium guajava',
    category: 'Fruit Trees and Bushes',
    price: 499,
    commonsFile: 'File:Guava Fruit.jpg',
    care: { light: 'Full sun', water: 'Twice a week', level: 'Easy' },
    description:
      'The Allahabad Safeda guava — sweet, white-fleshed and fragrant. A hardy, grafted plant that adapts to most Indian climates and begins fruiting in its second season.'
  },
  {
    slug: 'strawberry',
    name: 'Strawberry Plant',
    botanicalName: 'Fragaria × ananassa',
    category: 'Fruit Trees and Bushes',
    price: 199,
    commonsFile: 'File:Strawberries.JPG',
    care: { light: 'Full sun', water: 'Keep moist', level: 'Moderate' },
    description:
      'Grow your own sweet berries in a pot or hanging basket. Plant in the cool season for a spring harvest; runners root easily, so one plant soon becomes a whole patch.'
  },

  // ── Vegetable Plants and Seedlings ────────────────────────────────────────
  {
    slug: 'tomato-seedlings',
    name: 'Tomato Seedlings (Tray of 6)',
    botanicalName: 'Solanum lycopersicum',
    category: 'Vegetable Plants and Seedlings',
    price: 149,
    commonsFile: 'File:Red tomato (6951842889).jpg',
    care: { light: 'Full sun', water: 'Daily', level: 'Easy' },
    description:
      'Six hardy, hybrid tomato seedlings ready to transplant. Give them a stake and full sun and you will be picking ripe tomatoes in around ten weeks — nothing from the shop tastes the same.'
  },
  {
    slug: 'chilli-seedlings',
    name: 'Chilli Seedlings (Tray of 6)',
    botanicalName: 'Capsicum annuum',
    category: 'Vegetable Plants and Seedlings',
    price: 129,
    commonsFile: 'File:Shan Hills, Myanmar, Red chili pepper plant.jpg',
    care: { light: 'Full sun', water: 'Every 2 days', level: 'Easy' },
    description:
      'Prolific green-to-red chillies with a medium kick, perfect for everyday cooking. Chilli plants are compact, productive and happy in 20 cm pots on a sunny ledge.'
  },
  {
    slug: 'brinjal-seedlings',
    name: 'Brinjal Seedlings (Tray of 6)',
    botanicalName: 'Solanum melongena',
    category: 'Vegetable Plants and Seedlings',
    price: 139,
    commonsFile: 'File:Solanum melongena 24 08 2012 (1).JPG',
    care: { light: 'Full sun', water: 'Every 2 days', level: 'Easy' },
    description:
      'Glossy purple baingan for bharta and sambar, grown at home. These sturdy seedlings fruit generously through the warm months and do well in grow bags.'
  },
  {
    slug: 'spinach-seedlings',
    name: 'Spinach Seedlings (Tray of 6)',
    botanicalName: 'Spinacia oleracea',
    category: 'Vegetable Plants and Seedlings',
    price: 99,
    commonsFile: 'File:Spinacia oleracea Spinazie bloeiend.jpg',
    care: { light: 'Sun to part shade', water: 'Keep moist', level: 'Easy' },
    description:
      'Tender palak for saag and smoothies. Spinach grows quickly in the cooler months — harvest the outer leaves and the plant keeps producing for weeks.'
  },

  // ── Indoor Air-Purifying Plants ───────────────────────────────────────────
  {
    slug: 'snake-plant',
    name: 'Snake Plant',
    botanicalName: 'Dracaena trifasciata',
    category: 'Indoor Air-Purifying Plants',
    price: 449,
    isFeatured: true,
    commonsFile: "File:Snake Plant (Sansevieria trifasciata 'Laurentii').jpg",
    care: { light: 'Low to bright', water: 'Every 2–3 weeks', level: 'Easy' },
    description:
      'Upright, sword-like leaves edged in gold. The snake plant is practically indestructible, tolerates low light and forgetful watering, and is one of the few plants that releases oxygen at night — perfect for bedrooms.'
  },
  {
    slug: 'golden-pothos',
    name: 'Golden Pothos (Money Plant)',
    botanicalName: 'Epipremnum aureum',
    category: 'Indoor Air-Purifying Plants',
    price: 299,
    isFeatured: true,
    commonsFile: 'File:Money Plant (Epipremnum aureum) 4.jpg',
    care: { light: 'Low to bright, indirect', water: 'Weekly', level: 'Easy' },
    description:
      'Heart-shaped, gold-splashed leaves on fast-growing vines. Let it trail from a shelf or train it up a pole — the money plant forgives almost anything and is a superb beginner plant.'
  },
  {
    slug: 'peace-lily',
    name: 'Peace Lily',
    botanicalName: 'Spathiphyllum wallisii',
    category: 'Indoor Air-Purifying Plants',
    price: 499,
    isFeatured: true,
    commonsFile: 'File:Spathiphyllum cochlearispathum RTBG.jpg',
    care: { light: 'Medium, indirect', water: 'When leaves start to droop', level: 'Easy' },
    description:
      'Elegant white blooms above deep-green, glossy leaves. The peace lily tells you when it is thirsty by drooping slightly, then perks up within hours of a drink. Flowers best in a bright room out of direct sun.'
  },
  {
    slug: 'areca-palm',
    name: 'Areca Palm',
    botanicalName: 'Dypsis lutescens',
    category: 'Indoor Air-Purifying Plants',
    price: 749,
    commonsFile: 'File:散尾葵Dypsis lutescens 20210511145013 05.jpg',
    care: { light: 'Bright, indirect', water: 'Twice a week', level: 'Moderate' },
    description:
      'Feathery, arching fronds that bring a resort feel to living rooms and lobbies. The areca palm is a natural humidifier and grows into a lush, multi-stemmed clump about 1–1.5 m tall indoors.'
  },
  {
    slug: 'spider-plant',
    name: 'Spider Plant',
    botanicalName: 'Chlorophytum comosum',
    category: 'Indoor Air-Purifying Plants',
    price: 249,
    commonsFile: 'File:Hierbabuena 0611 Revised.jpg',
    care: { light: 'Bright, indirect', water: 'Weekly', level: 'Easy' },
    description:
      'Arching, cream-striped leaves with dangling plantlets that look wonderful in hanging pots. Spider plants are pet-safe, adaptable and one of the easiest plants to propagate.'
  },
  {
    slug: 'rubber-plant',
    name: 'Rubber Plant',
    botanicalName: 'Ficus elastica',
    category: 'Indoor Air-Purifying Plants',
    price: 599,
    commonsFile: 'File:Ficus elastica leaves 02.JPG',
    care: { light: 'Bright, indirect', water: 'When top 3 cm is dry', level: 'Easy' },
    description:
      'Large, leathery leaves with a glossy finish that catch the light beautifully. The rubber plant grows into a handsome indoor tree; wipe the leaves now and then to keep them shining.'
  }
]

export const bundles = [
  {
    slug: 'clean-air-trio',
    title: 'Clean Air Trio',
    products: ['snake-plant', 'golden-pothos', 'peace-lily'],
    discountedPrice: 999,
    description:
      'Three of the hardest-working air-purifying plants, chosen to thrive in typical Indian apartments. The snake plant handles the bedroom, the pothos trails from a shelf and the peace lily brightens a living-room corner with white blooms. All three tolerate lower light and the occasional missed watering.'
  },
  {
    slug: 'kitchen-herb-garden',
    title: 'Kitchen Herb Garden',
    products: ['holy-basil-tulsi', 'sweet-basil', 'spearmint', 'rosemary'],
    discountedPrice: 649,
    description:
      'Tulsi for your chai, basil for pasta, pudina for chutney and rosemary for roasting — a complete windowsill herb garden in one box. Each herb arrives well-rooted and ready to harvest within a couple of weeks.'
  },
  {
    slug: 'desert-desk-set',
    title: 'Desert Desk Set',
    products: ['aloe-vera', 'echeveria', 'zebra-haworthia', 'pincushion-cactus'],
    discountedPrice: 699,
    description:
      'Four sculptural, low-maintenance succulents that look great together on a desk or bookshelf. They need only a bright spot and a drink every couple of weeks — ideal for busy schedules and frequent travellers.'
  },
  {
    slug: 'balcony-bloom-box',
    title: 'Balcony Bloom Box',
    products: ['african-marigold', 'petunia', 'busy-lizzie', 'zinnia'],
    discountedPrice: 449,
    description:
      'Months of colour for railings, window boxes and terrace pots. Marigolds and zinnias for the sunny side, busy lizzie for the shade and petunias to spill over the edges.'
  },
  {
    slug: 'first-plant-parent-kit',
    title: 'First Plant Parent Kit',
    products: ['golden-pothos', 'spider-plant', 'jade-plant', 'chinese-money-plant'],
    discountedPrice: 1099,
    description:
      'Four forgiving, fast-rewarding plants hand-picked for beginners. Each one tolerates mistakes, grows visibly every few weeks and is easy to propagate — so your collection grows along with your confidence.'
  },
  {
    slug: 'grow-your-own-sabzi',
    title: 'Grow-Your-Own Sabzi',
    products: ['tomato-seedlings', 'chilli-seedlings', 'brinjal-seedlings', 'spinach-seedlings'],
    discountedPrice: 399,
    description:
      'Twenty-four vegetable seedlings to start a terrace kitchen garden: tomato, chilli, brinjal and palak. Everything is ready to transplant into grow bags, with harvests beginning in six to ten weeks.'
  },
  {
    slug: 'statement-living-room',
    title: 'Statement Living Room',
    products: ['monstera-deliciosa', 'fiddle-leaf-fig', 'rubber-plant'],
    discountedPrice: 2299,
    description:
      'Three big-leafed showpieces to transform a living room. The monstera, fiddle leaf fig and rubber plant share the same bright-indirect-light needs, so they style beautifully together by a large window.'
  }
]

export const collections = [
  {
    slug: 'low-light-heroes',
    title: 'Low-Light Heroes',
    commonsFile: 'File:Orkide i finstua mot vest.jpg',
    products: ['snake-plant', 'golden-pothos', 'peace-lily', 'zebra-haworthia', 'calathea-orbifolia', 'rubber-plant'],
    description:
      'Not every home gets all-day sun. These plants are happy a few metres from a window, in north-facing rooms and in offices with tube lights — proof that a green home does not need a sunny one.'
  },
  {
    slug: 'the-edible-garden',
    title: 'The Edible Garden',
    commonsFile: 'File:Jardin potager 001.JPG',
    products: [
      'holy-basil-tulsi',
      'curry-leaf',
      'spearmint',
      'tomato-seedlings',
      'chilli-seedlings',
      'dwarf-lemon-tree',
      'strawberry'
    ],
    description:
      'From tadka to dessert, grow the flavours you cook with every day. Herbs, vegetables and fruiting plants that do well in pots on Indian terraces and balconies, picked for generous harvests in small spaces.'
  },
  {
    slug: 'succulent-and-cactus-club',
    title: 'Succulent & Cactus Club',
    commonsFile: 'File:2010 Cactualdea, La Aldea de San Nicolas, Gran Canaria, Spain (8).jpg',
    products: ['aloe-vera', 'echeveria', 'zebra-haworthia', 'jade-plant', 'pincushion-cactus'],
    description:
      'Architectural shapes, soft pastels and almost zero upkeep. Our full range of desert plants for sunny ledges and minimalist shelves — they thrive on neglect and look good doing it.'
  },
  {
    slug: 'colour-your-balcony',
    title: 'Colour Your Balcony',
    commonsFile: 'File:Flower garden, Botanic Gardens, Churchtown 2.JPG',
    products: ['african-marigold', 'petunia', 'busy-lizzie', 'zinnia', 'pomegranate'],
    description:
      'Bright, long-flowering plants to turn a plain balcony into a garden. Mix sun-lovers with shade-tolerant bloomers and you will have colour from the first cool morning until the summer heat.'
  }
]

// Replacement for the bundle/collection rows that pointed at deleted test products.
export const legacyTitles = {
  bundles: ['bundle test', 'Bundle 2', 'Bundle 3', 'Bundle 4', 'Bundle 5', 'Bundle 99', 'Bundle 7'],
  collections: ['collection test']
}

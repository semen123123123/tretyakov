const fs = require('fs');

// ============================================================
// NEW 18 STONES — matching the photos in /public/stones/
// ============================================================
const newStones = [
  {
    id: '1',
    name_ru: 'Гематит',
    name_en: 'Hematite',
    description: 'Камень воинов и победителей. Гематит даёт владельцу несокрушимую силу духа, защищает в бою и помогает достигать целей.',
    history_facts: 'Гематит использовался ещё в Древнем Египте — жрецы носили перстни из гематита во время ритуалов. Название происходит от греческого «гема» — кровь.',
    additional_fact: 'В средневековье гематит считался мощным оберегом для воинов — его вставляли в доспехи и оружие.',
    color: 'Чёрный с металлическим блеском',
    price_per_unit: 250,
    sort_order: 1,
  },
  {
    id: '2',
    name_ru: 'Аметист',
    name_en: 'Amethyst',
    description: 'Королевский камень. Его фиолетовый оттенок — цвет высшей аристократии духа. Успокаивает ум, даёт ясность мысли и внутреннюю гармонию.',
    history_facts: 'Аметист украшает Британскую корону. В Древней Греции считался камнем от опьянения (греч. «метис» — опьянение).',
    additional_fact: 'В Китае из аметиста вырезали шкатулки и вазы. Считается камнем февраля.',
    color: 'Фиолетовый',
    price_per_unit: 300,
    sort_order: 2,
  },
  {
    id: '3',
    name_ru: 'Лазурит',
    name_en: 'Lapis Lazuli',
    description: 'Камень неба и мудрости. Его глубокий синий цвет символизирует бесконечность познания. Усиливает ясность мышления.',
    history_facts: 'Лазурит был найден в гробнице Тутанхамона — маска фараона инкрустирована этим камнем. В Древнем Египте ценился дороже золота.',
    additional_fact: 'В эпоху Возрождения лазурит растирали в порошок для создания ультрамариновой краски.',
    color: 'Глубокий синий с золотыми вкраплениями',
    price_per_unit: 350,
    sort_order: 3,
  },
  {
    id: '4',
    name_ru: 'Сердолик',
    name_en: 'Carnelian',
    description: 'Солнечный камень творцов. Его энергия стимулирует новые идеи, придаёт смелость в начинаниях. Считается камнем ораторов и лидеров.',
    history_facts: 'Перстень с сердоликом носил А.С. Пушкин — поэт считал его своим талисманом. В Древней Греции сердолик использовали для печатей.',
    additional_fact: 'В исламе сердолик считается священным камнем — пророк Мухаммед носил перстень с сердоликом.',
    color: 'Оранжево-красный',
    price_per_unit: 250,
    sort_order: 4,
  },
  {
    id: '5',
    name_ru: 'Цитрин',
    name_en: 'Citrine',
    description: 'Камень солнца и успеха. Его золотистый оттенок притягивает удачу и материальное благополучие. Лучший камень для бизнеса.',
    history_facts: 'В Древнем Риме цитрин называли «золотым камнем» — сенаторы носили перстни с цитрином как символ статуса.',
    additional_fact: 'В эпоху Возрождения цитрин дарили путешественникам как оберег в дорогу.',
    color: 'Золотисто-жёлтый',
    price_per_unit: 280,
    sort_order: 5,
  },
  {
    id: '6',
    name_ru: 'Амазонит',
    name_en: 'Amazonite',
    description: 'Камень гармонии и равновесия. Его нежный бирюзовый оттенок успокаивает нервную систему и помогает находить общий язык с людьми.',
    history_facts: 'Назван в честь реки Амазонки, хотя месторождения есть и в других регионах. Древние египтяне использовали амазонит для украшений и талисманов.',
    additional_fact: 'Считается камнем семейного благополучия — помогает укрепить отношения и привнести в дом гармонию.',
    color: 'Бирюзово-зелёный',
    price_per_unit: 270,
    sort_order: 6,
  },
  {
    id: '7',
    name_ru: 'Гранат',
    name_en: 'Garnet',
    description: 'Камень власти и амбиций. Его глубокий тёмно-красный цвет символизирует страсть к победе. Укрепляет силу воли.',
    history_facts: 'Гранаты украшали короны европейской аристократии. В средневековье считался камнем воинов.',
    additional_fact: 'Чехия до сих пор славится своими гранатами. Камень января.',
    color: 'Тёмно-красный',
    price_per_unit: 320,
    sort_order: 7,
  },
  {
    id: '8',
    name_ru: 'Апатит',
    name_en: 'Apatite',
    description: 'Камень вдохновения и самовыражения. Его яркие голубые и зелёные оттенки стимулируют творческую энергию и помогают найти своё призвание.',
    history_facts: 'Название происходит от греческого «апатао» — обманываю, потому что апатит часто путали с более дорогими камнями.',
    additional_fact: 'Апатит — основной источник фосфора в природе, необходимого для жизни растений и животных.',
    color: 'Голубовато-зелёный',
    price_per_unit: 230,
    sort_order: 8,
  },
  {
    id: '9',
    name_ru: 'Бычий глаз',
    name_en: 'Bull\'s Eye',
    description: 'Камень-оберег с глубокими красновато-коричневыми переливами. Защищает от негативной энергии и придаёт уверенность в сложных ситуациях.',
    history_facts: 'Бычий глаз — разновидность кварца, родственная тигровому глазу. Использовался воинами как талисман для защиты в бою.',
    additional_fact: 'Обработка кабошоном создаёт эффект «кошачьего глаза» — скользящую полосу света на поверхности камня.',
    color: 'Красновато-коричневый с переливами',
    price_per_unit: 260,
    sort_order: 9,
  },
  {
    id: '10',
    name_ru: 'Гелиотроп',
    name_en: 'Heliotrope',
    description: 'Камень жертвенности и духовной силы. Тёмно-зелёный с красными вкраплениями — напоминание о стойкости и верности принципам.',
    history_facts: 'В христианстве гелиотроп известен как «кровавый камень» — красные пятна символизировали кровь Христа. В средневековье использовался в церковных украшениях.',
    additional_fact: 'Считалось, что гелиотроп может останавливать кровотечения и защищать от отравлений.',
    color: 'Тёмно-зелёный с красными вкраплениями',
    price_per_unit: 240,
    sort_order: 10,
  },
  {
    id: '11',
    name_ru: 'Малахит',
    name_en: 'Malachite',
    description: 'Камень преображения. Зелёные узоры малахита напоминают лесные тропы — он помогает увидеть красоту в переменах и найти новые пути.',
    history_facts: 'Малахит высоко ценился на Руси — из него делали шкатулки, вазы и облицовку залов. Малахитовый зал Эрмитажа — одно из самых известных применений камня.',
    additional_fact: 'В Древнем Египте из малахита делали косметику для глаз — считалось, что это защищает от сглаза.',
    color: 'Зелёный с узорами',
    price_per_unit: 300,
    sort_order: 11,
  },
  {
    id: '12',
    name_ru: 'Мукаит',
    name_en: 'Mookaite',
    description: 'Камень путешественников. Его тёплые охристые, бордовые и кремовые оттенки напоминают земли Австралии — дарит энергию и тягу к приключениям.',
    history_facts: 'Мукаит добывается исключительно в Западной Австралии, в районе ручья Мука. Для аборигенов это священный камень — «кровь земли».',
    additional_fact: 'Относительно молодой ювелирный камень — начал активно использоваться только с 1960-х годов.',
    color: 'Пёстрый (бордовый, кремовый, жёлтый)',
    price_per_unit: 280,
    sort_order: 12,
  },
  {
    id: '13',
    name_ru: 'Родонит',
    name_en: 'Rhodonite',
    description: 'Камень доброты и сострадания. Его розовые и малиновые тона с чёрными прожилками открывают сердце для любви и прощения.',
    history_facts: 'Родонит называют «орлецом» на Руси — его использовали для изготовления шкатулок и пасхальных яиц. Был любимым камнем Фаберже.',
    additional_fact: 'Считается камнем России — крупнейшие месторождения находятся на Урале.',
    color: 'Розовый с чёрными прожилками',
    price_per_unit: 250,
    sort_order: 13,
  },
  {
    id: '14',
    name_ru: 'Турмалиновый кварц',
    name_en: 'Tourmalinated Quartz',
    description: 'Камень контрастов. Прозрачный кварц с чёрными иглами турмалина символизирует единство противоположностей — свет и тьму, инь и ян.',
    history_facts: 'В Древнем Риме из турмалина делали печати и камеи. Плиний Старший описывал его как «камень удивительных цветов».',
    additional_fact: 'Турмалин — единственный минерал, электризующийся при нагревании (пироэлектрик).',
    color: 'Прозрачный с чёрными иглами',
    price_per_unit: 290,
    sort_order: 14,
  },
  {
    id: '15',
    name_ru: 'Унакит',
    name_en: 'Unakite',
    description: 'Камень терпения и мудрости. Нежные розово-зелёные оттенки успокаивают ум и помогают видеть красоту в простых вещах.',
    history_facts: 'Назван по горе Юнака в Северной Каролине (США), где был впервые обнаружен. Используется в литотерапии для гармонизации эмоций.',
    additional_fact: 'Унакит — это не отдельный минерал, а разновидность гранитной породы с включениями эпидота и полевого шпата.',
    color: 'Розовато-зелёный',
    price_per_unit: 230,
    sort_order: 15,
  },
  {
    id: '16',
    name_ru: 'Флюорит',
    name_en: 'Fluorite',
    description: 'Камень ясности ума. Фиолетовые, синие и зелёные переливы флюорита структурируют мысли и помогают принимать взвешенные решения.',
    history_facts: 'Название происходит от латинского «fluere» — течь. Флюорит использовался в металлургии как плавень. Древние римляне ценили его за красоту.',
    additional_fact: 'Флюорит светится в ультрафиолете — это явление назвали флуоресценцией именно благодаря этому камню.',
    color: 'Фиолетово-зелёный',
    price_per_unit: 260,
    sort_order: 16,
  },
  {
    id: '17',
    name_ru: 'Циозит',
    name_en: 'Zoisite',
    description: 'Камень глубоких перемен. Его насыщенный зелёный цвет символизирует рост и обновление. Помогает отпускать прошлое и двигаться вперёд.',
    history_facts: 'Назван в честь австрийского учёного Зигмунда Цойса. Самая известная разновидность — танзанит, открытый в Танзании в 1967 году.',
    additional_fact: 'Танзанит — одна из самых редких и дорогих разновидностей циозита, ценится выше сапфира.',
    color: 'Зелёный',
    price_per_unit: 270,
    sort_order: 17,
  },
  {
    id: '18',
    name_ru: 'Черный агат',
    name_en: 'Black Agate',
    description: 'Камень равновесия и внутренней гармонии. Глубокий чёрный цвет впитывает негатив и защищает владельца от энергетических атак.',
    history_facts: 'Агат получил название от реки Ахатес на Сицилии, где его добывали ещё в античности. Чёрный агат особенно ценился в Древнем Риме как оберег.',
    additional_fact: 'Агат — один из самых древних поделочных камней, известный человечеству более 6000 лет.',
    color: 'Чёрный',
    price_per_unit: 240,
    sort_order: 18,
  },
];

// ============================================================
// Build HAS_REAL_IMAGE and stones-data.ts
// ============================================================
const stonesDir = 'C:/Users/stara/Desktop/project_tretyakov/public/stones';

function buildStonesData() {
  // HAS_REAL_IMAGE: all 18 stones have real photos
  const hasRealImage = {};
  newStones.forEach(s => {
    const filename = s.name_ru + '.png';
    hasRealImage[s.name_ru] = '/stones/' + filename;
  });

  return { hasRealImage, newStones };
}

const { hasRealImage } = buildStonesData();
console.log('HAS_REAL_IMAGE entries:', Object.keys(hasRealImage).length);

// ============================================================
// Update admin-data.json — full replace
// ============================================================
const adminPath = 'C:/Users/stara/Desktop/project_tretyakov/data/admin-data.json';
const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

adminData.stones = newStones.map(s => ({
  ...s,
  image_url: '/stones/' + s.name_ru + '.png',
  history_image: s.name_ru === 'Лазурит' ? '/history/lapis-lazuli-history.jpg' : null,
  _edited: true,
}));

fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));
console.log('admin-data.json updated with ' + adminData.stones.length + ' stones');

// ============================================================
// Generate stones-data.ts content
// ============================================================
// Map colors to hex for getImageUrl
const colorToHex = {
  'Чёрный с металлическим блеском': '#2D2D2D',
  'Фиолетовый': '#7B5EA7',
  'Глубокий синий с золотыми вкраплениями': '#1E3A5F',
  'Оранжево-красный': '#D4603A',
  'Золотисто-жёлтый': '#E8B830',
  'Бирюзово-зелёный': '#6ECDB5',
  'Тёмно-красный': '#8B1A1A',
  'Голубовато-зелёный': '#5B9EB5',
  'Красновато-коричневый с переливами': '#B86A38',
  'Тёмно-зелёный с красными вкраплениями': '#2D5A2D',
  'Зелёный с узорами': '#2D8A4A',
  'Пёстрый (бордовый, кремовый, жёлтый)': '#C87050',
  'Розовый с чёрными прожилками': '#D47090',
  'Прозрачный с чёрными иглами': '#D0D0D0',
  'Розовато-зелёный': '#C0B0A0',
  'Фиолетово-зелёный': '#7B8A9E',
  'Зелёный': '#3D8A5A',
  'Чёрный': '#1A1A1A',
};

// Map crystal types
const lastCharCrystal = (() => {
  const map = {};
  newStones.forEach((s, i) => {
    const c = s.color;
    if (c.includes('Чёрный') && !c.includes('Черный')) map[s.name_ru] = 'glassy';
    else if (i <= 5 || s.name_ru === 'Лазурит') map[s.name_ru] = 'rough';
    else if (s.name_ru === 'Малахит') map[s.name_ru] = 'banded';
    else map[s.name_ru] = 'smooth';
  });
  return map;
})();

// Now generate the TypeScript file
// Read existing file to preserve SVG generation functions
const existingSrc = fs.readFileSync('C:/Users/stara/Desktop/project_tretyakov/src/lib/stones-data.ts', 'utf8');

// Extract the SVG generation part (before the stones array)
const parts = existingSrc.split('export const stones: Stone[] = [');
const headerParts = parts[0].split('const HAS_REAL_IMAGE: Record<string, string> = {');
const beforeHash = headerParts[0];
const svgAndHelperCode = parts[0].substring(parts[0].indexOf('function getImageUrl'));
// Better approach: just get everything before 'export const stones'
const beforeStones = existingSrc.substring(0, existingSrc.indexOf('export const stones:'));

// Rebuild the file
const hasRealStr = Object.entries(hasRealImage)
  .map(([k, v]) => `  '${k}': '${v}'`)
  .join(',\n');

// Build the stone entries for TS
const stoneEntries = newStones.map(s => {
  const hex = colorToHex[s.color] || '#888888';
  const crystal = lastCharCrystal[s.name_ru] || 'smooth';
  return `  {
    id: '${s.id}',
    name_ru: '${s.name_ru}',
    name_en: '${s.name_en.replace(/'/g, "\\'")}',
    description: '${s.description}',
    history_facts: '${s.history_facts}',
    additional_fact: '${s.additional_fact}',
    color: '${s.color}',
    image_url: getImageUrl('${s.name_ru}', '${hex}', '${crystal}'),
    price_per_unit: ${s.price_per_unit},
    history_image: ${s.name_ru === 'Лазурит' ? "'/history/lapis-lazuli-history.jpg'" : 'null'},
    sort_order: ${s.sort_order},
  }`;
}).join(',\n');

const newTsContent = `${beforeStones}const HAS_REAL_IMAGE: Record<string, string> = {
${hasRealStr}
};

export const stones: Stone[] = [
${stoneEntries}
];
`;

// Write stones-data.ts
fs.writeFileSync('C:/Users/stara/Desktop/project_tretyakov/src/lib/stones-data.ts', newTsContent);
console.log('stones-data.ts updated');

// ============================================================
// Update stone-product-links.ts
// ============================================================
// Remap with new stone names
const stoneToProduct = {
  'Гематит': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
  'Аметист': ['5', '10', '13', '18'],
  'Лазурит': ['3'],
  'Сердолик': ['2'],
  'Цитрин': ['6', '17'],
  'Гранат': ['5'],
  'Амазонит': ['9'],
  'Флюорит': ['12'],
  'Малахит': [],
  'Апатит': [],
  'Бычий глаз': [],
  'Гелиотроп': [],
  'Мукаит': [],
  'Родонит': [],
  'Турмалиновый кварц': [],
  'Унакит': [],
  'Циозит': [],
  'Черный агат': ['1', '14'],
  'Чёрный агат': ['1', '14'],
};

const linkContent = `// Maps stone names (name_ru) to product IDs that contain that stone
// Used in the stone modal to show "View bracelet with this stone" links

const stoneToProductMap: Record<string, string[]> = ${JSON.stringify(stoneToProduct, null, 2)};

export function getProductIdsForStone(stoneName: string): string[] {
  return stoneToProductMap[stoneName] || [];
}
`;

fs.writeFileSync('C:/Users/stara/Desktop/project_tretyakov/src/lib/stone-product-links.ts', linkContent);
console.log('stone-product-links.ts updated');

console.log('\nDONE! All 18 stones replaced successfully.');

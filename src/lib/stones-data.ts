import { Stone } from './types';
// ============================================================
// ENHANCED SVG GENERATION for stones without real photos
// Creates realistic gemstone cabochon images with crystal facets
// ============================================================
function gemstoneSvg(
  baseColor: string,
  highlightColor: string,
  shadowColor: string,
  facetColors: string[],
  crystal: 'smooth' | 'rough' | 'banded' | 'glassy'
): string {
  const cx = 200;
  const cy = 200;
  const r = 180;
  // Build facet polygons
  let facets = '';
  if (crystal === 'rough') {
    // Rough crystalline facets
    const pts = [
      '100,30 160,50 180,120 140,180 80,170 40,120 50,60',
      '180,50 220,30 280,60 290,130 240,180 190,140',
      '280,80 320,100 340,170 300,220 250,200 270,130',
      '140,190 200,160 260,200 280,270 230,320 160,300 110,260',
      '50,140 100,130 140,200 130,280 80,290 30,240',
      '80,300 150,280 200,320 230,370 170,380 100,360 60,340',
      '200,330 260,300 310,330 330,380 280,390 220,370',
      '40,260 60,310 70,360 30,350 20,300',
    ];
    pts.forEach((p, i) => {
      const fc = facetColors[i % facetColors.length];
      facets += `<polygon points="${p}" fill="${fc}" stroke="${shadowColor}" stroke-width="1" opacity="0.9"/>`;
    });
  } else if (crystal === 'banded') {
    // Concentric banded pattern (agate, malachite)
    for (let i = 0; i < 12; i++) {
      const ri = r - i * 14;
      if (ri < 10) break;
      const fc = facetColors[i % facetColors.length];
      facets += `<circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="${fc}" stroke-width="${8 - i * 0.5}" opacity="${0.4 + i * 0.05}"/>`;
      // Wavy distortions
      const wav = 10 + i * 3;
      facets += `<path d="M${cx - ri},${cy} Q${cx - ri + wav},${cy - wav} ${cx},${cy - ri} Q${cx + wav},${cy - ri + wav} ${cx + ri},${cy} Q${cx + wav},${cy + wav} ${cx},${cy + ri} Q${cx - ri + wav},${cy + wav} ${cx - ri},${cy}" fill="none" stroke="${fc}" stroke-width="${3 - i * 0.2}" opacity="${0.3}"/>`;
    }
  } else if (crystal === 'glassy') {
    // Glassy/vitreous facets (obsidian, rock crystal)
    const pts = [
      '60,40 160,20 220,50 180,100 100,90 50,70',
      '220,60 300,50 340,110 300,160 230,130 250,80',
      '100,100 180,80 240,120 220,190 160,180 80,150',
      '240,140 310,140 350,200 320,260 260,220 270,160',
      '160,190 220,170 270,210 280,270 230,300 170,280 130,240',
      '50,160 110,150 140,210 130,270 70,250 30,200',
      '60,260 120,240 160,280 170,340 120,360 60,330',
      '180,290 240,260 290,290 310,350 250,370 190,340',
    ];
    pts.forEach((p, i) => {
      const fc = facetColors[i % facetColors.length];
      facets += `<polygon points="${p}" fill="${fc}" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" opacity="0.85"/>`;
    });
  } else {
    // Smooth cabochon (default)
    for (let i = 0; i < 8; i++) {
      const a1 = (i / 8) * Math.PI * 2;
      const a2 = ((i + 1) / 8) * Math.PI * 2;
      const innerR = r * 0.55;
      const mp = `${cx + innerR * Math.sin(a1 + Math.PI / 8)},${cy - innerR * Math.cos(a1 + Math.PI / 8)}`;
      const p1 = `${cx + r * Math.sin(a1)},${cy - r * Math.cos(a1)}`;
      const p2 = `${cx + r * Math.sin(a2)},${cy - r * Math.cos(a2)}`;
      const fc = facetColors[i % facetColors.length];
      facets += `<path d="M${mp} L${p1} A${r},${r} 0 0 1 ${p2} Z" fill="${fc}" stroke="${shadowColor}" stroke-width="1" opacity="0.85"/>`;
    }
  }
  // Background shadow
  const bgShadow = `<ellipse cx="${cx}" cy="${cy + r + 10}" rx="${r - 20}" ry="${r * 0.12}" fill="rgba(0,0,0,0.15)"/>`;
  // Main body
  const body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${baseColor}" stroke="${shadowColor}" stroke-width="2"/>`;
  // Highlight reflection
  const highlight = `<ellipse cx="${cx - r * 0.25}" cy="${cy - r * 0.28}" rx="${r * 0.4}" ry="${r * 0.25}" fill="${highlightColor}" opacity="0.35" transform="rotate(-20 ${cx - r * 0.25} ${cy - r * 0.28})"/>`;
  const highlight2 = `<ellipse cx="${cx - r * 0.4}" cy="${cy - r * 0.45}" rx="${r * 0.15}" ry="${r * 0.1}" fill="${highlightColor}" opacity="0.5" transform="rotate(-25 ${cx - r * 0.4} ${cy - r * 0.45})"/>`;
  // Bottom rim light
  const rimLight = `<path d="M${cx - r * 0.6},${cy + r * 0.6} A${r * 0.7},${r * 0.3} 0 0 0 ${cx + r * 0.6},${cy + r * 0.6}" fill="none" stroke="${highlightColor}" stroke-width="3" opacity="0.2"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <clipPath id="c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <radialGradient id="bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${baseColor}"/>
        <stop offset="70%" stop-color="${darkenHex(baseColor, 20)}"/>
        <stop offset="100%" stop-color="${darkenHex(baseColor, 40)}"/>
      </radialGradient>
    </defs>
    ${bgShadow}
    ${body}
    <g clip-path="url(#c)">
      ${facets}
    </g>
    ${highlight}
    ${highlight2}
    ${rimLight}
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}
function darkenHex(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - pct / 100;
  return rgbToHex(r * f, g * f, b * f);
}
// ============================================================
// Stone definitions with computed image URLs
// ============================================================
// Real stone photos in public/stones/ — English transliterated filenames
function getImageUrl(name: string, color: string, crystal: 'smooth' | 'rough' | 'banded' | 'glassy'): string {
  // Use real photo if available in public/stones/
  const realPhoto = HAS_REAL_IMAGE[name];
  if (realPhoto) return realPhoto;
  // Otherwise generate gemstone SVG
  const [r, g, b] = hexToRgb(color);
  const highlight = rgbToHex(Math.min(255, r + 80), Math.min(255, g + 80), Math.min(255, b + 80));
  const shadow = darkenHex(color, 40);
  const mid = rgbToHex(Math.min(255, r + 40), Math.min(255, g + 40), Math.min(255, b + 40));
  const dark1 = darkenHex(color, 15);
  const dark2 = darkenHex(color, 30);
  const bright = rgbToHex(Math.min(255, r + 100), Math.min(255, g + 100), Math.min(255, b + 100));
  return gemstoneSvg(color, highlight, shadow, [color, dark1, mid, dark2, bright, color, dark1, mid], crystal);
}

// Real stone photos in public/stones/ — matched by name_ru (English filenames)
const HAS_REAL_IMAGE: Record<string, string> = {
  'Гематит': '/stones/Gematit.png',
  'Аметист': '/stones/Ametist.png',
  'Лазурит': '/stones/Lazurit.png',
  'Сердолик': '/stones/Serdolik.png',
  'Цитрин': '/stones/Citrin.png',
  'Амазонит': '/stones/Amazonit.png',
  'Гранат': '/stones/Granat.png',
  'Апатит': '/stones/Apatit.png',
  'Бычий глаз': '/stones/Bichi glaz.png',
  'Гелиотроп': '/stones/Geliotrop.png',
  'Малахит': '/stones/Malahit.png',
  'Мукаит': '/stones/Mukait.png',
  'Родонит': '/stones/Rodonit.png',
  'Турмалиновый кварц': '/stones/Turmalinovy kvarz.png',
  'Унакит': '/stones/Unakit.png',
  'Флюорит': '/stones/Fluorit.png',
  'Циозит': '/stones/Cziozit.png',
  'Черный агат': '/stones/Cherny agat.png',
};

export const stones: Stone[] = [
  {
    id: '1',
    name_ru: 'Гематит',
    name_en: 'Hematite',
    description: 'Камень воинов и победителей. Гематит даёт владельцу несокрушимую силу духа, защищает в бою и помогает достигать целей.',
    history_facts: 'Гематит использовался ещё в Древнем Египте — жрецы носили перстни из гематита во время ритуалов. Название происходит от греческого «гема» — кровь.',
    additional_fact: 'В средневековье гематит считался мощным оберегом для воинов — его вставляли в доспехи и оружие.',
    color: 'Чёрный с металлическим блеском',
    image_url: getImageUrl('Гематит', '#2D2D2D', 'glassy'),
    price_per_unit: 250,
    history_image: null,
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
    image_url: getImageUrl('Аметист', '#7B5EA7', 'rough'),
    price_per_unit: 300,
    history_image: null,
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
    image_url: getImageUrl('Лазурит', '#1E3A5F', 'rough'),
    price_per_unit: 350,
    history_image: '/history/lapis-lazuli-history.jpg',
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
    image_url: getImageUrl('Сердолик', '#D4603A', 'rough'),
    price_per_unit: 250,
    history_image: null,
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
    image_url: getImageUrl('Цитрин', '#E8B830', 'rough'),
    price_per_unit: 280,
    history_image: null,
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
    image_url: getImageUrl('Амазонит', '#6ECDB5', 'rough'),
    price_per_unit: 270,
    history_image: null,
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
    image_url: getImageUrl('Гранат', '#8B1A1A', 'smooth'),
    price_per_unit: 320,
    history_image: null,
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
    image_url: getImageUrl('Апатит', '#5B9EB5', 'smooth'),
    price_per_unit: 230,
    history_image: null,
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
    image_url: getImageUrl('Бычий глаз', '#B86A38', 'smooth'),
    price_per_unit: 260,
    history_image: null,
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
    image_url: getImageUrl('Гелиотроп', '#2D5A2D', 'smooth'),
    price_per_unit: 240,
    history_image: null,
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
    image_url: getImageUrl('Малахит', '#2D8A4A', 'banded'),
    price_per_unit: 300,
    history_image: null,
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
    image_url: getImageUrl('Мукаит', '#C87050', 'smooth'),
    price_per_unit: 280,
    history_image: null,
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
    image_url: getImageUrl('Родонит', '#D47090', 'smooth'),
    price_per_unit: 250,
    history_image: null,
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
    image_url: getImageUrl('Турмалиновый кварц', '#D0D0D0', 'smooth'),
    price_per_unit: 290,
    history_image: null,
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
    image_url: getImageUrl('Унакит', '#C0B0A0', 'smooth'),
    price_per_unit: 230,
    history_image: null,
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
    image_url: getImageUrl('Флюорит', '#7B8A9E', 'smooth'),
    price_per_unit: 260,
    history_image: null,
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
    image_url: getImageUrl('Циозит', '#3D8A5A', 'smooth'),
    price_per_unit: 270,
    history_image: null,
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
    image_url: getImageUrl('Черный агат', '#1A1A1A', 'glassy'),
    price_per_unit: 240,
    history_image: null,
    sort_order: 18,
  }
];

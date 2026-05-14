// Maps stone names (name_ru) to product slugs that contain that stone
// Used in the stone modal to show "View bracelet with this stone" links

const stoneToProductMap: Record<string, string[]> = {
  "Гематит": [
    "absolyut", "avangard", "azimut", "barbados", "granat", "zheltyj-almaz",
    "zelenyj-sapfir", "imperator", "kapri", "korall", "malta", "neapol",
    "nefrit", "oniks", "safari", "tajfun", "topaz", "yantar"
  ],
  "Аметист": [
    "granat", "kapri", "nefrit", "yantar"
  ],
  "Лазурит": [
    "azimut"
  ],
  "Сердолик": [
    "avangard"
  ],
  "Цитрин": [
    "zheltyj-almaz", "topaz"
  ],
  "Гранат": [
    "granat"
  ],
  "Амазонит": [
    "imperator"
  ],
  "Флюорит": [
    "neapol"
  ],
  "Малахит": [],
  "Апатит": [],
  "Бычий глаз": [],
  "Гелиотроп": [],
  "Мукаит": [],
  "Родонит": [],
  "Турмалиновый кварц": [],
  "Унакит": [],
  "Циозит": [],
  "Черный агат": [
    "absolyut", "oniks"
  ],
  "Чёрный агат": [
    "absolyut", "oniks"
  ]
};

export function getProductSlugsForStone(stoneName: string): string[] {
  return stoneToProductMap[stoneName] || [];
}

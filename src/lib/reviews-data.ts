import { Review } from './types';

const AVITO_REVIEWS_URL = 'https://www.avito.ru/brands/73ec706323e74f732822382049cd02e0/reviews?sellerId=0b0c8ecd0e1307d79be53fc305f2abb0';

export const reviews: Review[] = [
  {
    id: '1',
    author_name: 'О ле сад',
    author_avatar: null,
    rating: 5,
    text: 'Довольна браслетом 🥰 Собран под мой размер, красиво упакован (можно заказывать на подарок), быстро отправлен. Прошёл тестовый период носки — никаких проблем. Однозначно мой рекомендасьон 👌',
    source: 'Avito',
    avito_url: AVITO_REVIEWS_URL,
    is_approved: true,
    created_at: '2026-05-13',
  },
  {
    id: '2',
    author_name: 'Александр',
    author_avatar: null,
    rating: 5,
    text: 'Бережная и качественная упаковка, браслет очень понравился, на руке сидит идеально удобно. Благодарю за труд! Рекомендую! Желаю вам Благополучия!!',
    source: 'Avito',
    avito_url: AVITO_REVIEWS_URL,
    is_approved: true,
    created_at: '2026-05-08',
  },
  {
    id: '3',
    author_name: 'Светлана',
    author_avatar: null,
    rating: 5,
    text: 'Очень красивый браслет, закажу ещё из других камней, продавец выше всех похвал, рекомендую!',
    source: 'Avito',
    avito_url: AVITO_REVIEWS_URL,
    is_approved: true,
    created_at: '2026-05-01',
  },
  {
    id: '4',
    author_name: 'Vita',
    author_avatar: null,
    rating: 5,
    text: 'Спасибо огромное) очень оперативно всё сделали, привезли и ещё красиво упакован 🥰 Ребята желаю дальнейшего расширения и магазина в Москве)',
    source: 'Avito',
    avito_url: AVITO_REVIEWS_URL,
    is_approved: true,
    created_at: '2026-04-28',
  },
];

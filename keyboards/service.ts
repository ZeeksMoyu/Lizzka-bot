import { Keyboard } from 'grammy';

export function getLangKeyboard() {
    return new Keyboard()
        .text('🇵🇱 Polski')
        .text('🇺🇦 Українська')
        .resized();
}

export function getServiceKeyboard(lang: 'pl' | 'ua') {
    // Без кнопки главного меню
    return new Keyboard()
        .text(lang === 'pl' ? '🖤 Tattoo' : '🖤 Тату')
        .text(lang === 'pl' ? '💅 Manicure' : '💅 Манікюр')
        .resized();
}
function getLangKeyboard() {
    return {
        keyboard: [
            [{ text: '🇵🇱 Polski' }, { text: '🇺🇦 Українська' }]
        ],
        resize_keyboard: true
    };
}

function getServiceKeyboard(lang) {
    const buttons = lang === 'pl'
        ? [{ text: '🖤 Tattoo' }, { text: '💅 Manicure' }]
        : [{ text: '🖤 Тату' }, { text: '💅 Манікюр' }];

    return {
        keyboard: [buttons],
        resize_keyboard: true
    };
}

module.exports = { getLangKeyboard, getServiceKeyboard };
function getAdminKeyboard() {
    return {
        keyboard: [
            [{ text: 'Последние записи' }, { text: 'Сегодняшние записи' }],
            [{ text: 'Все записи' }, { text: 'Маникюр записи' }],
            [{ text: 'Тату записи' }, { text: 'Назад' }],
        ],
        resize_keyboard: true
    };
}

module.exports = { getAdminKeyboard, getMainMenu: require('./main').getMainMenu };
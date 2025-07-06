const { getServiceKeyboard } = require('./service');

function getMainMenu(lang = 'pl', service = 'tattoo', includeBackToMain = true) {
    const galleryUrl = "https://telegra.ph/Galereya-shole-07-02";
    const backToMainButton = lang === 'pl'
        ? { text: '🔙 Główne menu' }
        : { text: '🔙 Головне меню' };

    const baseMenu = {
        tattoo: {
            pl: {
                keyboard: [
                    [
                        { text: 'Gotowe prace', web_app: { url: galleryUrl } },
                        { text: 'Szkice' }
                    ],
                    [
                        { text: 'Umów wizytę' },
                        { text: 'Godziny' }
                    ]
                ],
                resize_keyboard: true
            },
            ua: {
                keyboard: [
                    [
                        { text: 'Готові роботи', web_app: { url: galleryUrl } },
                        { text: 'Ескізи' }
                    ],
                    [
                        { text: 'Записатися' },
                        { text: 'Графік' }
                    ]
                ],
                resize_keyboard: true
            }
        },
        manicure: {
            pl: {
                keyboard: [
                    [
                        { text: 'Gotowe prace', web_app: { url: galleryUrl } },
                        { text: 'Szkice' }
                    ],
                    [
                        { text: 'Umów wizytę' },
                        { text: 'Godziny' }
                    ]
                ],
                resize_keyboard: true
            },
            ua: {
                keyboard: [
                    [
                        { text: 'Готові роботи', web_app: { url: galleryUrl } },
                        { text: 'Ескізи' }
                    ],
                    [
                        { text: 'Записатися' },
                        { text: 'Графік' }
                    ]
                ],
                resize_keyboard: true
            }
        }
    };

    const menu = baseMenu[service][lang];

    if (includeBackToMain) {
        menu.keyboard.push([backToMainButton]);
    }

    return menu;
}

module.exports = { getMainMenu };
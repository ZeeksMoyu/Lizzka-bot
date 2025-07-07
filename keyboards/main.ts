import { Keyboard } from 'grammy';

export function getMainMenu(
    lang: 'pl' | 'ua',
    service: 'tattoo' | 'manicure',
    showMainMenuBtn: boolean = true  // Новый параметр с значением по умолчанию
) {
    const galleryUrl = "https://telegra.ph/Galereya-shole-07-02";

    const texts = {
        tattoo: {
            pl: {
                gallery: 'Gotowe prace',
                appointment: 'Umów wizytę',
                mainMenu: '🔙 Główne menu'
            },
            ua: {
                gallery: 'Галерея',
                appointment: 'Записатися',
                mainMenu: '🔙 Головне меню'
            }
        },
        manicure: {
            pl: {
                gallery: 'Gotowe prace',
                appointment: 'Umów wizytę',
                mainMenu: '🔙 Główne menu'
            },
            ua: {
                gallery: 'Галерея',
                appointment: 'Записатися',
                mainMenu: '🔙 Головне меню'
            }
        }
    };

    const t = texts[service][lang];
    const keyboard = new Keyboard()
        .webApp(t.gallery, galleryUrl)
        .row()
        .text(t.appointment);

    if (showMainMenuBtn) {
        keyboard.row().text(t.mainMenu);
    }

    return keyboard.resized();
}
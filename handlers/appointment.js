const { Client } = require('../models');
const { getMainMenu } = require('../keyboards/main');

async function setup(bot) {
    // Обработчик галереи
    bot.hears(['Галерея', 'Galeria'], async (ctx) => {
        console.log(`[GALLERY] Пользователь ${ctx.from.id} запросил галерею`);

        const lang = ctx.session.lang || 'pl';
        const galleryUrl = "https://telegra.ph/Galereya-shole-07-02";

        try {
            await ctx.reply(
                lang === 'ua'
                    ? "🔗 Перехід до галереї..."
                    : "🔗 Przekierowanie do galerii...",
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: lang === 'ua' ? "👉 Перейти" : "👉 Przejdź",
                                url: galleryUrl
                            }]
                        ]
                    }
                }
            );
        } catch (e) {
            console.error('[GALLERY] Ошибка:', e);
            ctx.reply(lang === 'ua' ? '⚠️ Помилка відкриття галереї' : '⚠️ Błąd otwierania galerii');
        }
    });

    bot.hears(['Umów wizytę', 'Записатися'], async (ctx) => {
        console.log(`[APPOINT] Начало записи от ${ctx.from.id}`);

        try {
            const lang = ctx.session.lang || 'pl';
            await ctx.reply(
                lang === 'ua'
                    ? "Введіть ім'я та телефон (напр: Іван +380123456789):"
                    : "Podaj imię i telefon (np: Jan +48123456789):"
            );
            ctx.session.waitingForContact = true;
        } catch (e) {
            console.error('[APPOINT] Ошибка:', e);
            ctx.reply('⚠️ Ошибка начала записи');
        }
    });

    // Обработчик контактных данных
    bot.on('message:text', async (ctx) => {
        if (!ctx.session.waitingForContact) return;

        console.log(`[APPOINT] Данные записи от ${ctx.from.id}`);

        try {
            const lang = ctx.session.lang || 'pl';
            const text = ctx.message.text;
            const contactRegex = /^[A-Za-zА-Яа-яіїєґ\s]+\+\d+$/;

            if (!contactRegex.test(text)) {
                const errorMsg = lang === 'ua'
                    ? "Невірний формат. Приклад: Іван +380123456789"
                    : "Nieprawidłowy format. Przykład: Jan +48123456789";
                return ctx.reply(errorMsg);
            }

            const [name, phone] = text.split('+');
            const formattedPhone = `+${phone.trim()}`;

            await Client.create({
                name: name.trim(),
                phone: formattedPhone,
                language: lang,
                service: ctx.session.service || 'tattoo',
                date: new Date()
            });

            const successMsg = lang === 'ua'
                ? "Дякуємо! Ми зв'яжемося з вами."
                : "Dziękujemy! Skontaktujemy się wkrótce.";

            await ctx.reply(successMsg, {
                reply_markup: getMainMenu(lang, ctx.session.service)
            });

            ctx.session.waitingForContact = false;
        } catch (e) {
            console.error('[APPOINT] Ошибка сохранения:', e);
            ctx.reply('⚠️ Ошибка при сохранении записи');
        }
    });
}

module.exports = { setup };
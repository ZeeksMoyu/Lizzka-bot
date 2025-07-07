import { Bot } from 'grammy';
import { getMainMenu } from '../keyboards/main';
import type { MyContext } from '../types';
import { PrismaClient } from '@prisma/client';


export default function setupAppointmentHandlers(bot: Bot<MyContext>, prisma: PrismaClient) {

    bot.hears(['Галерея', 'Galeria'], async (ctx) => {
        try {
            const lang = ctx.session?.lang || 'pl';
            const galleryUrl = "https://telegra.ph/Galereya-shole-07-02";

            await ctx.reply(
                lang === 'ua' ? "🔗 Відкриваю галерею..." : "🔗 Otwieram galerię...",
                {
                    reply_markup: {
                        keyboard: [
                            [{
                                text: lang === 'ua' ? "🖼 Відкрити галерею" : "🖼 Otwórz galerię",
                                web_app: { url: galleryUrl }
                            }]
                        ],
                        resize_keyboard: true
                    },
                    parse_mode: 'HTML'
                }
            );
        } catch (e) {
            console.error('[GALLERY ERROR]:', e);
            const lang = ctx.session?.lang || 'pl';
            await ctx.reply(
                lang === 'ua' ? '⚠️ Помилка відкриття галереї' : '⚠️ Błąd otwierania galerii'
            );
        }
    });

    bot.hears(['Umów wizytę', 'Записатися'], async (ctx) => {
        const lang = ctx.session.lang || 'pl';
        await ctx.reply(
            lang === 'ua'
                ? "Введіть ім'я та телефон (напр: Іван +380123456789):"
                : "Podaj imię i telefon (np: Jan +48123456789):"
        );
        ctx.session.waitingForContact = true;
    });

    bot.on('message:text', async (ctx) => {
        if (!ctx.session.waitingForContact) return;

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

        await prisma.client.create({
            data: {
                name: name.trim(),
                phone: formattedPhone,
                language: ctx.session.lang || 'pl',
                service: ctx.session.service || 'tattoo',
                date: new Date()
            }
        });

        await ctx.reply(
            lang === 'ua' ? "Дякуємо! Ми зв'яжемося з вами." : "Dziękujemy! Skontaktujemy się wkrótce.",
            { reply_markup: getMainMenu(ctx.session.lang, ctx.session.service ?? 'tattoo') }
        );

        ctx.session.waitingForContact = false;
    });
}
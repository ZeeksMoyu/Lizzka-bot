import { Bot } from 'grammy';
import { getMainMenu } from '../keyboards/main';
import type { MyContext } from '../types';
import { PrismaClient } from '@prisma/client';
import {galleryLinks} from "../utils/galleryLinks";


export default function setupAppointmentHandlers(bot: Bot<MyContext>, prisma: PrismaClient) {

    bot.on('message:text', async (ctx) => {
        if (!ctx.session.waitingForContact) return;

        const lang = ctx.session.lang || 'pl';
        const text = ctx.message.text;
        const service = ctx.session?.service || 'manicure';
        const galleryUrl = galleryLinks[service] || galleryLinks.manicure;
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
            { reply_markup: getMainMenu(ctx.session.lang, ctx.session.service ?? 'tattoo')}
        );

        ctx.session.waitingForContact = false;
    });
}
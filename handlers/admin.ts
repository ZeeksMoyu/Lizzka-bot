import { Bot } from 'grammy';
import { getAdminKeyboard, getMainMenu } from '../keyboards/admin';
import type { MyContext } from '../types';
import config from '../config/config';
import { PrismaClient } from '@prisma/client';

export default function setupAdminHandlers(bot: Bot<MyContext>, prisma: PrismaClient) {
    bot.command('admin', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) {
            console.log(`🚨 Попытка доступа от ${ctx.from.id}`);
            return ctx.reply('🚫 Доступ запрещен');
        }

        ctx.session.adminMode = true;
        await ctx.reply('🔐 Админ-панель:', {
            reply_markup: getAdminKeyboard()
        });
    });

    bot.hears('Последние записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        const appointments = await prisma.client.findMany({
            orderBy: { date: 'desc' },
            take: 10
        });

        if (appointments.length === 0) {
            return ctx.reply('📭 Нет последних записей');
        }

        let response = '📋 Последние 10 записей:\n\n';
        appointments.forEach(app => {
            response += `🆔 ID: ${app.id}\n` +
                `📅 ${app.date.toLocaleString('uk-UA')}\n` +
                `👤 ${app.name} (${app.phone})\n` +
                `🔧 Услуга: ${app.service === 'tattoo' ? 'Тату' : 'Маникюр'}\n` +
                `🌐 Язык: ${app.language === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
        });

        await ctx.reply(response);
    });

    // Остальные обработчики админки...
    bot.hears('Сегодняшние записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointments = await prisma.client.findMany({
            where: {
                date: { gte: today }
            },
            orderBy: { date: 'asc' }
        });

        if (appointments.length === 0) {
            return ctx.reply('📭 Сегодня нет записей');
        }

        let response = `📅 Записи на ${today.toLocaleDateString('uk-UA')}:\n\n`;
        appointments.forEach(app => {
            response += `⏰ ${app.date.toLocaleTimeString('uk-UA')}\n` +
                `👤 ${app.name} (${app.phone})\n` +
                `🔧 ${app.service === 'tattoo' ? 'Тату' : 'Маникюр'}\n\n`;
        });

        await ctx.reply(response);
    });

    bot.hears('Назад', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        ctx.session.adminMode = false;
        await ctx.reply(
            ctx.session.lang === 'ua' ? '🔙 Ви вийшли з адмін-панелі' : '🔙 Wyjście z panelu admina',
            { reply_markup: getMainMenu(ctx.session.lang, ctx.session.service ?? 'tattoo') }
        );
    });
}
import { Bot } from 'grammy';
import { getAdminKeyboard } from '../keyboards/admin';
import { getMainMenu } from '../keyboards/main';
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

        const todayAppointments = await prisma.client.findMany({
            where: {
                date: { gte: today }
            },
            orderBy: { date: 'asc' }
        });

        if (todayAppointments.length === 0) {
            return ctx.reply('📭 Сегодня нет записей');
        }

        let response = `📅 Записи на ${today.toLocaleDateString('uk-UA')}:\n\n`;
        todayAppointments.forEach(app => {
            response += `⏰ ${app.date.toLocaleTimeString('uk-UA')}\n` +
                `👤 ${app.name} (${app.phone})\n` +
                `🔧 ${app.service === 'tattoo' ? 'Тату' : 'Маникюр'}\n\n`;
        });

        await ctx.reply(response);
    });

    bot.hears('Все записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        const allAppointments = await prisma.client.findMany({
            orderBy: { date: 'desc' },
            take: 365
        });

        if (allAppointments.length === 0) {
            return ctx.reply('📭 Нет последних записей');
        }

        let response = '📋 Все записи:\n\n';
        allAppointments.forEach(app => {
            response += `🆔 ID: ${app.id}\n` +
                `📅 ${app.date.toLocaleString('uk-Ua')}\n` +
                `👤 ${app.name} (${app.phone})\n` +
                `🔧 Услуга: ${app.service === 'tattoo' ? 'Тату' : 'Маникюр'}\n` +
                `🌐 Язык: ${app.language === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
        });

        await ctx.reply(response);
    });

    bot.hears('Тату записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        const tattooAppointments = await prisma.client.findMany({
            where:{
                service: 'tattoo'
            },
            orderBy: { date: 'desc' },
            take: 14
        });

        if (tattooAppointments.length === 0) {
            return ctx.reply('📭 Нет последних записей');
        }

        let response = '📋 Тату записи:\n\n';
        tattooAppointments.forEach(app => {
            response += `🆔 ID: ${app.id}\n` +
                `📅 ${app.date.toLocaleString('uk-Ua')}\n` +
                `👤 ${app.name} (${app.phone})\n` +
                `🌐 Язык: ${app.language === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
        });

        await ctx.reply(response);
    });

    bot.hears('Маникюр записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        const manicureAppointments = await prisma.client.findMany({
            where:{
                service: 'manicure'
            },
            orderBy: { date: 'desc' },
            take: 14
        });

        if (manicureAppointments.length === 0) {
            return ctx.reply('📭 Нет последних записей');
        }

        let response = '📋 Маникюр записи:\n\n';
        manicureAppointments.forEach(app => {
            response += `🆔 ID: ${app.id}\n` +
                `📅 ${app.date.toLocaleString('uk-Ua')}\n` +
                `👤 ${app.name} (${app.phone})\n` +
                `🌐 Язык: ${app.language === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
        });

        await ctx.reply(response);
    });

    bot.hears('Назад', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        ctx.session.adminMode = false;
        await ctx.reply(
            ctx.session.lang === 'ua' ? '🔙 Ви вийшли з адмін-панелі' : '🔙 Wyjście z panelu admina',
            {
                // Теперь эта функция импортируется напрямую
                reply_markup: getMainMenu(ctx.session.lang, ctx.session.service ?? 'tattoo')
            }
        );
    });
}
const { Client } = require('../models');
const { getAdminKeyboard, getMainMenu } = require('../keyboards/admin');
const { Op } = require('sequelize');
const config = require('../config/config');

async function setup(bot) {
    // Обработчик команды /admin
    bot.command('admin', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) {
            console.log(`🚨 Попытка доступа к админке от ${ctx.from.id} (${ctx.from.username})`);
            return ctx.reply('🚫 Доступ запрещен. Ваш ID: ' + ctx.from.id);
        }

        ctx.session.adminMode = true;

        try {
            await ctx.reply('🔐 Админ-панель:', {
                reply_markup: getAdminKeyboard(),
                parse_mode: 'HTML'
            });
            console.log(`👨‍💻 Админ ${ctx.from.username} вошел в панель`);
        } catch (e) {
            console.error('Ошибка админ-панели:', e);
            ctx.reply('⚠️ Ошибка при открытии админ-панели');
        }
    });

    // Последние записи
    bot.hears('Последние записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        try {
            const appointments = await Client.findAll({
                order: [['date', 'DESC']],
                limit: 10
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
                    `🌐 Язык: ${app.lang === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
            });

            await ctx.reply(response);
        } catch (e) {
            console.error('Ошибка получения записей:', e);
            ctx.reply('⚠️ Ошибка при получении записей');
        }
    });

    // Сегодняшние записи
    bot.hears('Сегодняшние записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const appointments = await Client.findAll({
                where: {
                    date: {
                        [Op.gte]: today
                    }
                },
                order: [['date', 'ASC']]
            });

            if (appointments.length === 0) {
                return ctx.reply('📭 Сегодня нет записей');
            }

            let response = `📅 Записи на ${today.toLocaleDateString('uk-UA')}:\n\n`;
            appointments.forEach(app => {
                response += `⏰ ${app.date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}\n` +
                    `👤 ${app.name} (${app.phone})\n` +
                    `🔧 ${app.service === 'tattoo' ? 'Тату' : 'Маникюр'}\n\n`;
            });

            await ctx.reply(response);
        } catch (e) {
            console.error('Ошибка получения сегодняшних записей:', e);
            ctx.reply('⚠️ Ошибка при получении записей');
        }
    });

    bot.hears('Все записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        try {
            const allAppointments = await Client.findAll({
                order: [['date', 'DESC']],
                limit: 365
            });

            if (allAppointments.length === 0) {
                return ctx.reply('📭 Сегодня нет записей');
            }

            let response = '📋 Записи за последний год:\n\n';
            allAppointments.forEach(app => {
                response += `🆔 ID: ${app.id}\n` +
                    `📅 ${app.date.toLocaleString('uk-UA')}\n` +
                    `👤 ${app.name} (${app.phone})\n` +
                    `🔧 Услуга: ${app.service === 'tattoo' ? 'Тату' : 'Маникюр'}\n` +
                    `🌐 Язык: ${app.lang === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
            });

            await ctx.reply(response);
        } catch (e) {
            console.error('Ошибка получения сегодняшних записей:', e);
            ctx.reply('⚠️ Ошибка при получении записей');
        }
    });

    bot.hears('Маникюр записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        try {
            const manicureApps = await Client.findAll({
                where: {
                    service: 'manicure'
                },
                order: [['date', 'DESC']],
                limit: 10
            });

            if (!manicureApps || manicureApps.length === 0) {
                return ctx.reply('📭 Нет записей на маникюр');
            }

            let response = '💅 Последние записи на маникюр:\n\n';
            manicureApps.forEach(app => {
                response +=
                    `📅 Дата: ${app.date.toLocaleString('uk-UA')}\n` +
                    `👤 Имя: ${app.name}\n` +
                    `📞 Телефон: ${app.phone}\n` +
                    `🌐 Язык: ${app.lang === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
            });

            await ctx.reply(response);
        } catch (e) {
            console.error('Ошибка получения записей на маникюр:', e);
            ctx.reply('⚠️ Ошибка при получении записей');
        }
    });

    bot.hears('Тату записи', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        try {
            const tattooApps = await Client.findAll({
                where: {
                    service: 'tattoo'
                },
                order: [['date', 'DESC']],
                limit: 10
            });

            if (!tattooApps || tattooApps.length === 0) {
                return ctx.reply('📭 Нет записей на маникюр');
            }

            let response = '💅 Последние записи на тату:\n\n';
            tattooApps.forEach(app => {
                response +=
                    `📅 Дата: ${app.date.toLocaleString('uk-UA')}\n` +
                    `👤 Имя: ${app.name}\n` +
                    `📞 Телефон: ${app.phone}\n` +
                    `🌐 Язык: ${app.lang === 'pl' ? 'Польский' : 'Украинский'}\n\n`;
            });

            await ctx.reply(response);
        } catch (e) {
            console.error('Ошибка получения записей на маникюр:', e);
            ctx.reply('⚠️ Ошибка при получении записей');
        }
    });

    // Обработчик кнопки "Назад"
    bot.hears('Назад', async (ctx) => {
        if (!config.ADMIN_IDS.includes(ctx.from.id)) return;

        try {
            ctx.session.adminMode = false;
            const lang = ctx.session.lang || 'pl';
            const service = ctx.session.service || 'tattoo';

            await ctx.reply(
                lang === 'ua' ? '🔙 Ви вийшли з адмін-панелі' : '🔙 Wyjście z panelu admina',
                { reply_markup: getMainMenu(lang, service) }
            );
            console.log(`👋 Админ ${ctx.from.username} вышел из панели`);
        } catch (e) {
            console.error('Ошибка выхода из админки:', e);
            ctx.reply('⚠️ Ошибка при выходе из админ-панели');
        }
    });
}

module.exports = { setup };
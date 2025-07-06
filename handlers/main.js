const { getServiceKeyboard } = require('../keyboards/service');

async function setup(bot) {
    bot.hears(['🔙 Główne menu', '🔙 Головне меню'], async (ctx) => {
        try {
            const lang = ctx.session.lang || 'pl';
            await ctx.reply(
                lang === 'ua' ? 'Оберіть послугу:' : 'Wybierz usługę:',
                { reply_markup: getServiceKeyboard(lang) }
            );
        } catch (e) {
            console.error('[MAIN MENU] Ошибка:', e);
            ctx.reply('⚠️ Ошибка возврата в главное меню');
        }
    });
}

module.exports = { setup };
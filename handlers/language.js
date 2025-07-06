const { getServiceKeyboard } = require('../keyboards/service');

async function setup(bot) {
    bot.hears(['🇵🇱 Polski', '🇺🇦 Українська'], async (ctx) => {
        console.log(`[LANG] Выбор языка от ${ctx.from.id}`);

        try {
            const lang = ctx.message.text === '🇵🇱 Polski' ? 'pl' : 'ua';
            ctx.session.lang = lang;

            await ctx.reply(
                lang === 'ua' ? 'Оберіть послугу:' : 'Wybierz usługę:',
                { reply_markup: getServiceKeyboard(lang) }
            );
        } catch (e) {
            console.error('[LANG] Ошибка:', e);
            ctx.reply('⚠️ Ошибка выбора языка');
        }
    });
}

module.exports = { setup };
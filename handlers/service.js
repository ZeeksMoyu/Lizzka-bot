const { getMainMenu } = require('../keyboards/main');

async function setup(bot) {
    bot.hears(['🖤 Tattoo', '🖤 Тату', '💅 Manicure', '💅 Манікюр'], async (ctx) => {
        console.log(`[SERVICE] Выбор услуги от ${ctx.from.id}`);

        try {
            const lang = ctx.session.lang || 'pl';
            const service = ctx.message.text.includes('Tattoo') || ctx.message.text.includes('Тату')
                ? 'tattoo'
                : 'manicure';

            ctx.session.service = service;

            const welcomeTexts = {
                tattoo: { pl: 'Witaj w sekcji tatuaży!', ua: 'Ласкаво просимо до розділу тату!' },
                manicure: { pl: 'Witaj w sekcji manicure!', ua: 'Ласкаво просимо до розділу манікюру!' }
            };

            await ctx.reply(welcomeTexts[service][lang], {
                reply_markup: getMainMenu(lang, service, true) // true - включаем кнопку "Главное меню"
            });
        } catch (e) {
            console.error('[SERVICE] Ошибка:', e);
            ctx.reply('⚠️ Ошибка выбора услуги');
        }
    });
}

module.exports = { setup };
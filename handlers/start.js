const { getLangKeyboard } = require('../keyboards/service');

async function setup(bot) {
    bot.command('start', async (ctx) => {
        console.log(`[START] Команда от ${ctx.from.id} @${ctx.from.username}`);

        try {
            ctx.session = {
                waitingForContact: false,
                lang: null,
                service: null,
                adminMode: false
            };

            await ctx.reply('🌍 Оберіть мову / Wybierz język:', {
                reply_markup: getLangKeyboard(),
                parse_mode: 'HTML'
            });

            console.log(`[START] Пользователь ${ctx.from.id} начал работу`);
        } catch (e) {
            console.error('[START] Ошибка:', e);
            try {
                await ctx.reply('⚠️ Произошла ошибка при старте. Пожалуйста, попробуйте ещё раз.');
            } catch (err) {
                console.error('[START] Не удалось отправить сообщение об ошибке:', err);
            }
        }
    });

    bot.command('start_refresh', async (ctx) => {
        console.log(`[START_REFRESH] Принудительный сброс для ${ctx.from.id}`);
        ctx.session = {};
        await ctx.reply('Сессия сброшена. Введите /start снова');
    });
}

module.exports = { setup };
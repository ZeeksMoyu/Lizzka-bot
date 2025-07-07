import { Bot } from 'grammy';
import { getMainMenu } from '../keyboards/main';
import type { MyContext } from '../types';

export default function setupServiceHandlers(bot: Bot<MyContext>) {
    bot.hears(['🖤 Tattoo', '🖤 Тату', '💅 Manicure', '💅 Манікюр'], async (ctx) => {
        ctx.session.service = ctx.message.text.includes('Tattoo') || ctx.message.text.includes('Тату')
            ? 'tattoo'
            : 'manicure';

        const welcomeTexts = {
            tattoo: {
                pl: 'Witaj w sekcji tatuaży!',
                ua: 'Ласкаво просимо до розділу тату!'
            },
            manicure: {
                pl: 'Witaj w sekcji manicure!',
                ua: 'Ласкаво просимо до розділу манікюру!'
            }
        };

        await ctx.reply(welcomeTexts[ctx.session.service][ctx.session.lang], {
            reply_markup: getMainMenu(ctx.session.lang, ctx.session.service, true) // true - показываем кнопку
        });
    });
}
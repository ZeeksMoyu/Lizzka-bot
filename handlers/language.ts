import { Bot } from 'grammy';
import { getServiceKeyboard } from '../keyboards/service';
import type { MyContext } from '../types';

export default function setupLanguageHandlers(bot: Bot<MyContext>) {
    bot.hears(['🇵🇱 Polski', '🇺🇦 Українська'], async (ctx) => {
        ctx.session.lang = ctx.message.text === '🇵🇱 Polski' ? 'pl' : 'ua';

        await ctx.reply(
            ctx.session.lang === 'ua' ? 'Оберіть послугу:' : 'Wybierz usługę:',
            { reply_markup: getServiceKeyboard(ctx.session.lang) } // Без кнопки главного меню
        );
    });
}
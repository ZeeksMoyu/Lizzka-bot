import { Bot } from 'grammy';
import { getLangKeyboard } from '../keyboards/service';
import type { MyContext } from '../types';

export default function setupStartHandlers(bot: Bot<MyContext>) {
    bot.command('start', async (ctx) => {
        ctx.session = {
            waitingForContact: false,
            lang: 'pl',
            service: 'tattoo',
            adminMode: false
        };

        await ctx.reply('🌍 Оберіть мову / Wybierz język:', {
            reply_markup: getLangKeyboard()
        });
    });

    bot.command('start_refresh', async (ctx) => {
        ctx.session = {
            waitingForContact: false,
            lang: 'pl',
            service: 'tattoo',
            adminMode: false
        };
        await ctx.reply('Сессия сброшена. Введите /start снова');
    });
}
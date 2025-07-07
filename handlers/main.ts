import { getServiceKeyboard } from '../keyboards/service';
import type { MyContext } from '../types';
import {Bot} from "grammy";

export default function setupMainMenuHandlers(bot: Bot<MyContext>) {
    bot.hears(['🔙 Główne menu', '🔙 Головне меню'], async (ctx) => {
        try {
            const lang = ctx.session.lang || 'pl';

            // Сбрасываем состояние
            ctx.session.waitingForContact = false;
            ctx.session.service = undefined;

            await ctx.reply(
                lang === 'ua' ? 'Оберіть послугу:' : 'Wybierz usługę:',
                {
                    reply_markup: getServiceKeyboard(lang), // Без кнопки главного меню
                    parse_mode: 'HTML'
                }
            );
        } catch (e) {
            console.error('[MAIN MENU ERROR]:', e);
            await ctx.reply('⚠️ Помилка повернення в головне меню');
        }
    });
}
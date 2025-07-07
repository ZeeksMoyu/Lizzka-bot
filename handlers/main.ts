import { getServiceKeyboard } from '../keyboards/service';
import type { MyContext } from '../types';

export default function setupMainMenuHandlers(bot: { hears: Function }) {
    bot.hears(['🔙 Główne menu', '🔙 Головне меню'], async (ctx: MyContext) => {
        try {
            const lang = ctx.session.lang || 'pl';

            // Вместо delete устанавливаем значение undefined
            ctx.session.service = undefined as unknown as 'tattoo' | 'manicure';

            await ctx.reply(
                lang === 'ua' ? 'Оберіть послугу:' : 'Wybierz usługę:',
                {
                    reply_markup: getServiceKeyboard(lang),
                    parse_mode: 'HTML'
                }
            );
        } catch (e) {
            console.error('[MAIN MENU ERROR]:', e);
            const lang = ctx.session?.lang || 'pl';
            await ctx.reply(
                lang === 'ua' ? '⚠️ Помилка повернення в головне меню' : '⚠️ Błąd powrotu do menu głównego'
            );
        }
    });
}
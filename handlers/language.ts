import { Bot } from 'grammy';
import { getServiceKeyboard } from '../keyboards/service';
import type { MyContext } from '../types';
import {setLocalizedCommands} from "../utils/setLocalizedCommands";

export default function setupLanguageHandlers(bot: Bot<MyContext>) {
    bot.hears(['🇵🇱 Polski', '🇺🇦 Українська'], async (ctx) => {
        try {
            // Проверяем наличие сообщения и текста
            if (!ctx.message || !('text' in ctx.message)) {
                console.warn('Message or text is undefined');
                return;
            }

            // Устанавливаем язык
            const selectedLang = ctx.message.text === '🇵🇱 Polski' ? 'pl' : 'ua';

            ctx.session.lang = selectedLang;

            await setLocalizedCommands(ctx, selectedLang);

            // Отправляем клавиатуру выбора услуги
            await ctx.reply(
                selectedLang === 'ua' ? 'Оберіть послугу:' : 'Wybierz usługę:',
                {
                    reply_markup: getServiceKeyboard(selectedLang),
                    parse_mode: 'HTML'
                }
            );
        } catch (e) {
            console.error('[LANGUAGE HANDLER ERROR]:', e);
            await ctx.reply('⚠️ Помилка обробки вибору мови');
        }
    });
}
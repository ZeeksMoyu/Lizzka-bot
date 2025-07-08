import { Bot } from 'grammy';
import type { MyContext } from '../types';
import {galleryLinks} from "../utils/galleryLinks";

export default function setupServiceHandlers(bot: Bot<MyContext>) {
    bot.hears(['🖤 Tattoo', '🖤 Тату', '💅 Manicure', '💅 Манікюр'], async (ctx) => {
        try {
            // Проверяем наличие сообщения и текста
            if (!ctx.message || !('text' in ctx.message)) {
                console.warn('Сообщение или текст отсутствует');
                return await ctx.reply('Пожалуйста, попробуйте еще раз');
            }

            // Определяем выбранную услугу
            const text = ctx.message.text;
            ctx.session.service = text.includes('Tattoo') || text.includes('Тату')
                ? 'tattoo'
                : 'manicure';
            const { getMainMenu } = await import('../keyboards/main');
            // Тексты приветствия
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
            const lang = ctx.session?.lang || 'pl';
            const service = ctx.session?.service || 'manicure';
            const galleryUrl = galleryLinks[service] || galleryLinks.manicure;

            // Отправляем ответ
            await ctx.reply(
                welcomeTexts[ctx.session.service][ctx.session.lang || 'pl'],
                {
                    reply_markup: getMainMenu(
                        lang || 'pl',
                        service,
                        galleryUrl,
                    ),
                    parse_mode: 'HTML'
                }
            );
        } catch (e) {
            console.error('[SERVICE HANDLER ERROR]:', e);
            const lang = ctx.session?.lang || 'pl';
            await ctx.reply(
                lang === 'ua'
                    ? '⚠️ Помилка вибору послуги'
                    : '⚠️ Błąd wyboru usługi'
            );
        }
    });
}
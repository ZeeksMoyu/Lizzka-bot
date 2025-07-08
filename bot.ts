import { Bot, session } from 'grammy';
import { FileAdapter } from '@grammyjs/storage-file';
import  setupMainMenuHandlers from './handlers/main';
import config from './config/config';
import prisma from './config/database';
import { MyContext, SessionData } from './types';

// Импорт обработчиков
import setupStartHandlers from './handlers/start';
import setupLanguageHandlers from './handlers/language';
import setupServiceHandlers from './handlers/service';
import setupAdminHandlers from './handlers/admin';
import setupAppointmentHandlers from './handlers/appointment';

const bot = new Bot<MyContext>(config.BOT_TOKEN);

// Настройка сессии
const storage = new FileAdapter({
    dirName: 'sessions'
});


bot.use(
    session({
        initial: () => ({
            waitingForContact: false,
            lang: 'pl',
            service: 'tattoo',
            adminMode: false
        }),
        storage
    })
);
setupMainMenuHandlers(bot);

// Подключение обработчиков
setupStartHandlers(bot);
setupLanguageHandlers(bot);
setupServiceHandlers(bot);
setupAdminHandlers(bot, prisma);
setupAppointmentHandlers(bot, prisma);

// Обработка ошибок
bot.catch((err) => {
    console.error('⚠️ Ошибка в боте:', err);
});

// Запуск бота
(async () => {
    try {
        await prisma.$connect();
        console.log('✅ Подключено к базе данных');

        await bot.start({
            onStart: async (info) => {
                console.log(`🤖 Бот @${info.username} запущен`);
                console.log(`🆔 ID администраторов: ${config.ADMIN_IDS.join(', ')}`);


            }
        });
    } catch (error) {
        console.error('💥 Ошибка запуска:', error);
        process.exit(1);
    }
})();

// Корректное завершение
process.once('SIGINT', () => {
    console.log('🛑 Получен SIGINT. Остановка бота...');
    bot.stop();
    prisma.$disconnect().then(() => process.exit(0));
});

process.once('SIGTERM', () => {
    console.log('🛑 Получен SIGTERM. Остановка бота...');
    bot.stop();
    prisma.$disconnect().then(() => process.exit(0));
});
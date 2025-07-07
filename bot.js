require('dotenv').config({ path: '.env' });

const { Bot, session } = require('grammy');
const config = require('./config/config');

// Инициализация бота
const bot = new Bot(config.BOT_TOKEN);

// Настройка сессии
bot.use(session({
    initial: () => ({
        waitingForContact: false,
        lang: 'pl',
        service: 'tattoo',
        adminMode: false
    })
}));

// Подключение обработчиков
const handlers = [
    'start',
    'language',
    'service',
    'main',
    'admin',
    'appointment'
];

handlers.forEach(handlerName => {
    const handler = require(`./handlers/${handlerName}`);
    if (typeof handler.setup === 'function') {
        handler.setup(bot);
    }
});

// Глобальная обработка ошибок
bot.catch((err) => {
    console.error('⚠️ Ошибка в боте:', err);
});

// Запуск бота
async function startBot() {
    try {
        await bot.start();
        console.log('🤖 Бот успешно запущен');
        console.log(`🆔 Ваши ADMIN_IDS: ${config.ADMIN_IDS.join(', ')}`);
    } catch (error) {
        console.error('💥 Ошибка запуска бота:', error);
        process.exit(1);
    }
}

startBot();

// Корректное завершение работы
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
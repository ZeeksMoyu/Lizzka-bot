require('dotenv').config();

module.exports = {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    ADMIN_IDS: process.env.ADMIN_IDS
        ? process.env.ADMIN_IDS.split(',').map(Number)
        : [0],
    DB_PATH: process.env.DB_PATH || './database.sqlite',
    PARSE_MODE: 'HTML'
};
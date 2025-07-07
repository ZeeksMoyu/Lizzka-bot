import 'dotenv/config';

export default {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    ADMIN_IDS: process.env.ADMIN_IDS
        ? process.env.ADMIN_IDS.split(',').map(Number)
        : [0],
    PARSE_MODE: 'HTML' as const
};
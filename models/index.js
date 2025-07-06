const sequelize = require('../config/database');
const Client = require('./Client');
const Content = require('./Content');

// Связи моделей (если нужны)

module.exports = {
    sequelize,
    Client,
    Content
};
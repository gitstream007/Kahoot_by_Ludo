require('dotenv').config();


let CONFIG = {};

CONFIG.db_dialect       = process.env.DB_DIALECT;
CONFIG.db_host          = process.env.DB_HOST;
CONFIG.db_port          = process.env.DB_PORT;
CONFIG.db_name          = process.env.DB_NAME;

CONFIG.jwt_encryption   = process.env.JWT_ENCRYPTION;
CONFIG.jwt_expiration   = process.env.JWT_EXPIRATION;

module.exports = CONFIG;
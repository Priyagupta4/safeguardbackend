const config = {

    DB_HOST: "localhost",
    DB_PORT: "3306",
    DB_USERNAME: "root",
    DB_PASSWORD: "",
    DB_NAME: "ubankSafeGaurd",
  
    // JWT DATA
    JWT_EXPIRY: "5min",
    JWT_ALGO: "sha512",
    JWT_SECRET: "UBankConnect.15.05.22",
    PWD_SALT: 10,
  };
  
  module.exports = config;
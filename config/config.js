require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwt: {
    secret:            process.env.JWT_SECRET,
    expiresIn:         process.env.JWT_EXPIRES_IN,
    refreshExpiresIn:  process.env.REFRESH_TOKEN_EXPIRES_IN
  }
};

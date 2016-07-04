(function() {

'use strict';

var path = require('path');
var _ = require('underscore');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV || 'development',

  logsDir: path.normalize(__dirname + '/../../logs'),

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    mobileAuthToken: 'sistac-mobile-secret',
    mobileAuthTokenExpiresInMinutes: process.env.EXPIRATION_TIME_IN_MINUTES || 30 * 24 * 60,
    session: 'sistac-secret'
  },

  // List of user roles
  userRoles: ['user', 'comercial', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.extend(
  all,
  require('./' + all.env + '.js') || {});
}());

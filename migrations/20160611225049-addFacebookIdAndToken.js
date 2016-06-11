'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('users', 'facebookId', Sequelize.STRING).then(function() {
      return queryInterface.addColumn('users', 'facebookToken', Sequelize.STRING);
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('users', 'facebookToken').then(function() {
      return queryInterface.removeColumn('users', 'facebookId');
    });
  }
};

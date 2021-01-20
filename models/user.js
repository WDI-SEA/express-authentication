'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    validPassword(typedPassword) {
      let isValid = bcrypt.compareSync(typedPassword, this.password); // returns a boolean
      return isValid;
    }

    toJSON() {
      let userData = this.get();
      delete userData.password;
      return userData;
    }
  };
  user.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters long'
        },
        notContains: {
          args: this.name,
          msg: 'Password cannot contain your name'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser, options) => {
        // check if there is a user being passed AND that that user has a password
        if (pendingUser && pendingUser.password) {
          // hash the pass
          let hash = bcrypt.hashSync(pendingUser.password, 12);
          // store the hash as the user's pass
          pendingUser.password = hash
        }
      }
    },
    sequelize,
    modelName: 'user',
  });
  return user;
};
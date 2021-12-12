'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.User.hasMany(models.Invoice, { foreignKey: 'user_id', as: 'invoices' });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      role: DataTypes.ENUM('user', 'admin'),
      phone: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      photo: {
        type: DataTypes.STRING,
        get() {
          const raw = this.getDataValue('photo');
          return (raw && `uploads/${raw}`) || null;
        },
      },
    },
    {
      modelName: 'User',
      tableName: 'users',
      freezeTableName: true,
      underscored: true,
      sequelize,
    },
  );
  return User;
};

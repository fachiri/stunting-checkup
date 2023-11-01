module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  return User;
}
module.exports = (sequelize, Sequelize) => {
  const Checkup = sequelize.define("checkups", {
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    bb: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
    tb: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
    label: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      validate: {
        isIn: {
          args: [[0, 1]],
          msg: "label must be 0 or 1"
        }
      }
    },
    accuracy: {
      type: Sequelize.DECIMAL(17, 16),
      allowNull: false,
    }
  })

  return Checkup;
}
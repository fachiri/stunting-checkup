module.exports = (sequelize, Sequelize) => {
  const Balita = sequelize.define("master_balita", {
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    nama: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    alamat: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jenis_kelamin: {
      type: Sequelize.STRING(9),
      allowNull: false,
    },
    berat_badan: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
    },
    tinggi_badan: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
    },
    umur: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
    },
    status_imunisasi: {
      type: Sequelize.STRING(13),
      allowNull: false,
    },
    status_checkup: {
      type: Sequelize.STRING(13),
      allowNull: false,
      defaultValue: "Belum Checkup"
    }
  })

  return Balita;
}
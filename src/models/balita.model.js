module.exports = (sequelize, Sequelize) => {
  const Balita = sequelize.define("toddlers", {
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
    tanggal_lahir: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    nama_ibu: {
      type: Sequelize.STRING(50),
      allowNull: false,
    }
  })

  return Balita;
}
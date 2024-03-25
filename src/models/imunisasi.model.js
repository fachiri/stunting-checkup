module.exports = (sequelize, Sequelize) => {
    const Imunisasi = sequelize.define("immunizations", {
        uuid: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        nama_imunisasi: {
            type: Sequelize.STRING,
            allowNull: false
        },
        berat_badan: {
            type: Sequelize.DECIMAL(5, 1),
            allowNull: false,
        },
        tinggi_badan: {
            type: Sequelize.DECIMAL(5, 1),
            allowNull: false,
        },
        umur: {
            type: Sequelize.INTEGER(3),
            allowNull: false,
        },
        tanggal: {
            type: Sequelize.DATE(),
            allowNull: true,
        },
    })

    return Imunisasi;
}
module.exports = (sequelize, Sequelize) => {
    const Infomrasi = sequelize.define("informasi", {
        uuid: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        nama_acara: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tanggal: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        waktu_mulai: {
            type: Sequelize.TIME,
            allowNull: false
        },
        waktu_selesai: {
            type: Sequelize.TIME,
            allowNull: false
        },
        lokasi: {
            type: Sequelize.STRING
        },
        deskripsi: {
            type: Sequelize.TEXT
        },
        pembuat_acara: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('Pending', 'Aktif', 'Selesai'),
            allowNull: false,
            defaultValue: 'Pending'
        }
    })

    return Infomrasi;
}
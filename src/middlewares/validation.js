const Joi = require('joi')

module.exports = {
  validateStoreBalita: async (req, res, next) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required().messages({
          'string.empty': 'Nama harus diisi'
        }),
        alamat: Joi.string().required().messages({
          'string.empty': 'Alamat harus diisi'
        }),
        jenis_kelamin: Joi.string().required().messages({
          'string.empty': 'Jenis kelamin harus diisi'
        }),
        berat_badan: Joi.number().required().messages({
          'number.base': 'Berat badan harus berupa angka',
          'any.required': 'Berat badan harus diisi'
        }),
        tinggi_badan: Joi.number().required().messages({
          'number.base': 'Tinggi badan harus berupa angka',
          'any.required': 'Tinggi badan harus diisi'
        }),
        tahun: Joi.number().required().messages({
          'number.base': 'Tahun harus berupa angka',
          'any.required': 'Tahun harus diisi'
        }),
        bulan: Joi.number().required().messages({
          'number.base': 'Bulan harus berupa angka',
          'any.required': 'Bulan harus diisi'
        }),
        status_imunisasi: Joi.string().required().messages({
          'string.empty': 'Status imunisasi harus diisi'
        })
      });

      const { nama, alamat, jenis_kelamin, berat_badan, tinggi_badan, tahun, bulan, status_imunisasi } = req.body
      await schema.validateAsync({ nama, alamat, jenis_kelamin, berat_badan, tinggi_badan, tahun, bulan, status_imunisasi })

      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/balita`)
    }
  },
  validateUpdateBalita: async (req, res, next) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required().messages({
          'string.empty': 'Nama harus diisi'
        }),
        alamat: Joi.string().required().messages({
          'string.empty': 'Alamat harus diisi'
        }),
        jenis_kelamin: Joi.string().required().messages({
          'string.empty': 'Jenis kelamin harus diisi'
        }),
        berat_badan: Joi.number().required().messages({
          'number.base': 'Berat badan harus berupa angka',
          'any.required': 'Berat badan harus diisi'
        }),
        tinggi_badan: Joi.number().required().messages({
          'number.base': 'Tinggi badan harus berupa angka',
          'any.required': 'Tinggi badan harus diisi'
        }),
        tahun: Joi.number().required().messages({
          'number.base': 'Tahun harus berupa angka',
          'any.required': 'Tahun harus diisi'
        }),
        bulan: Joi.number().required().messages({
          'number.base': 'Bulan harus berupa angka',
          'any.required': 'Bulan harus diisi'
        }),
        status_imunisasi: Joi.string().required().messages({
          'string.empty': 'Status imunisasi harus diisi'
        })
      });

      const { nama, alamat, jenis_kelamin, berat_badan, tinggi_badan, tahun, bulan, status_imunisasi } = req.body
      await schema.validateAsync({ nama, alamat, jenis_kelamin, berat_badan, tinggi_badan, tahun, bulan, status_imunisasi })

      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/balita/${req.params.uuid}`)
    }
  },
  validateStoreKader: async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required().messages({
          'string.empty': 'Nama harus diisi'
        }),
        username: Joi.string().required().messages({
          'string.empty': 'Username harus diisi'
        }),
        nama_puskesmas: Joi.string().required().messages({
          'string.empty': 'Nama Puskesmas harus diisi'
        }),
        kecamatan_puskesmas: Joi.string().required().messages({
          'string.empty': 'Kecamatan harus diisi'
        }),
      });

      const { name, username, nama_puskesmas, kecamatan_puskesmas } = req.body
      await schema.validateAsync({ name, username, nama_puskesmas, kecamatan_puskesmas })

      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/kader`)
    }
  },
  validateUpdateKader: async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required().messages({
          'string.empty': 'Nama harus diisi'
        }),
        username: Joi.string().required().messages({
          'string.empty': 'Username harus diisi'
        }),
        nama_puskesmas: Joi.string().required().messages({
          'string.empty': 'Nama Puskesmas harus diisi'
        }),
        kecamatan_puskesmas: Joi.string().required().messages({
          'string.empty': 'Kecamatan harus diisi'
        }),
      });

      const { name, username, nama_puskesmas, kecamatan_puskesmas } = req.body
      await schema.validateAsync({ name, username, nama_puskesmas, kecamatan_puskesmas })

      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/kader/${req.params.uuid}`)
    }
  },
}
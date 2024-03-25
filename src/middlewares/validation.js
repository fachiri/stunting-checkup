const Joi = require('joi')

module.exports = {
  validateStoreBalita: async (req, res, next) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required().messages({
          'any.required': 'Nama harus diisi',
          'string.empty': 'Nama tidak boleh kosong'
        }),
        tanggal_lahir: Joi.date().required().messages({
          'any.required': 'Tanggal lahir harus diisi',
          'date.base': 'Format tanggal lahir tidak valid'
        }),
        jenis_kelamin: Joi.string().required().messages({
          'any.required': 'Jenis kelamin harus diisi',
          'string.empty': 'Jenis kelamin tidak boleh kosong'
        }),
        nama_ibu: Joi.string().required().messages({
          'any.required': 'Nama Ibu harus diisi',
          'string.empty': 'Nama Ibu tidak boleh kosong'
        }),
        alamat: Joi.string().required().messages({
          'any.required': 'Alamat harus diisi',
          'string.empty': 'Alamat tidak boleh kosong'
        })
      });

      await schema.validateAsync(req.body)
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
          'any.required': 'Nama harus diisi',
          'string.empty': 'Nama tidak boleh kosong'
        }),
        tanggal_lahir: Joi.date().required().messages({
          'any.required': 'Tanggal lahir harus diisi',
          'date.base': 'Format tanggal lahir tidak valid'
        }),
        jenis_kelamin: Joi.string().required().messages({
          'any.required': 'Jenis kelamin harus diisi',
          'string.empty': 'Jenis kelamin tidak boleh kosong'
        }),
        nama_ibu: Joi.string().required().messages({
          'any.required': 'Nama Ibu harus diisi',
          'string.empty': 'Nama Ibu tidak boleh kosong'
        }),
        alamat: Joi.string().required().messages({
          'any.required': 'Alamat harus diisi',
          'string.empty': 'Alamat tidak boleh kosong'
        })
      });

      await schema.validateAsync(req.body)
      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/balita/${req.params.uuid}`)
    }
  },
  validateStoreImunisasi: async (req, res, next) => {
    try {
      const schema = Joi.object({
        toddlerId: Joi.string().required().messages({
          'any.required': 'Balita harus diisi',
          'string.empty': 'Balita tidak boleh kosong'
        }),
        nama_imunisasi: Joi.string().required().messages({
          'any.required': 'Nama Imunisasi harus diisi',
          'string.empty': 'Nama Imunisasi tidak boleh kosong'
        }),
        tahun: Joi.number().required().messages({
          'any.required': 'Tahun harus diisi',
          'number.base': 'Tahun harus berupa angka'
        }),
        bulan: Joi.number().required().messages({
          'any.required': 'Bulan harus diisi',
          'number.base': 'Bulan harus berupa angka'
        }),
        berat_badan: Joi.number().required().messages({
          'any.required': 'Berat badan harus diisi',
          'number.base': 'Berat badan harus berupa angka'
        }),
        tinggi_badan: Joi.number().required().messages({
          'any.required': 'Tinggi badan harus diisi',
          'number.base': 'Tinggi badan harus berupa angka'
        }),
        tanggal: Joi.date().required().messages({
          'any.required': 'Tanggal harus diisi',
          'date.base': 'Tanggal tidak valid'
        })
      });

      await schema.validateAsync(req.body)
      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/imunisasi`)
    }
  },
  validateUpdateImunisasi: async (req, res, next) => {
    try {
      const schema = Joi.object({
        toddlerId: Joi.string().required().messages({
          'any.required': 'Balita harus diisi',
          'string.empty': 'Balita tidak boleh kosong'
        }),
        nama_imunisasi: Joi.string().required().messages({
          'any.required': 'Nama Imunisasi harus diisi',
          'string.empty': 'Nama Imunisasi tidak boleh kosong'
        }),
        tahun: Joi.number().required().messages({
          'any.required': 'Tahun harus diisi',
          'number.base': 'Tahun harus berupa angka'
        }),
        bulan: Joi.number().required().messages({
          'any.required': 'Bulan harus diisi',
          'number.base': 'Bulan harus berupa angka'
        }),
        berat_badan: Joi.number().required().messages({
          'any.required': 'Berat badan harus diisi',
          'number.base': 'Berat badan harus berupa angka'
        }),
        tinggi_badan: Joi.number().required().messages({
          'any.required': 'Tinggi badan harus diisi',
          'number.base': 'Tinggi badan harus berupa angka'
        }),
        tanggal: Joi.date().required().messages({
          'any.required': 'Tanggal harus diisi',
          'date.base': 'Tanggal tidak valid'
        })
      });

      await schema.validateAsync(req.body)
      next()
    } catch (error) {
      req.flash('error', error.message);
      req.flash('form', req.body);
      res.redirect(`/dasbor/master/imunisasi/${req.params.uuid}`)
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
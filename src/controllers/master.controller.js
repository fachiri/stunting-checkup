const { validateStoreBalita, validateUpdateBalita, validateStoreKader, validateUpdateKader, validateStoreImunisasi, validateUpdateImunisasi } = require('../middlewares/validation');
const db = require('../models')
const express = require('express')
const bcrypt = require('bcryptjs');
const algorithmUtil = require('../utils/algorithm.util');
const excel = require('exceljs');
const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Izinkan hanya file dengan ekstensi xlsx
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung!'), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router()

router.get('/balita', async (req, res) => {
  const dataBalita = await db.Balita.findAll();

  const data = {
    balita: dataBalita
  }

  res.render('./pages/dashboard/master/balita', {
    title: 'Master Balita',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})
router.get('/balita/:uuid', async (req, res) => {
  const dataBalita = await db.Balita.findOne({
    where: {
      uuid: req.params.uuid
    },
    include: {
      model: db.Imunisasi,
    },
    order: [
      [
        db.Imunisasi,
        'tanggal',
        'ASC'
      ]
    ]
  });

  const immunizations = dataBalita.immunizations.map(immunization => immunization.get({ plain: true }));

  console.log(immunizations)

  const data = {
    balita: dataBalita,
    immunizations: immunizations
  }

  res.render('./pages/dashboard/master/balita-detail', {
    title: 'Detail Balita',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})
router.post('/balita', validateStoreBalita, async (req, res) => {
  try {
    const { nama, tanggal_lahir, jenis_kelamin, nama_ibu, alamat } = req.body

    const data = await db.Balita.create({
      nama,
      tanggal_lahir,
      jenis_kelamin,
      nama_ibu,
      alamat
    })

    req.flash('success', 'Data balita berhasil disimpan.');
    res.redirect(`/dasbor/master/balita/${data.uuid}`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
})
router.post('/balita/:uuid/update', validateUpdateBalita, async (req, res) => {
  try {
    const data = await db.Balita.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.update(req.body)

    req.flash('success', 'Data balita berhasil diedit.');
    res.redirect(`/dasbor/master/balita/${data.uuid}`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
})
router.get('/balita/:uuid/delete', async (req, res) => {
  try {
    const data = await db.Balita.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    await data.destroy()

    req.flash('success', 'Data berhasil dihapus.');
  } catch (error) {
    req.flash('error', error.message);
  } finally {
    res.redirect(`/dasbor/master/balita`)
  }
})
router.get('/balita/sync/export', async (req, res) => {
  try {
    const dataBalita = await db.Balita.findAll();

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Balita');

    worksheet.columns = [
      { header: 'Nama', key: 'nama', width: 20 },
      { header: 'Alamat', key: 'alamat', width: 20 },
      { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
      { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 15 },
      { header: 'Nama Ibu', key: 'nama_ibu', width: 20 },
    ];

    dataBalita.forEach(balita => {
      const { nama, alamat, jenis_kelamin, tanggal_lahir, nama_ibu } = balita;

      // Pastikan setiap atribut memiliki nilai sebelum menambahkan baris
      if (nama && alamat && jenis_kelamin && tanggal_lahir && nama_ibu) {
        worksheet.addRow({
          nama,
          alamat,
          jenis_kelamin,
          tanggal_lahir,
          nama_ibu,
        });
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="data_balita.xlsx"');

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Error exporting data');
  }
});
router.post('/balita/sync/import', upload.single('file'), async (req, res) => {
  try {
    const workbook = new excel.Workbook();
    const fileBuffer = req.file.buffer;
    await workbook.xlsx.load(fileBuffer);

    // Ambil worksheet pertama dari workbook
    const worksheet = workbook.worksheets[0];

    // Periksa header
    const headerRow = worksheet.getRow(1); // Ambil baris pertama (header)
    const headers = headerRow.values;
    const expectedHeaders = [null, 'Nama', 'Alamat', 'Jenis Kelamin', 'Tanggal Lahir', 'Nama Ibu'];

    // Periksa apakah header sesuai
    const headerIsValid = headers.every((header, index) => header === expectedHeaders[index]);

    if (!headerIsValid) {
      throw new Error('Format file Excel tidak sesuai. Pastikan header kolom sesuai dengan format yang diharapkan.');
    }

    // Iterasi melalui baris-baris worksheet
    worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber > 1) { // Lewati baris header (jika ada)
        const [_, nama, alamat, jenis_kelamin, tanggal_lahir, nama_ibu] = row.values;

        // Simpan data ke database
        await db.Balita.create({
          nama,
          alamat,
          jenis_kelamin,
          tanggal_lahir,
          nama_ibu
        });
      }
    });

    req.flash('success', 'Data balita berhasil disimpan.');
    res.redirect(`/dasbor/master/balita`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
});

router.get('/imunisasi', async (req, res) => {
  let data = {};
  let filterOptions = {};
  data.queryParams = {}

  // Mengambil nama imunisasi dari query params
  const namaImunisasi = req.query.nama_imunisasi;
  if (namaImunisasi) {
    filterOptions.nama_imunisasi = namaImunisasi;
    data.queryParams.nama_imunisasi = namaImunisasi;
  }

  // Mengambil umur dari query params
  let umur = null;
  if (req.query.year && req.query.month) {
    umur = +req.query.year * 12 + +req.query.month;
    data.queryParams.year = req.query.year;
    data.queryParams.month = req.query.month;
  }

  if (umur) {
    filterOptions.umur = umur;
  }

  // Mengambil data imunisasi dengan filter yang diberikan
  data.imunisasi = await db.Imunisasi.findAll({
    include: db.Balita,
    where: filterOptions
  });

  data.balita = await db.Balita.findAll();

  res.render('./pages/dashboard/master/imunisasi', {
    title: 'Master Imunisasi',
    layout: 'layouts/dashboard',
    data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form')
  })
})
router.post('/imunisasi', validateStoreImunisasi, async (req, res) => {
  try {
    const { toddlerId, nama_imunisasi, tahun, bulan, berat_badan, tinggi_badan, tanggal } = req.body

    await db.Imunisasi.create({
      toddlerId,
      nama_imunisasi,
      umur: (+tahun * 12) + +bulan,
      berat_badan,
      tinggi_badan,
      tanggal,
    })

    req.flash('success', 'Data berhasil disimpan.');
    res.redirect(`/dasbor/master/imunisasi`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/imunisasi`)
  }
})
router.get('/imunisasi/:uuid', async (req, res) => {
  let data = {}
  data.imunisasi = await db.Imunisasi.findOne({
    where: { uuid: req.params.uuid },
    include: [db.Balita, db.Checkup]
  });
  data.balita = await db.Balita.findAll();

  res.render('./pages/dashboard/master/imunisasi-detail', {
    title: 'Detail Imunisasi',
    layout: 'layouts/dashboard',
    data: data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
  })
})
router.get('/imunisasi/:uuid/delete', async (req, res) => {
  try {
    await db.Imunisasi.destroy({ where: { uuid: req.params.uuid } });

    req.flash('success', 'Data berhasil dihapus.');
  } catch (error) {
    req.flash('error', error.message);
  } finally {
    res.redirect(`/dasbor/master/imunisasi`)
  }
})
router.post('/imunisasi/:uuid/update', validateUpdateImunisasi, async (req, res) => {
  try {
    const { toddlerId, nama_imunisasi, tahun, bulan, berat_badan, tinggi_badan, tanggal } = req.body

    await db.Imunisasi.update({
      toddlerId,
      nama_imunisasi,
      umur: (+tahun * 12) + +bulan,
      berat_badan,
      tinggi_badan,
      tanggal
    }, { where: { uuid: req.params.uuid } })

    req.flash('success', 'Data berhasil diedit.');
  } catch (error) {
    req.flash('error', error.message);
  } finally {
    res.redirect(`/dasbor/master/imunisasi/${req.params.uuid}`)
  }
})
router.post('/imunisasi/:uuid/checkup', async (req, res) => {
  try {
    const data = await db.Imunisasi.findOne({
      where: {
        uuid: req.params.uuid
      },
      include: [db.Balita, db.Checkup]
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    const jk = data.toddler.jenis_kelamin = 'Laki-laki' ? 1 : 0
    const { predict_result, predict_accuracy, predict_proba_x, predict_proba_y } = await algorithmUtil.decisionTreeClassifier(+data.berat_badan, +data.tinggi_badan, +data.umur, jk)

    const payload = {
      age: data.umur,
      bb: data.berat_badan,
      tb: data.tinggi_badan,
      jk,
      label: predict_result,
      accuracy: predict_accuracy,
      immunizationId: data.id,
    }

    if (data.checkup) {
      await db.Checkup.update(payload, {
        where: {
          id: data.checkup.id
        }
      });
      req.flash('success', 'Cek Stunting berhasil diupdate.');
    } else {
      await db.Checkup.create(payload)
      req.flash('success', 'Cek Stunting berhasil.');
    }
  } catch (error) {
    req.flash('error', error.message);
  } finally {
    res.redirect(`/dasbor/master/imunisasi/${req.params.uuid}`)
  }
})

router.get('/balita/print/preview', async (req, res) => {
  let data = {}

  data.balita = await db.Balita.findAll();

  res.render('./pages/dashboard/print/balita', {
    layout: 'layouts/print',
    data
  })
})
router.get('/imunisasi/print/preview', async (req, res) => {
  let data = {}

  data.imunisasi = await db.Imunisasi.findAll({
    include: [db.Balita, db.Checkup]
  });

  res.render('./pages/dashboard/print/imunisasi', {
    layout: 'layouts/print',
    data
  })
})

router.get('/kader', async (req, res) => {
  const kaders = await db.User.findAll({
    where: {
      role: 'KADER'
    }
  });

  const data = {
    kader: kaders
  }

  res.render('./pages/dashboard/master/kader', {
    title: 'Master Kader',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})

router.post('/kader', validateStoreKader, async (req, res) => {
  try {
    const { name, username, nama_puskesmas, kecamatan_puskesmas } = req.body
    await db.User.create({
      name,
      username,
      role: 'KADER',
      password: bcrypt.hashSync(username),
      kecamatan_puskesmas,
      nama_puskesmas
    })

    req.flash('success', 'Data Kader berhasil disimpan.');
    res.redirect(`/dasbor/master/kader`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/kader`)
  }
})

router.get('/kader/:uuid/delete', async (req, res) => {
  try {
    const data = await db.User.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.destroy()

    req.flash('success', 'Data kader berhasil dihapus.');
    res.redirect(`/dasbor/master/kader`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/kader`)
  }
})

router.get('/kader/:uuid', async (req, res) => {
  const dataKader = await db.User.findOne({
    where: {
      uuid: req.params.uuid
    }
  });

  const data = {
    kader: dataKader
  }

  res.render('./pages/dashboard/master/kader-detail', {
    title: 'Detail Kader',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})

router.post('/kader/:uuid/update', validateUpdateKader, async (req, res) => {
  try {
    const data = await db.User.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.update(req.body)

    req.flash('success', 'Data kader berhasil diedit.');
    res.redirect(`/dasbor/master/kader/${data.uuid}`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/kader`)
  }
})

module.exports = router


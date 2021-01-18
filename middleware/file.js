const multer = require('multer')

const randomNumber = () =>{
  return Math.floor(Math.random() * Math.floor(1000000000));
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images')
  },
  filename(req, file, cb) {
    cb(null, randomNumber() + '_' + file.originalname)
  }
})

const allowedTypes = [ 'image/png', 'image/jpg', 'image/jpeg' ]

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage,
  fileFilter
})
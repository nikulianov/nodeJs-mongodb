const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
  body('email', 'Введен неккоректный @mail')
    .isEmail()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject('Такой пользователь уже занят')
      }
    })
    .normalizeEmail(),
  body('password', 'Длина пароля должна быть минимум 3 символа')
    .isLength({ min: 3, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароли не совпадают')
      }
      return true
    })
    .trim(),
  body('name', 'Имя должно содержать минимум 3 символа')
    .isLength({ min: 3 })
    .trim()
]

exports.courseValidators = [
  body('title').isLength({min:3}).withMessage('Длина заголовка дожна быть больше 3-х символов'),
  body('price').isNumeric().withMessage('Поле должно содежать только цифры'),
  body('url').isURL().withMessage('Введите корректный URL адрес изображения')
]
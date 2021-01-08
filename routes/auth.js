const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    isLogin: true,
    title: 'Авторизация',
    registerError:req.flash('registerError'),
    loginError:req.flash('loginError')
  })
})

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body
    let candidate = await User.findOne({ email })
    if (candidate) {
      const tryLogin =await bcrypt.compare(password, candidate.password)
      if (tryLogin) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save((err) => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('loginError','Неправильно введен логин или пароль')
        res.redirect('/auth/login#login')
      }

    } else {
      req.flash('loginError','Неправильно введен логин или пароль')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }


})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/register', async (req, res) => {
  try {
    let { email, name, password, confirm } = req.body
    let candidate = await User.findOne({ email })
    if (candidate) {
      req.flash('registerError','Пользователь с таким Email уже существует.')
     return res.redirect('/auth/login#register')
    }
    let hashPassword = await bcrypt.hash(password,10)
    let user = new User({
      email,
      name,
      password:hashPassword,
      cart: { items: [] }
    })
    await user.save()
    res.redirect('/auth/login#login')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
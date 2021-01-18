const { Router } = require('express')
const router = Router()
const { validationResult } = require('express-validator')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const { courseValidators } = require('../utils/validate')

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Курсы',
    isAdd: true
  })
})

router.post('/', auth, courseValidators, async (req, res) => {

  const error = validationResult(req)
  if(!error.isEmpty()){
   return  res.status(422).render('add',{
      title: 'Курсы',
      isAdd: true,
      error:error.array()[0].msg,
      data:{
        title: req.body.title,
        price: req.body.price,
        url: req.body.url,
      }
    })
  }

  try {
    let course = await new Course({
      title: req.body.title,
      price: req.body.price,
      url: req.body.url,
      userId: req.user
    })
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
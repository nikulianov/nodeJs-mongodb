const { Router } = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')

function isOwner(course, req) {
  return req.user._id.toString() !== course.userId.toString()
}


router.get('/', async (req, res) => {
  let courses = await Course.find()
    .populate('userId', 'email name')
    .select('title price url')
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    userId: req.user._id ? req.user._id.toString() : null,
    courses
  })
})

router.get('/:id', async (req, res) => {
  let course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Курс по ${ course.title }`,
    course
  })
})

router.post('/remove', auth, async (req, res) => {
  await Course.deleteOne({
    _id: req.body.id,
    userId:req.user._id
  })
  res.redirect('/courses')
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/')
  }

  try {
    let course = await Course.findById(req.params.id)
//Защищаем роут. Если этот курс не создавал авторизованный пользователь, значит мы редиректим его на курсы
    if (isOwner(course, req)) {
      return res.redirect('/courses')
    }

    res.render('course-edit', {
      title: `Редактирование курса ${ course.title }`,
      course
    })
  } catch (e) {
    console.log(e)
  }

})

router.post('/edit', auth, async (req, res) => {
  try {
    const { id } = req.body
    delete req.body.id
    const course = await Course.findById(id)
    if(isOwner(course,req)){
      return res.redirect('/courses')
    }
    Object.assign(course,req.body)
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
  // await Course.findByIdAndUpdate(req.body.id, req.body)
  // res.redirect('/courses')
})

module.exports = router
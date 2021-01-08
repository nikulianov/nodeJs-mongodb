const { Router } = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try{
    const orders = await Order.find({'user.userId':req.user.id})
      .populate('user.userId')

    res.render('orders', {
      isOrders: true,
      title: 'Заказы',
      orders: orders.map(c => {
        return {
          ...c._doc,
          price: c.courses.reduce((total, c)=>{
            return total += c.count * c.course.price
          },0)
        }
      })
    })
  }catch (e) {
    console.log(e)
  }

})

router.post('/', auth, async (req, res) => {
  try{
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate()
    const courses = user.cart.items.map(m=>({
      count:m.count,
      course: {...m.courseId._doc}
    }))

    const order = new Order({
      courses,
      user:{
        name:req.user.name,
        userId:req.user
      }
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  }catch (e) {
    console.log(e)
  }
})

module.exports = router
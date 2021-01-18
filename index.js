const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const path = require('path')
const app = express()
const flash = require('connect-flash')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const csrf = require('csurf')

const HomeRouters = require('./routes/home')
const AddRouters = require('./routes/add')
const CoursesRouters = require('./routes/courses')
const CardRouters = require('./routes/card')
const OrdersRouters = require('./routes/orders')
const AuthRouters = require('./routes/auth')
const ProfileRouters = require('./routes/profile')
const keys = require('./keys')
const PORT = process.env.PORT || 3000

app.engine('.hbs',exphbs({
  defaultLayout:'main',
  extname: '.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers:require('./utils/hbs-helpers')
}))
app.set('view engine','.hbs')
app.set('views','views')

const store = new MongoStore({
  collection:'sessions',
  uri: keys.MONGODB_URI,
})

app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret:keys.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/',HomeRouters)
app.use('/add',AddRouters)
app.use('/courses',CoursesRouters)
app.use('/card',CardRouters)
app.use('/orders',OrdersRouters)
app.use('/auth',AuthRouters)
app.use('/profile',ProfileRouters)
app.use(errorHandler)

async function start(){
  try {
    await mongoose.connect(keys.MONGODB_URI,{useNewUrlParser: true,useFindAndModify:false, useUnifiedTopology: true})

    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`)
    })
  }catch (e) {
    console.log(e)

  }

}
start()


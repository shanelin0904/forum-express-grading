const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path') // 引入 path 套件
const flash = require('connect-flash')
const methodOverride = require('method-override') // 引入套件 method-override

const session = require('express-session')
const passport = require('./config/passport') // 增加這行，引入 Passport

const handlebarsHelpers = require('./helpers/handlebars-helpers') // 引入 handlebars-helpers
const { getUser } = require('./helpers/auth-helpers') // 增加這行，引入自定義的 auth-helpers
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true })) // 加入這行

// 新增以下 7 行
app.use(session({ secret: 'Mynameischickenass', resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session()) // 增加這行，啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method')) // 使用 method-override
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // 新增這裡
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.currentUser = getUser(req) // 增加這行
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app

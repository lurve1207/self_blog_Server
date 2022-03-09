const express = require('express')
const cors = require('cors')
const joi = require('joi')
const expressJwt = require('express-jwt')

const config = require('./config')
const apiRouter = require('./router/api')
const userRouter = require('./router/user')
// *********************


const app = express()
// 配置cors跨域
app.use(cors())
// 配置express内置解析表单数据的中间件(只能解析 application/x-www-form-urlencoded  格式的表单数据)
app.use(express.urlencoded({ extended: false }))

// 一定要在 apiRouter 之前封装 res.send 并使用
app.use((req, res, next) => {
    // status 默认值为 1，表示失败
    res.cc = function (err, status = 1) {
        res.send({
            message: err instanceof Error ? err.message : err,
            status: status
        })
    }
    next()
})

// 一定要在 apiRouter 之前配置解析 token 的中间件
// 使用 .unless({ path: [可配置正则表达式] }) 指定哪些接口不需要进行 Token 的身份认证
// ！！！！！！！！！！
// 以'/api' 开头的,不需token验证
// 以'/user' 开头的，需要token验证
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


app.use('/uploads', express.static('./uploads'))// 托管静态资源文件
app.use('/api', apiRouter)// 登录、注册、注销的路由 以及获取博客的各个路由(文章分类、文章)
app.use('/user', userRouter)// 个人中心的路由

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败
    if (err instanceof joi.ValidationError) return res.cc(err.message)
    // 身份认证失败
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    res.cc(err)
})

// *********************

app.listen(3000, function () {
    console.log("server running at http://127.0.0.1:3000");
})


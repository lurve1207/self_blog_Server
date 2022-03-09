const db = require('../../db/index')
const bctypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')

exports.register = (req, res) => {
    const userinfo = req.body
    // console.log(userinfo); 
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send(c)
    // }
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 封装 res.send 前: if (err) return res.send({ status: 1, message: err.message })
        // 封装 res.send 后:
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc("用户名已经被占用！")

        // console.log(userinfo.password);
        // 加密密码 bctypt.hashSync(明文密码，随机盐长度) 进行加密
        userinfo.password = bctypt.hashSync(userinfo.password, 10)
        // console.log(userinfo.password);

        // 否则用户名可以使用...插入新用户
        const sql = 'insert into users set?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err)
            // 影响行数是否为1
            if (results.affectedRows !== 1) return res.cc("注册用户失败，请稍后再试！")
            // 否则注册用户成功
            res.cc("注册成功！", 0)
        })

    })
}

exports.login = (req, res) => {
    const userinfo = req.body
    // 判断用户名
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("登录失败！")
        // 判断密码 bctypt.compareSync(用户提交的密码, 数据库中的密码),返回布尔值
        const compareResult = bctypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc("密码错误！")
        }
        // 剔除其他数据，user 中只保留用户的 id, username, email 的值
        const user = { ...results[0], password: '', user_pic: '', desc: '', gender: '', birth: '', email: '' }
        // 生成token jwt.sign(加密的信息对象, 密钥, 配置对象(其中可配置当前token有效期))
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        })
        res.send({ status: 0, message: "登录成功！", token: 'Bearer ' + tokenStr })
    })
}

exports.destroy = (req, res) => {
    const userinfo = req.body
    // 判断用户名
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("注销失败！")
        // 判断密码 bctypt.compareSync(用户提交的密码, 数据库中的密码),返回布尔值
        const compareResult = bctypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc("注销失败！")
        }
        const sql = 'delete from users where username=?'
        db.query(sql, userinfo.username, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注销失败！')
            return res.cc('注销成功！', 0)
        })
    })
}

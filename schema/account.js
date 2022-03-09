// 导入验证规则模块
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

const id = joi.number().integer().min(1).required()

const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

const email = joi.string().email().required()
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const user_pic = joi.string().required()

const intro = joi.string().required().allow('')
const gender = joi.number().integer().valid(0, 1, 2).required()
const birth = joi.date()

exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

exports.update_userinfo_schema = {
    body: {
        // id,
        username,
        email,
        intro,
        gender,
        birth
    }
}

exports.update_password_schema = {
    body: {
        username,
        // 使用 password 这个规则，验证 req.body.oldPassword 的值
        oldPassword: password,
        // joi.ref('oldPassword') 即值需与 oldPassword 的值保持一致
        // joi.not(joi.ref('oldPassword')) 取反
        // .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPassword: joi.not(joi.ref('oldPassword')).concat(password)
    }
}

exports.updateUserPic = {
    body: {
        user_pic,
    }
}



const joi = require('joi')

const id = joi.number().integer().min(1).required()

const name = joi.string().min(1).max(15).required()
const avatar = joi.string().required()
const link = joi.string().required()
const desc = joi.string().required()

// 验证规则对象 - 发布文章
exports.update_isDelete_schema = {
    params: {
        id
    }
}

exports.addLink_schema = {
    body: {
        name,
        avatar,
        link,
        desc,
    },
}
const joi = require('joi')

const id = joi.number().integer().min(1).required()

const name = joi.string().required()
const alias = joi.string().alphanum().required()


exports.add_tag_schema = {
    body: {
        name,
        alias
    }
}

exports.get_del_tag_schema = {
    params: {
        id
    }
}

exports.update_tag_schema = {
    body: {
        id,
        name,
        alias
    }
}

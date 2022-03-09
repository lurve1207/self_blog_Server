const joi = require('joi')

const id = joi.number().integer().min(1).required()
const comm_content = joi.string().required()
const username = joi.string().alphanum().min(1).max(10).required()
const art_comm_id = joi.number().integer().min(-1).required()


exports.get_comms_schema = {
    params: {
        art_id: id
    }
}

exports.get_comms_user_schema = {
    params: {
        user_id: id
    }
}

exports.get_del_comm_schema = {
    params: {
        id
    }
}

exports.add_comment_schema = {
    body: {
        username,
        answer_art_id: art_comm_id,
        answer_art_title: comm_content,
        answer_comm_id: art_comm_id,
        answer_comm_username: username,
        content: comm_content,
        art_id: id
    },
}

exports.add_comment_user_schema = {
    body: {
        answer_id: id,
        content: comm_content
    },
}
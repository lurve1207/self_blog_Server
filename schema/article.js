const joi = require('joi')

const title = joi.string().required()
const tag_id = joi.number().integer().min(1).required()
const content = joi.string().required().min(10).allow('')
const content_html = joi.string().required().min(10).allow('')
const state = joi.string().valid('已发布', '草稿').required()

const name = joi.string().required().min(1).max(80).required()
const size = joi.number().integer().min(1).required()
const type = joi.string().valid('image/png', 'image/jpeg').required()

const share_state = joi.string().valid('原创', '转载').required()
const appreciationable = joi.boolean().required()
const commentable = joi.boolean().required()
const tag_ids = joi.string().required()
const cover_img = joi.string().required()

const id = joi.number().integer().min(1).required()

const ids = joi.array().items(joi.number().integer().min(1)).required()

const offset = joi.number().integer().min(0).required()

// 验证规则对象 - 发布文章
exports.get_del_art_schema = {
  params: {
    id
  }
}

exports.del_art_schema = {
  body: {
    id
  }
}

exports.add_article_schema = {
  body: {
    title,
    content,
    content_html,
    share_state,
    appreciationable,
    commentable,
    tag_ids,
    cover_img
  },
}

exports.save_article_schema = {
  body: {
    title,
    // tag_id,
    content,
    state,
  },
}

exports.img_uploadtoken_schema = {
  body: {
    name,
    size,
    type
  },
}

exports.get_author_schema = {
  query: {
    id
  },
}

exports.like_article_schema = {
  body: {
    id
  },
}

exports.del_comms_schema = {
  body: {
    ids
  },
}


exports.search_art_schema = {
  body: {
    title
  },
}

exports.getArt_config_schema = {
  query: {
    limit: offset,
    offset
  }
}












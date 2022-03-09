const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const { add_tag_schema, get_del_tag_schema, update_tag_schema } = require('../schema/arttag')
const arttag_handler = require('../router_handler/api/arttag')

const { get_author_schema, get_del_art_schema, search_art_schema, getArt_config_schema } = require('../schema/article')
const article_handler = require('../router_handler/api/article')

const { get_del_comm_schema, get_comms_schema } = require('../schema/comment')
const comment_handler = require('../router_handler/api/comment')

const { reg_login_schema } = require('../schema/account')
const account_handler = require('../router_handler/api/account')

const { update_isDelete_schema, addLink_schema } = require('../schema/link')
const link_handler = require('../router_handler/api/link')

// ********************************* 文章分类相关路由,处理函数封装在 router_handler/arttag *********************************
router.get('/tags', arttag_handler.getArticleTags)// 获取所有文章分类
router.get('/tag/:id', expressJoi(get_del_tag_schema), arttag_handler.getArticleTagById)// 根据id获取文章分类
router.get('/tag/:id/articles', expressJoi(getArt_config_schema), arttag_handler.getArticlesByArticleTagId)// 根据id获取文章分类的所有文章
router.post('/addtag', expressJoi(add_tag_schema), arttag_handler.addArticleTag)// 添加文章分类
router.post('/updatetag', expressJoi(update_tag_schema), arttag_handler.updateArticleTagById)// 更新文章分类
router.get('/deltag/:id', expressJoi(get_del_tag_schema), arttag_handler.delArticleTagById)// 删除文章分类



// ********************************* 文章相关路由,处理函数封装在 router_handler/article *********************************
// upload.single('cover_img')会被上传的内容挂载到 req.file 上
router.get('/all', expressJoi(getArt_config_schema), article_handler.getAllArticle)// 获取指定数量的文章
router.get('/art/:id', expressJoi(get_del_art_schema), article_handler.getArticleById)// 根据id获取指定文章
router.get('/author', expressJoi(get_author_schema), article_handler.getAuthor)//获取文章作者信息
router.post('/search', expressJoi(search_art_schema), article_handler.searchArt)


// ********************************* 评论相关路由,处理函数封装在 router_handler/comment *********************************
router.get('/comms/:art_id', expressJoi(get_comms_schema), comment_handler.getAllCommentByArtId)// 获取文章的所有评论
router.get('/comm/:id', expressJoi(get_del_comm_schema), comment_handler.getCommentById)// 根据id获取指定评论

// ********************************* 注册登录注销相关路由,处理函数封装在 router_handler/user *********************************
// 注册的路由
// 在路由中声明局部中间件，对请求中携带的数据进行验证
// 1.通过，则把请求交给后面的处理函数
// 2.不通过，终止后续代码的执行，抛出全局的Error错误，进入全局错误中间件中进行处理
router.post('/register', expressJoi(reg_login_schema), account_handler.register)
// 登录的路由
router.post('/login', expressJoi(reg_login_schema), account_handler.login)
// 注销的路由
router.post('/destroy', expressJoi(reg_login_schema), account_handler.destroy)

// 友链的路由
router.get('/links', link_handler.getLinks)
router.post('/togglelink/:id', expressJoi(update_isDelete_schema), link_handler.toggle_isDelete)
router.post('/addlink', expressJoi(addLink_schema), link_handler.addLink)



module.exports = router
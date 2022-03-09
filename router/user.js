const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const user_handler = require('../router_handler/user')
const { update_userinfo_schema, update_password_schema, updateUserPic } = require('../schema/account')


// 引入上传文件的模块
const { upload } = require('../tools/upload_img')
const { add_article_schema, del_art_schema, save_article_schema, img_uploadtoken_schema,
    like_article_schema, del_comms_schema } = require('../schema/article')

const { add_comment_schema, add_comment_user_schema } = require('../schema/comment')


router.get('/userinfo', user_handler.getUserInfo)// 获取用户个人信息
router.post('/userinfo', expressJoi(update_userinfo_schema), user_handler.updateUserInfo)// 更新用户个人基本信息
router.post('/updatepwd', expressJoi(update_password_schema), user_handler.updatePassword)// 更新密码
router.post('/updateuserpic', expressJoi(updateUserPic), user_handler.updateUserPic)// 更新头像

router.get('/draft', user_handler.getDraft)// 获取用户保存的草稿
router.post('/saveart', expressJoi(save_article_schema), user_handler.saveArticle)// 保存文章草稿

// router.post('/img', upload.single('img'), user_handler.uploadImg)// 上传文章内容中的图片
router.post('/imguptoken', expressJoi(img_uploadtoken_schema), user_handler.getImageUploadToken) // 获取图片上传的token
router.post('/addart', expressJoi(add_article_schema), user_handler.addArticle)// 上传文章
router.post('/delart', expressJoi(del_art_schema), user_handler.delArticleById)//删除指定文章
router.get('/all', user_handler.getAllArticle)//获取用户自己发布的所有文章
router.get('/likes', user_handler.getAllLikes)//获取用户点过赞的所有文章
router.get('/comms', user_handler.getUserComments)// 获取用户的所有评论
router.post('/like/art', expressJoi(like_article_schema), user_handler.likeArtOrComm)//喜欢指定文章
router.post('/like/comm', expressJoi(like_article_schema), user_handler.likeArtOrComm)//喜欢指定评论

router.post('/addcomm', expressJoi(add_comment_schema), user_handler.addComment)//评论指定文章
router.post('/replycomm', expressJoi(add_comment_user_schema), user_handler.addComment)//回复指定评论
router.post('/about/art', expressJoi(like_article_schema), user_handler.getAbout)//获取用户与文章的交互信息
router.post('/about/comm', expressJoi(like_article_schema), user_handler.getAbout)//获取用户与文章的交互信息
router.post('/delcomm', user_handler.delCommentById)//删除指定评论


module.exports = router
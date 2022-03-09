const bctypt = require('bcryptjs')
const db = require('../db/index')
const path = require('path')
const token_generator = require('../tools/qiniu')
const { json } = require('body-parser')



exports.getUserInfo = (req, res) => {
    const sqlStr = `select id, username, email, user_pic, intro, gender, birth from users where id=?`
    // express-jwt 解析 token 成功后，会将内容挂载到 req.user
    // console.log(req.user);
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 1) return res.cc('获取用户信息失败！')
        res.send({ status: 0, message: '获取用户信息成功！', data: results[0] })
    })
}

exports.updateUserInfo = (req, res) => {
    const sql = 'select * from users where username=?'
    db.query(sql, req.body.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length >= 2) return res.cc("用户名已经被占用！")
        if (results.length == 1
            && results[0].id != req.user.id) return res.cc("用户名已经被占用！")

        const sqlStr = 'update users set ? where id=?'
        // console.log('服务器');
        // console.dir(req);
        db.query(sqlStr, [req.body, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('修改用户信息失败！')
            return res.cc('修改用户信息成功！', 0)
        })
    })


}

exports.updatePassword = (req, res) => {
    const sqlStr = 'select * from users where id=?'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断密码 bctypt.compareSync(用户提交的密码, 数据库中的密码),返回布尔值
        const compareResult = bctypt.compareSync(req.body.oldPassword, results[0].password)
        if (!compareResult) {
            return res.cc('原密码错误！')
        }
        const sql = 'update users set password=? where id=?'
        req.body.newPassword = bctypt.hashSync(req.body.newPassword, 10)
        db.query(sql, [req.body.newPassword, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            return res.cc('更新密码成功！', 0)
        })
    })
}

exports.updateUserPic = (req, res) => {
    const sql = 'update users set user_pic=? where id=?'
    db.query(sql, [req.body.user_pic, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        return res.cc('更新头像成功！', 0)
    })
}

exports.addArticle = (req, res) => {
    // console.log(req.body);
    // 手动判断是否上传了文章封面
    // if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    const commentInfo = {
        ...req.body,// 标题、内容、版权状态等
        // cover_img: path.join('/uploads', req.file.filename), // 文章封面在服务器端的存放路径
        pub_date: new Date(), // 文章发布时间
        state: "已发布",
        author_id: req.user.id, // 文章作者的Id
    }
    const sql = `insert into articles set ?`

    db.query(sql, commentInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')

        // 更新标签的文章数量
        let sqlStr = `select id, art_count from article_tag where FIND_IN_SET(id,'${req.body.tag_ids}')`
        console.log(sqlStr);
        db.query(sqlStr, (err, tagResults) => {
            if (err) return res.cc(err)
            let arrSql = ``
            let tagArr = req.body.tag_ids.split(',')
            console.log(tagResults);
            console.log(tagArr);

            tagResults.forEach((item, index) => {
                arrSql += `WHEN ${item.id} THEN ${item.art_count + 1} `
            })
            sqlStr = `UPDATE article_tag SET art_count = CASE id ` + arrSql + `END WHERE id IN (${req.body.tag_ids})`
            console.log(sqlStr);
            db.query(sqlStr, (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== tagArr.length) return res.cc('文章数量更新失败！')
                res.cc('发布文章成功', 0)
            })
        })

    })




}

exports.saveArticle = (req, res) => {
    const sqlStr = 'select * from articles where author_id=? and state="草稿"'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 1) return res.cc('获取文章草稿失败！')
        if (results.length == 1) {
            const sql = 'update articles set ? where author_id=? and state="草稿"'
            db.query(sql, [req.body, req.user.id], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('保存文章草稿失败！')
                return res.cc('保存文章草稿成功！', 0)
            })
        }
        else {
            const commentInfo = {
                ...req.body,// 标题、内容、编辑状态
                author_id: req.user.id, // 作者的Id
            }
            const sql = `insert into articles set ?`
            db.query(sql, commentInfo, (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('保存文章草稿失败！')
                return res.cc('保存文章草稿成功', 0)
            })
        }
    })
}

exports.uploadImg = (req, res) => {

}

exports.getDraft = (req, res) => {
    const sqlStr = 'select * from articles where author_id=? and state="草稿"'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 1) return res.cc('获取草稿失败！')
        if (results.length == 0) return res.cc('没有草稿！')
        res.send({
            status: 0, message: '获取草稿成功！', data: {
                title: results[0].title,
                content: results[0].content,
                state: results[0].state
            }
        })
    })
}

exports.getImageUploadToken = (req, res) => {
    let token = token_generator.uptoken(req.body)
    // return res.cc('获取图片上传token失败！')
    return res.send({
        status: 0, message: '获取图片上传token成功！', data: token
    })
}

exports.getAllArticle = (req, res) => {
    const sqlStr = 'select * from articles where is_delete=0 and state="已发布" and author_id=? order by id asc'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({ status: 0, message: '获取用户已发布的文章列表成功！', data: results })
    })
}

exports.delArticleById = (req, res) => {
    const sqlStr = 'update articles set is_delete=1 where id=?'
    db.query(sqlStr, req.body.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc("删除文章失败！")

        // 更新标签的文章数量
        let sql = `select tag_ids from articles where id=?`
        db.query(sql, req.body.id, (err, tag_idsResults) => {
            if (err) return res.cc(err)
            if (tag_idsResults.length !== 1) return res.cc('标签的文章数量更新失败！')

            let sql = `select id, art_count from article_tag where FIND_IN_SET(id,'${tag_idsResults[0].tag_ids}')`
            db.query(sql, (err, tagResults) => {
                if (err) return res.cc(err)
                let arrSql = ``
                let tagArr = tag_idsResults[0].tag_ids.split(',')
                tagResults.forEach((item, index) => {
                    arrSql += `WHEN ${item.id} THEN ${item.art_count - 1} `
                })
                sql = `UPDATE article_tag SET art_count = CASE id ` + arrSql + `END WHERE id IN (${tag_idsResults[0].tag_ids})`
                db.query(sql, (err, results) => {
                    if (err) return res.cc(err)
                    if (results.affectedRows !== tagArr.length) return res.cc('文章数量更新失败！')
                    res.cc('删除文章成功', 0)
                })
            })
        })






    })
}

// 点赞相关**********************************
exports.getAllLikes = (req, res) => {
    const sqlStr = 'select * from likes where user_id=? and is_like=1 and art_id is not null'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        let arr = []
        results.forEach(element => {
            arr.push(element.art_id.toString())
        });
        let ids = "'" + arr.join(',') + "'"
        const str = `select * from articles where FIND_IN_SET (id,${ids})`
        db.query(str, req.user.id, (err, results) => {
            if (err) return res.cc(err)
            res.send({ status: 0, message: '获取用户点过赞的文章列表成功！', data: results })
        })
    })
}

exports.likeArtOrComm = (req, res) => {
    let table = req.path.indexOf('art') !== -1 ? 'articles' : 'comments'
    let art_or_comm = table == 'articles' ? '文章' : '评论'
    const sqlStr = 'select * from ' + table + ' where is_delete=0 and id=?'
    // 查询该文章（评论）
    db.query(sqlStr, req.body.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 1) return res.cc('该' + art_or_comm + '无法赞赏！')
        // 查询点赞表，用户是否已点赞
        let is_ok = true
        let queryItem = table == 'articles' ? 'art_id' : 'comm_id'
        sql = 'select * from likes where user_id=? and ' + queryItem + '=?'
        db.query(sql, [req.user.id, req.body.id], (err, response) => {
            if (err || response.length > 1) is_ok = false
            //点赞表已有记录
            if (response.length == 1) {
                const is_like = response[0].is_like == 0 ? 1 : 0
                sql = 'update likes set is_like=? where user_id=? and ' + queryItem + '=?'
                db.query(sql, [is_like, req.user.id, req.body.id], (err, results) => {
                    if (err || results.affectedRows !== 1) is_ok = false
                    thumbs(req, res, table, is_ok, is_like)
                })
            }
            //点赞表还没有记录
            if (response.length == 0) {
                sql = `insert into likes set ?`
                let dataToSet = table == 'articles' ?
                    {
                        user_id: req.user.id,
                        art_id: req.body.id,
                        is_like: 1
                    } : {
                        user_id: req.user.id,
                        comm_id: req.body.id,
                        is_like: 1
                    }
                db.query(sql, dataToSet, (err, results) => {
                    if (err || results.affectedRows !== 1) is_ok = false
                    thumbs(req, res, table, is_ok, 1)
                })
            }
        })
    })
}

function thumbs(req, res, table, is_ok, is_like) {
    if (is_ok) {
        let art_or_comm = table == 'articles' ? '文章' : '评论'
        const sqlStr = 'select * from ' + table + ' where is_delete=0 and id=?'
        db.query(sqlStr, req.body.id, (err, results) => {
            if (err) return res.cc(err)
            if (results.length > 1) return res.cc('该' + art_or_comm + '无法赞赏！')
            // 1.更新该文章（评论）赞赏数
            let sql = 'update ' + table + ' set likes=? where is_delete=0 and id=?'
            let likes
            if (is_like == 1) {
                likes = results[0].likes + 1
            }
            if (is_like == 0) {
                likes = results[0].likes - 1
            }
            db.query(sql, [likes, req.body.id], (err, response) => {
                if (err) return res.cc(err)
                if (response.affectedRows !== 1) return res.cc("赞赏失败！")
                if (is_like == 1) {
                    res.send({ status: 0, message: '赞赏成功！', data: { is_like, likes, table } })
                }
                if (is_like == 0) {
                    res.send({ status: 0, message: '取消赞赏成功！', data: { is_like, likes, table } })
                }

            })
        })
    }
}

exports.getAbout = (req, res) => {
    let queryItem = req.path.indexOf('art') !== -1 ? 'art_id' : 'comm_id'
    let art_or_comm = req.path.indexOf('art') !== -1 ? '文章' : '评论'
    const sqlStr = 'select * from likes where user_id=? and ' + queryItem + '=?'
    db.query(sqlStr, [req.user.id, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 1) return res.cc('获取用户与' + art_or_comm + '交互信息失败！')
        res.send({ status: 0, message: '获取用户与' + art_or_comm + '交互信息成功！', data: results[0] })
    })
}



// 评论相关****************************************
exports.addComment = (req, res) => {
    const commentInfo = {
        ...req.body,// 内容,评论的文章或者被回复的评论
        user_id: req.user.id,// 评论者
        pub_time: new Date(), // 文章发布时间
    }
    const sql = `insert into comments set ?`
    db.query(sql, commentInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加评论失败！')
        const sqlStr = `select * from comments where id=?`
        db.query(sqlStr, results.insertId, (err, response) => {
            if (err) return res.cc(err)
            if (response.length > 1) return res.cc('获取添加的评论信息失败！')
            res.send({ status: 0, message: '添加评论成功！', data: response[0] })
        })
    })
}

exports.delCommentById = (req, res) => {
    let ids = []
    Object.keys(req.body).forEach(idx => {
        if (parseInt(req.body[idx]) <= 0) {
            return res.cc("删除失败")
        }
        else {
            ids.push(parseInt(req.body[idx]))
        }
    })
    // console.log('没失败', ids);
    const sqlStr = `update comments set is_delete=1 where id in (${ids.join(',')})`
    // console.log(sqlStr);
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== ids.length) {
            return res.cc("部分评论删除失败！")
        }
        return res.cc("删除评论成功！", 0)
    })
}


exports.getUserComments = (req, res) => {
    // console.log(req.user.id);
    const sqlStr = 'select * from comments where user_id=? and is_delete=0'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({ status: 0, message: '获取用户发表的所有评论成功', data: results })
    })
}















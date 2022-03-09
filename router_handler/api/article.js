const db = require('../../db/index')



exports.getAllArticle = (req, res) => {
    if (req.query.offset == 0) {
        const sqlStr = `select * from articles where is_delete=0 and state="已发布" order by id desc`
        db.query(sqlStr, (err, allResults) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: { total: allResults.length, arts: allResults.slice(0, req.query.limit) }
            })
        })
    }
    else {
        const sqlStr = `select * from articles where is_delete=0 and state="已发布" order by id desc 
            limit ${req.query.limit} offset ${req.query.offset}`
        db.query(sqlStr, (err, allResults) => {
            if (err) return res.cc(err)
            res.send({ status: 0, message: '获取文章列表成功！', data: allResults })
        })
    }
}

exports.getArticleById = (req, res) => {
    const sqlStr = 'select * from articles where is_delete=0 and state="已发布" and id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("获取指定文章失败！")
        res.send({ status: 0, message: '获取指定文章成功！', data: results[0] })
    })
}

exports.getAuthor = (req, res) => {
    const sqlStr = `select id, username, email, user_pic, intro, gender, birth from users where id=?`
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 1) return res.cc('获取作者信息失败！')
        res.send({ status: 0, message: '获取作者信息成功！', data: results[0] })
    })
    // return res.cc("作者失败！")
}

exports.searchArt = (req, res) => {
    const sqlStr = `select id, title, likes from articles where is_delete=0 and state="已发布" and 
        CONCAT(articles.title,articles.content_html) LIKE '%${req.body.title}%' order by likes desc`
    // locate('${req.body.title}', title)
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc('没有搜索到相关内容')
        res.send({ status: 0, message: '查询文章成功！', data: results })
    })
}








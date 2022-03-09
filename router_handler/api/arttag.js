const db = require('../../db/index')

exports.getArticleTags = (req, res) => {
    // asc 升序，desc 降序
    const sqlStr = 'select * from article_tag where is_delete=0 order by id asc'
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        res.send({ status: 0, message: '获取文章分类列表成功！', data: results })
    })

}

exports.addArticleTag = (req, res) => {
    const sqlStr = 'select * from article_tag where name=? or alias=?'
    db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 2) return res.cc("分类名称与别名都已被占用！")
        if (results.length == 1
            && results[0].name == req.body.name
            && results[0].alias === req.body.alias) return res.cc("分类名称与别名都已被占用！")
        if (results.length == 1
            && results[0].name == req.body.name) return res.cc("分类名称已被占用！")
        if (results.length == 1
            && results[0].alias === req.body.alias) return res.cc("分类别名已被占用！")

        const sql = 'insert into article_tag set?'
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("新增文章分类失败！")
            const str = `select * from article_tag where id=?`
            db.query(str, results.insertId, (err, response) => {
                if (err) return res.cc(err)
                if (response.length > 1) return res.cc('获取添加的文章分类失败！')
                res.send({ status: 0, message: '新增文章分类成功！', data: response[0] })
            })
        })
    })
}

exports.delArticleTagById = (req, res) => {
    const sqlStr = 'update article_tag set is_delete=1 where id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc("删除文章分类失败！")
        return res.cc("删除文章分类成功！", 0)
    })
}

exports.getArticleTagById = (req, res) => {
    const sqlStr = 'select * from article_tag where id=? and is_delete=0'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("获取文章分类失败！")
        res.send({ status: 0, message: '获取文章分类成功！', data: results[0] })
    })
}

exports.getArticlesByArticleTagId = (req, res) => {
    const sqlStr = 'select * from article_tag where id=? and is_delete=0'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("获取该分类的文章列表失败！")

        if (req.query.offset == 0) {
            const sqlStr = `select * from articles where FIND_IN_SET (?,tag_ids) and is_delete=0 and state="已发布" order by id desc`
            db.query(sqlStr, req.params.id, (err, allResults) => {
                if (err) return res.cc(err)
                res.send({
                    status: 0,
                    message: '获取该分类的文章列表成功！',
                    data: { total: allResults.length, arts: allResults.slice(0, req.query.limit) }
                })
            })
        }
        else {
            const sqlStr = `select * from articles where FIND_IN_SET (?,tag_ids) and is_delete=0 and state="已发布" order by id desc 
                limit ${req.query.limit} offset ${req.query.offset}`
            db.query(sqlStr, req.params.id, (err, allResults) => {
                if (err) return res.cc(err)
                res.send({ status: 0, message: '获取该分类的文章列表成功！', data: allResults })
            })
        }
    })
}

exports.updateArticleTagById = (req, res) => {
    // 该id文章的 分类名称 与 分类别名 是否被占用
    const sqlStr = 'select * from article_tag where id<>? and (name=? or alias=?)'
    db.query(sqlStr, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 2) return res.cc("分类名称与别名都已被占用！")
        if (results.length == 1
            && results[0].name == req.body.name
            && results[0].alias === req.body.alias) return res.cc("分类名称与别名都已被占用！")
        if (results.length == 1
            && results[0].name == req.body.name) return res.cc("分类名称已被占用！")
        if (results.length == 1
            && results[0].alias === req.body.alias) return res.cc("分类别名已被占用！")

        const sql = 'update article_tag set ? where id=? and is_delete=0'
        db.query(sql, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("更新文章分类失败！")
            res.cc("更新文章分类成功！", 0)
        })
    })
}


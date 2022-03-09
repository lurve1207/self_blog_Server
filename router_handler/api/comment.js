const db = require('../../db/index')



exports.getAllCommentByArtId = (req, res) => {
    const sqlStr = 'select * from comments where is_delete=0 and art_id=? order by id asc'
    db.query(sqlStr, req.params.art_id, (err, results) => {
        if (err) return res.cc(err)
        res.send({ status: 0, message: '获取该文章的评论列表成功！', data: results })
    })
}

exports.getCommentById = (req, res) => {
    const sqlStr = 'select * from comments where is_delete=0 and id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("获取指定评论失败！")
        res.send({ status: 0, message: '获取指定评论成功！', data: results[0] })
    })
}









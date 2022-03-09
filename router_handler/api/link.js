const db = require('../../db/index')
exports.getLinks = (req, res) => {
    const sqlStr = 'select * from links where is_delete=0 order by id asc'
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        results.forEach(item => {
            if (item.desc.length >= 20) {
                item.desc = item.desc.slice(0, 20) + "..."
            }
        });
        res.send({ status: 0, message: '获取友情链接列表成功！', data: results })
    })
}

exports.toggle_isDelete = (req, res) => {
    const sqlStr = 'select * from links where id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("切换友情链接是否显示失败！")
        let isDelete = results[0].is_delete
        isDelete = isDelete == 0 ? 1 : 0
        const sql = `update links set is_delete=${isDelete} where id=?`
        db.query(sql, req.params.id, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("切换友情链接是否显示失败！")
            return res.cc("切换友情链接是否显示成功！", 0)
        })
    })
}

exports.addLink = (req, res) => {
    const sqlStr = 'select * from links where link=?'
    db.query(sqlStr, req.body.link, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc("此友情链接已存在！")
        const sql = `insert into links set?`
        db.query(sql, {
            name: req.body.name,
            avatar: req.body.avatar,
            link: req.body.link,
            desc: req.body.desc
        }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("新增友情链接失败！")
            return res.cc("新增友情链接成功！", 0)
        })
    })
}


// 注意：使用 express.urlencoded() 中间件无法解析 multipart / form - data 格式的请求体数据。
// 当前项目，推荐使用 multer 来解析 multipart / form - data 格式的表单数据。
// https://www.npmjs.com/package/multer
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性***来自己指定***文件的存放路径，但无法控制文件存储名称
// const upload = multer({ dest: path.join(__dirname, '../static/uploads') })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static/uploads'))// 指定上传的存储目录
    },
    filename: function (req, file, cb) {
        let extname = path.extname(file.originalname)
        cb(null, Date.now() + extname)// 指定文件名
    }
})

exports.upload = multer({ storage: storage })

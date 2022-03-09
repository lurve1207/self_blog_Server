const qiniu = require('qiniu')

const accessKey = 'yafTH6k4UUgX5M9j-JtpEI4b1OY-nbc11JVTTOzD'
const secretKey = 'aQPTgC0nEmHX_vA8PcBSVCdhdx82I1zlNRQ-Laki'
const bucket = 'blogself'

// 七牛云服务器********************
// 1.定义鉴权对象mac
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

exports.uptoken = (data) => {
    // console.log(data);
    // 简单上传的凭证
    var options = {
        scope: bucket + ':' + data.name,
        expires: 3600,
    };

    var putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
}

# self_blog_Server

#### 介绍
个人博客后台

#### 软件架构
软件架构说明

#### 使用说明


npm i 安装所需模块
node app.js 运行


*  http://127.0.0.1:3000

 - http://127.0.0.1:3000/uploads    // 托管静态资源文件

 - http://127.0.0.1:3000/api 
 --- // 1.登录、注册、注销的路由   
 --- post http://127.0.0.1:3000/api/register // 注册的路由
 --- post http://127.0.0.1:3000/api/login    // 登录的路由
 --- post http://127.0.0.1:3000/api/destroy  // 注销的路由
 --- // 2.文章分类的路由
 --- get http://127.0.0.1:3000/api/cates    // 获取所有文章分类
 --- get http://127.0.0.1:3000/api/cate/:id // 根据id获取文章分类
 --- get http://127.0.0.1:3000/api/cate/:id/articles    // 根据id获取文章分类的所有文章
 --- post http://127.0.0.1:3000/api/addcate  // 添加文章分类
 --- get http://127.0.0.1:3000/api/updatecate   // 更新文章分类
 --- get http://127.0.0.1:3000/api/delcate/:id  // 删除文章分类
 --- // 3.文章的路由
 --- get http://127.0.0.1:3000/api/all  // 获取所有文章
 --- // 4.友链的路由
 --- http://127.0.0.1:3000/api/links    // 获取所有要展示的友链
 --- http://127.0.0.1:3000/api/togglelink/:id   // 根据id指定友链是否展示

 - http://127.0.0.1:3000/user   // 个人中心
 --- get http://127.0.0.1:3000/user/userinfo    // 获取用户个人信息
 --- post http://127.0.0.1:3000/user/userinfo    // 更新用户个人基本信息
 --- post http://127.0.0.1:3000/user/updatepwd   // 更新密码
 --- post http://127.0.0.1:3000/user/update/avatar   // 更新头像 
 --- post http://127.0.0.1:3000/user/addart  // 上传文章
...未更新，具体见 api.js 与 user.js
...未更新，具体见 api.js 与 user.js
...未更新，具体见 api.js 与 user.js
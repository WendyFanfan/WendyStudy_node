# Node.js

### 整个阶段概念快览：

微服务：（架构）细分为各个小组件，松散耦合

微前端：

原子化：各个功能模块代码简单单一，提高复用率

serverless:无后端开发

可视化：把数据变成图形

### NodeJS:

##### 工具准备，环境变量配置：

- postman
- cnpm
- supervisor
- express
- MongoDB(注意配置环境变量)   想连接成功必须要开服务，mongod -dbpath C:\data\db 这条命令可要一直开着



-三阶段代码规范（注释规范，作者，时间精确到小时，模块描述）：

```
/**
 * @author deming.su
 * @time 2022-05-23 10AM
 * @description 项目启动文件
 */
```

##### nodeJs简述：

- 基于 chorme V8的js代码运行平台。
- 特性：异步，非I/O阻塞，所有的回调基于事件机制。
- nodeJs可以实现高并发

##### nodeJs基本应用:

- webService应用接口
- express->Nest.js框架基于ts
- koa->egg.js 阿里双十一产生

### nodeJs原生创建服务



```
npm init -y       初始化项目
```

```
node xx.js        运行项目
```

```javascript
/**
 * @author wendy
 * @time 2022-05-23 8PM
 * @description 项目启动文件 
 * 
 * */

/**
 * 引入一个http(node.js内置模块)
*/
const http = require('http')

/**
 * 利用现有电脑的服务器 ->使用模块创建一个服务器create server
 * 请求：url,pathname,method,端口号
 * function createServer(requestListener?: http.RequestListener): http.Server
 * 
*/
const server = http.createServer(function (request, response) {
    let url = request.url
    let method = request.method
    if (method === 'GET') {
        if (url === '/wendy/list') {
            let list = Array(10).fill('').map(function (_, i) {
                return {
                    id: 'wendy' + i,
                    username: 'fanjiayi' + i
                }

            })
            response.write(JSON.stringify(list))
        }
        else {
            response.write(JSON.stringify({ code: 404 }))
        }
        response.end()
    }
    else {
        response.write(JSON.stringify({ code: 403, message: 'not support request method' }))
        response.end()
    }

})
/**
 * 处理端口
*/
server.listen(8081, function () {
    console.log('-------service start----')
})
```

### Express框架

#### 准备工作

下载cnpm: 

```
npm install cnpm -g --registry=https://registry.npm.taobao.org
```

 测试cnpm安装是否生效

```
cnpm -v 
```

下载热更新库supervisor，当js代码改变自动更新:

```
cnpm i -g supervisor
```

测试

```
supervisor -h
```

为什么不用npm,要是用cnpm:

- 如果出现网络错误以后，它会回滚代码，出现误删

#### 特点

- 可以设置中间件来相应http请求
- 定义了路由表用于执行不同的http请求动作
- 可以通过向模板传递参数来动态渲染html页面

#### 实例

配置package下的script成自己的项目开发命令：

```
"scripts": {

  "dev": "supervisor index.js"

 },
```

```
/***
 * @author wendy
 * @time 2022-05-23
 * @description 项目启动文件
 * 
*/

/**
 * 引入express库
 * 得到Experss实例化对象
*/
const { response } = require('express')
const express = require('express')
const app = express()

/**
 * 利用中间件实现静态服务器，托管静态资源，返回给前端的是静态资源，html,js,png
 * public为公开文件
*/
app.use(express.static('public'))

/**
 * 挂载服务器端口
 * // listen(port: number, callback?: () => void)
*/
app.listen(80, function () {
    console.log('----启动成功----')
})

//构造返回对象
const list = Array.from(Array(111), function (_, i) {
    return {
        id: 'userid' + i,
        username: 'wendy' + i
    }
})

/**
 * 使用get方法来定义一个get请求，请求的地址为：/user/list，请求处理函数为第二个参数
    (
        req: Request,
        res: Response,
        next: NextFunction,
    ): void
    NextFunction 下一个函数，如果有下一个业务处理器，是否执行下一个业务处理器
*/

//中间件,实现假如没有url拦截器
const myHandler = function (req, res, next) {
    //对象形式
    if (req.query.page === undefined || req.query.page === isNaN) {
        res.send({ code: 400, message: 'page参数没有正确传递' })
    } else {
        if (req.query.size === undefined || isNaN(req.query.size)) {
            res.send({ code: 400, message: 'size参数没有正确传递' })
        } else {
            // 执行回调，提示后边业务处理器，你可以执行了
            next()
        }
    }
}

app.get('/user/list', myHandler, function (req, res) {
    // 接收传递过来的查询参数 -> query string parameters
    console.log('---------------------- 接收的参数')
    console.log(req.query)

    // 如果前端没有传递参数过来，那么不要执行业务 -- 实现一个拦截器

    let page = req.query.page
    let size = req.query.size


    res.send({
        code: 200,
        message: 'success',
        data: userList.slice((page - 1) * size, page * size)
    })
})
```


# Mongodb

#### 启动：

```
$ mongo
```

如果依然不能开启，则另起一个cmd运行(注意：这个服务不能停止，停止数据库服务器就断开了)

```
$ mongod
```

#### 关于数据库：

- 关系数据库：MySQL 、Oracle  MSsql(sql server) DB2 ,存储的是关联数据，在执行关联查询的时候，需要一些优化手段；数据库-> 业务数据库->业务表
- 非关系数据库：存储运行结果

1. 文档型数据库：Mongodb,执行效率高，查询结果很快，关联查询很慢，常用与webservice数据库
2. 内存型数据库:redis 存储热数据（用户查询频率非常高，但是数据更新频率较低）用于做中间数据库--消息

#### Mongodb在cmd的运行

- 在mongodb上没有表的概念，数据表是集合（mongodb存储的是json对象）
- 在mongodb上，数据库和集合可以不存在，利用use来指定一个数据库，如不存在，往数据库插入数据的时候，数据库和集合自动创建

显示当前服务器上所有的数据库

```
$ show dbs
```

全局帮助

```
$ help
```

设置某个业务数据库为当前数据库 set current database

```
$ use <db_name>
```

数据新增 insert：

```
 db.mycoll.insert(obj)
        
 db.mycoll.insertOne( obj, <optional params> ) - insert a document, optional parameters are: w, wtimeout, j
 
db.mycoll.insertMany( [objects], <optional params> ) - insert multiple documents, optional parameters are: w, wtimeout, j
```

删 delete：

db.mycoll.deleteOne({sex: 2})

改

```
db.mycoll.updateOne( filter, <update object or pipeline>, <optional params> ) - update the first matching document, optional parameters are: upsert, w, wtimeout, j, hint  

db.mycoll.updateOne( filter, <update object or pipeline>, <optional params> ) => filter 筛选(过滤)条件 update object 更新对象  



db.mycoll.updateOne({id: 'zhangsan02'}, {$set: {sex: 2}})
```

查：

```
db.mycoll.find( {x:77} , {name:1, x:1} )

		db.mycoll.find([query],[fields]) 这个方法可以传递两个参数 fields 表示从这个集合中取哪些字段或则哪些字段不取出来
```

```
query -> 查询条件对象
			
		db.mycoll.find({id: 'admin'}) 查询id为admin的用户信息
		
		db.mycoll.find({id: 'admin'}, {name: 0, _id: 0}) 只有0，那么剩下字段都要返回
		db.mycoll.find({id: 'admin'}, {name: 1, _id: 0}) 只有1的字段会返回
		db.mycoll.find({id: 'admin'}, {name: 1}) 如果有1，那么_id会默认返回
		
		大于：&gt; -> {age: 大于22小于26} -> db.mycoll.find({age: {$gt: 22, $lt: 26}}) => 有一些mongodb自己的一个属性：$gt
```

#### 集成Mongodb到Express框架中

``` 
$ npm init -y              项目初始化 
$ cnpm i -S mongoose       第三方库
$ cnpm i -S express        第三方库
```

(-S save 发布依赖)  （--save-dev -D  开发依赖）

#### 概要设计

- 需求：建立一个服务器，实现一个静态页面，还有一个接口，这个接口可以在页面上调用能获取到mongodb的数据

- restful架构设计：使用method（请求方式）来声明当前要执行的接口操作 CRUT(create PUT/retrieve GET/update POST/delete DELETE)

1. express方法创建实例
2. listen方法监听端口启动服务
3. 新建目录用于存放所有的静态资源
4. use 一个中间件（static）来实现静态服务器
5. 开发一个get接口：/user/list
6. 使用XHR发送请求
7. 连接数据库并调用find方法

- mongoose库的使用
  1. 连接数据库
  2. 建立数据模型

```
//引入express
const express = require('express')

//创建一个实例
const app = express()

//监听端口服务
app.listen(8084, () => {
    console.log("----service start")
})
//use plugin for static source
//使用中间件，指定目录里的静态文件
app.use(express.static('static'))

//引入mongoose,作为nodejs和mongodb的通信
const mongoose = require('mongoose')

//连接mongodb数据库
//TCP 需要一个网络地址：mongodb://127.0.0.1:27017/ 需要使用mongodb协议，mongodb默认的端口是27017
mongoose.connect('mongodb://127.0.0.1:27017/wendy_db').then(() => {
    console.log('-----database connected successfully')
}).catch(() => {
    console.log('---database not connected')
})

//mongoose 是一个ODM(object document mapping)库，是一个对象到数据文档的映射框架
//建立一个对象模型data model instance 数据模型实例,通过mongoose跟数据库中集合（数据文档）进行关联
//model(name: string, schema?: mongoose.Schema, collection?: string, options?: mongoose.CompileModelOptions): mongoose.Model
//name:数据模型的名字，schema:数据模型的描述文档对象 collection:集合名称

const schema = new mongoose.Schema({
    id: String,
    name: String,
    age: Number,
    dept: String,
    position: String,
    date: Date,
    birthday: Date,
    address: String,
    phone: String,
    remark: String
})
// model方法执行以后会得到一个数据模型实例(Model对象)
const UserModel = mongoose.model('UserModel', schema, 'user_info')

//开发接口
app.get('/user/list', (req, res) => {
    //调用接口获取数据
    //// find(callback?: mongoose.Callback<any[]>)
    // Callback(error: NativeError, result: any[])
    UserModel.find((err, result) => {
        if (err) {
            //第一个应该是错误信息 -> 如果出现查询错误，那么就应该由提示数据对象；没有则返回一个null给我们
            // 第二个是查询结果,但都返回一个错误信息，否则容易被人查询到数据结构（安全）。
            res.send({ code: 50, message: 'server error' })
        }
        else {
            res.send({ code: 200, message: 'success', data: result })
        }
    })
})


```

静态index.html

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h3>测试页面</h3>
    <button>测试按钮</button>
    <script>
        let btn = document.querySelector('button')
        btn.onclick = function () {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', '/user/list')
            xhr.setRequestHeader('content-type', 'application/json')
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log(xhr.responseText)
                    }
                }
            }
            xhr.send()
        }
    </script>

</body>

</html>
```


//引入express
const express = require('express')

//创建一个实例
const app = express()

//监听端口服务
app.listen(80, () => {
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
const user = mongoose.model('user', schema, 'user_info')
user.find(function (err, result) {
    console.log(result)
})

//开发接口
app.get('/user/list', (req, res) => {
    //调用接口获取数据
    //// find(callback?: mongoose.Callback<any[]>)
    // Callback(error: NativeError, result: any[])
    user.find((err, result) => {

        if (err) {
            //第一个应该是错误信息 -> 如果出现查询错误，那么就应该由提示数据对象；没有则返回一个null给我们
            // 第二个是查询结果,但都返回一个错误信息，否则容易被人查询到数据结构（安全）。
            res.send({ code: 500, message: 'server error' })
        }
        else {
            res.send({ code: 200, message: 'success', data: result })
        }
    })
})


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




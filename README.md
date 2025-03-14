# 聊天室 api 字段

- 网址默认为 localhost

## :6657 - 用户个人信息处理/登录注册 api

### MVC 结构

- model
  负责数据库的连接，数据校验（mongoose 提供了自动校验故在此处实现）
- router
  负责路由
- control
  负责路由对应的功能实现

### http 模块

tip: 一律使用 json 格式发送消息

- /login 登录 get
  字段 account, password

- /register 注册 post
  request 字段 {name, account, password, custom?}
  response 字段 {name, account, custom}
- /isNameExist
  request 字段 {account, name}
  response 字段 {isReqNameIsExist}
- /updateUserName
  request 字段 {account, name}
  response 字段 {name, account, custom}
  风险: 存在直接调用修改用户名的特殊情况，最好使用 jwt 给一个 token 来确认呢登录(密码正确)以后执行(代价是耗时)，或者输入密码修改用户名(反用户特性)
- /updateUserCustom
  request 字段 {account,custom}
  response 字段 {name, account, custom}

#### 服务器返回字段

```
  {
    status:number;
    data:object|string;
  }
```

#### 数据库储存/返回字段

```
   {
      name:string; // 唯一
      account:string, // 唯一
      password:string,
      custom: object, // 自定义字段，为减少工作量尽量不使用
   }
```

#### 后端维护的实例队列

```
  {
    [socketId:string]:socketObject;
  }
```

### 6658 - 用户聊天 api websocket 模块

以下参数都支持传入参数用户 id 来实现向单个用户发送

##### 发送的字段

- server-broadcast-userslist - 当有新的用户加入连接的时候向所有用户广播新的用户名单

```
  // 接收字段
  {name:string,account:string,custom?:object}
  // 返回字段
  {name:string,account:string,id:string,custom?:object}[]
```

- server-broadcast-message - 广播发送文本消息

```
  // 接收字段
  {name:string,account:string,custom?:object,message:string}
  // 返回字段
  {name:string,account:string,custom?:object, message:string}
```

- server-broadcast-file - 广播发送文件，不支持大文件

```
 //todo
```

- server-toSelectUser-message - 对选择的用户发送文本，包括自己，共计两人

```
  // 接收字段
  {name:string,account:string,custom?:object,message:string}
  // 返回字段
  {name:string,account:string,custom?:object, message:string}
```

- server-toSelectUser-file - 对选择的用户发送文件，包括自己，共计两人，小文件直接发送，可以发送大型文件，但是需要选择中的用户同意才可以传输

```
//todo
```

##### 监听的字段

- user-newUserJoin - 新的用户加入
- user-broadcast-message - 用户发送需要广播的信息
- user-broadcast-file - 用户发送需要广播的文件，不支持大文件
- user-toSelectUser-message - 用户发送需要对选择的用户发送文本信息
- user-toSelectUser-file - 用户对选择的用户发送文件

##### 用户信息字段

```

{
name:string;
account:string;
id:string; // socket.io 分配的 id
custom:object;
}[]

```

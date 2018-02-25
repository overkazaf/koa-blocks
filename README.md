# koa-blocks

基于koa+mongoose的MVC架构，依据用户自定义数据模型自动化生成各层组件，变相增加你的泡妞时间。
在demo的入口***index.js***中，我们采用了Next.js这个支持服务端渲染的构架，当然你也可以根据自己的喜好进行选择。


# Start
```js
yarn
```

# Run
```js
node index.js
```

# Try
```bash

***findOne***

curl -L http://localhost:3001/cms/app/com.tucao.test/1.0.1
curl -L http://localhost:3001/cms/app/com.tucao.test/1.0.2

***findAll***
curl -L http://localhost:3001/cms/apps/com.tucao.test

***pageFind***
curl -L http://localhost:3001/cms/apps/com.tucao.test/2/2
```

# Author
overkazaf

# Email
overkazaf@gmail.com

# License
MIT
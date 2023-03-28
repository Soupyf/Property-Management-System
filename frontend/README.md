# 目前代码主要是了解不同view和组件的结构
1. App.vue主要包含的是所有页面共同需要的东西，值得注意的是，背景处理上，虽然引用代码写在了各页面当中，但是样式定义在了App.vue中，防止代码重复。粒子特效的样式同样如此。
2. views中包含的是不同的页面
3. components中包含的是页面当中引用的组件

# 使用的插件
1. vue ui 中安装elementui，axios
2. npm install vue-particles --save-dev （各种登录页面的粒子特效）
3. npm install dayjs -S --legacy-peer-deps
4. npm install echarts@4.9.0 --save --legacy-peer-deps
5. npm install ol --save --legacy-peer-deps
6. npm install vue-video-player@5.0.2 videojs-contrib-hls@5.14.1
7. npm install better-scroll --save  (没有用，下次可以不安装)

8. npm i @amap/amap-jsapi-loader -save
9. npm install leaftlet
10. npm install leaftlet.pm

# 前后端交互Api
1. 前端接口已经进行了封装
2. utils的request.js当中放了baseURL，主要用于后端IP地址发生改变的时候，我们不需要该很多交互的接口，只需要在其中改baseURL就可以
3. apis中的loginApi放的是类似与方法的API接口，包含了所有登录需要的API，后面可以模仿里面的写。需要的话，要重新建一个.js文件，存放比如说userHome或者订单管理的API使结构更清晰。

# 页面间的传参
this.$router.push({ path: "/client/tableSelect", query: { hotelName: row.hotelName } });
另一个页面在methods中获得参数：var x=this.$route.query.hotelName;
但是使用此种方式参数拼接在URL上，能被看见，不安全，不过目前好像没有涉及安全性，暂时可以使用此种方式

# 登录时保存账号，以便后续调用 
store index.js 中， 暂时只在登录时保存了用户昵称（状态栏显示），用户账号

# Token
1. 一台电脑只能存关于一个网站的一个token，合理，维护一个登录状态
2. 只要源是一样的，多个页面可以跨数据
3. router中的index.js 中判断是否有token
4. 在request.js中对所有的前端API都加个请求头
5. 验证token是否正确 对于需要验证的页面后端加try的那一段代码，
5. 前端判断res.data.code是否为502，弹出error，跳转页面

# 登录逻辑
1. 对于管理员，第一件事就是登录
2. 对于用户，可以先进去查看，此时上方导航栏会提示是否登录
3. 后端用户预定API添加验证token，验证失败，跳转登录页面

# client的顶部导航栏，没有登录时会提示登录/注册，并且可以点击跳转，登录后显示昵称，无法点击跳转
# 订单分为未出行，待评价，已完成三种，对应不同操作
# 评价支持评分，文字，图片，视频，弹窗展示评价

消息通知，查看订单，预定房间需要登录拦截


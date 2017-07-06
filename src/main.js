
import 'whatwg-fetch'

var url = './json/index.json';
// get 请求
/*
fetch(url).then((res) => {
  return res.json();
}).then((json)=> {
  console.log(json);
}).catch((e) => {
  console.log(e);
  var error = new Error(e);
  throw error;
});
*/

/*
fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
}).then((res) => {
  console.log(res.json)
  return res.json();
}).then((json) => {
  console.log(json);
}).catch((e) => {
  console.log(e);
  var error = new Error(e);
  throw error;
});
*/
/*
var cc = "hello world";
var reqHeaders = new Headers();
reqHeaders.append("Content-Type", "text/plain");
reqHeaders.append("Content-Length", cc.length.toString());
reqHeaders.append("Content-Type", "text/plain");
console.log(reqHeaders.has('Content-Type')); // true
console.log(reqHeaders.has("cookie")); // false
*/
fetch(url, {       // url: 请求地址
  method: 'GET',   // 请求的方法 GET/POST
  headers: {       // 请求头
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 
    'Accept': 'application/json'
  },
  // body: 'name=kongzhi',  // post请求添加的参数 请求发送的数据 blob, BufferSource、FormData、URLSearchParams
  cache: 'default',      // 是否缓存请求
  credentials : 'same-origin', //要不要携带 cookie 默认不携带 omit、same-origin 或者 include 使用include 是携带cookie
  mode: "",     
  /*  
    mode,给请求定义一个模式确保请求有效
    same-origin:只在请求同域资源时成功，其他请求将被拒绝（同源策略）
    cors : 允许请求同域及返回CORS响应头的域中的资源，通常用作跨域请求来从第三方提供的API获取数据
    cors-with-forced-preflight:在发出实际请求前执行preflight检查
    no-cors : 目前不起作用（默认）
  */
}).then((res) => {
  /*
   Response     实现了Body， 可以使用Body的属性和方法
   res.type     Response的类型
   res.url      Response的url
   res.status   状态码
   res.ok       Response 是成功还是失败
   res.headers  Response 所关联的 Headers 对象
   res.clone()  创建一个Response对象的克隆
   res.arrayBuffer()  返回一个被解析为 ArrayBuffer格式的promise对象
   res.blob()         返回一个被解析为 blob 格式的promise对象。
   res.formData()     返回一个被解析为 FormData 格式的promise对象。
   res.json()         返回一个被解析为 json格式的promise对象。
   res.text()         返回一个被解析为 Text 格式的promise对象
   */
   console.log(res.type);
   console.log(res.url);   // basic
   console.log(res.status); // 200
   console.log(res.ok);  // true
   console.log(res.headers); // Headers 对象

   return res.json();

}).then((json) => {
  console.log(json);
}).catch((e) => {
  console.log(e);
  var error = new Error(e);
  throw error;
});

/*
// 发送form表单数据
var form = document.querySelector('form');
fetch(url, {
  method: 'post',
  body: new FormData(form)
}).then((res) => {
  return res.json();
}).then((json) {
  console.log(json);
})
*/
/*
// 文件上传
var file = document.querySelector('.file');
var data = new FormData();
data.append('file', file.files[0]);
fetch(url, {
  method: 'POST',
  body: data
});
// HTML
fetch('a.html').then((res) => {
  return res.text();
}).then((body) => {
  console.log(body);
})
// JSON
fetch('a.json').then((res) => {
  return res.json();
}).then((json) => {
  console.log('parsed json', json);
}).catch((e) => {
  console.log(e);
  var error = New Error(e);
  throw error;
})


*/



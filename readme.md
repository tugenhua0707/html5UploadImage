
### js 图片上传控件
<p>HTML使用方式如下代码：</p>
<pre>
  <code>
      <div id="container">
        <a href="javascript:void(0)" class="file">选择文件
          <input type='file' multiple accept = 'image/gif,image/jpeg,image/jpg,image/png' />
          <input type="hidden" />
        </a>
      </div>
  </code>
</pre>
<p>javascript调用方式如下：</p>
<pre>
  <code>
    var params = {
      container: '#container',
      url: '',
      dragDrop: false,
      onDragLeave: function(target) {
        console.log(111)
      }
    };
    new UploadImg(params);
  </code>
</pre>
<p>如上调用即可初始化。</p>
<div>
  <p>如上代码说明：</p>
  <p>1. 最外层容器定义id或class都是在页面上需要唯一的且必须要传递的，因此传递参数container是区分是哪部分的上传区域的</p>
  <p>2. 上传图片的地址 url 是必须要传递的</p>
  <p>3. 上传完后所有服务器端返回的图片地址都会放在对应上传的区域的隐藏域中，比如上面input隐藏域中，且每个上传图片地址都是以 竖斜杠隔开的 "|"，比如 http://www.baidu.com|http://www.google.com</p>
</div>
<h3>Javascript 相对应的API如下：</h3>

####  组件API
|      属性      |             说明                                                 |     类型          |     默认值       |
| --------------|:--------------------------------------------------------------:  |   :-----------:  | :-------------: |
|   container   |  上传图片最外层的容器[必须的参数]                                     | [String]         |  ''             |
|   width       |  外层容器的宽度                                                    | [Number , String] |  600           |
|   dragDrop    |  是否需要拖曳区域                                                  | Boolean           |  true          |
|   fold        |  是否需要折叠按钮                                                  | Boolean           |  true          |
|   url         |  上传图片的地址 [必须的参数]                                        | String             |   ''          |
|   fileName    |  上传到服务器端图片的字段名                                         | String             |   'imgFile'    |

####  回调方法
|     方法名     |             说明             |     返回参数                                                          | 
| --------------|:-------------------------:  |   :----------------------------------------------------------------: |
| onSuccess     |  上传成功的回调函数            | file, data(第一个参数是上传成功的文件，第二个参数是上传成功后服务器端返回的数据) |  
| onFailure     |  上传失败的回调函数            | file, XMLHttpRequest, textStatus, errorThrown(第一个参数是上传失败的文件) | 
| onDelete      |  文件被删除的回调              | file (被删除的文件对象)                                                 | 
| onDragOver    | 文件被拖曳到该区域时的方法       | 无                                                                   | 
| onDragLeave   |  文件离开到敏感区域时           | 无                                                                   | 
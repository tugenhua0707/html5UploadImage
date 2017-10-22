
### js 图片上传控件
####  HTML使用方式如下代码:
    <div id="container">
      <a href="javascript:void(0)" class="file">选择文件
        <input type='file' multiple accept = 'image/gif,image/jpeg,image/jpg,image/png' />
        <input type="hidden" />
      </a>
    </div>
#### javascript调用方式如下：
    var data = [
      {
        "url": 'https://img.alicdn.com/tfs/TB11nHZXWagSKJjy0FgXXcRqFXa-218-46.png'
      },
      {
        "url": 'https://img.alicdn.com/simba/img/TB1WT41SVXXXXaSXpXXSutbFXXX.jpg'
      }
    ];
    var params = {
      container: '#container',
      url: '',
      dragDrop: false,
      data: data,   
      onDragLeave: function(target) {
        console.log(111)
      }
    };
    var uploadImg1 = new UploadImg(params);
<p>如上调用即可初始化。</p>
<h3>注意：data选项是指编辑页面的时候，页面本来有数据的项，传递参数方式为数组方式，如上data参数</h3>
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
|   data        |  页面初始化图片的数据                                              | Array              |   []          |

####  回调方法
|     方法名     |             说明             |     返回参数                                                          | 
| --------------|:-------------------------:  |   :----------------------------------------------------------------: |
| onSuccess     |  上传成功的回调函数            | file, data(第一个参数是上传成功的文件，第二个参数是上传成功后服务器端返回的数据) |  
| onFailure     |  上传失败的回调函数            | file, XMLHttpRequest, textStatus, errorThrown(第一个参数是上传失败的文件) | 
| onDelete      |  文件被删除的回调              | index（被删除图片的索引）                                                | 
| onDragOver    | 文件被拖曳到该区域时的方法       | 无                                                                   | 
| onDragLeave   |  文件离开到敏感区域时           | 无                                                                   | 

### 页面查看效果 预览如下地址

<p><a href="https://tugenhua0707.github.io/html5UploadImage/index.html" target="_blank">https://tugenhua0707.github.io/html5UploadImage/index.html</a></p>

<h3>注意：</h3>
<p>IE10-浏览器不支持formData传递数据，因此使用IE9浏览器下可能会报错，不支持，所以如果需要支持IE9的话，可能不通用，一直使用mac电脑，所以IE9没有兼容~</p>
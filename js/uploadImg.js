
/*
 * js 图片上传控件
 * 支持手动上传和拖曳
 * @author {kongzhi@tongbanjie.com}
 * @date 2017/9/25
   HTML使用方式如下代码：
   <div id="container">
    <a href="javascript:void(0)" class="file">选择文件
       <input type='file' multiple accept = 'image/gif,image/jpeg,image/jpg,image/png' />
       <input type="hidden" />
     </a>
   </div>
   javascript调用方式如下：
   var params = {
     container: '#container',
     url: '',
     dragDrop: false,
     onDragLeave: function(target) {
       console.log(111)
     }
   };
   new UploadImg(params);
   如上调用即可初始化。
 */
 function UploadImg(cfg) {

   if (!cfg.container) {
     throw new Error('必须使用一个容器');
     return;
   }
   this.container = cfg.container;

   // 外层容器的宽度 默认为600px
   this.width = cfg.width || 600;

   // 是否需要拖曳
   if (cfg.dragDrop === false) {
     this.isDragDrop = cfg.dragDrop;
   } else {
     this.isDragDrop = true;
   }

   // 是否显示折叠按钮
   if (cfg.fold === false) {
     this.isfold = cfg.fold;
   } else {
     this.isfold = true;
   }

   // 上传url 
   this.url = cfg.url || '';

   // data 数据 页面默认显示图片的数据
   this.data = cfg.data || [];

   // 上传文件到服务器端fileName字段 默认为 imgFile, 也可以根据服务器端需要什么字段 自己自定义
   this.fileName = cfg.fileName || 'imgFile'; 

   // 上传文件保存后数组
   this.fileFilter = [];

   // 文件被删除后的方法
   this.onDelete = cfg.onDelete || function(){};

   // 文件被拖曳到该区域时的方法
   this.onDragOver = this.isDragDrop ? cfg.onDragOver : function(){};

   // 文件离开到敏感区域时
   this.onDragLeave = this.isDragDrop ? cfg.onDragLeave : function(){};

   // 文件上传成功的回调
   this.onSuccess = cfg.onSuccess || function(){};

   // 文件上传失败后的回调
   this.onFailure = cfg.onFailure || function(){};

   this.init();
   // 绑定事件
   this.bindEnv();
 }
 UploadImg.prototype = {
    init: function() {
      var self = this;
      var inputDOM = $(this.container).html();
      var containerId = $(this.container).attr('id');
      this.containerId = containerId;
      var html = '<div class="upload_box" style="width:'+this.width+'px">' + 
                  '<div class="upload-inner">' + 
                    '<div class="upload_choose">' + 
                      '<div id="form_'+containerId+'"></div>' +
                    '</div>' + 
                    '<div class="upload_main">' + 
                      '<div id="file_'+containerId+'"></div>'+
                      '<div class="upload_preview none">' + 
                        '<ul id="preview_'+containerId+'"></ul>' + 
                      '</div>' +
                      '<div class="upload_submit none">' + 
                        '<input type="submit" id="btn_'+containerId+'" class="upload_submit_btn" value="上传图片" />' + 
                      '</div>' + 
                    '</div>' +
                  '</div>' + 
                '</div>';
      $(this.container).html(html);
      $("#form_"+containerId).html(inputDOM);

      // 如果支持拖曳的话
      if (this.isDragDrop) {
        $("#file_"+containerId).html('<span id="drag_'+containerId+'" class="upload_drag_area">或者将图片拖到此处</span>');
      }
      // 如果需要折叠按钮的话
      if (this.isfold) {
        $(this.container).find('.upload-inner').prepend("<span class='foldbtn'></span>");
      }
      // 如果页面初始化有值的话
      if (this.data.length) {
        var html = '';
        var arrs = [];
        for (var a = 0, alen = this.data.length; a < alen; a++) { 
          html += '<li id="uploadList_'+ a +'" class="upload_append_list success">'+
                    '<div class="m-layer none" id="m-layer_'+self.containerId+a+'"></div>' + 
                    '<span class="ajax-loader hidden" id="loader_'+self.containerId+a+'"></span>'+
                    '<p>'+
                      '<span href="javascript:void(0)" class="upload_delete" title="删除" data-index="'+ a +'"></span>' +
                      '<i class="upload-progress success"></i>' + 
                      '<em>' + 
                        '<img id="uploadImage_' + a + '" src="' + this.data[a].url + '" class="upload_image" />'+
                      '</em>' + 
                    '</p>'+ 
                    '<a class="filename" title="'+this.data[a].url+'">' + this.data[a].url + '</a>'+
                  '</li>';
          var imgUrl = this.data[a].url;
          arrs.push(imgUrl);
          var image = new Image();
          image.crossOrigin = '';
          image.src = imgUrl;
          (function(a, imgUrl, image){
            image.onload = function() {
              var base64 = self.getBase64Image(image);
              var blob = self.convertBase64UrlToBlob(base64);
              blob.successStatus = 1;
              blob.index = a;
              blob.name = imgUrl;
              blob.imgData = {url: imgUrl};
              self.fileFilter.push(blob);
            } 
          })(a, imgUrl, image);
        }
        $(this.container).find('.upload_preview').removeClass('none');
        $("#preview_"+self.containerId).html(html);
        $("#form_"+self.containerId + ' input[type="hidden"]').val(arrs.join('|'));
      }
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
      var dataURL = canvas.toDataURL("image/"+ext);
      return {
        dataURL: dataURL,
        type: "image/"+ext
      };
    },
    /**  
     * 将以base64的图片url数据转换为Blob  
     * @param urlData  
     * 用url方式表示的base64图片数据  
     */ 
    convertBase64UrlToBlob(base64) {
      var urlData =  base64.dataURL;
      var type = base64.type;
      var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0  
      var ab = new ArrayBuffer(bytes.length);  
      var ia = new Uint8Array(ab);  
      for (var i = 0; i < bytes.length; i++) {  
          ia[i] = bytes.charCodeAt(i);  
      }  
      return new Blob( [ab] , {type : type});  
    },
    bindEnv: function() {
      var self = this;
      // 文件选择事件
      var fileInput = $("#form_"+this.containerId + ' input[type="file"]')[0];
      fileInput.addEventListener('change', function(e) {
        self.funGetFiles(e);
      }, false);

      // 文件上传操作
      var upBotton = $("#btn_"+this.containerId)[0];
      upBotton.addEventListener('click', function(e) {
        self.uploadFiles();
      }, false);

      // 是否需要拖曳效果
      if (this.isDragDrop) {

        var dragDropId = $("#drag_"+this.containerId)[0];

        // 在可拖动元素或选取的文本正在拖动到放置目标时触发
        dragDropId.addEventListener('dragover', function(e) {
          self.dragHover(e);
        }, false);

        // 在可拖动的元素或选取的文本移出放置目标时触发。
        dragDropId.addEventListener('dragleave', function(e) {
          self.dragHover(e);
        }, false);

        // 在可拖动元素或选取的文本放置在目标区域时触发。
        dragDropId.addEventListener('drop', function(e){
          self.funGetFiles(e);
        }, false);
      }

      // 折叠操作
      if (this.isfold) {
        var foldbtn = $(this.container).find('.foldbtn')[0];
        foldbtn.addEventListener('click', function(e) {
          self.foldDiv(e);
        }, false);
      }

      // 删除操作
      $(this.container).on('click', '.upload_delete', function() {
        self.deleteFile(parseInt($(this).attr('data-index')));
      });
    },
    dragHover: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragover') {
        $(e.target).addClass('upload_drag_hover');
      } else {
        $(e.target).removeClass('upload_drag_hover');
      }
      if (e.type === 'dragover') {
        this.onDragOver && this.onDragOver.call(e.target);
      } else {
        this.onDragLeave && this.onDragLeave.call(e.target);
      }
      return this;
    },
    // 选择文件组的过滤方法 返回所有过滤后的文件
    filter: function(files) {
      var arrFiles = [];
      for (var i = 0, file; file = files[i]; i++) {
        if (file.size >= 1024000) {
          alert('您这张'+ file.name + '图片过大，应小于1M');
        } else {
          arrFiles.push(file);
        }
      }
      return arrFiles;
    },
    // 折叠操作
    foldDiv: function(e) {
      var target = e.target;
      if (!$(target).hasClass("up")) {
        $(target).addClass('up');
        $(this.container).find('.upload_main').slideUp();
      } else {
        $(target).removeClass('up');
        $(this.container).find('.upload_main').slideDown();
      }
    },
    onSelect: function(files) {
      var self = this;
      var html = '',
        i = 0;
      var funAppendImage = function() {
        var file = files[i];
        if (file) {
          var reader = new FileReader();
          reader.onload = function(e) {
            var progressCls = file.successStatus ? 'upload-progress success' : 'upload-progress';
            var loaderCls  =  file.successStatus ? 'ajax-loader hidden' : (file.failStatus ?  'ajax-loader upload-fail': 'ajax-loader hidden');

            html += '<li id="uploadList_'+ i +'" class="upload_append_list">'+
                      '<div class="m-layer none" id="m-layer_'+self.containerId+i+'"></div>' + 
                      '<span class="'+loaderCls+'" id="loader_'+self.containerId+i+'"></span>'+
                      '<p>'+
                        '<span href="javascript:void(0)" class="upload_delete" title="删除" data-index="'+ i +'"></span>' +
                        '<i class="'+progressCls+'"></i>' + 
                        '<em>' + 
                          '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" />'+
                        '</em>' + 
                      '</p>'+ 
                      '<a class="filename" title="'+file.name+'">' + file.name + '</a>'+
                    '</li>';
            i++;
            funAppendImage();
          }
          reader.readAsDataURL(file);
        }else {
          $("#preview_"+self.containerId).html(html);
          self.listCls();
        }
      };
      funAppendImage();
    },
    listCls: function() {
      if (this.fileFilter.length > 0) {
        $(this.container).find('.upload_preview').removeClass('none');
        $(this.container).find('.upload_submit').removeClass('none');
      } else {
        $(this.container).find('.upload_preview').addClass('none');
        $(this.container).find('.upload_submit').addClass('none');
      }
    },
    hideProcess: function() {
      if (this.fileFilter.length > 0) {
        for (var i = 0, ilen = this.fileFilter.length; i < ilen; i++) {
          var file = this.fileFilter[i];
          if (file.successStatus) {
            $("#loader_"+this.containerId + i).addClass('hidden');
            $("#m-layer_"+this.containerId + i).addClass('none');
          }
        }
      }
    },
    funGetFiles: function(e) {
      // 文件选择或拖动 需要调用该方法 同时阻止浏览器默认操作(打开该图片操作)
      this.dragHover(e);
      // 获取被选择的文件对象列表
      var files = e.target.files || e.dataTransfer.files;

      // 继续添加文件 调用filter方法
      var files = this.filter(files);
      this.fileFilter = this.fileFilter.concat(files);
      // 选择文件的处理
      this.dealFiles();
      return this;
    },
    // 选择文件的处理
    dealFiles: function() {
      var files = this.fileFilter;
      if (files.length) {
        for(var i = 0, ilen = files.length; i < ilen; i++) {
          // 索引值
          this.fileFilter[i].index = i;
        }
        // 执行选择回调
        this.onSelect(this.fileFilter);
        return this;
      }
    },
    uploadFiles: function() {
      var self = this;
      if (self.fileFilter.length) {
        for(var i = 0, ilen = self.fileFilter.length; i < ilen; i++) {
          var file = self.fileFilter[i];
          if (!file.successStatus) {
            var formdata = new FormData();
            // 上传到服务器的字段名称
            formdata.append(self.fileName, file);
            $("#loader_"+self.containerId +i).removeClass('hidden');
            $("#m-layer_"+self.containerId +i).removeClass('none');
            (function(file){
              /*
              $.ajax({
                url: self.url,
                type: 'POST',
                cache: false,
                data: formdata,
                timeout: 5000,
                //必须false才会避开jQuery对 formdata 的默认处理 
                // XMLHttpRequest会对 formdata 进行正确的处理
                processData: false,
                //必须false才会自动加上正确的Content-Type 
                contentType: false,
                xhrFields: {
                  withCredentials: true
                },
                success: function(data) {
                  //返回的数据格式为 var data = {url: ''};
                  $(self.container).find('#uploadList_'+file.index).addClass('success');
                  $(self.container).find('#uploadList_'+file.index).find('.upload-progress').addClass("success");
                  file.successStatus = 1;
                  file.imgData = data;
                  // 隐藏进度条
                  self.hideProcess();
                  var inputValue = $("#form_"+self.containerId + ' input[type="hidden"]').val();
                  if (inputValue) {
                    inputValue = inputValue + "|" + data.url;
                  } else {
                    inputValue = data.url;
                  }
                  $("#form_"+self.containerId + ' input[type="hidden"]').val(inputValue);
                  self.onSuccess && self.onSuccess(file, data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  $(self.container).find('#uploadList_'+file.index).removeClass('success');
                  file.failStatus = 1;
                  $("#loader_"+self.containerId +file.index).removeClass('hidden').addClass('upload-fail');
                  $("#m-layer_"+self.containerId +file.index).addClass('none');
                  self.onFailure && self.onFailure(file, XMLHttpRequest, textStatus, errorThrown);
                }
              })
              */
              
              // 模拟数据如下：
              setTimeout(function(){
                var data = {url: 'xxxxx'};
                $(self.container).find('#uploadList_'+file.index).addClass('success');
                $(self.container).find('#uploadList_'+file.index).find('.upload-progress').addClass("success");
                file.successStatus = 1;
                file.imgData = data;
                // 隐藏进度条
                self.hideProcess();
                var inputValue = $("#form_"+self.containerId + ' input[type="hidden"]').val();
                if (inputValue) {
                  inputValue = inputValue + "|" + data.url;
                } else {
                  inputValue = data.url;
                }
                $("#form_"+self.containerId + ' input[type="hidden"]').val(inputValue);
                self.onSuccess && self.onSuccess(file, data);
              }, 3000);
              
            })(file);
          }
        }
      }
    },
    // 删除对应的文件
    deleteFile: function(index) {

      // 清空input输入框的值
      $("#form_"+this.containerId + ' input[type="file"]').eq(0).val('');
      $(this.container + " #uploadList_" + index).eq(0).fadeOut();
      // 重新设置隐藏域的值
      this.resetSetValue(index);
      this.listCls();

      // 删除回调
      this.onDelete(index);
      return this;
    },
    indexOf: function(index, arrs){
      if (arrs.length) {
        for (var i = 0, ilen = arrs.length; i < ilen; i++) {
          if (arrs[i].index == index) {
            return i;
          }
        }
      }
      return -1;
    },
    // 重新设置隐藏域的值
    resetSetValue: function(index) {
      var hiddenValues = [];
      var index = this.indexOf(index, this.fileFilter);
      if (index !== -1) {
        this.fileFilter.splice(index, 1);
      }
      if (this.fileFilter.length) {
        for (var j = 0, jlen = this.fileFilter.length; j < jlen; j++) {
          // 判断是否已经上传了
          if (this.fileFilter[j].successStatus) {
            var url = this.fileFilter[j].imgData ? this.fileFilter[j].imgData.url : '';
            hiddenValues.push(url);
          }
        }
      }
      if (hiddenValues.length >= 2) {
        $("#form_"+this.containerId + ' input[type="hidden"]').val(hiddenValues.join(',').replace(/,/g, '|'));
      } else {
        $("#form_"+this.containerId + ' input[type="hidden"]').val(hiddenValues.join(','));
      }
      
    }
 };
 window.UploadImg = UploadImg;

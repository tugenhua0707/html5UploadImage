
function Html5Upload(cfg) {
  this.fileInput = cfg.fileInput || null;           // html file 控件DOM元素
  this.dragDrop = cfg.dragDrop || null;             // 被拖曳的区域
  this.upBotton = cfg.upBotton || null;             // 上传按钮
  this.url = cfg.url || '';                         // 上传地址

  // 上传文件保存后数组
  this.fileFilter = [];

  // 文件被删除后的方法
  this.onDelete = cfg.onDelete || function(){};

  // 文件被拖曳到该区域时的方法
  this.onDragOver = this.dragDrop ? cfg.onDragOver : function(){};

  // 文件离开到敏感区域时
  this.onDragLeave = this.dragDrop ? cfg.onDragLeave : function(){};

  // 文件上传进度
  this.onProgress = cfg.onProgress || function(){};

  // 文件上传成功的回调
  this.onSuccess = cfg.onSuccess || function(){};

  // 文件上传失败后的回调
  this.onFailure = cfg.onFailure || function(){};

  // 文件全部上传完毕时的回调 
  this.onComplete = cfg.onComplete || function(){};

  this.init();
}
$.extend(Html5Upload.prototype, {
  init: function() {
    var self = this;
    if (self.dragDrop) {
      // 在可拖动元素或选取的文本正在拖动到放置目标时触发
      self.dragDrop.addEventListener('dragover', function(e) {
        self.dragHover(e);
      }, false);

      // 在可拖动的元素或选取的文本移出放置目标时触发。
      self.dragDrop.addEventListener('dragleave', function(e) {
        self.dragHover(e);
      }, false);

      // 在可拖动元素或选取的文本放置在目标区域时触发。
      self.dragDrop.addEventListener('drop', function(e) {
        self.funGetFiles(e);
      }, false);
    }
    // 文件选择控件
    if (self.fileInput) {
      self.fileInput.addEventListener('change', function(e) {
        self.funGetFiles(e);
      },false);
    }
    // 上传操作
    if (self.upBotton) {
      self.upBotton.addEventListener('click', function(e) {
        self.uploadFiles(e);
      }, false);
    }
  },
  dragHover: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this[e.type === 'dragover' ? 'onDragOver' : 'onDragLeave'].call(e.target);
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
  onSelect: function(files) {
    var self = this;
    var html = '',
      i = 0;
    var funAppendImage = function() {
      var file = files[i];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          html += '<li id="uploadList_'+ i +'" class="upload_append_list">'+
                    '<p>'+
                      '<span href="javascript:void(0)" class="upload_delete" title="删除" data-index="'+ i +'">x</span>' +
                      '<i class="upload-progress"></i>' + 
                      '<em>' + 
                        '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" />'+
                      '</em>' + 
                    '</p>'+ 
                    '<span class="filename">' + file.name + '</span>'+
                  '</li>';
          i++;
          funAppendImage();
        }
        reader.readAsDataURL(file);
      } else {
        $("#preview").html(html);
        if (html) {
          // 删除操作
          $('.upload_delete').click(function() {
             self.deleteFile(files[parseInt($(this).attr('data-index'))]);
             return;
          });
        }
      }
    };
    funAppendImage();
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
  uploadFiles: function(e) {
    var self = this;
    if (self.fileFilter.length) {
      for(var i = 0, ilen = self.fileFilter.length; i < ilen; i++) {
        var file = self.fileFilter[i];
        if (!file.successStatus) {
          var formdata = new FormData();
          formdata.append('imgFile', file);
          (function(file){
            $('#uploadList_'+file.index).find('.upload-progress').html('上传中...')
            $.ajax({
              url: self.url,
              type: 'POST',
              cache: false,
              data: formdata,
              /*
               * 必须false才会避开jQuery对 formdata 的默认处理 
               * XMLHttpRequest会对 formdata 进行正确的处理 
               */
              processData: false,
              //必须false才会自动加上正确的Content-Type 
              contentType: false,
              xhrFields: {
                withCredentials: true
              },
              success: function(data) {
                $('#uploadList_'+file.index).find('.upload-progress').html('').addClass('success');
                file.successStatus = 1;
                file.imgData = data;
              },
              error: function(error) {
                $('#uploadList_'+file.index).find('.upload-progress').html('上传失败').removeClass('success');
              }
            })
          })(file);
        }
      }
    }
  },
  // 删除对应的文件
  deleteFile: function(file) {
    var arrs = [];
    if (this.fileFilter.length) {
      for (var i = 0, ilen = this.fileFilter.length; i < ilen; i++) {
        var curFile = this.fileFilter[i];
        if (file != curFile) {
          arrs.push(curFile);
        } else {
          this.onDelete(file);
        }
      }
      this.fileFilter = arrs;
    }
    return this;
  }
});

export { Html5Upload };
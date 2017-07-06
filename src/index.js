
import './common/css/upload.styl';


import { Html5Upload } from './common/js/html5Upload.js';
var html5;

var params = {
  fileInput: $('#fileImage')[0],
  dragDrop: $('#fileDragArea')[0],
  upBotton: $('#submit')[0],
  url: '',
  onDelete: function(file) {
    $("#uploadList_" + file.index).eq(0).fadeOut();
  },
  onDragOver: function() {
    $(this).addClass('upload_drag_hover');
  },
  onDragLeave: function() {
    $(this).removeClass('upload_drag_hover');
  },
  onProgress: function(file, loaded, total) {
    var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
    eleProgress.show().html(percent);
  },
  onSuccess: function(file, response) {
    $("#uploadInf").append("<p>上传成功，图片地址是：" + response + "</p>");
  },
  onFailure: function(file) {
    $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");
  },
  onComplete: function() {

    // 成功提示
    $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
  }
};
html5 = new Html5Upload(params);
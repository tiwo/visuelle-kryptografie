'use strict';

(function() {

    var display = new VkDisplay(document.getElementById('display'));
    var body = document.getElementsByTagName('body')[0];
    var dropzone = document.getElementsByTagName('html')[0];


  var handle_dragover = function(ev) {
    ev.preventDefault();
  }

  var handle_drop = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var file;
    var vk;

    if (ev.dataTransfer.items) {
      for (var i=0; i<ev.dataTransfer.items.length; i++) {
        var it = ev.dataTransfer.items[i]
        if (it.kind === 'file') {
          file = it.getAsFile()
          break;
        }
      }
    } else {
      file = dataTransfer.files[0]
      }

    console.log("received file: ",    file);
    if (file) {
      display.clear();
      var _ = loadImage(file, function(img){
        vk = new VisuelleKryptografie(img)
        console.log('vk obj: ', vk);
        display.addCanvas(vk.L);
        display.addCanvas(vk.R);
      })
    }
  }



  dropzone.addEventListener('dragover', handle_dragover, true);
  dropzone.addEventListener('drop', handle_drop, true);

  body.style.backgroundColor = '#ffe';
  dropzone.style.backgroundColor ='#ffe'
})()

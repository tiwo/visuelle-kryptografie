(function() {
  'use strict';

    var display = document.getElementById('display');
    var body = document.getElementsByTagName('body')[0];
    var dropzone = document.getElementsByTagName('html')[0];

    var get_pixel = function(ctx, i, j) {
      var pd = ctx.getImageData(i, j, 1, 1).data;
      var p = (pd[0]+pd[1]+pd[2]) / 3;
      return (p > 127);
    }


    var encrypt_image = function(c0) {

      var chiffre_0 = null;

      var cL = document.createElement('canvas');
      var cR = document.createElement('canvas');
      cL.width = cR.width = 2 * c0.width;
      cL.height = cR.height = 2 * c0.height;
      var p0 = c0.getContext('2d');
      var pL = cL.getContext('2d');
      var pR = cR.getContext('2d');

      pL.fillStyle = pR.fillStyle = "rgba(255,255,255,1.0)"
      pL.fillRect(0, 0, cL.width, cL.height);
      pR.fillRect(0, 0, cR.width, cR.height);
      pL.fillStyle = pR.fillStyle = "rgba(0,0,0,1.0)"

      window.setTimeout(function(){
        for (var i=0; i<c0.width; i++) {
          for (var j=0; j<c0.height; j++) {
            var rnd = Math.random() > .5;
            pL.fillRect(2*i, 2*j+rnd, 1, 1);
            pL.fillRect(2*i+1, 2*j+1-rnd, 1, 1);
            var p = rnd ^ get_pixel(p0, i, j);
            pR.fillRect(2*i, 2*j+p, 1, 1);
            pR.fillRect(2*i+1, 2*j+1-p, 1, 1);
          }
        }
      }, 1);


      window.setTimeout(function(){display.appendChild(cL)}, 500);
      window.setTimeout(function(){cL.classList.add('in')}, 600);
      window.setTimeout(function(){display.appendChild(cR)}, 1500);
      window.setTimeout(function(){cR.classList.add('in')}, 1600);

      console.log(cL);
    }

    var process_image = function(img) {
      var cnv = document.createElement('canvas');
      cnv.width = img.width;
      cnv.height = img.height;
      var ctx = cnv.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      display.appendChild(cnv);
      window.setTimeout(function(){cnv.classList.add('in')}, 250);
      encrypt_image(cnv);
    }




  var handle_dragover = function(ev) {
    ev.preventDefault();
  }

  var empty_display = function() {
    for (var i=0; i<display.children.length; i++) {
      display.children[i].remove();
    }
    return display;
  }

  var handle_drop = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    empty_display();

    var file;

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

    loadImage(file, process_image)
  }



  dropzone.addEventListener('dragover', handle_dragover, true);
  dropzone.addEventListener('drop', handle_drop, true);

  body.style.backgroundColor = '#ffe';
  dropzone.style.backgroundColor ='#ffe'
})()

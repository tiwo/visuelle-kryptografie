'use strict';


class VkDisplay {

  constructor(container) {
    this.container = container;
    this.clear()
  }

  clear() {
    var range = document.createRange()
    range.selectNodeContents(this.container);
    range.deleteContents();
    return this;
  }

  addCanvas(canvas) {
    this.container.appendChild(canvas);
    return this;
  }


}




class VisuelleKryptografie {

  constructor(sourceCanvas) {

    if (sourceCanvas instanceof Image)
    {
      sourceCanvas = VisuelleKryptografie.imgToCanvas(sourceCanvas);
    }

    this.width = sourceCanvas.width;
    this.height = sourceCanvas.height;
    this.source = sourceCanvas;
    this.data = this.readSource(sourceCanvas);
    //this.ctx = sourceCanvas.getContext('2d');

    this.L = VisuelleKryptografie.newCanvas(2*this.width, 2*this.height);
    this.R = VisuelleKryptografie.newCanvas(2*this.width, 2*this.height);

    this.encipher()
  }

  encipher() {
    var w = this.width;
    var h = this.height;
    var Ld = this.L.getContext('2d');
    var Rd = this.R.getContext('2d');

    const alpha = 0;
    var chiffre = [
      new ImageData(new Uint8ClampedArray([0, 0, 0, 255,  255, 255, 255, alpha,  255, 255, 255, alpha,  0, 0, 0, 255]), 2, 2),
      new ImageData(new Uint8ClampedArray([255, 255, 255, alpha,  0, 0, 0, 255,  0, 0, 0, 255,  255, 255, 255, alpha]), 2, 2)
    ];
    //chiffre = [ //debug chiffre
    //  new ImageData(new Uint8ClampedArray([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]), 2, 2),
    //  new ImageData(new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255]), 2, 2),
    //];

    var putChiffre = function(ctx, i, j, pos) {
      //console.log(pos, chiffre[0+pos]);
      ctx.putImageData(chiffre[0+pos], 2*i, 2*j)
    }

    for (var i=0; i<w; i++) {
      for (var j=0; j<h; j++) {
        var pr = (Math.random() > 0.5);
        var pl = 1 ^ pr ^ this.data[i+w*j];
        putChiffre(Ld, i, j, pl);
        putChiffre(Rd, i, j, pr);
      }
    }
    //this.L.getContext('2d').putImageData(Ld, 0, 0);
    //this.R.getContext('2d').putImageData(Rd, 0, 0);
    console.log(this.L.getContext('2d').getImageData(0, 0, 2*w, 2*h));
    return [this.L, this.R];
  }

  static imgToCanvas(img) {
    var cnv = document.createElement('canvas');
    cnv.width = img.width;
    cnv.height = img.height;
    cnv.getContext('2d').drawImage(img, 0, 0);
    return cnv;
  }

  static newCanvas(width, height) {
    var result = document.createElement('canvas');
    result.width = width;
    result.height = height;
    var ctx = result.getContext('2d');
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(0, 0, width, height);
    result.setAttribute('draggable', true);
    return result;


  }

   readSource(sourceCanvas) {
    var data = new Array(this.width * this.height)
    var imageData = sourceCanvas.getContext('2d'
      ).getImageData(0, 0, this.width, this.height).data;
    var p=0;
    for (var k=0; k<=4*this.width*this.height; k+=4) {
      var alpha = imageData[3+k]/255;
      data[p++] = (
        alpha*(imageData[k]+imageData[1+k]+imageData[2+k])/765
        + (1-alpha)) > 0.5;
    }

    return data;
  }



}

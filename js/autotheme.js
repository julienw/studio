/*global Color, ColorThief, MozActivity */

'use strict';

(function(exports) {
  // is autotheming active
  var active;

  Promise.Defer = function() {
    var defer = {};

    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });

    return defer;
  };

  function loadImage(src) {
    var defer = new Promise.Defer();

    var img = new Image();
    img.src = 'img/default_image.jpg';

    if (img.complete) {
      defer.resolve(img);
    } else {
      img.onload = () => defer.resolve(img);
      img.onerror = defer.reject;
    }

    return defer.promise;
  }

  function blobFromURL(src) {
    var defer = Promise.Defer();

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      defer.resolve(xhr.response);
    });
    xhr.addEventListener('error', defer.reject);

    xhr.open('GET', src);
    xhr.responseType = 'blob';
    xhr.send();

    return defer.promise;
  }

  var AutoTheme = exports.AutoTheme = {
    get active() {
      return active;
    },
    set active(bool) {
      active = bool;
      document.body.classList.toggle('has-autotheme', bool);
    },
    elts: {
      button: document.querySelector('.autotheme-pick-image-button'),
      palettes: document.querySelectorAll('.autotheme-palette')
    },

    handleEvent(e) {
      switch(e.type) {
        case 'click':
          this.pickImage()
            .then(this.getPalette.bind(this))
            .then(this.storePalette.bind(this))
            .then(() => this.active = true)
            .then(this.showPalette.bind(this, this.elts.palettes));
          break;
      }
    },

    pickImage() {
      var defer = new Promise.Defer();

      if (window.MozActivity) {
        var activity = new MozActivity({
          name: 'pick',
          date: { type: 'image/*' }
        });

        activity.onsuccess = () => defer.resolve(activity.result.blob);
        activity.onerror = defer.reject;
      } else {
        defer.resolve(blobFromURL('img/default_image.jpg'));
      }

      return defer.promise.then((blob) => {
        this.image = blob;
        return blob;
      });
    },

    getPalette(blob) {
      function imageFromBlob(blob) {
        var blobUrl = window.URL.createObjectURL(blob);
        return loadImage(blobUrl).then((image) => {
          window.URL.revokeObjectURL(image.src);
          return image;
        });
      }

      var defer = new Promise.Defer();

      imageFromBlob(blob).then((image) => {
        var colorThief = new ColorThief();
        var palette = colorThief.getPalette(image, 8);
        defer.resolve(palette);
      });

      return defer.promise;
    },

    storePalette(palette) {
      this.palette = palette.map(Color);
    },

    showPalette(where) {
      where = Array.from(where);
      where.forEach(elt => elt.textContent = '');

      this.palette.forEach((color) => {
        var elt = document.createElement('div');
        elt.className = 'palette-item';
        elt.style.backgroundColor = color.toCSS();
        elt.dataset.color = color.toJSONString();
        where.forEach(where => where.appendChild(elt.cloneNode()));
      });
    },

    clean() {
      this.active = false;
      this.palette = null;
      this.image = null;
    },

    asStorable() {
      return {
        palette: this.palette.map((color) => color.toStorable()),
        image: this.image
      };
    },

    fromStorable(stored) {
      this.palette = stored.palette;
      this.image = stored.image;
      this.showPalette(this.elts.palettes);
    }
  };

  AutoTheme.elts.button.addEventListener('click', AutoTheme);
})(window);

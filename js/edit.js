/*global Color, Navigation, Storage */

(function(exports) {
  'use strict';

  var currentTheme = null;
  var currentSection = null;
  var currentKey = null;

  var Edit = {
    panel: document.getElementById('edit'),
    header: document.querySelector('#edit gaia-header'),
    title: document.querySelector('#edit gaia-header h1'),
    list: document.querySelector('#edit-list'),
    editColor: document.querySelector('#edit-color'),
    picker: document.querySelector('#edit-color gaia-color-picker'),
    iframe: document.querySelector('#edit iframe'),
    autotheme: document.querySelector('#edit-color .autotheme-palette'),

    prepareForDisplay: function(params) {
      currentTheme = params.theme;

      this.title.textContent = params.section;
      this.header.setAttr('action', 'back');

      this.picker.addEventListener('change', this.onPickerChange.bind(this));

      var currentList = this.list.querySelector('gaia-list');
      if (currentList) {
        this.list.removeChild(currentList);
      }

      var list = document.createElement('gaia-list');
      currentSection = currentTheme.sections[params.section];

      this.iframe.src = params.section + '-preview.html';
      this.iframe.onload = () => {
        Object.keys(currentSection).forEach((key) => {
          var body = this.iframe.contentDocument.body;
          body.style.setProperty(key, currentSection[key]);
        });
      };

      Object.keys(currentSection).forEach((key) => {
        var link = document.createElement('a');
        link.classList.add('edit');
        link.dataset.key = key;

        var label = document.createElement('label');
        label.classList.add('l-flex');
        label.classList.add('l-flex-grow');

        var title = document.createElement('h3');
        title.textContent = key;
        label.appendChild(title);

        link.appendChild(label);

        var valueElt = document.createElement('div');
        var value = currentSection[key];
        valueElt.textContent = value;
        valueElt.dataset.id = key;
        valueElt.className = 'palette-item';
        valueElt.style.backgroundColor = value;

        link.appendChild(valueElt);

        list.appendChild(link);
      });

      this.list.appendChild(list);

      return this.panel;
    },

    pick: function(key) {
      currentKey = key;
      this.picker.value = currentSection[key];
      this.editColor.classList.add('editing');
    },

    onPickerChange() {
      if (!currentKey) {
        return;
      }
      var value = this.picker.value;
      this.iframe.contentDocument.body.style.setProperty(currentKey, value);
    }
  };

  Edit.header.addEventListener('action', function(evt) {
    if (evt.detail.type != 'back') {
      return;
    }

    Navigation.pop();
    Edit.iframe.src = '';
  });

  Edit.panel.addEventListener('click', function(evt) {
    var target = evt.target;
    if (!target.classList.contains('edit')) {
      return;
    }

    Edit.pick(target.dataset.key);
  });

  Edit.editColor.addEventListener('click', function(evt) {
    var target = evt.target;
    var value;

    if (target.classList.contains('save')) {
      if (!currentKey) {
        return;
      }

      value = Edit.picker.value;
      currentSection[currentKey] = value;

      var elem = Edit.list.querySelector('[data-id=' + currentKey + ']');
      elem.textContent = value;
      elem.style.backgroundColor = value;

      Storage.updateTheme(currentTheme).then(() => {
        Edit.editColor.classList.remove('editing');
        currentKey = null;
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (!target.classList.contains('cancel')) {
      return;
    }

    if (currentKey) {
      value = currentSection[currentKey];
      Edit.iframe.contentDocument.body.style.setProperty(currentKey, value);
    }

    Edit.editColor.classList.remove('editing');
    currentKey = null;
  });

  Edit.autotheme.addEventListener('click', function(e) {
    if (!e.target.classList.contains('palette-item')) {
      return;
    }

    var color = Color.fromJSONString(e.target.dataset.color);
    Edit.picker.value = color.toHexString();
    Edit.onPickerChange();
  });

  exports.Edit = Edit;
})(window);

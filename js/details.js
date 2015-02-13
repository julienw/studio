/* global
  AutoTheme,
  Edit,
  Generation,
  Main,
  Navigation,
  Storage
*/

(function(exports) {
  'use strict';

  var currentTheme = null;

  var Details = {
    panel: document.getElementById('details'),
    header: document.querySelector('#details gaia-header'),
    title: document.querySelector('#details gaia-header h1'),
    list: document.querySelector('#details gaia-list'),

    prepareForDisplay: function(params) {
      Array.from(this.list.children).forEach((item) => {
        if (!item.classList.contains('static')) {
          item.remove();
        }
      });

      Storage.fetchTheme(params.id).then((theme) => {
        currentTheme = theme;
        this.title.textContent = theme.title;
        this.header.setAttr('action', 'back');

        Object.keys(theme.sections).forEach(function(key) {
          var link = document.createElement('a');
          link.classList.add('navigation');
          link.dataset.section = key;

          var title = document.createElement('h3');
          title.textContent = key;
          link.appendChild(title);

          var forward = document.createElement('i');
          forward.dataset.icon = 'forward-light';
          link.appendChild(forward);

          this.list.appendChild(link);
        }, this);

        var actions = [
          {
            title: 'Install this theme',
            action: 'install'
          },
          {
            title: 'Fork this theme',
            action: 'fork'
          },
          {
            title: 'Remove this theme',
            action: 'remove',
            css: 'destructive'
          }
        ];
        actions.forEach(function(params) {
          var link = document.createElement('a');
          link.classList.add('action');
          link.dataset.action = params.action;
          if (params.css) {
            link.classList.add(params.css);
          }
          var title = document.createElement('h3');
          title.textContent = params.title;
          link.appendChild(title);
          this.list.appendChild(link);
        }, this);
      }).catch(function(error) {
        console.log(error);
      });

      return this.panel;
    },

    installTheme: function() {
      return Generation.installTheme(currentTheme.id);
    },

    forkTheme: function() {
      var title = prompt('Title');
      if (!title) {
        return Promise.resolve();
      }

      return Storage.forkTheme(currentTheme, title);
    },

    removeTheme: function() {
      return Storage.removeTheme(currentTheme.id);
    }
  };

  Details.panel.addEventListener('click', function(evt) {
    var target = evt.target;

    if (target.dataset.action == 'install') {
      target.classList.add('disabled');
      Details.installTheme().then(() => {
        target.classList.remove('disabled');
      }).catch(console.error);
      return;
    }

    if (target.dataset.action == 'fork') {
      Details.forkTheme().then(function() {
        Main.prepareForDisplay();
        Navigation.pop();
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (target.dataset.action == 'remove') {
      Details.removeTheme().then(function() {
        Main.prepareForDisplay();
        Navigation.pop();
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (!target.classList.contains('navigation')) {
      return;
    }

    var targetSection = target.dataset.section;
    Navigation.push(Edit.prepareForDisplay({
      theme: currentTheme,
      section: targetSection
    }));
  });

  Details.header.addEventListener('action', function(evt) {
    if (evt.detail.type != 'back') {
      return;
    }

    AutoTheme.clean();
    Navigation.pop();
  });

  exports.Details = Details;
})(window);

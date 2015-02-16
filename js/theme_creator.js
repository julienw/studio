(function(exports) {
  'use strict';

  const THEME_SOLARIZED_LIGHT = {
    title: 'Solarized Light',
    sections: {
      'Basics': {
        '--background': '#FCF5E4',
        '--text-color': '#6A7A82',
        '--highlight-color': '#3C86CB',
        '--link-color': '#3C86CB',
        '--border-color': '#889426',
        '--button-background': '#F2F0C2',
        '--input-background': '#FCF5E4',
        '--input-color': '#6A7A82',
        '--input-clear-background': '#3C86CB',
      },
      'Header': {
        '--header-background': '#FCF5E4',
        '--header-color': '#6A7A82',
        '--header-icon-color': '#CA9630',
        '--header-button-color': '#CA9630',
        '--header-disabled-button-color': '#BDC3C3',
        '--header-action-button-color': '#CA9630'
      }
    }
  };

  const THEME_SOLARIZED_DARK = {
    title: 'Solarized Dark',
    sections: {
      'Basics': {
        '--background': '#0E2B35',
        '--text-color': '#ffffff',
        '--highlight-color': '#889426',
        '--link-color': '#889426',
        '--border-color': '#C15082',
        '--button-background': '#3C86CB',
        '--input-background': '#0E2B35',
        '--input-color': '#6F8B94',
        '--input-clear-background': '#3C86CB',
      },
      'Header': {
        '--header-background': '#0E2B35',
        '--header-color': '#6F8B94',
        '--header-icon-color': '#C15082',
        '--header-button-color': '#C15082',
        '--header-disabled-button-color': '#BDC3C3',
        '--header-action-button-color': '#C15082'
      }
    }
  };

  const THEME_TEMPLATE = {
    sections: {
      'Basics': {
        '--background': '#ffffff',
        '--text-color': '#4d4d4d',
        '--highlight-color': '#00caf2',
        '--link-color': '#00caf2',
        '--border-color': '#e7e7e7',
        '--button-background': '#f4f4f4',
        '--input-background': '#ffffff',
        '--input-color': '#333333',
        '--input-clear-background': '#909ca7',
      },
      'Header': {
        '--header-background': '#ffffff',
        '--header-color': '#4d4d4d',
        '--header-icon-color': '#4d4d4d',
        '--header-button-color': '#00caf2',
        '--header-disabled-button-color': '#e7e7e7',
        '--header-action-button-color': '#4d4d4d'
      }
    }
  };

  exports.ThemeCreator = {
    template(theme) {
      var result = Object.assign({}, theme);

      for (var key in THEME_TEMPLATE) {
        if (!(key in result)) {
          result[key] = THEME_TEMPLATE[key];
        }
      }
      return result;
    },

    solarized(flavor) {
      switch(flavor) {
        case 'light':
          return THEME_SOLARIZED_LIGHT;
        case 'dark':
          return THEME_SOLARIZED_DARK;
        default:
          throw new Error('Flavor ' + flavor + ' is invalid.');
      }
    }
  };
})(window);

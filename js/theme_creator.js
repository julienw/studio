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
        '--background': 'background',
        '--text-color': 'text',
        '--highlight-color': 'highlight',
        '--link-color': 'highlight',
        '--border-color': 'border',
        '--button-background': 'button',
        '--input-background': 'background',
        '--input-color': 'input',
        '--input-clear-background': 'inputClear',
      },
      'Header': {
        '--header-background': 'background',
        '--header-color': 'header',
        '--header-icon-color': 'headerIcon',
        '--header-button-color': 'headerButton',
        '--header-disabled-button-color': 'headerDisabledButton',
        '--header-action-button-color': 'header'
      }
    }
  };

  const THEME_DEFAULTS = {
    background: '#ffffff',
    text: '#4d4d4d',
    highlight: '#00caf2',
    border: '#e7e7e7',
    button: '#f4f4f4',
    input: '#333333',
    inputClear: '#909ca7',
    header: '#4d4d4d',
    headerButton: '#00caf2',
    headerDisabledButton: '#e7e7e7'
  };

  function replaceThemeTemplate(sections, palette) {
    if (Array.isArray(palette)) {
      var l = palette.length;
      palette = Object.keys(THEME_DEFAULTS).reduce((acc, keyword, i) => {
        acc[keyword] = palette[i % l];
        return acc;
      }, {});
    }

    var result = {};
    Object.keys(sections).forEach(section => {
      result[section] = {};
      Object.keys(sections[section]).forEach(variable => {
        var keyword = sections[section][variable];
        var color = palette[keyword];
        result[section][variable] =
          color ? color.toHexString() : THEME_DEFAULTS[keyword];
      });
    });

    return result;
  }

  exports.ThemeCreator = {
    /**
     * theme is { title, [sessions], [autotheme], [palette] }
     */
    template(theme) {
      var result = Object.assign({}, theme);

      for (var key in THEME_TEMPLATE) {
        if (!(key in result)) {
          if (key === 'sections') {
            result[key] = replaceThemeTemplate(
              THEME_TEMPLATE[key],
              theme.palette || {}
            );
            continue;
          }
          result[key] = THEME_TEMPLATE[key];
        }
      }

      delete result.palette;
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

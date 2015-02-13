/* global
  EventDispatcher,
  Main
 */
(function(exports) {
  'use strict';

  var stack = [Main.prepareForDisplay()];

  var Navigation = {
    push: function(panel) {
      stack[stack.length - 1].classList.add('back');
      panel.classList.remove('next');
      stack.push(panel);
      // TODO wait for transition event
      this.emit('post-navigate');
    },

    pop: function() {
      var toPop = stack.pop();
      toPop.classList.add('next');
      stack[stack.length - 1].classList.remove('back');
      // TODO wait for transition event
      this.emit('post-navigate');
    }
  };

  exports.Navigation = EventDispatcher.mixin(Navigation, ['post-navigate']);
})(window);

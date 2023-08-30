import {iosVhFix} from './utils/ios-vh-fix';
import {Playground} from './modules/playground';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  window.addEventListener('load', () => {
    const playground = new Playground(document.querySelector('.playground'));
    playground.init();
  });
});

// ---------------------------------

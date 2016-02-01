import monkberry from 'monkberry';
import template from './search/results.monk';
import lunr from './lunr';
import './lunr/patch';
import './lunr/ru';

const MAX_RESULTS = 20;

export function search() {
  // DOM Refs
  let button = document.querySelector('[href="#search"]');
  let root = document.querySelector('.js-search');
  let form = root.querySelector('.form');
  let input = form.querySelector('input[type="search"]');

  // View
  monkberry.mount(template);
  let view = monkberry.render('results');
  view.appendTo(form);

  // State
  let state = {
    active: false,
    indexed: false,
    reference: [],
    results: [],
    foundedResults: 0,
    selectedResult: 0,
    lastSearchQuery: ''
  };

  // Index
  let index = lunr(function () {
    this.field('title', {boost: 10});
    this.field('content');
  });

  // Using the russian language extension.
  lunr.ru.call(index);

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.active) {
      hide();
    } else {
      show();
    }
  });

  root.addEventListener('click', () => {
    hide();
  });

  input.addEventListener('keyup', debounce((event) => {
    let query = input.value;

    if (state.lastSearchQuery == query) {
      return;
    }

    if (query < 2) {
      state.results = [];
      state.foundedResults = 0;
      state.selectedResult = 0;
    } else {
      state.results = [];
      let i, refs = index.search(state.lastSearchQuery = query);
      for (i = 0; i < refs.length && i < MAX_RESULTS; i++) {
        state.results.push(state.reference[refs[i].ref]);
      }
      state.foundedResults = i;
      state.selectedResult = 0;
    }

    view.update(state);
  }));

  setInterval(() => {
    console.log('clear');
    if (input.value.length < 2) {
      state.results = [];
      state.foundedResults = 0;
      state.selectedResult = 0;
      view.update(state);
    }
  }, 500);

  form.addEventListener('click', (event) => event.stopPropagation());

  document.addEventListener('keydown', (event) => {
    switch (event.which) {
      case 38: // up
        if (state.selectedResult > 0) {
          state.selectedResult -= 1;
          view.update({selectedResult: state.selectedResult});
        }
        break;

      case 40: // down
        if (state.selectedResult < state.foundedResults) {
          state.selectedResult += 1;
          view.update({selectedResult: state.selectedResult});
        }
        break;

      case 9: // tab
        state.selectedResult = 0;
        view.update({selectedResult: state.selectedResult});
        return;

      case 13: // enter
        let link = form.querySelector('a:nth-child(' + state.selectedResult + ')');
        if (link) {
          window.location.href = link.getAttribute('href');
        } else {
          return; // no link selected, but maybe active with tab.
        }
        break;

      case 27: // esc
        hide();
        break;

      default:
        return; // exit this handler for other keys
    }

    event.stopImmediatePropagation();
    event.preventDefault();
  });

  // -------- |\
  // Function ||
  // -------- |/

  function show() {
    button.classList.add('active');
    root.classList.add('active');
    document.body.style.overflow = 'hidden';
    state.active = true;
    focus();

    if (!state.indexed) {
      populateIndex();
    }
  }

  function hide() {
    button.classList.remove('active');
    root.classList.remove('active');
    document.body.style.overflow = 'auto';
    state.active = false;
  }

  function focus() {
    input.focus();
  }

  function populateIndex() {
    state.indexed = true;
    var script = document.createElement('script');
    script.setAttribute('src', '/index.js');
    document.body.appendChild(script);
  }

  window.indexCallback = function indexCallback(data) {
    state.reference = data;
    state.reference.forEach((obj) => {
      index.add(obj);
    });
  };

  function debounce(fn) {
    let timeout;
    return function () {
      let args = Array.prototype.slice.call(arguments),
        ctx = this;

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(ctx, args)
      }, 100);
    }
  }
}
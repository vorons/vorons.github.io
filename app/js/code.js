import hljs from 'highlight.js';

export function highlightCodeBlocks() {
  let blocks = document.querySelectorAll('pre code[class*="language-"]');

  // For local development.
  if (window.location.port == 4000) {
    blocks = document.querySelectorAll('pre code');
  }

  for (let i = 0; i < blocks.length; i++) {
    hljs.highlightBlock(blocks[i]);
  }
}

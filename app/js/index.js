import FastClick from 'fastclick';
import { highlightCodeBlocks } from './code';
import { search } from './search';

FastClick.attach(document.body);
highlightCodeBlocks();
search();

import $ from 'jquery';

declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}

export {};
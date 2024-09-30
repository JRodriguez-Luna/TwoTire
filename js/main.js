'use strict';
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
if (!HTMLDialogElement.prototype.showModal) {
  console.warn('Browser does not support dialog.showModal');
}
$openModal?.addEventListener('click', () => {
  console.log('Button clicked!');
  $dialog?.showModal();
});
$dismissModal?.addEventListener('click', () => {
  console.log('Dialog dismissed!');
  $dialog?.close();
});

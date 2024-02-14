/**
 * @copyright Ayush Agarwal
 */

'use strict';


import {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable
} from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";

const /** {HTMLElement} */ $sidebar = document.querySelector('[data-sidebar]');
const /** {Array<HTMLElement>} */ $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const /** {HTMLElement} */ $overlay = document.querySelector('[data-sidebar-overlay]');

addEventOnElements($sidebarTogglers, 'click', function () {
  $sidebar.classList.toggle('active');
  $overlay.classList.toggle('active');
});

const /** {Array<HTMLElement>} */ $tooltipElems = document.querySelectorAll('[data-tooltip]');
$tooltipElems.forEach($elem => Tooltip($elem));

const /** {HTMLElement} */ $greetElem = document.querySelector('[data-greeting]');
const /** {number} */ currentHour = new Date().getHours();
$greetElem.textContent = getGreetingMsg(currentHour);


const /** {HTMLElement} */ $currentDateElem = document.querySelector('[data-current-date]');
$currentDateElem.textContent = new Date().toDateString().replace(' ', ', ');

const /** {HTMLElement} */ $sidebarList = document.querySelector('[data-sidebar-list]');
const /** {HTMLElement} */ $addNotebookBtn = document.querySelector('[data-add-notebook]');


const showNotebookField = function () {
  const /** {HTMLElement} */ $navItem = document.createElement('div');
  $navItem.classList.add('nav-item');

  $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field></span>

    <div class="state-layer"></div>
  `;

  $sidebarList.appendChild($navItem);

  const /** {HTMLElement} */ $navItemField = $navItem.querySelector('[data-notebook-field]');
  activeNotebook.call($navItem);
  makeElemEditable($navItemField);
  $navItemField.addEventListener('keydown', createNotebook);
}

$addNotebookBtn.addEventListener('click', showNotebookField);


/**
 * Create new notebook
 * Creates a new notebook when the 'Enter' key is pressed while editing a notebook name field.
 * The new notebook is stored in the database.
 * 
 * @param {KeyboardEvent} event - The keyboard event that triggered notebook creation.
 */
const createNotebook = function (event) {

  if (event.key === 'Enter') {
    const /** {Object} */ notebookData = db.post.notebook(this.textContent || 'Untitled'); // this: $navItemField
    this.parentElement.remove();
    client.notebook.create(notebookData);

  }

}

const renderExistedNotebook = function () {
  const /** {Array} */ notebookList = db.get.notebook();
  client.notebook.read(notebookList);
}

renderExistedNotebook();


const /** {Array<HTMLElement>} */ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

addEventOnElements($noteCreateBtns, 'click', function () {
  const /** {Object} */ modal = NoteModal();
  modal.open();
  modal.onSubmit(noteObj => {
    const /** {string} */ activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;

    const /** {Object} */ noteData = db.post.note(activeNotebookId, noteObj);
    client.note.create(noteData);
    modal.close();
  })
});
const renderExistedNote = function () {
  const /** {string | undefined} */ activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

  if (activeNotebookId) {
    const /** {Array<Object>} */ noteList = db.get.note(activeNotebookId);
    client.note.read(noteList);
  }
}

renderExistedNote();
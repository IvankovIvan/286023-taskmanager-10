import {createElement} from '../utils.js';

const createTasksTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Tasks {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTasksTemplate();
  }

  getElement() {
    this._element = createElement(this.getTemplate());

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

}
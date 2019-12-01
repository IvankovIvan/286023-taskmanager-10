import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskTemplate} from './components/task.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';

const TASK_COUNT = 22;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

/* const createArray = (count, element) => {
  new Array(count).fill(``)
    .forEach(() => render(element, createTaskTemplate(), `beforeend`));
};*/

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElemant = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElemant, createSiteMenuTemplate(), `beforeend`);

const filter = generateFilters();
render(siteMainElement, createFilterTemplate(filter), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);
tasks.slice(1).forEach((task) => render(taskListElement
    , createTaskTemplate(task), `beforeend`));

// createArray(TASK_COUNT, taskListElement);

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

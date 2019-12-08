//import {createSiteMenuTemplate} from './components/site-menu.js';
import SiteMenuComponent from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskTemplate} from './components/task.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {TASK_COUNT, SHOWING_TASKS_COUNT_BY_BUTTON,
  SHOWING_TASKS_COUNT_ON_START} from './const.js';
import {RenderPosition, renderElement} from './utils.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const clickButtonLoadMore = (element, showingTasksCount,
    taskListElement, tasks) => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task),
        `beforeend`));

  if (showingTasksCount >= tasks.length) {
    element.remove();
  }
  return showingTasksCount;
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

// render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
renderElement(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);

const filter = generateFilters();
render(siteMainElement, createFilterTemplate(filter), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement
    , createTaskTemplate(task), `beforeend`));

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

const loadMoreButton = boardElement.querySelector(`.load-more`);
loadMoreButton
  .addEventListener(`click`, () => {
    showingTasksCount = clickButtonLoadMore(loadMoreButton,
        showingTasksCount, taskListElement, tasks);
  });

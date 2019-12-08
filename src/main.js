import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import TaskComponent from './components/task.js';
import TaskEditComponent from './components/task-edit.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {TASK_COUNT, SHOWING_TASKS_COUNT_BY_BUTTON,
  SHOWING_TASKS_COUNT_ON_START} from './const.js';
import {RenderPosition, renderElement} from './utils.js';

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const editButton = taskComponent.getElement()
    .querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    taskListElement
      .replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  });

  const editForm = taskEditComponent.getElement()
    .querySelector(`form`);
  editForm.addEventListener(`click`, () => {
    taskListElement
      .replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  renderElement(taskListElement, taskComponent.getElement(),
      RenderPosition.BEFOREEND);
};

const clickButtonLoadMore = (element, showingTasksCount,
    taskListElement, tasks) => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(task));

  if (showingTasksCount >= tasks.length) {
    element.getElement().remove();
    element.removeElement();
  }
  return showingTasksCount;
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuComponent().getElement(),
    RenderPosition.BEFOREEND);

const filter = generateFilters();
renderElement(siteMainElement, new FilterComponent(filter).getElement(),
    RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
renderElement(siteMainElement, boardComponent.getElement(),
    RenderPosition.BEFOREEND);

const taskListElement = boardComponent.getElement()
  .querySelector(`.board__tasks`);

const tasks = generateTasks(TASK_COUNT);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(0, showingTasksCount)
  .forEach((task) => renderTask(task));

const loadMoreButtonComponent = new LoadMoreButtonComponent();
renderElement(boardComponent.getElement(), loadMoreButtonComponent.getElement(),
    RenderPosition.BEFOREEND);

loadMoreButtonComponent.getElement()
  .addEventListener(`click`, () => {
    showingTasksCount = clickButtonLoadMore(loadMoreButtonComponent,
        showingTasksCount, taskListElement, tasks);
  });

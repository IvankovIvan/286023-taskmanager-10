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

const clickButtonLoadMore = (element, showingTasksCount,
    taskListElement, tasks) => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderElement(taskListElement,
        new TaskComponent(task).getElement(),
        RenderPosition.BEFOREEND));

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

renderElement(taskListElement, new TaskEditComponent(tasks[0]).getElement(),
    RenderPosition.BEFOREEND);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(1, showingTasksCount)
  .forEach((task) => renderElement(taskListElement,
      new TaskComponent(task).getElement(),
      RenderPosition.BEFOREEND));

const loadMoreButtonComponent = new LoadMoreButtonComponent();
renderElement(boardComponent.getElement(), loadMoreButtonComponent.getElement(),
    RenderPosition.BEFOREEND);

loadMoreButtonComponent.getElement()
  .addEventListener(`click`, () => {
    showingTasksCount = clickButtonLoadMore(loadMoreButtonComponent,
        showingTasksCount, taskListElement, tasks);
  });

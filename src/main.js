import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import SortComponent from './components/sort.js';
import TaskComponent from './components/task.js';
import TasksComponent from './components/tasks.js';
import NoTasksComponent from './components/no-tasks.js';
import TaskEditComponent from './components/task-edit.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {TASK_COUNT, SHOWING_TASKS_COUNT_BY_BUTTON,
  SHOWING_TASKS_COUNT_ON_START} from './const.js';
import {RenderPosition, renderElement} from './utils.js';

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceEditToTask = () => {
    taskListElement
      .replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    taskListElement
      .replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const editButton = taskComponent.getElement()
    .querySelector(`.card__btn--edit`);

  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editForm = taskEditComponent.getElement()
    .querySelector(`form`);
  editForm.addEventListener(`click`, () => replaceEditToTask);

  renderElement(taskListElement, taskComponent.getElement(),
      RenderPosition.BEFOREEND);
};

const clickButtonLoadMore = (element, showingTasksCount,
    taskListElement, tasks) => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

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

const tasks = generateTasks(TASK_COUNT);
const isAllTasksArchived = tasks.every((task) => task.isArchive);
if (isAllTasksArchived) {
  renderElement(boardComponent.getElement(),
      new NoTasksComponent().getElement(),
      RenderPosition.BEFOREEND);
} else {
  renderElement(boardComponent.getElement(), new SortComponent().getElement(),
      RenderPosition.BEFOREEND);
  renderElement(boardComponent.getElement(), new TasksComponent().getElement(),
      RenderPosition.BEFOREEND);

  const taskListElement =
    boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  renderElement(boardComponent.getElement(),
      loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement()
    .addEventListener(`click`, () => {
      showingTasksCount = clickButtonLoadMore(loadMoreButtonComponent,
          showingTasksCount, taskListElement, tasks);
    });
}

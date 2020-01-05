import LoadMoreButtonComponent from '../components/load-more-button.js';
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import TasksComponent from '../components/tasks.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoTasksComponent from '../components/no-tasks.js';
import {SHOWING_TASKS_COUNT_BY_BUTTON,
  SHOWING_TASKS_COUNT_ON_START} from '../const.js';
import {RenderPosition, removeComponent,
  replace, renderComponents} from "../utils/renderComponents";

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler(replaceEditToTask());

  renderComponents(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();
    const taskListElement = this._tasksComponent.getElement();
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      renderComponents(container, this._loadMoreButtonComponent,
          RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

        renderTask(taskListElement, tasks.slice(prevTasksCount,
            showingTasksCount));

        if (showingTasksCount >= tasks.length) {
          removeComponent(this._loadMoreButtonComponent);
        }
      });
    };

    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      renderComponents(container, this._noTasksComponent,
          RenderPosition.BEFOREEND);
      return;
    }

    renderComponents(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponents(container, this._tasksComponent, RenderPosition.BEFOREEND);

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
        default:
          sortedTasks = tasks.slice(0, showingTasksCount);
          break;
      }

      taskListElement.innerHTML = ``;
      renderTasks(taskListElement, sortedTasks);

      if (sortType === SortType.DEFAULT) {
        renderLoadMoreButton();
      } else {
        removeComponent(this._loadMoreButtonComponent);
      }
    });
  }
}

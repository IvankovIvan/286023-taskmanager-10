import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {TASK_COUNT} from './const.js';
import {RenderPosition, renderComponents} from './utils/renderComponents.js';

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderComponents(siteHeaderElement, new SiteMenuComponent(),
    RenderPosition.BEFOREEND);

const filter = generateFilters();
renderComponents(siteMainElement, new FilterComponent(filter),
    RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
renderComponents(siteMainElement, boardComponent,
    RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const boardController = new BoardController(boardComponent);
boardController.render(tasks);

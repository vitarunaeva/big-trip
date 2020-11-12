import StatisticsView from '../view/statistics.js';
import {render, remove} from '../utils/render.js';
import {RenderPosition, TabNavItem} from '../const.js';

export default class Statistics {
  constructor(statisticsContainer, pointsModel, menuModel) {
    this._statisticsContainer = statisticsContainer;
    this._pointsModel = pointsModel;
    this._menuModel = menuModel;

    this._statisticsComponent = null;

    this._handleMenuEvent = this._handleMenuEvent.bind(this);
  }

  init() {
    this._menuModel.addObserver(this._handleMenuEvent);
  }

  _renderStatistics() {
    if (this._statisticsComponent) {
      return;
    }

    this._statisticsComponent = new StatisticsView(this._pointsModel.get());
    render(this._statisticsContainer, this._statisticsComponent, RenderPosition.BEFOREBEGIN);
  }

  destroy() {
    if (this._statisticsComponent === null) {
      return;
    }

    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }

  _handleMenuEvent(_event, menuItem) {
    switch (menuItem) {
      case TabNavItem.STATISTICS.toLowerCase():
        this._renderStatistics();
        break;
      default:
        this.destroy();
        break;
    }
  }
}

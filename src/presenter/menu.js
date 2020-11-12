import FilterPresenter from '../presenter/filter.js';
import MenuView from '../view/menu.js';
import EventAddButtonView from '../view/add-button';
import {render} from '../utils/render.js';
import {UpdateType, RenderPosition, MenuItem, FilterType} from '../const.js';

export default class Menu {
  constructor(menuContainer, newPointModel, menuModel, filterModel, pointsModel) {
    this._menuContainer = menuContainer;
    this._newPointModel = newPointModel;
    this._menuModel = menuModel;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._controlsContainer = this._menuContainer.querySelector(`.trip-controls`);
    this._tripConntrolsTitle = this._controlsContainer.querySelector(`h2`);

    this._tabsComponent = null;
    this._buttonAddComponent = null;

    this._filterPresenter = new FilterPresenter(this._controlsContainer, filterModel, pointsModel);

    this._handleMenuClick = this._handleMenuClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePointsModelEvent = this._handlePointsModelEvent.bind(this);

    this._newPointModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handlePointsModelEvent);
  }

  init() {
    this._tabsComponent = new MenuView(this._menuModel.get());
    render(this._tripConntrolsTitle, this._tabsComponent, RenderPosition.AFTEREND);

    this._buttonAddComponent = new EventAddButtonView();
    render(this._menuContainer, this._buttonAddComponent);

    this._tabsComponent.setMenuClickHandler(this._handleMenuClick);
    this._buttonAddComponent.setButtonClickHandler(this._handleMenuClick);

    this._filterPresenter.init();
  }

  _handleModelEvent(event, payload) {
    if (event === UpdateType.MAJOR) {
      const isNewPointActive = payload !== null;
      this._buttonAddComponent.setDisabledButton(isNewPointActive);
    }
  }

  _handleMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.ADD_NEW_EVENT:
        this._setActiveMenuItem(MenuItem.TABLE);
        this._filterPresenter.init();
        this._newPointModel.set(UpdateType.MAJOR, menuItem);
        break;
      case MenuItem.TABLE.toLowerCase():
        this._setActiveMenuItem(menuItem);
        this._filterPresenter.init();
        break;
      case MenuItem.STATISTICS.toLowerCase():
        this._setActiveMenuItem(menuItem);
        this._filterPresenter.destroy();
        break;
    }
  }

  _setActiveMenuItem(tab) {
    if (this._filterModel.get() !== FilterType.EVERYTHING) {
      this._filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    }

    if (this._menuModel.get().toLowerCase() === tab.toLowerCase()) {
      return;
    }

    this._menuModel.set(UpdateType.MAJOR, tab);
    this._tabsComponent.setActiveTab(tab);
  }

  _handlePointsModelEvent(event) {
    if (event === UpdateType.INIT) {
      this._filterPresenter.init();
    }
  }
}

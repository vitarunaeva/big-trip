import EventEditorView from "../view/event-editor";
import EventView from "../view/event";
import {PointMode, UserAction, UpdateType, State} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editorComponent = null;
    this._mode = PointMode.DEFAULT;

    this._replacePointToEditor = this._replacePointToEditor.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this.replaceEditFormToPoint = this.replaceEditFormToPoint.bind(this);
  }

  init(tripEvent, destinations, tripOffers) {
    this._tripEvent = tripEvent;

    const prevPointComponent = this._pointComponent;
    const prevEditorComponent = this._editorComponent;

    this._pointComponent = new EventView(this._tripEvent);
    this._editorComponent = new EventEditorView(destinations, tripOffers, this._tripEvent);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editorComponent.setCancelClickHandler(this._handleCancelClick);
    this._editorComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editorComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEditorComponent === null) {
      render(this._pointContainer, this._pointComponent);
      return;
    }

    if (this._mode === PointMode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === PointMode.EDITING) {
      replace(this._pointComponent, prevEditorComponent);
      this._mode = PointMode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditorComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editorComponent);
  }

  resetView() {
    if (this._mode !== PointMode.DEFAULT) {
      this.replaceEditFormToPoint();
    }
  }

  replaceEditFormToPoint() {
    if (this._mode !== PointMode.EDITING) {
      return;
    }
    replace(this._pointComponent, this._editorComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = PointMode.DEFAULT;
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editorComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._editorComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._editorComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTED:
        this._pointComponent.shake(resetFormState);
        this._editorComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToEditor() {
    replace(this._editorComponent, this._pointComponent);
    this._editorComponent.setDatePickers();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = PointMode.EDITING;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editorComponent.reset();
      this.replaceEditFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToEditor();
  }

  _handleCancelClick() {
    this._editorComponent.reset();
    this.replaceEditFormToPoint();
  }

  _handleDeleteClick() {
    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, this._tripEvent);
  }

  _handleFavoriteClick(updatedPoint) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
  }
}

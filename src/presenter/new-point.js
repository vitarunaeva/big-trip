import EventEditorView from '../view/event-editor.js';
import {remove, render} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../const.js';

export default class NewPoint {
  constructor(pointContainer, newPointModel, changeData) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;

    this._editorComponent = null;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(destinations, tripOffers) {
    if (this._editorComponent !== null) {
      return;
    }

    this._editorComponent = new EventEditorView(destinations, tripOffers);

    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editorComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._editorComponent.setDatePickers();

    render(this._pointContainer, this._editorComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    if (this._editorComponent === null) {
      return;
    }

    remove(this._editorComponent);
    this._editorComponent = null;

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
  }

  setAborting() {
    const resetFormState = () => {
      this._editorComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this._editorComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

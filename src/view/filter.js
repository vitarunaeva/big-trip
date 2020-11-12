import AbstractView from './abstract.js';

const createFilterItemTemplate = (title, currentFilterType, isFilteredTaskExist) => {
  return (
    `<div class="trip-filters__filter">
        <input id="filter-${title}" type="radio" name="trip-filter"
          class="trip-filters__filter-input  visually-hidden"
          value="${title}"
          ${ currentFilterType === title ? `checked` : ``}
          ${isFilteredTaskExist ? `` : `disabled`}
        >
        <label for="filter-${title}"
          class="trip-filters__filter-label  ${isFilteredTaskExist ? `` : `trip-filters__filter-label--empty`}"
        >
          ${title}
        </label>
      </div>`
  );
};

const createFilterTemplate = (currentFilterType, filters) => {
  const filterItemsTemplate = Object
    .entries(filters)
    .map(([filterTitle, isFilteredTaskExist]) => createFilterItemTemplate(filterTitle, currentFilterType, isFilteredTaskExist))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor(currentFilterType, filters) {
    super();

    this._currentFilter = currentFilterType;
    this._filters = filters;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createFilterTemplate(this._currentFilter, this._filters);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

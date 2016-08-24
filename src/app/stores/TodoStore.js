import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TODO_CONSTANTS from '../constants/TodoConstants';
import {Store} from './Store';

let _todos = {};

class TodoStoreHelper {
  /**
   * Create a TODO item.
   * @param {string} text The content of the TODO
   * @return {void}
   */
  static create(text) {
    // Using the current timestamp + random number in place of a real id.
    let id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _todos[id] = {
      id: id,
      complete: false,
      text: text
    };
  }

  /**
   * Update a TODO item.
   * @param {string} id TODO item id
   * @param {object} updates An object literal containing only the data to be updated.
   * @return {void}
   */
  static update(id, updates) {
    _todos[id] = assign({}, _todos[id], updates);
  }

  /**
   * Update all of the TODO items with the same object.
   * @param {object} updates An object literal containing only the data to be updated.
   * @return {void}
   */
  static updateAll(updates) {
    for (let id in _todos) {
      this.update(id, updates);
    }
  }

  /**
   * Delete a TODO item.
   * @param {string} id TODO item id
   * @return {void}
   */
  static destroy(id) {
    delete _todos[id];
  }

  /**
   * Delete all the completed TODO items.
   * @return {void}
   */
  static destroyCompleted() {
    for (let id in _todos) {
      if (_todos[id].complete) {
        this.destroy(id);
      }
    }
  }
}

class TodoStore extends Store {
  /**
   * constructor
   */
  constructor() {
    super('todo-change');
  }

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean} true if all TODO items are marked as completed.
   */
  areAllComplete() {
    for (let id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get the entire collection of TODOs.
   * @return {object} TODO list
   */
  getAll() {
    return _todos;
  }
}

// Register callback to handle all updates
const todoStore = new TodoStore();
todoStore.dispatchToken = AppDispatcher.register(action => {
  let text;

  switch (action.actionType) {
    case TODO_CONSTANTS.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        TodoStoreHelper.create(text);
        todoStore.emitChange();
      }
      break;

    case TODO_CONSTANTS.TODO_TOGGLE_COMPLETE_ALL:
      if (todoStore.areAllComplete()) {
        TodoStoreHelper.updateAll({complete: false});
      } else {
        TodoStoreHelper.updateAll({complete: true});
      }
      todoStore.emitChange();
      break;

    case TODO_CONSTANTS.TODO_UNDO_COMPLETE:
      TodoStoreHelper.update(action.id, {complete: false});
      todoStore.emitChange();
      break;

    case TODO_CONSTANTS.TODO_COMPLETE:
      TodoStoreHelper.update(action.id, {complete: true});
      todoStore.emitChange();
      break;

    case TODO_CONSTANTS.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        TodoStoreHelper.update(action.id, {text: text});
        todoStore.emitChange();
      }
      break;

    case TODO_CONSTANTS.TODO_DESTROY:
      TodoStoreHelper.destroy(action.id);
      todoStore.emitChange();
      break;

    case TODO_CONSTANTS.TODO_DESTROY_COMPLETED:
      TodoStoreHelper.destroyCompleted();
      todoStore.emitChange();
      break;
    default:
    // do nothing
  }
});
export default todoStore;

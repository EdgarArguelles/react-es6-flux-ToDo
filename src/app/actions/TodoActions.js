import AppDispatcher from '../dispatcher/AppDispatcher';
import TODO_CONSTANTS from '../constants/TodoConstants';

export class TodoActions {
  /**
   * Create a new ToDo
   * @param {string} text content of new ToDo
   * @return {void}
   */
  static create(text) {
    AppDispatcher.dispatch({
      actionType: TODO_CONSTANTS.TODO_CREATE,
      text: text
    });
  }

  /**
   * Update a ToDo
   * @param {string} id The ID of the ToDo item
   * @param {string} text new value
   * @return {void}
   */
  static updateText(id, text) {
    AppDispatcher.dispatch({
      actionType: TODO_CONSTANTS.TODO_UPDATE_TEXT,
      id: id,
      text: text
    });
  }

  /**
   * Toggle whether a single ToDo is complete
   * @param {object} todo ToDo to be toggled
   * @return {void}
   */
  static toggleComplete(todo) {
    let id = todo.id;
    let actionType = todo.complete ?
      TODO_CONSTANTS.TODO_UNDO_COMPLETE :
      TODO_CONSTANTS.TODO_COMPLETE;

    AppDispatcher.dispatch({
      actionType: actionType,
      id: id
    });
  }

  /**
   * Mark all ToDos as complete
   * @return {void}
   */
  static toggleCompleteAll() {
    AppDispatcher.dispatch({
      actionType: TODO_CONSTANTS.TODO_TOGGLE_COMPLETE_ALL
    });
  }

  /**
   * @param {string} id The ID of the ToDo item
   * @return {void}
   */
  static destroy(id) {
    AppDispatcher.dispatch({
      actionType: TODO_CONSTANTS.TODO_DESTROY,
      id: id
    });
  }

  /**
   * Delete all the completed ToDos
   * @return {void}
   */
  static destroyCompleted() {
    AppDispatcher.dispatch({
      actionType: TODO_CONSTANTS.TODO_DESTROY_COMPLETED
    });
  }
}

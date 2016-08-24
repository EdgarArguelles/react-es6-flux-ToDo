import EventEmitter from 'events';

let CHANGE_EVENT;

export class Store extends EventEmitter {
  /**
   * Avoid to create a Store instances directly
   * @param {string} changeEvent event that classes which extends will emit
   */
  constructor(changeEvent) {
    super();
    if (this.constructor === Store) {
      throw new TypeError('Can not create a Store instances directly.');
    }

    CHANGE_EVENT = changeEvent;
  }

  /**
   * Emit a CHANGE_EVENT
   * @return {void}
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * Add a callback to CHANGE_EVENT
   * @param {function} callback function that will be added to CHANGE_EVENT listener
   * @return {void}
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Remove a callback from CHANGE_EVENT
   * @param {function} callback function that will be removed from CHANGE_EVENT listener
   * @return {void}
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

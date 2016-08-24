jest.dontMock('../constants/TodoConstants');
jest.dontMock('./Store');
jest.dontMock('./TodoStore');
jest.dontMock('object-assign');
jest.dontMock('keymirror');

describe('TodoStore', () => {
  let TODO_CONSTANTS = require('../constants/TodoConstants').default;
  let AppDispatcher;
  let TodoStore;
  let callback;

  // mock actions
  let actionTodoCreate = {
    actionType: TODO_CONSTANTS.TODO_CREATE,
    text: 'foo'
  };

  beforeEach(() => {
    AppDispatcher = require('../dispatcher/AppDispatcher').default;
    TodoStore = require('./TodoStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('should registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  describe('Via Public', () => {
    beforeEach(() => {
      for (let i = 0; i < 2; i++) {
        callback(actionTodoCreate);
      }
    });

    it('should initialize with 2 to-do items', () => {
      expect(Object.keys(TodoStore.getAll()).length).toBe(2);
    });

    it('should determine whether all to-do items are complete', () => {
      expect(TodoStore.areAllComplete()).toBe(false);

      callback({
        actionType: TODO_CONSTANTS.TODO_TOGGLE_COMPLETE_ALL
      });

      expect(TodoStore.areAllComplete()).toBe(true);
    });
  });

  describe('Via Dispatcher', () => {
    let all;
    let keys;

    beforeEach(() => {
      for (let i = 0; i < 3; i++) {
        callback(actionTodoCreate);
      }

      all = TodoStore.getAll();
      keys = Object.keys(all);
    });

    it('should do TODO_CREATE action', () => {
      expect(keys.length).toBe(3);
      expect(all[keys[0]].text).toEqual('foo');
    });

    it('should do TODO_TOGGLE_COMPLETE_ALL action', () => {
      expect(TodoStore.areAllComplete()).toBe(false);

      callback({
        actionType: TODO_CONSTANTS.TODO_TOGGLE_COMPLETE_ALL
      });

      expect(TodoStore.areAllComplete()).toBe(true);

      callback({
        actionType: TODO_CONSTANTS.TODO_TOGGLE_COMPLETE_ALL
      });

      expect(TodoStore.areAllComplete()).toBe(false);
    });

    it('should do TODO_COMPLETE and TODO_UNDO_COMPLETE action', () => {
      callback({
        actionType: TODO_CONSTANTS.TODO_COMPLETE,
        id: keys[0]
      });

      all = TodoStore.getAll();
      keys = Object.keys(all);
      expect(all[keys[0]].complete).toBe(true);

      callback({
        actionType: TODO_CONSTANTS.TODO_UNDO_COMPLETE,
        id: keys[0]
      });

      all = TodoStore.getAll();
      keys = Object.keys(all);
      expect(all[keys[0]].complete).toBe(false);
    });

    it('should do TODO_UPDATE_TEXT action', () => {
      let text = 'new text';
      callback({
        actionType: TODO_CONSTANTS.TODO_UPDATE_TEXT,
        id: keys[0],
        text: text
      });

      all = TodoStore.getAll();
      keys = Object.keys(all);
      expect(all[keys[0]].text).toBe(text);
    });

    it('should do TODO_DESTROY action', () => {
      callback({
        actionType: TODO_CONSTANTS.TODO_DESTROY,
        id: keys[0]
      });

      all = TodoStore.getAll();
      keys = Object.keys(all);
      expect(keys.length).toBe(2);
    });

    it('should do TODO_DESTROY_COMPLETED action', () => {
      callback({
        actionType: TODO_CONSTANTS.TODO_COMPLETE,
        id: keys[0]
      });
      callback({
        actionType: TODO_CONSTANTS.TODO_COMPLETE,
        id: keys[1]
      });
      callback({
        actionType: TODO_CONSTANTS.TODO_DESTROY_COMPLETED
      });

      all = TodoStore.getAll();
      keys = Object.keys(all);
      expect(keys.length).toBe(1);
    });
  });
});

import {Dispatcher} from 'flux';

class AppDispatcher extends Dispatcher {
  handleViewAction(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }

  handleServerAction(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }
}

const appDispatcher = new AppDispatcher();
export default appDispatcher;

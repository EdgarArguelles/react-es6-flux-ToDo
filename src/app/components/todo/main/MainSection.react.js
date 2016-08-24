import React from 'react';

import {TodoActions} from '../../../actions/TodoActions';
import {TodoItem} from '../item/TodoItem.react';

export class MainSection extends React.Component {
  _onToggleCompleteAll() {
    TodoActions.toggleCompleteAll();
  }

  render() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    let allTodos = this.props.allTodos;
    let todos = [];

    for (let key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]}/>);
    }

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  }
}

MainSection.propTypes = {
  allTodos: React.PropTypes.object.isRequired,
  areAllComplete: React.PropTypes.bool.isRequired
};

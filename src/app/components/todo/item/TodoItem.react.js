import React from 'react';

import {TodoActions} from '../../../actions/TodoActions';
import {TodoTextInput} from '../text_input/TodoTextInput.react';

export class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
    this._onToggleComplete = this._onToggleComplete.bind(this);
    this._onDoubleClick = this._onDoubleClick.bind(this);
    this._onSave = this._onSave.bind(this);
    this._onDestroyClick = this._onDestroyClick.bind(this);
  }

  _onToggleComplete() {
    TodoActions.toggleComplete(this.props.todo);
  }

  _onDoubleClick() {
    this.setState({isEditing: true});
  }

  _onSave(text) {
    TodoActions.updateText(this.props.todo.id, text);
    this.setState({isEditing: false});
  }

  _onDestroyClick() {
    TodoActions.destroy(this.props.todo.id);
  }

  render() {
    let todo = this.props.todo;

    let input;
    if (this.state.isEditing) {
      input = (
        <TodoTextInput
          className="edit"
          onSave={this._onSave}
          value={todo.text}
        />
      );
    }

    let currentClassName = '';
    if (todo.complete) {
      currentClassName = 'completed';
    } else if (this.state.isEditing) {
      currentClassName = 'editing';
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <li
        className={currentClassName}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={this._onDestroyClick}/>
        </div>
        {input}
      </li>
    );
  }
}

TodoItem.propTypes = {
  todo: React.PropTypes.object.isRequired
};

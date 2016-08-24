import React from 'react';

import {TodoActions} from '../../../actions/TodoActions';
import {TodoTextInput} from '../text_input/TodoTextInput.react';

export class Header extends React.Component {
  _onSave(text) {
    if (text.trim()) {
      TodoActions.create(text);
    }
  }

  render() {
    return (
      <header id="header">
        <h1>TODOS</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  }
}

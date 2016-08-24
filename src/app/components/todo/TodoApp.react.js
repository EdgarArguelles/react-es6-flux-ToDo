import React from 'react';

import TodoStore from '../../stores/TodoStore';
import {Header} from './header/Header.react';
import {MainSection} from './main/MainSection.react';
import {Footer} from './footer/Footer.react';

export class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getTodoState();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    TodoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    TodoStore.removeChangeListener(this._onChange);
  }

  _getTodoState() {
    return {
      allTodos: TodoStore.getAll(),
      areAllComplete: TodoStore.areAllComplete()
    };
  }

  _onChange() {
    this.setState(this._getTodoState());
  }

  render() {
    return (
      <div id="todoapp">
        <Header />
        <MainSection
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
        <Footer allTodos={this.state.allTodos}/>
      </div>
    );
  }
}

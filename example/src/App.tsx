import React from 'react';
import { connect } from 'react-redux';

import { RootState } from './store';
import { socket } from './red-sock';

import './App.css';

const mapStateToProps = ({ countReducer }: RootState) => ({
  count: countReducer,
});

type Props = ReturnType<typeof mapStateToProps>;

const App: React.FC<Props> = props => {
  return (
    <div className="App">
      <h1>Wello !</h1>
      <h1>Count: {props.count}</h1>
      <button
        onClick={() => {
          socket.emit('activate_increment');
        }}
      >
        Activate auto Increment !
      </button>
      <button
        onClick={() => {
          socket.emit('activate_decrement');
        }}
      >
        Activate auto Decrement !
      </button>
    </div>
  );
};

export default connect(mapStateToProps)(App);

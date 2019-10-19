import React from 'react';
import './App.scss';

import Board from './components/Board';
function App() {
  return (
    <div className="rapid-react-task-manager">
      <div className="top-bar">
        <h1>Not Trello</h1>
      </div>
      <Board />
    </div>
  );
}

export default App;

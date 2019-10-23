import React from 'react';

import { connect } from 'react-redux';

import Board from './components/Board';
import ModalWrapper from './components/ModalWrapper';
import CardDetail from './components/CardDetail';

function App(props) {

  return (
    <div className="rapid-react-task-manager">
      <div className="top-bar">
        <h1>Not Trello</h1>
        {props.modal.modal === true ? (
          <ModalWrapper>
            <CardDetail />
          </ModalWrapper>
        ) : (
          null
        )}

      </div>
      <Board />

    </div>
  );
}
// passing the entire state
const mapStateToProps = state => ({
  modal: state.modal
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(App);

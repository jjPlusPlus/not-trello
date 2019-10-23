import React from 'react';
import { connect } from 'react-redux';

import { saveCard, closeModal } from '../actions';

function ModalWrapper(props) {
  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-content">
          {props.children}
        </div>
        <div className="modal-actions">
          <p>{props.card.name}</p>
          {/*<button onClick={() => props.save()}>Save</button>*/}
          <button onClick={() => props.closeModal()}>Close</button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  card: state.cards.card
});

const mapDispatchToProps = (dispatch) => ({
  // save: () => dispatch(saveCard()),
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrapper);

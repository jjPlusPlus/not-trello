import React from 'react';
import { connect } from 'react-redux';

import { closeModal } from '../actions';

import { AnyAction, Dispatch } from "redux";

interface ModalWrapperProps {
  closeModal: any;
  children: any;
}

function ModalWrapper(props: ModalWrapperProps) {
  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white p-6 w-10/12 md:max-w-2xl lg:max-w-4xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content">
          {props.children}
        </div>
        <div className="modal-actions flex items-center justify-center pt-4 mt-4 border-t border-gray-300">
          {/*<button onClick={() => props.save()}>Save</button>*/}
          <button 
            className="rounded-sm bg-white px-4 py-2 border border-teal-300 text-teal-600 hover:bg-teal-100"
            onClick={() => props.closeModal()}
          >
              Close
          </button>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  // save: () => dispatch(saveCard()),
  closeModal: () => dispatch(closeModal())
});

export default connect(null, mapDispatchToProps)(ModalWrapper);

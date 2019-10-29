import React from "react";

import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";

import Board from "./components/Board";
import ModalWrapper from "./components/ModalWrapper";

import CardDetail from "./components/CardDetail";

import { newColumn } from "./actions";

import { AppState } from "./types";

interface DispatchProps {
  newColumn: () => void;
  modal: boolean;
}

const App: React.FunctionComponent<DispatchProps> = (props) => {
  return (
    <div className="not-trello">
      <div className="top-bar p-4 fixed w-full bg-purple-800 text-yellow-400 flex flex-row items-center shadow-2xl">
        <h1 className="text-4xl flex-grow">Not Trello</h1>
        <button onClick={props.newColumn}>ADD COLUMN</button>
      </div>
      {props.modal === true ? (
        <ModalWrapper>
          <CardDetail />
        </ModalWrapper>
      ) : (
        null
      )}
      <Board />

    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  newColumn: () => dispatch(newColumn()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

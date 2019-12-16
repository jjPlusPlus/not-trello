import React from "react";

import { connect } from "react-redux";
// import { AnyAction, Dispatch } from "redux";

import Board from "./components/Board";
import ModalWrapper from "./components/ModalWrapper";
import Home from "./components/pages/Home";

import CardDetail from "./components/CardDetail";
import TopBar from "./components/TopBar";

// import { AppState } from "./types";

import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

// interface DispatchProps {
//   newColumn: () => void;
//   modal: boolean;
//   firebase: any;
// }

const App = (props) => {

// const App: React.FunctionComponent<DispatchProps> = (props) => {
  return (
    <div className="not-trello">
      
      <Router>
        <TopBar />
        <div className="not-trello--content h-full">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/board/:id" component={Board} />
            <Redirect to="/" />
          </Switch>
        </div>
        {props.modal === true ? (
          <ModalWrapper>
            <CardDetail />
          </ModalWrapper>
        ) : (
          null
        )}
      </Router>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modal: state.local.modal,
});

export default connect(mapStateToProps)(App);

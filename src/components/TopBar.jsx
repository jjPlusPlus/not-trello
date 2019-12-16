import React, { useCallback } from "react";

import { newColumn } from "../actions";
import { connect } from "react-redux";

import { withRouter, useRouteMatch, useLocation, Link } from "react-router-dom";

import { firebaseConnect } from "react-redux-firebase";

import { compose } from "recompose";

import { pathToRegexp } from "path-to-regexp";

/* Persistent top bar; Has controls for the board if auth'd (add column), board selection, and admin ctrl  */
const TopBar = (props) => {
  const location = useLocation().pathname;
  const isBoard = useRouteMatch("/board");
 
  // get board name
  let boardId = "";
  let isOwner = false;

  const updateBoard = useCallback((event) => {
    props.history.push("/board/" + event.target.value);
  }, [props.history]);

  const logout = useCallback(() => {
    props.firebase.logout();
    props.history.push("/")
  }, [props.firebase, props.history]);

  if (!props.boards) { return <div>Loading</div> }

  if (isBoard) {
    var keys = [];
    const regex = pathToRegexp("/board/:id", keys);
    const result = regex.exec(location);
    boardId = result[1];
    isOwner = props.boards[boardId].owner === props.auth.email;
  }

  const authIsEmpty = props.auth.isEmpty;
  const authIsLoaded = props.auth.isLoaded;
  const isAuth = authIsLoaded && !authIsEmpty;

  const myBoards = props.boards ? Object.keys(props.boards).filter((b) => {
    return props.boards[b].owner === props.auth.email;
  }) : [];

  return (
    <div className="top-bar p-4 fixed w-full bg-purple-800 text-yellow-400 flex flex-row items-center shadow-2xl">
      <div className="flex-grow">
        <Link to="/">
          <h1 className="text-4xl">Not Trello</h1>
        </Link>
      </div>
      
        {isBoard ? (
          <div className="flex flex-row">
            {isAuth ? (
              <div className="relative">
                <select
                  className="block cursor-pointer appearance-none w-full bg-transparent border border-yellow-400 text-lg text-yellow-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-purple-700 focus:border-purple-200"
                  value={boardId}
                  onChange={updateBoard}
                >
                  {myBoards && myBoards.map((b) => {
                    return (
                      <option value={b}>{props.boards[b].name}</option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            ): ( null )}
            { isOwner ? (
              <button className="border border-yellow-400 ml-2 mr-2 py-2 px-4 rounded leading-tight" onClick={() => props.newColumn(props.location.pathname)}>ADD COLUMN</button>
            ): (null)}
          </div>
        ) : (
          null
        )}
        {isAuth ? (
        <button className="border border-purple-400 text-purple-400 py-2 px-4 rounded leading-tight" onClick={() => logout()}>Sign Out</button>
        ) : ( 
          null 
        )}
        
        
      
    </div>
  )
}


const mapDispatchToProps = (dispatch) => ({
  newColumn: (board) => dispatch(newColumn(board)),
});
export default compose(
  firebaseConnect(() => [
    "boards",
  ]),
  connect((state) => ({
    auth: state.firebase.auth,
    boards: state.firebase.data.boards,
  }), mapDispatchToProps), 
  withRouter
)(TopBar);

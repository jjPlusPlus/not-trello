import React, { useState, useEffect, useCallback } from "react";

import { newColumn } from "../actions";
import { connect, useSelector } from "react-redux";
import { withRouter, useRouteMatch, useLocation, Link } from "react-router-dom";
import { firebaseConnect, useFirebase } from "react-redux-firebase";
import firebase from "firebase/app";
import { compose } from "recompose";
import { pathToRegexp } from "path-to-regexp";

import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TopBar = (props) => {

  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [editorSearchInput, setEditorSearchInput] = useState("");
  const [viewerSearchInput, setViewerSearchInput] = useState("");
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);
  const [board, setBoard] = useState(null)
  const [editors, setEditors] = useState([])
  const [boardId, setBoardId] = useState(null)
  const [isOwner, setIsOwner] = useState(null)

  const location = useLocation().pathname;
  const isBoard = useRouteMatch("/board");

  useEffect(() => {
    if (!props.boards || !boardId) { return }
    const board = props.boards[boardId]
    setBoard(board)
  }, [boardId])

  useEffect(() => {
    if (!board || !board.editors) { return }
    setEditors(Object.keys(board.editors).map(e => { 
      return {
        ...board.editors[e],
        id: e
      }
    }))
  }, [board, props.boards])

  if (isBoard) {
    var keys = [];
    const regex = pathToRegexp("/board/:id", keys);
    const result = regex.exec(location);

    if (!boardId) { setBoardId(result[1]); }
    if (props.boards[result[1]].owner === props.auth.email && isOwner === null) {
      setIsOwner(true);
    }
  }

  const users = useSelector(state => {
    return state.firebase.data['users']
  })

  useEffect(() => {
    if (!editorSearchInput || !editorSearchInput.length) { return setAutoCompleteResults([])}

    const userKeys = Object.keys(users);
    const convertedUsers = userKeys.map((user, index) => {
      const u = users[user]
      u.id = user;
      return u;
    });

    const matches = convertedUsers.filter(user => {
      if (user.email === props.boards[boardId].owner) {
        return
      }

      if (editors && editors.map(e => e.email).includes(user.email) ) {
        return
      }

      const regex = new RegExp(editorSearchInput,'gi');
      return user.username.match(regex);
    });

    setAutoCompleteResults(matches)
  }, [editorSearchInput])

  const createBoard = useCallback(() => {
    const newBoardName = prompt('new board name')

    if (!newBoardName) {
      return
    }
    if (newBoardName.length == 0) {
      return alert('invalid board name');
    }
    const newBoard = {
      name: newBoardName,
      description: "",
      owner: props.auth.email
    };

    props.firebase.push("boards", newBoard)
      .then(result => {
        console.log('board created');
      }).catch(error => {
        console.log(error);
        alert("Failed to create the board");
      });
    return;
  }, [props.auth.email, props.firebase]);

  const addUserAsEditor = (user) => {
    firebase.ref(`boards/${boardId}/editors`).push(user)
  }

  const updateBoard = useCallback((event) => {
    props.history.push("/board/" + event.target.value);
  }, [props.history]);

  const logout = useCallback(() => {
    props.firebase.logout();
    props.history.push("/")
  }, [props.firebase, props.history]);

  if (!props.boards) { return <div>Loading</div> }

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
            <div className="relative mr-2">
              <select
                className="block cursor-pointer appearance-none w-full bg-transparent border border-yellow-400 text-sm text-yellow-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-purple-700 focus:border-purple-200"
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
            <>
              <button className="text-sm border border-yellow-400 mr-2 py-2 px-4 rounded leading-tight" onClick={() => props.newColumn(props.location.pathname)}>Add Column</button>
              <button className="text-sm border border-yellow-400 mr-2 py-2 px-4 rounded leading-tight" onClick={() => setShowBoardSettings(true)}>Board Settings</button>
            </>
          ): (null)}
        </div>
      ) : (
        null
      )}
      {isAuth ? (
        <>
          <button className="text-sm border border-black bg-yellow-400 text-black mr-2 py-2 px-4 rounded leading-tight" onClick={createBoard}>New Board</button>
          <button className="text-sm border border-purple-400 text-purple-400 py-2 px-4 rounded leading-tight" onClick={() => logout()}>Sign Out</button>
        </>
      ) : ( 
        null 
      )}

      {showBoardSettings && (
        <div className="fixed z-50 inset-0 overflow-hidden flex">
          <div className="fixed inset-0 bg-black opacity-25" onClick={() => setShowBoardSettings(false)}></div>
          <div className="relative overflow-auto min-h-0 flex-grow">
            <div className="flex items-center justify-center min-h-full">
              <div className="bg-white text-black text-sm rounded m-2 w-full max-w-lg">
                <div className="flex flex-row p-5">
                  <h1 className="flex-grow text-4xl">Board Settings</h1>
                  <button className="text-red-500" onClick={() => setShowBoardSettings(false)}>Close</button>
                </div>
                <div className="p-5 pt-0">
                  <h2 className="text-2xl bg-purple-500 px-4 mb-4 inline-block" style={{transform: "skew(-10deg)"}}>Access</h2>
                  <h3 className="text-lg">Editors</h3>
                  <p className="pt-2">these users have permission to edit this board</p>
                  <div className="py-3">
                    {editors.map(e => (
                      <div>
                        <p className="text-purple-500">{e.username}</p>
                      </div>
                    ))}
                  </div>

                  <input 
                    type="text" 
                    name="editor" 
                    className="text-input border p-2 w-full"
                    placeholder="Search for a user by username" 
                    value={editorSearchInput} 
                    onChange={event => { console.log(event.target.value); setEditorSearchInput(event.target.value) }} 
                  />
                  <div className="relative w-full">
                    {autoCompleteResults.length ? (
                      <ul className="bg-white shadow-lg border rounded absolute top-0 z-10 w-full">
                        {autoCompleteResults.map(result => (
                          <li 
                            className="flex flex-row px-1 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                            onClick={() => addUserAsEditor(result)}
                          >
                            <p className="text-sm flex-1">{result.username}</p>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  

                  <hr  className="my-5" />

                  <h2 className="text-2xl bg-yellow-400 px-4 mb-4 inline-block" style={{transform: "skew(-10deg)"}}>Board Status</h2>
                  <p>Board deletion is permanent! Once you delete your board, you will not be able to recover your data.</p>
                  <button className="border-2 border-red-500 text-red-500 my-5 block py-2 px-6" onClick={() => console.log('prompt for board name to verify like github')}>Delete Board</button>
                  
                  <strong>Activate 'public access' for this board</strong>
                  <p className="text-gray-500">To Do: Public access on/off pill selector</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    "users"
  ]),
  connect((state) => ({
    auth: state.firebase.auth,
    boards: state.firebase.data.boards,
    users: state.firebase.data.users
  }), mapDispatchToProps), 
  withRouter
)(TopBar);

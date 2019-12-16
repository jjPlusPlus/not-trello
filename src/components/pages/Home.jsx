import React, { useState, useCallback } from "react";

import SignInForm from "../firebase/SignInForm";

import { firebaseConnect } from "react-redux-firebase";

import { connect } from "react-redux";

import { compose } from "recompose";

import { Link } from "react-router-dom";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = (props) => {
  const [showNewBoardForm, toggleNewBoardForm] = useState(false);
  const [newBoardName, updateNewBoardName] = useState("");

  const createBoard = useCallback(() => {
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
  }, [newBoardName, props.auth.email, props.firebase]);

  const logout = useCallback(() => {
    props.firebase.logout();
  }, [props.firebase]);

  const authIsEmpty = props.auth.isEmpty;
  const authIsLoaded = props.auth.isLoaded;
  const isAuth = authIsLoaded && !authIsEmpty;

  const myBoards = props.boards ? Object.keys(props.boards).filter((b) => {
    return props.boards[b].owner === props.auth.email; 
  }) : [];

  const publicBoards = props.boards ? Object.keys(props.boards).filter((b) => {
    const boardObj = props.boards[b];
    const isPublic = boardObj.public;
    const notOwnedByMe = props.boards[b].owner !== props.auth.email;
    return isPublic && notOwnedByMe;
  }) : [];

  return (
    <div className="w-full h-full bg-white p-8">

      <header className="w-full bg-gray-300 p-4 flex flex-row flex-center">
        <h1 className="text-4xl flex flex-1">Really Noice "Not Trello" Graphic In here</h1>
        <section className="flex flex-1 flex-col max-w-lg">
          { isAuth ? (
            <div>
              <h1 className="text-4xl">Welcome, {props.profile.username} ! </h1>
              <button className="" onClick={() => logout()}>Sign Out</button>
            </div>
          ) : (
            <SignInForm />
          )}
        </section>
      </header>

      <section className="flex flex-row">
        <div className="w-1/2 p-4">
          <h2 className="text-3xl ">Public Boards</h2>
          <p>A list of boards that have Public Access turned on</p>
          {props.boards && publicBoards.length ? (
            <ul>
              {publicBoards.map((board, index) => {
                const b = props.boards[board];
                return (
                  <li key={index} className="border p-2">
                    <Link to={"/board/" + board}>
                      {b.name} {b.lastupdated}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div>
              <p>There are no public boards available.</p>
            </div>
          )}
        </div>
        {isAuth ? (
          <div className="w-1/2 p-4">
            <h2 className="text-3xl">My Boards</h2>
            <p>Your Boards</p>
            {props.boards ? (
              <ul>
                {myBoards.map((board, index) => {
                  const b = props.boards[board];
                  return (
                    <li key={index} className="border p-2">
                      <Link to={"/board/" + board}>
                        {b.name} {b.lastupdated}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div>
                <p>You don't haz any boards yet.</p>
              </div>
            )}
          </div>
         ) : ( null )}
      </section>

      {isAuth ? (
        <section className="p-4">
          {showNewBoardForm ? (
            <div>
              <label htmlFor="newBoardName">New Board Name:</label>
              <input className="text-input" type="text" name="newBoardName" value={newBoardName} onChange={(e) => updateNewBoardName(e.target.value)} />
              <button onClick={() => createBoard()}>Create</button>
            </div>
          ) : (
              <div>
                <button onClick={() => toggleNewBoardForm(true)}>New Board</button>
              </div>
            )
          }
        </section>
      ) : null }

      <section className="p-4">
        <h2 className="text-3xl">About Not Trello</h2>
        <p>An image, and a blurb about how the project is basically Trello</p>
        <p>A note about open-sourcing project management</p>
        <p>A link to Github and a plug for hiring me.</p>
        <p>You can also view the project on &nbsp;
          <a className="text-purple-600" href="https://www.github.com/jjplusplus/not-trello" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} /> Github
          </a>.
        </p>
      </section>
    </div>
  );
};

const enhance = compose(
  firebaseConnect(props => [
    // { path: '/boards', queryParams: ['orderByChild=owner', `equalTo=${props.auth.email}`] }
    // { path: '/boards', queryParams: ['orderByChild=owner', `equalTo=justinjcode@gmail.com`] }
    "boards"
  ]),
  connect(
    (state) => ({
      boards: state.firebase.data.boards,
      auth: state.firebase.auth,
      profile: state.firebase.profile
    })
  )
);

export default enhance(Home);

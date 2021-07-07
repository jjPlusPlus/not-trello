import React, { useState, useCallback } from "react";

import SignInForm from "../firebase/SignInForm";

import { firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Link } from "react-router-dom";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = (props) => {

  const createBoard = useCallback(() => {
    const newBoardName = prompt('new board name')

    if (!newBoardName || newBoardName.length == 0) {
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

  const logout = useCallback(() => {
    props.firebase.logout();
  }, [props.firebase]);

  const authIsEmpty = props.auth.isEmpty;
  const authIsLoaded = props.auth.isLoaded;
  const isAuth = authIsLoaded && !authIsEmpty;

  const myBoards = props.boards ? Object.keys(props.boards).filter((b) => {
    return props.boards[b].owner === props.auth.email; 
  }) : [];

  const editorBoards = props.boards ? Object.keys(props.boards).filter((b) => {
    const editors = props.boards[b].editors && Object.keys(props.boards[b].editors).map(key => props.boards[b].editors[key])
    return editors && editors.map(e => e.email).includes(props.auth.email); 
  }) : [];

  const publicBoards = props.boards ? Object.keys(props.boards).filter((b) => {
    const boardObj = props.boards[b];
    const isPublic = boardObj.public;
    const notOwnedByMe = props.boards[b].owner !== props.auth.email;
    return isPublic && notOwnedByMe;
  }) : [];

  return (
    <div className="w-full h-full p-8">

      <header className="w-full pb-8 flex flex-row flex-center">
        <div className="w-3/5">
          <img src='not-trellosvg.svg' />
        </div>
        <section className="flex flex-1 p-5 mx-5 flex-col max-w-lg bg-yellow-400  w-2/5">
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
        <div className="w-1/2 p-4 border-2 border-yellow-400 mr-2">
          <h2 className="text-3xl bg-yellow-400 px-4 py-2 inline-block" style={{transform: "skew(-10deg)"}}>Public Boards</h2>
          <p className="py-5">These boards have Public Access activated with limited editing capablity.</p>
          {props.boards && publicBoards.length ? (
            <ul>
              {publicBoards.map((board, index) => {
                const b = props.boards[board];
                return (
                  
                    <Link to={"/board/" + board}>
                      <li key={index} className="border bg-white p-2">
                        {b.name} {b.lastupdated}
                      </li>
                    </Link>
                  
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
          <div className="w-1/2 p-4 border-2 border-purple-500 ml-2">
            <h2 className="text-3xl bg-purple-500 px-4 py-2 inline-block" style={{transform: "skew(-10deg)"}}>My Boards</h2>
            {myBoards && myBoards.length ? (
              <ul className="py-5">
                {myBoards.map((board, index) => {
                  const b = props.boards[board];
                  return (
                    <Link to={"/board/" + board}>
                      <li key={index} className="border p-2 bg-white">
                        {b.name} {b.lastupdated}
                      </li>
                    </Link>  
                  )
                })}
              </ul>
            ) : (
              <div className="text-center py-5">
                <p className="py-2">You don't haz any boards yet.</p>
                <button className="button bg-black text-yellow-400 px-4 py-2 mx-auto text-center submit-button" style={{transform: "skew(-10deg)"}} onClick={createBoard}>Create Your First Board</button>
              </div>
            )}
            {editorBoards && editorBoards.length ? (
              <>
                <p>You are en editor on these boards:</p>
                <ul className="py-5">
                  {editorBoards.map((board, index) => {
                    const b = props.boards[board];
                    return (
                      <Link to={"/board/" + board}>
                        <li key={index} className="border p-2 bg-white">
                          {b.name} {b.lastupdated}
                        </li>
                      </Link>  
                    )
                  })}
                </ul>
              </>
            ) : null }
          </div>
         ) : ( 
           <div className="w-1/2 p-4 border-2 border-purple-500">
            <h2 className="text-3xl bg-purple-500 px-4 py-2 inline-block" style={{transform: "skew(-10deg)"}}>Your Boards</h2>
            <p className="py-5 text-center italic">Sign in to see your boards</p>
          </div>  
         )}
      </section>

      <section className="px-4 pb-10 my-10">
        <h2 className="text-3xl">About Not Trello</h2>
        <p>This is an open source project that is absolutely <i>not</i> Trello (although it is inspired by Trello).</p>
        <p>
          You can find the the Github repository for this project
          <a target="_blank" className="text-purple-500" href="https://github.com/jjPlusPlus/not-trello" >
            &nbsp;<FontAwesomeIcon icon={faGithub} /> here
          </a>
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

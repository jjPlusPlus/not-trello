import React, { Component } from "react";

import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "recompose";
import { AnyAction, Dispatch } from "redux";

import { AppState, Card } from "../types";

import { removeCard, updateCard } from "../actions";

import RemoveButton from "./buttons/RemoveButton";
import EditableField from "./EditableField";

import ReactMarkdown from "react-markdown";

import Moment from "react-moment";

import { pathToRegexp } from "path-to-regexp";

import { useLocation } from "react-router-dom";

interface CardDetailProps {
  columns: any;
  detail: any;
  updateCard: any;
  removeCard: any;
  boards: any;
  match: any;
  location: any;
}
interface CardDetailState {
  showPreview: boolean;
}

class CardDetail extends Component<CardDetailProps, CardDetailState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showPreview: true,
    };
  }
  public handleInputChange = (board: any, column: any, card: any, field: any, value: any) => {
    this.props.updateCard(board, column, card, field, value);
  }
  public handleMarkdownChange = (board: any, column: any, card: any, event: any) => {
    this.props.updateCard(board, column, card, "description", event.target.value);
  }

  public render() {
    const { detail } = this.props;

    // get the current board from the path
    let boardId = "";
    const location = useLocation().pathname;
    const keys: any = [];
    const regex = pathToRegexp("/board/:id", keys);
    const result = regex.exec(location) || [];
    boardId = result[1];

    if (!boardId) { return (<div>Board Error: Could not parse Board ID from the Route. </div>); }

    const boards = this.props.boards;
    const board = boards[boardId];

    if (!board) { return (<div className="card-detail">Error: Board not found</div>); }

    // get the current column from the board
    const column = board.columns[detail.column];
    if (!column) { return (<div className="card-detail">Error: Column not found</div>); }
    column.cards = column.cards || {}; // null-safe against the column not having cards yet
    const card = column.cards[detail.card];
    if (!card) { return (<div className="card-detail">Error: Card not found</div>); }

    // preemptively convert card.activity to an array if it isn't one already
    card.activity = card.activity || {};
    if (card.activity !== typeof Array) {
      // convert to an array
      const activityKeys = Object.keys(card.activity);
      card.activity = activityKeys.map((a: any, index) => {
        const entry: any = card.activity[a];
        entry.id = a;
        return entry;
      });
    }

    return (
      <div className="card-detail">
        <div className="flex flex-row">
          <div className="flex-1">
            <EditableField
              element="h3"
              inputType="input"
              updateInput={(value: any) => this.handleInputChange(boardId, detail.column, detail.card, "name", value)}
              field={card.name}
              extraClasses="text-2xl underline"
              extraInputClasses="text-2xl card-title-input"
            />
          </div>
          <RemoveButton action={() => this.props.removeCard(boardId, card.column, card.id, card.name)}/>
        </div>

        <div className="w-full pt-4">
          { this.state.showPreview
            ? <div>
                <p className="text-gray-600 text-lg pb-2">
                  Description
                  <span className="px-2 underline text-teal-600"
                        onClick={() => this.setState({showPreview: !this.state.showPreview})}
                  >
                    Edit
                  </span>
                </p>
                <ReactMarkdown className="w-full border rounded-sm p-2 border-gray-200" source={card.description}/>
              </div>
            : (
              <div>
                <textarea
                  className="w-full h-80 p-2 rounded-lg border border-gray-500"
                  name="description"
                  value={card.description}
                  rows={14}
                  onChange={(event) => this.handleMarkdownChange(boardId, detail.column, detail.card, event)}
                />
                <button
                  className="rounded-sm bg-teal-500 px-4 py-2 border-teal-100 text-white hover:bg-teal-800"
                  onClick={() => this.setState({showPreview: !this.state.showPreview})}
                >
                  Close
                </button>
              </div>
            )
          }
        </div>

        <p className="text-gray-600 text-lg pt-4">Activity:</p>
        <hr />
        {
          card.activity && card.activity.map((activity: any, index: any) => {
            return (
              <p className="text-sm text-gray-700 py-2" key={index}>
                {activity.label} <Moment format="YYYY-MM-DD HH:mm">{activity.timestamp}</Moment>
              </p>
            );
          })
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateCard: (board: any, column: any, card: any, field: any, value: any) =>
    dispatch(updateCard(board, column, card, field, value)),
  removeCard: (boardId: string, columnId: string, cardId: string, name: string) =>
    dispatch(removeCard(boardId, columnId, cardId, name)),
});

const enhance = compose(
  firebaseConnect(() => [
    "boards",
  ]),
  connect(
    (state: AppState) => ({
      detail: state.local.detail,
      boards: state.firebase.data.boards,
    }),
    mapDispatchToProps,
  ),
  withRouter,
);

export default enhance(CardDetail);

import React, { Component } from "react";

import Card from "./Card";

import { AnyAction, Dispatch } from "redux";

import AddButton from "./buttons/AddButton";
import MoveButton from "./buttons/MoveButton";
import RemoveButton from "./buttons/RemoveButton";

import { connect } from "react-redux";
import { moveColumn, newCard, removeColumn } from "../actions";

import { Draggable } from "react-beautiful-dnd";

interface ColumnProps {
  column: any;
  key: any;
  moveColumn: any;
  removeColumn: any;
  newCard: any;
  children: any;
}

class Column extends Component<ColumnProps> {
  public render() {
    const { column } = this.props;
    return (
      <div className="bg-gray-400">
        <header className="flex flex-row items-center text-white bg-black">
          <MoveButton direction="left" extraClasses="p-2" action={() => this.props.moveColumn(column, "left")}/>
          <h2 className="flex-1 p-2 text-lg">{column.title}</h2>
          <RemoveButton action={() => this.props.removeColumn(column)}/>
          <MoveButton direction="right" extraClasses="p-2" action={() => this.props.moveColumn(column, "right")}/>
        </header>

        <div className="p-2">
          { column.cards
            ? column.cards.map((card: any, index: number, id: string) => {
                return (
                  <Draggable key={index} index={index} draggableId={card.id}>
                    {(provided) => (
                      <div ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card key={index} card={card} />
                      </div>
                    )}
                  </Draggable>
                )
              })
            : <div>
                <h3>No cards yet</h3>
              </div>
          }
          <AddButton extraClasses="w-full" action={() => this.props.newCard(column.id)}/>
        </div>

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  moveColumn: (column: any, direction: string) => dispatch(moveColumn(column, direction)),
  newCard: (column: string) => dispatch(newCard(column)),
  removeColumn: (column: string) => dispatch(removeColumn(column)),
});

export default connect(null, mapDispatchToProps)(Column);

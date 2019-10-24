import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateCard, removeCard } from '../actions';

import RemoveButton from './buttons/RemoveButton';
import EditableField from './EditableField';

import ReactMarkdown from 'react-markdown';

import Moment from 'react-moment';

class CardDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPreview: true,
    }
  }
  handleInputChange = (field, value) => {
    this.props.updateCard(this.props.detail, field, value);
  }
  handleMarkdownChange = (event) => {
    this.props.updateCard(this.props.detail, "description", event.target.value);
  }

  render() {
    const { columns, detail } = this.props;

    // targeting columns[column].cards[card]
    let column = columns.filter(c => {
      return c.id === detail.column;
    });

    if (!column[0]) { return (<div className="card-detail">Error: Column not found</div>) }

    let card = column[0].cards.filter( c => {
      return c.id === detail.card;
    });

    if (!card[0]) { return (<div className="card-detail">Error: Card not found</div>) }

    card = card[0];

    return (
      <div className="card-detail">
        <div className="flex flex-row">
          <div className="flex-1">
            <EditableField
              element="h3"
              inputType="input"
              updateInput={(value) => this.handleInputChange("name", value)}
              field={card.name}
              extraClasses="text-2xl underline"
              extraInputClasses="text-2xl card-title-input"
            />
          </div>
          <RemoveButton action={() => this.props.removeCard(card)}/>
        </div>

        <div className="w-full pt-4">
          { this.state.showPreview
            ? <div>
                <p className="text-gray-600 text-lg pb-2">
                  Description
                  <span className="px-2 underline text-teal-600" onClick={() => this.setState({"showPreview": !this.state.showPreview})}>
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
                  onChange={(event) => this.handleMarkdownChange(event)}
                />
                <button className="rounded-sm bg-teal-500 px-4 py-2 border-teal-100 text-white hover:bg-teal-800" onClick={() => this.setState({"showPreview": !this.state.showPreview})}>Close</button>
              </div>
            )
          }
        </div>

        <p className="text-gray-600 text-lg pt-4">Activity:</p>
        <hr />
        {
          card.activity && card.activity.map((activity, index) => {
            return (
              <p className="text-sm text-gray-700 py-2" key={index}>{activity.label} <Moment format="YYYY-MM-DD HH:mm">{activity.timestamp}</Moment></p>
            )
          })
        }
      </div>
    )
  }

}

const mapStateToProps = state => ({
  columns: state.columns.columns,
  detail: state.columns.detail
})

const mapDispatchToProps = dispatch => ({
  updateCard: (card, field, value) => dispatch(updateCard(card, field, value)),
  removeCard: (card) => dispatch(removeCard(card)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);

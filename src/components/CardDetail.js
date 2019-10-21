import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateCard } from '../actions';

import EditableField from './EditableField';

/* CARD DETAIL
 * Has it's own internal 'editing' mode state? or Redux
 * Button to toggle 'edit mode'
 * Name, Description for now
 * Cards should also show activity
 * Due dates, checklists, and labels features tbd
*/

class CardDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: false,
    }
  }
  handleInputChange = (card, field, value) => {
    this.props.updateCard(card, field, value);
  }

  render() {
    const card = this.props.cards.filter((c) => {
      return c.id === this.props.card;
    })[0];

    if (!card) { return (<div className="card-detail"></div>) }

    return (
      <div className="card-detail">
        <EditableField
          element="h3"
          inputType="input"
          updateInput={(value) => this.handleInputChange(card, "name", value)}
          field={card.name} />
        <EditableField
          element="p"
          inputType="textarea"
          updateInput={(value) => this.handleInputChange(card, "description", value)}
          field={card.description}/>

        <hr />
        <p>Activity:</p>
        {
          card.activity && card.activity.map((activity, index) => {
            return (
              <p key={index}>{activity.label} {activity.timestamp}</p>
            )
          })
        }
      </div>
    )
  }

}

const mapStateToProps = state => ({
  cards: state.cards.cards,
  card: state.cards.card
})

const mapDispatchToProps = dispatch => ({
  updateCard: (card, field, value) => dispatch(updateCard(card, field, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);

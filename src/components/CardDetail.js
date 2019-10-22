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
  handleInputChange = (field, value) => {
    this.props.updateCard(this.props.detail, field, value);
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
        <EditableField
          element="h3"
          inputType="input"
          updateInput={(value) => this.handleInputChange("name", value)}
          field={card.name} />
        <EditableField
          element="p"
          inputType="textarea"
          updateInput={(value) => this.handleInputChange("description", value)}
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
  columns: state.columns.columns,
  detail: state.columns.detail
})

const mapDispatchToProps = dispatch => ({
  updateCard: (card, field, value) => dispatch(updateCard(card, field, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);

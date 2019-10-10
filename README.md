# Rapid React Task Manager
A task management project (Trello style).

There are four initial columns: "To Do", "In Progress", "Testing", and "Done"  
A user can add, edit, or remove a column (_unless_ it is the only column left).  
When a column has no cards, there is an empty state.  
You can add a new card to the first column.  

A user can create, update, or delete a card  
  Creating a new card assigns it to a column  
A user can move a card from column to column  

## Components  
__Board__  
Props:  Columns(Array)

__Column__  
Props: Cards(Array), Column(Object)
Internal State: editing(Boolean)

__Card__  
Props: Card(Object)  
Internal State: editing(Boolean)

__AddButton__  
@action: 'addCard'(card)

__RemoveButton__  
@action: 'removeCard'(card)

__MoveButton__  
@action: 'moveCard'(type, [_oneOf_ card/column] ,direction)

## Actions  
__Cards:__  
_'addCard'__  

_'removeCard'_  

_'updateCard'_  

_'moveCard'_  



__Columns:__  
_'addColumn'_  

_'removeColumn'_  

_'updateColumn'_  

_'moveColumn'_

columns, direction,


## Available Scripts

In the project directory, you can run:

### `npm start`
### `npm test`
### `npm run build`
### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

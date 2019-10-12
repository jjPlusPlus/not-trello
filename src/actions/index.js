export const addCard = (column) => {
  return {
    type: "ADD_CARD",
    payload: { column: column }
  }
}
export const removeCard = (id) => ({
  type: "REMOVE_CARD",
  payload: id
})
export const moveCard = (id, direction) => ({
  type: "MOVE_CARD",
  payload: { id: id, direction: direction }
})
export const updateCard = (id, card) => ({
  type: "UPDATE_CARD",
  payload: { id: id, card: card }
})

export const addColumn = () => ({
  type: "ADD_COLUMN",
  payload: {}
})
export const removeColumn = (id) => ({
  type: "REMOVE_COLUMN",
  payload: id
})
export const moveColumn = (column, direction) => ({
  type: "MOVE_COLUMN",
  payload: { column: column, direction: direction }
})
export const updateColumn = (id, column) => ({
  type: "UPDATE_COLUMN",
  payload: id, column
})

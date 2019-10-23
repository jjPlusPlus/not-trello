export const newCard = (column) => ({
  type: "NEW_CARD",
  payload: { column: column }
})
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
export const moveCard = (card, columns, direction) => ({
  type: "MOVE_CARD",
  payload: { card: card, columns: columns, direction: direction }
})
export const updateCard = (card, field, value) => ({
  type: "UPDATE_CARD",
  payload: { card: card, field: field, value: value }
})
// export const saveCard = (id, card) => ({
//   type: "SAVE_CARD",
//   payload: { id: id, card: card }
// })

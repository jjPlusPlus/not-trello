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
export const moveCardHorizontal = (card, direction) => ({
  type: "MOVE_CARD_HORIZONTAL",
  payload: { card: card, direction: direction }
})
export const moveCardVertical = (card, direction) => ({
  type: "MOVE_CARD_VERTICAL",
  payload: { card: card, direction: direction }
  type: "UPDATE_CARD",
  payload: { card: card, field: field, value: value }
export const openCardDetail = (card, column) => ({
  type: "OPEN_CARD_DETAIL",
  payload: { card: card, column: column }
})
// export const saveCard = (id, card) => ({
//   type: "SAVE_CARD",
//   payload: { id: id, card: card }
// })

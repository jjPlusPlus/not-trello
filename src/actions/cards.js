export const newCard = (column) => ({
  type: "NEW_CARD",
  payload: { column: column }
})
export const addCard = (payload) => {
  return {
    type: "ADD_CARD",
    payload: { column: payload.column, cardID: payload.cardID }
  }
}
export const removeCard = (card) => ({
  type: "REMOVE_CARD",
  payload: card
})
export const moveCardHorizontal = (card, direction) => ({
  type: "MOVE_CARD_HORIZONTAL",
  payload: { card: card, direction: direction }
})
export const moveCardVertical = (card, direction) => ({
  type: "MOVE_CARD_VERTICAL",
  payload: { card: card, direction: direction }
})
export const dropCard = (cardId, source, destination) => ({
  type: "DRAG_DROP_CARD",
  payload: { cardId: cardId, source: source, destination: destination}
})
export const updateCard = (detail, field, value) => ({
  type: "UPDATE_CARD",
  payload: { detail: detail, field: field, value: value }
})
export const openCardDetail = (card, column) => ({
  type: "OPEN_CARD_DETAIL",
  payload: { card: card, column: column }
})
export const openCard = (card, column) => ({
  type: "OPEN_CARD",
  payload: { card: card, column: column }
})

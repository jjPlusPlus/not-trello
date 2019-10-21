export const newColumn = () => ({
  type: "NEW_COLUMN"
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

export const openModal = () => ({
  type: "OPEN_MODAL"
})

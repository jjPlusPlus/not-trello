export default function(state = { modal: null }, action) {
  switch (action.type) {
    case "OPEN_MODAL": {
      return {
        ...state,
        modal: true
      }
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        modal: false
      }
    }
    default: {
      return state;
    }
  }
}

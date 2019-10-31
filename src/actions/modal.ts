import * as constants from "../constants";

export interface CloseModal {
  type: constants.CLOSE_MODAL;
}
export interface OpenModal {
  type: constants.OPEN_MODAL;
}

export type ModalAction =
  | CloseModal
  | OpenModal;

export const closeModal = () => ({
  type: "CLOSE_MODAL",
});
export const openModal = () => ({
  type: "OPEN_MODAL",
});

import React from "react";
import Modal from "react-modal";
import Button from "../../../components/Button";

Modal.setAppElement("#modal");

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<Props> = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      style={{
        content: {
          top: "50%",
          left: "50%",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      }}
      contentLabel="Logout Confirmation Modal"
      className="modal fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="modal-overlay"
    >
      <div className="bg-white sm:w-[50vw] w-[80vw] p-4 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-sharpGroteskBook mb-4">Logout Confirmation</h2>
        <p>Are you sure you want to logout?</p>
        <div className="mt-4 flex flex-row justify-around">
          <Button className="w-[30%]" onClick={onConfirm}>
            Yes
          </Button>
          <Button onClick={onRequestClose} className="w-[30%] text-thinText bg-white">
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;

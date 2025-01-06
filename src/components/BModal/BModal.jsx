import { Modal } from "react-bootstrap";

const BModal = ({
  isOpen,
  title,
  handleClose,
  closebutton,
  children,
  ...props
}) => {
  return (
    <Modal
      show={isOpen}
      backdrop="static"
      keyboard={false}
      onHide={handleClose}
      closeButton={closebutton ?? true}
      centered
      {...props}
    >
      <Modal.Header closeButton style={{ border: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

BModal.defaultProps = {
  title: "",
  closebutton: false,
  isOpen: false,
  size: "lg",
  backdrop: true,
};

export default BModal;

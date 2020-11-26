import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalWindow = (props) => {
  return (
    <div>
      <Modal show={props.show} onHide={props.close}>
        <Modal.Header className="bg-primary text-light" closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          {props.close && (
            <Button variant="secondary" onClick={props.close}>
              Cancel
            </Button>
          )}
          {props.save && (
            <Button variant="primary" onClick={props.save}>
              {props.label ? props.label : "Save"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalWindow;

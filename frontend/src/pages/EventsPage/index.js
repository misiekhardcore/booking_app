import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ModalWindow from "../../components/Modal";

class EventsPage extends Component {
  state = {
    show: false,
    name: "",
  };

  handleOpen = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleSave = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <>
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col md="4" className="text-center shadow p-4">
              <h2>Share your own event</h2>
              <Button onClick={this.handleOpen} className="shadow-sm">
                Create Event
              </Button>
            </Col>
          </Row>
        </Container>

        <ModalWindow
          title="Create Event"
          show={this.state.show}
          close={this.handleClose}
          save={this.handleSave}
        >
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                ref={this.name}
                type="text"
                placeholder="Enter event name"
                required
              ></Form.Control>
              <Form.Text className=""></Form.Text>
            </Form.Group>
          </Form>
        </ModalWindow>
      </>
    );
  }
}

export default EventsPage;

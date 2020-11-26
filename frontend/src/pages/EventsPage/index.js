import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ModalWindow from "../../components/Modal";
import AuthContext from "../../context/auth-context";

class EventsPage extends Component {
  state = {
    show: false,
    events: [],
  };

  componentDidMount() {
    this.fetchEvents();
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.title = React.createRef();
    this.description = React.createRef();
    this.price = React.createRef();
    this.date = React.createRef();
    this.time = React.createRef();
  }

  handleOpen = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleSave = () => {
    this.setState({ show: false });
    const title = this.title.current.value;
    const description = this.description.current.value;
    const price = +this.price.current.value;
    const datetime =
      this.date.current.value + "T" + this.time.current.value + ":00.000Z";

    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price === null ||
      datetime.trim().length === 0
    ) {
      return;
    }
    const query = {
      query: `
      mutation{
        createEvent(eventInput:{title:"${title}",description:"${description}",date:"${datetime}",price:${price}}){
          _id
          title
          description
          price
          date
          creator{
            email
          }
        }
      }
      `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            events: [...this.state.events, res.data.createEvent],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.handleSave();
  };

  fetchEvents = () => {
    const query = {
      query: `
      query{
        events{
          _id
          title
          description
          price
          date
          creator{
            email
          }
        }
      }
      `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        if (res.data) {
          this.setState({ events: res.data.events });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const eventsList = this.state.events.map((event) => (
      <Row key={event._id}>
        <Col className="m-2 shadow rounded">
          <h2>{event.title}</h2>
          <span className="badge badge-primary">
            {new Date(event.date).toLocaleString("pl-PL", {
              timeZone: "UTC",
              weekday: "short",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
          <p className="text-muted p-2">{event.description}</p>
        </Col>
      </Row>
    ));
    return (
      <>
        <Container className="mt-4">
          {this.context.token && (
            <Row className="justify-content-center">
              <Col md="4" className="text-center shadow px-5 py-4 m-2 rounded">
                <h2>Share your own event</h2>
                <Button onClick={this.handleOpen} className="shadow-sm">
                  Create Event
                </Button>
              </Col>
            </Row>
          )}
          <section className="events__list">
            {this.state.events.length !== 0 && eventsList}
          </section>
        </Container>

        <ModalWindow
          title="Create Event"
          show={this.state.show}
          close={this.handleClose}
          save={this.handleSave}
        >
          <Form onSubmit={(e) => this.handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                ref={this.title}
                type="text"
                placeholder="Enter event title"
                required
              ></Form.Control>
              <Form.Text className=""></Form.Text>
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                style={{ resize: "none" }}
                as="textarea"
                rows={4}
                ref={this.description}
                type="text"
                placeholder="Enter event description"
                required
              ></Form.Control>
              <Form.Text className=""></Form.Text>
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                ref={this.price}
                type="number"
                placeholder="Enter event price"
                step="0.01"
                required
              ></Form.Control>
              <Form.Text className=""></Form.Text>
            </Form.Group>
            <Form.Group controlId="formDate" className="col">
              <Row>
                <Form.Label>Date:</Form.Label>
              </Row>
              <Row>
                <Form.Control
                  className="col"
                  ref={this.date}
                  type="date"
                  placeholder="Enter event date"
                  required
                ></Form.Control>
                <Form.Control
                  className="col"
                  ref={this.time}
                  type="time"
                  placeholder="Enter event time"
                  required
                ></Form.Control>
              </Row>
              <Form.Text className=""></Form.Text>
            </Form.Group>
          </Form>
        </ModalWindow>
      </>
    );
  }
}

export default EventsPage;

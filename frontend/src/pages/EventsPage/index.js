import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ModalWindow from "../../components/Modal";
import AuthContext from "../../context/auth-context";
import EventList from "../../components/Event/EventList";
import Loading from "../../components/Loading";

class EventsPage extends Component {
  state = {
    show: false,
    events: [],
    loading: false,
    selectedEvent: null,
    showDetails: false,
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
          this.setState((prevState) => {
            const newEvents = [...prevState.events];
            newEvents.push({
              ...res.data.createEvent,
              creator: { _id: this.context.userId },
            });
            return { events: newEvents };
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

  handleBook = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      this.props.history.push("/auth");
    }
    const query = {
      query: `
      mutation{
        bookEvent(eventId:"${this.state.selectedEvent._id}"){
          _id
          event{
            _id
          }
          user{
            _id
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
          this.setState({ selectedEvent: null, showDetails: null });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchEvents = () => {
    this.setState({ loading: true });
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
            _id
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
          this.setState({ events: res.data.events, loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  };

  handleShowDetails = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent, showDetails: true };
    });
  };

  render() {
    return (
      <>
        <Container className="mt-4">
          {this.context.token && (
            <Row className="justify-content-center mb-4">
              <Col className="d-flex justify-content-center bg-light shadow p-4 rounded">
                <h2>Share your own event</h2>
                <Button onClick={this.handleOpen} className="shadow-sm ml-4">
                  Create Event
                </Button>
              </Col>
            </Row>
          )}
          <section>
            {this.state.loading ? (
              <Loading />
            ) : (
              this.state.events.length !== 0 && (
                <EventList
                  events={this.state.events}
                  userId={this.context.userId}
                  handleOnClick={this.handleShowDetails}
                />
              )
            )}
          </section>
        </Container>

        <ModalWindow
          size="lg"
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

        {this.state.showDetails && (
          <ModalWindow
            size="lg"
            title={this.state.selectedEvent.title}
            show={this.state.showDetails}
            close={() =>
              this.setState({ showDetails: false, selectedEvent: null })
            }
            save={this.handleBook}
            label={this.context.token ? "Book Now!" : "Log in to book"}
          >
            <Row>
              <Col>
                <span className="badge badge-secondary p-2 mr-auto">
                  {new Date(this.state.selectedEvent.date).toLocaleString(
                    "pl-PL",
                    {
                      timeZone: "UTC",
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )}
                </span>
                <p>{this.state.selectedEvent.description}</p>
              </Col>
              <Col md="auto">
                <p className="h2">
                  {this.state.selectedEvent.price.toFixed(2)} zł
                </p>
              </Col>
            </Row>
          </ModalWindow>
        )}
      </>
    );
  }
}

export default EventsPage;

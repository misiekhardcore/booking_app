import React, { Component } from "react";
import { Button, Col, Row } from "react-bootstrap";

class EventItem extends Component {
  isYour =
    this.props.creator._id && this.props.creator._id === this.props.userId;

  // state = {
  //   angle: Math.random() * 360,
  //   red: Math.random() * 50 + 30,
  //   green: Math.random() * 50 + 30,
  //   blue: Math.random() * 50 + 30,
  // };

  render() {
    return (
      <Row>
        <Col
          className="mb-4 p-4 shadow rounded"
          // style={{
          //   backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`,
          //   background: `
          //   linear-gradient(${this.state.angle}deg,
          //   rgba(${this.state.red},${this.state.green},${this.state.blue},1) 0%,
          //   rgba(${this.state.red + 30},${this.state.green + 30},${this.state.blue + 30},1) 70%,
          //   rgba(${this.state.red + 50},${this.state.green + 50},${this.state.blue + 50},1) 100%)`,
          // }}
        >
          <Row className="text-dark">
            <Col>
              <h2 className="text-shadoww">{this.props.title}</h2>
              <span className="badge badge-warning p-2 mr-auto">
                {new Date(this.props.date).toLocaleString("pl-PL", {
                  timeZone: "UTC",
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              <p className="p-2 text-shadoww">{this.props.description}</p>
            </Col>
            <Col
              md="auto"
              className="d-flex flex-column justify-content-center align-items-end"
            >
              <p className="h3 text-shadoww">
                {this.props.price.toFixed(2)} zł
              </p>
              <Button
                onClick={() => this.props.handleOnClick(this.props._id)}
                disabled={this.isYour}
                variant={this.isYour ? "secondary" : "warning"}
              >
                {this.isYour ? "Your Event" : "Details"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default EventItem;

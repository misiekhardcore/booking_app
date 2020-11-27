import React from "react";
import { Button, Col, Row } from "react-bootstrap";

const BookingItem = (props) => {
  return (
    <Row>
      <Col className="mb-4 p-4 shadow rounded">
        <Row className="text-dark">
          <Col>
            <h2>{props.event.title}</h2>
            <span className="badge badge-warning p-2 mr-auto">
              {"Last update: " +
                new Date(props.updatedAt).toLocaleString("pl-PL", {
                  timeZone: "UTC",
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
            </span>
          </Col>
          <Col
            md="auto"
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <Button
              variant="warning"
              onClick={() => props.handleOnClick(props._id)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default BookingItem;

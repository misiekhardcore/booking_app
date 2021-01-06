import React from "react";
import { Col, Row } from "react-bootstrap";

const BOOKING_BUCKETS = {
  cheap: 100,
  normal: 200,
  expensive: 10000000,
};

const BookingChart = (props) => {
  let output = {};
  for (let bucket in BOOKING_BUCKETS) {
    const filtered = props.bookings.reduce((prev, act) => {
      if (act.event.price < BOOKING_BUCKETS[bucket]) return prev + 1;
      return prev;
    }, 0);
    output[bucket] = filtered;
  }

  return (
    <Row>
      <Col className="shadow">{output.cheap}</Col>
    </Row>
  );
};

export default BookingChart;

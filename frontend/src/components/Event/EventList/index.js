import React from "react";
import EventItem from "./EventItem";

const EventList = (props) => {
  return (
    <>
      {props.events &&
        props.events.map((event) => (
          <EventItem
            userId={props.userId}
            handleOnClick={props.handleOnClick}
            {...event}
            key={event._id}
          />
        ))}
    </>
  );
};

export default EventList;

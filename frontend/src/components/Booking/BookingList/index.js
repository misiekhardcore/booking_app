import React from "react";
import BookingItem from "./BookingItem";

const BookingList = (props) => {
  return (
    <>
      {props.bookings &&
        props.bookings.map((booking) => (
          <BookingItem
            key={booking._id}
            handleOnClick={props.handleOnClick}
            {...booking}
          />
        ))}
    </>
  );
};

export default BookingList;

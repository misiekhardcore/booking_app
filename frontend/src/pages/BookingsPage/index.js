import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Prev } from "react-bootstrap/esm/PageItem";
import BookingList from "../../components/Booking/BookingList";
import Loading from "../../components/Loading";
import AuthContext from "../../context/auth-context";
import BookingChart from "./BookingChart";

class BookingPage extends Component {
  state = {
    loading: false,
    bookings: [],
    switchType: "list",
  };

  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  handleCancel = (bookingId) => {
    const query = {
      query: `
      mutation cancelBooking($id:ID!){
        cancelBooking(bookingId:$id){
          _id
        }
      }
      `,
      variables: {
        id: bookingId,
      },
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
        if (res.data && this.isActive) {
          this.setState((prevState) => {
            const newBookings = prevState.bookings.filter((b) => {
              return b._id !== bookingId;
            });
            return { bookings: newBookings };
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchBookings = () => {
    this.setState({ loading: true });
    const query = {
      query: `
      query{
        bookings{
          _id
          event{
            title
            price
          }
          user{
            email
          }
          createdAt
          updatedAt
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
        if (res.data && this.isActive) {
          this.setState({ bookings: res.data.bookings, loading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) this.setState({ loading: false });
      });
  };

  handleTypeSwitch = () => {
    if (this.state.switchType === "list") {
      this.setState({ switchType: "chart" });
    }
    if (this.state.switchType === "chart") {
      this.setState({ switchType: "list" });
    }
  };

  render() {
    return (
      <Container className="mt-4">
        <section>
          {this.state.loading ? (
            <Loading />
          ) : (
            <>
              <Row>
                <Col className="d-flex p-4 shadow mb-4 justify-content-center">
                  <Button
                    onClick={() => this.handleTypeSwitch()}
                    variant="warning"
                  >
                    {this.state.switchType === "list"
                      ? "Switch to Chart"
                      : this.state.switchType === "chart"
                      ? "Switch to List"
                      : "Error"}
                  </Button>
                </Col>
              </Row>
              {this.state.switchType === "list" &&
                this.state.bookings.length !== 0 && (
                  <BookingList
                    bookings={this.state.bookings}
                    handleOnClick={this.handleCancel}
                  />
                )}
              {this.state.switchType === "chart" && (
                <BookingChart bookings={this.state.bookings} />
              )}
            </>
          )}
        </section>
      </Container>
    );
  }
}

export default BookingPage;

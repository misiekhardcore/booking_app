import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";
import Loading from "../../components/Loading";
import AuthContext from "../../context/auth-context";

class BookingPage extends Component {
  state = {
    loading: false,
    bookings: [],
  };

  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  fetchBookings = () => {
    this.setState({ loading: true });
    const query = {
      query: `
      query{
        bookings{
          _id
          event{
            title
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

  render() {
    return (
      <Container>
        <Row>
          {this.state.loading ? (
            <Loading />
          ) : (
            <ul>
              {this.state.bookings.map((booking) => (
                <li key={booking._id}>
                  {booking.event.title} - {booking.user.email}
                </li>
              ))}
            </ul>
          )}
        </Row>
      </Container>
    );
  }
}

export default BookingPage;

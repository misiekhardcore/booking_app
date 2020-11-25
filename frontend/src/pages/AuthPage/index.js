import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import AuthContext from "../../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  toggleForm = (e) => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.email.current.value;
    const password = this.password.current.value;

    // if (email.trim().length === 0 || password.trim().length) {
    //   return;
    // }
    let query;
    if (this.state.isLogin) {
      query = {
        query: `
        query{
          login(email:"${email}",password:"${password}"){
            token
          }
        }
        `,
      };
    } else {
      query = {
        query: `
      mutation{
        createUser(userInput:{email:"${email}",password:"${password}"}){
          _id
          email
        }
      }
      `,
      };
    }

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
        if (res.data.login.token) {
          this.context.login(
            res.data.login.token,
            res.data.login.userId,
            res.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <Container fluid="md">
        <Row className="justify-content-md-center">
          <Col md="6">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  ref={this.email}
                  type="email"
                  placeholder="Enter email"
                  required
                ></Form.Control>
                <Form.Text className=""></Form.Text>
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  ref={this.password}
                  type="password"
                  placeholder="Enter password"
                  required
                ></Form.Control>
                <Form.Text className=""></Form.Text>
              </Form.Group>
              <Button
                className="mb-2 shadow-sm"
                variant="primary"
                type="submit"
                block
              >
                {this.state.isLogin ? "Sign In" : "Sign Up"}
              </Button>
              {this.state.isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <span className="link" onClick={this.toggleForm}>
                    Sign up!
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span className="link" onClick={this.toggleForm}>
                    Sign in!
                  </span>
                </p>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AuthPage;

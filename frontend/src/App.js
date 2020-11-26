import "./App.scss";
import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingsPage";
import EventsPage from "./pages/EventsPage";
import MainNav from "./components/Navigation/MainNav";
import AuthContext from "./context/auth-context";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNav />
          <main>
            <Switch>
              {!this.state.token && <Redirect exact from="/" to="/auth" />}
              {this.state.token && <Redirect exact from="/" to="/events" />}
              {this.state.token && <Redirect exact from="/auth" to="/events" />}
              {!this.state.token && (
                <Redirect exact from="/bookings" to="/auth" />
              )}
              <Route path="/auth" component={AuthPage} />
              <Route path="/events" component={EventsPage} />
              <Route path="/bookings" component={BookingPage} />
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;

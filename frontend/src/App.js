import "./App.scss";
import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingsPage";
import EventsPage from "./pages/EventsPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/auth" />
        <Route path="/auth" component={AuthPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/bookings" component={BookingPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

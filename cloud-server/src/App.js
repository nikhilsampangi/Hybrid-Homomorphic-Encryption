import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
// Components
import lp from "./components/LandingPage";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* Landing Page */}
          <Route exact path="/" component={lp} />
        </Switch>
      </Router>
    );
  }
}

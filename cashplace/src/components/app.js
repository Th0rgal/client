import { h, Component } from "preact";
import { Router } from "preact-router";

import Header from "./header";

// Code-splitting is automated for routes
import Home from "../routes/home";
import Ticket from "../routes/ticket";
import RequestsManager from "../utils/requests";

export default class App extends Component {
  state = {
    requestsManager: null,
  };

  componentDidMount() {
    this.setState({
      requestsManager: new RequestsManager("https://test.alpha.cash.place"),
    });
  }

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = (e) => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <Home path="/" requestsManager={this.state.requestsManager} />
          <Ticket path="/:id" requestsManager={this.state.requestsManager} />
        </Router>
      </div>
    );
  }
}

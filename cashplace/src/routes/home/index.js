import style from "./style";
import { Component } from "preact";
import { route } from "preact-router";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCode: false,
      creating: false,
    };
  }

  createTicket = () => {
    this.setState({ creating: true });
    this.props.requestsManager
      .createTicket("btc")
      .then((response) => response.json())
      .then((response) => {
        if ("id" in response) {
          route(response["id"], true);
        } else if ("error" in response) console.log(response["error"]);
        else console.log("error");
      });
  };

  toggleCode = () => {
    this.setState({
      hasCode: !this.state.hasCode,
    });
  };

  displayCodeField = () => {
    if (this.state.hasCode) return <input type="text" placeholder="code" />;
  };

  displayCreateButton = () => {
    if (!this.state.creating)
      return <button onClick={() => this.createTicket()}>create</button>;
    else return <div>creating ticket...</div>;
  };

  render() {
    return (
      <div class={style.home}>
        <h1>Create a ticket {this.state.checked}</h1>
        <p>Here you can create a ticket to secure a Bitcoin transaction.</p>

        <div>
          <label>
            <input
              type="checkbox"
              checked={this.state.isChecked}
              onChange={this.toggleCode}
            />
            Use a code?
          </label>
          {this.displayCodeField()}
          {this.displayCreateButton()}
        </div>
      </div>
    );
  }
}

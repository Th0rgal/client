import style from "./style";
import { Component } from "preact";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCode: false,
    };
  }

  createTicket = (btcSpender) => {
    if (btcSpender) console.log("spender");
    else console.log("receiver");
  };

  toggleCode = () => {
    this.setState({
      hasCode: !this.state.hasCode,
    });
  };

  displayCodeField = () => {
    if (this.state.hasCode) return <input type="text" placeholder="code" />;
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
        </div>
        {this.displayCodeField()}
        <div>
          <button onClick={() => this.createTicket(true)}>Spend BTC</button>
          You want to send BTC to someone and make sure to get what you paid
          for.
        </div>
        <div>
          <button onClick={() => this.createTicket(false)}>Receive BTC</button>
          You want to receive BTC from someone and make sure to receive your
          money.
        </div>
      </div>
    );
  }
}

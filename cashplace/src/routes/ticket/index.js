import { h, Component } from "preact";
import style from "./style";

export default class Ticket extends Component {
  state = {};

  componentDidMount() {
    console.log(this.props.id);
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ id }) {
    return (
      <div class={style.ticket}>
        <h1>Blockchain address: {id}</h1>

        <input type="password" placeholder="password"></input>
        <div>
          <button onClick={() => {}}>connect as spender</button>
          You want to send BTC to someone and make sure to get what you paid
          for.
        </div>
        <div>
          <button onClick={() => {}}>connect as receiver</button>
          You want to receive BTC from someone and make sure to receive your
          money.
        </div>
      </div>
    );
  }
}

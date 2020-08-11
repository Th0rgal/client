import { h, Component } from "preact";
import style from "./style";

export default class Ticket extends Component {
  state = {};

  // Note: `user` comes from the URL, courtesy of our router
  render({ id }) {
    return (
      <div class={style.ticket}>
        <h1>Blockchain address: {id}</h1>

        <input type="password" placeholder="password"></input>

        <button onClick={() => {}}>connect as spender</button>
        <button onClick={() => {}}>connect as receiver</button>
      </div>
    );
  }
}

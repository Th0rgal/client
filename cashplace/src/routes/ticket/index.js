import { useState } from 'preact/hooks';
import useParams from "preact-router";
import style from "./style";

export default function Ticket({ requestsManager }) {
  const { id } = useParams();
  const [password, setPassword] = useState("");

  const handleConnect = () => {
    console.log("Entered password is", password);
  };

  return (
    <div class={style.ticket}>
      <h1>Blockchain address: {id}</h1>
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <div>
        <button onClick={() => handleConnect(true)}>connect as spender</button>
        You want to send BTC to someone and make sure to get what you paid for.
      </div>
      <div>
        <button onClick={() => handleConnect(false)}>
          connect as receiver
        </button>
        You want to receive BTC from someone and make sure to receive your
        money.
      </div>
    </div>
  );
}

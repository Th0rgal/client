import { useState } from "preact/hooks";
import style from "./style";
import SpenderPanel from "../../components/panel/spender";
import { Fragment } from "preact";

export default function Ticket({ requestsManager, id }) {
  const [password, setPassword] = useState("");
  const [isSpender, setSpender] = useState();
  const [isConnecting, setConnecting] = useState(false);
  const [infos, setInfos] = useState(false);

  const handleConnect = (spender) => {
    setConnecting(true);
    setSpender(spender);
    requestsManager.setPassword(password);

    requestsManager
      .fetchTicketInfos(id, spender)
      .then((response) => response.json())
      .then((json) => {
        if ("error" in json) {
          //todo: handle error!
        } else setInfos(json);
      });
  };

  const getButtons = () => {
    if (isConnecting) {
      return <div>Connecting...</div>;
    } else
      return (
        <Fragment>
          <div>
            <button onClick={() => handleConnect(true)}>
              connect as spender
            </button>
            You want to send BTC to someone and make sure to get what you paid
            for.
          </div>
          <div>
            <button onClick={() => handleConnect(false)}>
              connect as receiver
            </button>
            You want to receive BTC from someone and make sure to receive your
            money.
          </div>
        </Fragment>
      );
  };

  const ticketLogin = () => {
    return (
      <Fragment>
        <h1>Blockchain address: {id}</h1>
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        {getButtons()}
      </Fragment>
    );
  };

  const getContent = () => {
    if (!infos) {
      return ticketLogin();
    } else {
      if (isSpender) return <SpenderPanel />;
    }
  };

  return (
    <div class={style.ticket}>
      {getContent()}
      {isSpender}
    </div>
  );
}

import { useState } from "preact/hooks";
import style from "./style";
import { Fragment } from "preact";
import {
  SharedConfig,
  SharedReception,
  SharedReceived,
  SharedSending,
  SharedSent,
  SharedDispute,
} from "./shared";

export default function SpenderPanel({ requestsManager, id, infos, setInfos }) {
  const [localAmount, setLocalAmount] = useState(getAmount(null) / 10 ** 9);
  const [localLeftoverAddress, setLocalLeftoverAddress] = useState(
    getLeftOverAddress("bc1qm9g2k3fznl2a9vghnpnwem87p03txl4y5lahyu")
  );

  const getAmountPanel = () => {
    if (infos["master"]) {
      return (
        <Fragment>
          <div>
            <h3>Amount</h3>
            You created this ticket, as a ticket master you have to configure
            the amount you want to send:
            <label>Amount in BTC</label>
            <input
              type="number"
              placeholder="0.01"
              value={localAmount}
              onChange={(event) => setLocalAmount(event.target.value)}
            />
            <button onClick={() => setAmount(localAmount)}>Set amount</button>
          </div>
        </Fragment>
      );
    }
  };

  function getAmount(defaultValue) {
    const amount = infos["amount"];
    return amount ? amount : defaultValue;
  }

  const setAmount = (amount) => {
    amount = Math.floor(parseFloat(amount) * 10 ** 9);
    requestsManager
      .setAmount(id, true, amount)
      .then((response) => response.json())
      .then((response) => {
        if ("error" in response) console.log(response["error"]);
        else setInfos(response);
      });
  };

  function getLeftOverAddress(defaultValue) {
    if (!("leftover" in infos)) return defaultValue;
    return infos["leftover"];
  }

  const setLeftoverAddress = (address) => {
    requestsManager
      .setLeftover(id, true, address)
      .then((response) => response.json())
      .then((response) => {
        if ("error" in response) console.log(response["error"]);
        else setInfos(response);
      });
  };

  function getReceiverAddress(defaultValue) {
    if (!("receiver" in infos)) return defaultValue;
    return infos["receiver"];
  }

  return (
    <div class={style.panel}>
      <h1>Spender Panel</h1>
      <ul>
        <li>BTC address: {id}</li>
        <li>
          Amount to send: {getAmount() / 10 ** 9} BTC or {getAmount()} satoshis
        </li>
        <li>Leftover Address: {getLeftOverAddress("you didn't set it")}</li>
        <li>
          Receiver Address: {getReceiverAddress("the receiver didn't set it")}
        </li>
      </ul>
      {() => {
        switch (infos["status"]) {
          case 0:
            return (
              <SharedConfig
                setLeftoverAddress={setLeftoverAddress}
                setLocalLeftoverAddress={setLocalLeftoverAddress}
                localLeftoverAddress={localLeftoverAddress}
                additionalPanel={getAmountPanel()}
              />
            );

          case 1:
            <SharedReception infos={infos} id={id} />;

          case 2:
            <SharedReceived />;

          case 3:
            <SharedSending />;

          case 4:
            <SharedSent />;

          case 5:
            <SharedDispute />;
        }
      }}
    </div>
  );
}

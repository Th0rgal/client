import { useState } from "preact/hooks";
import style from "./style";

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
    getLeftoverAddress("bc1qm9g2k3fznl2a9vghnpnwem87p03txl4y5lahyu")
  );

  const getLeftoverOption = () => {
    return (
      <div>
        <h3>Leftover address</h3>
        If there is too much Bitcoin, the surplus will be sent back to this
        address:
        <label>Leftover address</label>
        <input
          type="text"
          placeholder="Your btc address"
          value={localLeftoverAddress}
          onChange={(event) => setLocalLeftoverAddress(event.target.value)}
        />
        <button onClick={() => setLeftoverAddress(localLeftoverAddress)}>
          Set leftover address
        </button>
      </div>
    );
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

  function getLeftoverAddress(defaultValue) {
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

  function askPayment() {
    requestsManager
      .askPayment(id, true)
      .then((response) => response.json())
      .then((response) => {
        if ("error" in response) console.log(response["error"]);
        else setInfos(response);
      });
  }

  function handleStatus(status) {
    switch (status) {
      case 0:
        return (
          <SharedConfig
            master={infos["master"]}
            localAmount={localAmount}
            setLocalAmount={setLocalAmount}
            setAmount={setAmount}
            additionalPanel={getLeftoverOption()}
            askPayment={askPayment}
          />
        );

      case 1:
        return <SharedReception infos={infos} id={id} />;

      case 2:
        return <SharedReceived />;

      case 3:
        return <SharedSending />;

      case 4:
        return <SharedSent />;

      case 5:
        return <SharedDispute />;
    }
  }

  return (
    <div class={style.panel}>
      <h1>Spender Panel</h1>
      <ul>
        <li>BTC address: {id}</li>
        <li>
          Amount to send: {getAmount() / 10 ** 9} BTC or {getAmount()} satoshis
        </li>
        <li>Leftover Address: {getLeftoverAddress("you didn't set it")}</li>
        <li>
          Receiver Address: {getReceiverAddress("the receiver didn't set it")}
        </li>
      </ul>
      {handleStatus(infos["status"])}
    </div>
  );
}

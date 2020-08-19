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

export default function ReceiverPanel({
  requestsManager,
  id,
  infos,
  setInfos,
}) {
  const [localAmount, setLocalAmount] = useState(getAmount(null) / 10 ** 9);
  const [localReceiverAddress, setLocalReceiverAddress] = useState(
    getReceiverAddress("")
  );

  const getReceiverOption = () => {
    return (
      <div>
        <h3>Receiver address</h3>
        Here is the address where you will receive the BTC sent by the spender.
        <label>Receiver address</label>
        <input
          type="text"
          placeholder="Your btc address"
          value={localReceiverAddress}
          onChange={(event) => setLocalReceiverAddress(event.target.value)}
        />
        <button onClick={() => setReceiverAddress(localReceiverAddress)}>
          Set receiver address
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
      .setAmount(id, false, amount)
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

  const setReceiverAddress = (address) => {
    requestsManager
      .setReceiver(id, false, address)
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

  function askPayment() {
    requestsManager
      .askPayment(id, false)
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
            additionalPanel={getReceiverOption()}
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
      <h1>Receiver Panel</h1>
      <ul>
        <li>BTC address: {id}</li>
        <li>
          Amount to receive: {getAmount() / 10 ** 9} BTC or {getAmount()}{" "}
          satoshis
        </li>
        <li>
          Leftover Address: {getLeftoverAddress("the spender didn't set it")}
        </li>
        <li>Receiver Address: {getReceiverAddress("you didn't set it")}</li>
      </ul>
      {handleStatus(infos["status"])}
    </div>
  );
}

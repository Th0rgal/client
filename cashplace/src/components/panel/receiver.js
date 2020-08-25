import { useState } from "preact/hooks";
import style from "./style";

import {
  Refresh,
  SharedConfig,
  SharedReception,
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

  const setAmount = (amount) => {
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

  function handleStatus(status) {
    switch (status) {
      case 0:
        return (
          <SharedConfig
            spender={false}
            infos={infos}
            setInfos={setInfos}
            setAmount={setAmount}
            additionalPanel={getReceiverOption()}
            requestsManager={requestsManager}
            id={id}
          />
        );

      case 1:
        return (
          <SharedReception
            infos={infos}
            spender={false}
            id={id}
            requestsManager={requestsManager}
            setInfos={setInfos}
          />
        );

      case 2:
        return (
          <div>
            <h2>This ticket is in RECEIVED state.</h2>
            <h3>Your bitcoin payment have been received</h3>
            To transfer the funds to your own address, please send the
            counterparty to the spender and ask him to confirm the reception
            once it is done.
          </div>
        );

      case 3:
        return <SharedSending id={id} />;

      case 4:
        return <SharedSent />;

      case 5:
        return <SharedDispute code={infos["code"]} />;
    }
  }

  const amount = infos["amount"] ? infos["amount"] : 0;

  return (
    <div class={style.panel}>
      <h1>Receiver Panel</h1>
      <Refresh
        setInfos={setInfos}
        id={id}
        spender={false}
        requestsManager={requestsManager}
      />
      <ul>
        <li>BTC address: {id}</li>
        <li>
          Amount to send: {amount / 1e8} ₿ ({amount} satoshis)
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

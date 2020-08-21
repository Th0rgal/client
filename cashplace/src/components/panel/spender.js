import { useState } from "preact/hooks";
import style from "./style";

import {
  Refresh,
  SharedConfig,
  SharedReception,
  SharedReceived,
  SharedSending,
  SharedSent,
  SharedDispute,
} from "./shared";

export default function SpenderPanel({ requestsManager, id, infos, setInfos }) {
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

  const setAmount = (amount) => {
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

  function handleStatus(status) {
    switch (status) {
      case 0:
        return (
          <SharedConfig
            sender={true}
            infos={infos}
            setInfos={setInfos}
            setAmount={setAmount}
            additionalPanel={getLeftoverOption()}
            requestsManager={requestsManager}
            id={id}
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

  const amount = infos["amount"] ? infos["amount"] : 0;

  return (
    <div class={style.panel}>
      <h1>Spender Panel</h1>
      <Refresh
        setInfos={setInfos}
        id={id}
        sender={true}
        requestsManager={requestsManager}
      />
      <ul>
        <li>BTC address: {id}</li>
        <li>
          Amount to send: {amount / 1e8} ₿ ({amount} satoshis)
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

import { useState } from "preact/hooks";
import style from "./style";

import {
  refreshInfos,
  Refresh,
  SharedConfig,
  SharedReception,
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
            spender={true}
            infos={infos}
            setInfos={setInfos}
            setAmount={setAmount}
            additionalPanel={getLeftoverOption()}
            requestsManager={requestsManager}
            id={id}
          />
        );

      case 1:
        return (
          <SharedReception
            infos={infos}
            spender={true}
            id={id}
            requestsManager={requestsManager}
            setInfos={setInfos}
          />
        );

      case 2:
        return (
          <Received
            spender={true}
            id={id}
            requestsManager={requestsManager}
            setInfos={setInfos}
          />
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
      <h1>Spender Panel</h1>
      <Refresh
        setInfos={setInfos}
        id={id}
        spender={true}
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

function Received({ spender, id, requestsManager, setInfos }) {
  const [lastUsage, setLastUsage] = useState(0);
  const delay = 10 * 1e3;

  function confirmReception(spender, id, requestsManager, setInfos, fast) {
    const realDelay = Date.now() - lastUsage;
    if (delay > realDelay) {
      console.log(`please wait ${10 - realDelay / 1000} more seconds`);
      return;
    }
    setLastUsage(Date.now());
    refreshInfos(requestsManager.confirmReception(id, spender, fast), setInfos);
  }

  function openDispute(spender, id, requestsManager, setInfos) {
    const realDelay = Date.now() - lastUsage;
    if (delay > realDelay) {
      console.log(`please wait ${10 - realDelay / 1000} more seconds`);
      return;
    }
    setLastUsage(Date.now());
    refreshInfos(requestsManager.openDispute(id, spender), setInfos);
  }

  return (
    <div>
      <h2>This ticket is in RECEIVED state.</h2>
      <div>
        <h3>Your bitcoins have been received</h3>
        Please confirm here once you've received what you paid for. If there is
        an issue, click on "there is an issue" button to open a dispute.
        <h4>Confirm the reception of what I paid for</h4>
        <button
          onClick={() => {
            confirmReception(spender, id, requestsManager, setInfos, true);
          }}
        >
          Fast payment (the receiver will receive a bit less)
        </button>
        <button
          onClick={() => {
            confirmReception(spender, id, requestsManager, setInfos, false);
          }}
        >
          Slow payment
        </button>
        <h4>Report a problem to a human</h4>
        <button
          onClick={() => {
            openDispute(spender, id, requestsManager, setInfos);
          }}
        >
          Open a dispute
        </button>
      </div>
    </div>
  );
}

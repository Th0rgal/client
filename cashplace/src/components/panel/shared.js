import { useState, useEffect } from "preact/hooks";

function refreshInfos(promise, setInfos) {
  promise
    .then((response) => response.json())
    .then((response) => {
      if ("error" in response) console.log(response["error"]);
      else setInfos(response);
    });
}

export function Refresh({ setInfos, id, spender, requestsManager }) {
  const [lastUsage, setLastUsage] = useState(0);
  const delay = 10 * 1e3;

  function refresh() {
    const realDelay = Date.now() - lastUsage;
    if (delay > realDelay) {
      console.log(`please wait ${10 - realDelay / 1000} more seconds`);
      return;
    }
    setLastUsage(Date.now());
    refreshInfos(requestsManager.fetchTicketInfos(id, spender), setInfos);
  }

  return <button onClick={refresh}>Refresh</button>;
}

export function SharedConfig({
  spender,
  infos,
  setInfos,
  setAmount,
  additionalPanel,
  requestsManager,
  id,
}) {
  const [cachedAmount, setCachedAmount] = useState(infos["amount"]);
  const [lastUsage, setLastUsage] = useState(0);
  const delay = 10 * 1e3;

  function askPayment() {
    const realDelay = Date.now() - lastUsage;
    if (delay > realDelay) {
      console.log(`please wait ${10 - realDelay / 1000} more seconds`);
      return;
    }
    setLastUsage(Date.now());
    refreshInfos(requestsManager.askPayment(id, spender), setInfos);
  }

  return (
    <div>
      <h2>This ticket is in CONFIGURATION state.</h2>
      {infos["master"] && (
        <div>
          <h3>Amount</h3>
          You created this ticket, as a ticket master you have to configure the
          amount you want to receive:
          <label>Amount in BTC</label>
          <input
            type="number"
            placeholder="0.01"
            value={infos["amount"] / 1e8}
            onChange={(event) => setCachedAmount(event.target.value)}
          />
          <button
            onClick={() =>
              setAmount(Math.floor(parseFloat(cachedAmount) * 1e8))
            }
          >
            Set amount
          </button>
        </div>
      )}
      {additionalPanel}
      {spender ? (
        <button onClick={askPayment}>Send payment</button>
      ) : (
        <button onClick={askPayment}>Ask for payment</button>
      )}
    </div>
  );
}

export function SharedReception({
  infos,
  spender,
  id,
  requestsManager,
  setInfos,
}) {
  const [cachedBalance, setCachedBalance] = useState(0);
  const [lastUsage, setLastUsage] = useState(0);
  const delay = 10 * 1e3;

  function queryBlockchain(spender, id, requestsManager, setInfos) {
    const realDelay = Date.now() - lastUsage;
    if (delay > realDelay) {
      console.log(`please wait ${10 - realDelay / 1000} more seconds`);
      return;
    }
    setLastUsage(Date.now());
    requestsManager
      .getBalance(id, spender)
      .then((response) => response.json())
      .then((response) => {
        if ("error" in response) console.log(response["error"]);
        else {
          setCachedBalance(response["balance"]);
          refreshInfos(requestsManager.fetchTicketInfos(id, spender), setInfos);
        }
      });
  }

  useEffect(() => {
    queryBlockchain(spender, id, requestsManager, setInfos);
  }, [spender, id, requestsManager, setInfos]);

  return (
    <div>
      <h2>This ticket is in RECEPTION state.</h2>
      <div>
        <h3>Bitcoin transaction</h3>A minimum of {infos["amount"] / 1e8}{" "}
        bitcoins must be sent. A portion may be paid by the receiver to
        discourage him from wasting time of the spender. If more bitcoins are
        received than necessary, the surplus will be returned to the leftover
        address and the receiver address will receive exactly the right amount
        (amount - 1%), otherwise the receiver will pay the transaction fees.
        <h4>Currently received:</h4>
        {cachedBalance / 1e8} ₿ ({cachedBalance} satoshis)
        <button
          onClick={() =>
            queryBlockchain(spender, id, requestsManager, setInfos)
          }
        >
          Query blockchain
        </button>
        <h4>Address to send the bitcoins:</h4>
        {id}
        <h4>qrcode to send the bitcoins:</h4>
        <img
          src={`https://www.bitcoinqrcodemaker.com/api/?style=bitcoin&address=${id}`}
          alt="qrcode"
        />
      </div>
    </div>
  );
}

export function SharedReceived() {
  return (
    <div>
      <h2>This ticket is in RECEIVED state.</h2>
      <div>
        <h3>Your bitcoins have been received</h3>
        Please confirm here once you've received what you paid for. If there is
        an issue, click on "there is an issue" button to open a dispute.
        <button onClick={null}>Confirm the reception of what I paid for</button>
        <button onClick={null}>Open an issue</button>
      </div>
    </div>
  );
}

export function SharedSending() {
  return (
    <div>
      <h2>This ticket is in SENDING state.</h2>
      <div>
        <h3>We transfer your Bitcoins.</h3>
        You have nothing to do. You can look for the transaction status on a
        blockchain explorer.
        <a href={`https://blockstream.info/address/${id}`}>
          Open a blockchain explorer
        </a>
      </div>
    </div>
  );
}

export function SharedSent() {
  return (
    <div>
      <h2>This ticket is in SENT state.</h2>
      <div>
        <h3>Your bitcoins have been sent</h3>
        You have nothing to do. This ticket will automatically be destroyed
        within 24 hours. No trace will be kept.
      </div>
    </div>
  );
}

export function SharedDispute() {
  return (
    <div>
      <h2>This ticket is in DISPUTE state.</h2>
      <div>
        <h3>Contact us to fix the problem</h3>
        You have reported a problem, please contact us on matrix to solve it.
      </div>
    </div>
  );
}

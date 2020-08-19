export function SharedConfig({
  master,
  localAmount,
  setLocalAmount,
  setAmount,
  additionalPanel,
  askPayment,
}) {
  return (
    <div>
      <h2>This ticket is in CONFIGURATION state.</h2>
      {master && (
        <div>
          <h3>Amount</h3>
          You created this ticket, as a ticket master you have to configure the
          amount you want to receive:
          <label>Amount in BTC</label>
          <input
            type="number"
            placeholder="0.01"
            value={localAmount}
            onChange={(event) => setLocalAmount(event.target.value)}
          />
          <button onClick={() => setAmount(localAmount)}>Set amount</button>
        </div>
      )}
      {additionalPanel}
      <button onClick={askPayment}>Send payment</button>
    </div>
  );
}

export function SharedReception(infos, id) {
  return (
    <div>
      <h2>This ticket is in RECEPTION state.</h2>
      <div>
        <h3>Transaction address</h3>
        You need to send at least {infos["amount"]} BTC to the address: {id}
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

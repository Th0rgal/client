import { useState } from "preact/hooks";
import MasterBox from "./master";
import style from "./style";
import { Fragment } from "preact";

export default function SpenderPanel({ id, infos }) {
  const showMasterBox = () => {
    if (infos["master"]) return <MasterBox />;
  };

  const getMasterConfigurationPanel = () => {
    if (infos["master"]) {
      <Fragment>
        <div>
          <h3>Amount</h3>
          You created this ticket, as a ticket master you have to configure the
          amount you want to send:
          <label>Amount in BTC</label>
          <input type="number" placeholder="0.01" />
          <button onClick={null}>Set amount</button>
        </div>
      </Fragment>;
    }
  };

  const getConfigurationPanel = () => {
    return (
      <div>
        <h2>This ticket is in CONFIGURATION state.</h2>
        <div>
          <h3>Leftover address</h3>
          If there is too much Bitcoin, the surplus will be sent back to this
          address:
          <label>Leftover address</label>
          <input
            type="text"
            placeholder="Your btc address"
            value="bc1qm9g2k3fznl2a9vghnpnwem87p03txl4y5lahyu"
          />
          <button onClick={null}>Set leftover address</button>
        </div>
        {getMasterConfigurationPanel()}

        <button onClick={null}>Send payment</button>
      </div>
    );
  };

  const getReceptionPanel = () => {
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
  };

  const getReceivedPanel = () => {
    return (
      <div>
        <h2>This ticket is in RECEIVED state.</h2>
        <div>
          <h3>Your bitcoins have been received</h3>
          Please confirm here once you've received what you paid for. If there
          is an issue, click on "there is an issue" button to open a dispute.
          <button onClick={null}>
            Confirm the reception of what I paid for
          </button>
          <button onClick={null}>Open an issue</button>
        </div>
      </div>
    );
  };

  const getSendingPanel = () => {
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
  };

  const getSentPanel = () => {
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
  };

  const getDisputePanel = () => {
    return (
      <div>
        <h2>This ticket is in DISPUTE state.</h2>
        <div>
          <h3>Contact us to fix the problem</h3>
          You have reported a problem, please contact us on matrix to solve it.
        </div>
      </div>
    );
  };

  const showStatusBox = (status) => {
    switch (status) {
      case 0:
        return getConfigurationPanel();
      case 1:
        return getReceptionPanel();
      case 2:
        return getReceivedPanel();
      case 3:
        return getSendingPanel();
      case 4:
        return getSentPanel();
      case 5:
        return getDisputePanel();
    }
  };

  return (
    <div class={style.panel}>
      <h1>Spender Panel</h1>
      BTC address: {id}
      Amount to send: {infos["amount"]}
      {showStatusBox(infos["status"])}
      {showMasterBox()}
    </div>
  );
}

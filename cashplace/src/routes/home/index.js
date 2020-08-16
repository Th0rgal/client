import style from "./style";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { Button } from 'preact-fluid';


export default function Home({ requestsManager }) {
  const [hasCode, setCode] = useState(false);
  const [isCreating, setCreating] = useState(false);

  const createTicket = () => {
    setCreating(true);
    requestsManager
      .createTicket("btc")
      .then((response) => response.json())
      .then((response) => {
        if ("id" in response) {
          route(response["id"], true);
        } else if ("error" in response) console.log(response["error"]);
        else console.log("error");
      });
  };

  const displayCodeField = () => {
    if (hasCode) return <input type="text" placeholder="code" />;
  };

  const displayCreateButton = () => {
    if (!isCreating)
      return <Button onClick={() => createTicket()}>create</Button>;
    else return <div>creating ticket...</div>;
  };

  return (
    <div class={style.home}>
      <h1>Create a ticket {hasCode}</h1>
      <p>Here you can create a ticket to secure a Bitcoin transaction.</p>

      <div>
        <label>
          <input
            type="checkbox"
            checked={hasCode}
            onChange={() => setCode(!hasCode)}
          />
          Use a code?
        </label>
        {displayCodeField()}
        {displayCreateButton()}
      </div>
    </div>
  );
}

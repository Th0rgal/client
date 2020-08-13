import { useState } from "preact/hooks";
import style from "./style";

export default function SpenderPanel({ id, infos }) {

  return (
    <div class={style.panel}>
      <h1>Blockchain address: {id}</h1>

    </div>
  );
}

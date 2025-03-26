import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const newGameButton = document.getElementById("newGame");
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
newGameButton.addEventListener("click", () => board.style.display = "flex");
const board = document.getElementById("board");
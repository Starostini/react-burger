import React from "react";
import { useState } from "react";
import "./App.css";
import Main from "./compoments/main/Main.jsx";
import AppHeader from "./compoments/header/AppHeader.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AppHeader />
      <Main />
    </>
  );
}

export default App;

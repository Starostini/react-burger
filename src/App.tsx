import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import Main from "./compoments/main/Main.tsx";
import AppHeader from "./compoments/header/AppHeader.tsx";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <AppHeader />
        <Main />
      </>
    </DndProvider>
  );
}

export default App;

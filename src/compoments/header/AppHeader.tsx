import React from "react";
import headerStyles from "./header.module.css";
import Navigation from "../nav/Navigation";

const AppHeader = () => {
  return (
    <header className={`${headerStyles.header} pt-4 pb-4`}>
      <Navigation />
    </header>
  );
};

export default AppHeader;

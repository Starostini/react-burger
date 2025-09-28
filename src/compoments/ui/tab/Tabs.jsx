import React from "react";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
const Tabs = ({ props, activeTab, onChange }) => {
  const tabs = props;
  return (
    <div style={{ display: "flex" }} className="mb-10">
      {tabs.map((tab) => (
        <Tab
          key={tab.type_id}
          value={tab.type}
          active={activeTab === tab.type}
          onClick={() => onChange(tab.type)}
        >
          {tab.name}
        </Tab>
      ))}
    </div>
  );
};

export default Tabs;

import React from "react";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import stylesTabs from "./tabs.module.css";
import type { IngredientHead } from "../../Interfaces/Interfaces";

interface TabsProps {
  props: Array<Pick<IngredientHead, "type_id" | "name" | "type">>;
  activeTab: IngredientHead["type"] | "";
  onChange: (type: IngredientHead["type"]) => void;
}

const Tabs: React.FC<TabsProps> = ({ props, activeTab, onChange }) => {
  const tabs = props;
  return (
    <div className={`${stylesTabs.container} mb-10`}>
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

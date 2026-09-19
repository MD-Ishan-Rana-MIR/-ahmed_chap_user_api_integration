import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { TabItem, TabStatus } from "../../../lib/type";

interface StatusTabsProps {
  tabs: TabItem[];
  activeTab: TabStatus;
  onSelectTab: (tab: TabStatus) => void;
  getTabCount: (status: TabStatus) => number;
}

export const StatusTabs: React.FC<StatusTabsProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  getTabCount,
}) => (
  <View style={tw`flex-row border-b border-[#DCDCDC]`}>
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      const count = getTabCount(tab.id);

      return (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onSelectTab(tab.id)}
          activeOpacity={0.7}
          style={tw`flex-1 items-center pb-3 relative`}
        >
          <Text
            style={tw`${
              isActive
                ? "text-[#F75908] font-Manrope-Medium text-sm"
                : "text-sm text-[#757575] font-Manrope-Regular"
            }`}
          >
            {tab.label} ({count})
          </Text>
          {isActive && (
            <View
              style={tw`absolute bottom-0 left-0 right-0 h-[2px] bg-[#F75908]`}
            />
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

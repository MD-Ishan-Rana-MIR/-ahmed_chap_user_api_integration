import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { SectionProps } from "../../../lib/type";
import { OrdersFlatList } from "./OrdersFlatList";

export const BusSection: React.FC<SectionProps> = (props) => (
  <View style={tw`flex-1`}>
    <View style={tw`px-4 py-2 bg-purple-50 mb-2 rounded-lg mx-4`}>
      <Text style={tw`text-xs font-bold text-purple-600`}>
        Bus Travel Tickets & Boarding Passes
      </Text>
    </View>
    <OrdersFlatList {...props} />
  </View>
);

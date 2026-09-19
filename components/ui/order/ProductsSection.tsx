import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import { SectionProps } from "../../../lib/type";
import { OrdersFlatList } from "./OrdersFlatList";

export const ProductsSection: React.FC<SectionProps> = (props) => (
  <View style={tw`flex-1`}>
    <OrdersFlatList {...props} />
  </View>
);

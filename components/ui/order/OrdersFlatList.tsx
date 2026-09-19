import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import { SectionProps } from "../../../lib/type";
import { ProductOroderCard } from "./ProductOroderCard";

export const OrdersFlatList: React.FC<SectionProps> = ({
  orders,
  activeTab,
  onCancel,
  onTrack,
  onOpenFeedback,
}) => (
  <FlatList
    data={orders}
    keyExtractor={(item) => item.id}
    contentContainerStyle={tw`p-4 gap-4 pb-10`}
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={
      <View style={tw`py-20 items-center justify-center`}>
        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
        <Text style={tw`text-gray-400 text-sm mt-2 font-medium`}>
          No {activeTab} orders found for this category.
        </Text>
      </View>
    }
    renderItem={({ item }) => (
      <ProductOroderCard
        order={item}
        onCancel={onCancel}
        onTrack={onTrack}
        onOpenFeedback={onOpenFeedback}
      />
    )}
  />
);

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import { SectionProps } from "../../../lib/type";
import { RestaurantCard } from "./ResturantOrderCard";

export const RestaurantsSection: React.FC<SectionProps> = ({
  orders,
  activeTab,
  onCancel,
  onTrack,
  onOpenFeedback,
}) => (
  <View style={tw`flex-1 bg-white`}>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={tw`p-4 pb-10`}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={tw`py-20 items-center justify-center`}>
          <Ionicons name="restaurant-outline" size={48} color="#D1D5DB" />
          <Text style={tw`text-gray-400 text-sm mt-2 font-medium`}>
            No {activeTab} restaurant orders found.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <RestaurantCard
          orderId={item.orderId}
          title={item.title}
          itemsCount={item.items}
          time={item.time}
          price={item.price}
          status={item.status}
          imageUri={item.imageUri}
          onCancel={() => onCancel(item.id)}
          onTrack={() => onTrack(item.id)}
          onGiveFeedback={() => onOpenFeedback(item.id)}
        />
      )}
    />
  </View>
);

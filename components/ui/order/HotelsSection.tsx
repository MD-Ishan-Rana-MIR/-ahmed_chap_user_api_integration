import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import { SectionProps } from "../../../lib/type";
import { HotelOrderCard } from "./HotelOrderCard";

export const HotelsSection: React.FC<SectionProps> = ({
  orders,
  activeTab,
}) => (
  <View style={tw`flex-1 bg-white`}>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={tw`p-4 gap-4 pb-10`}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={tw`py-20 items-center justify-center`}>
          <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
          <Text style={tw`text-gray-400 text-sm mt-2 font-medium`}>
            No {activeTab} hotel bookings found.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <HotelOrderCard
          hotelName={item.title}
          badgeText={item.status}
          imageUri={item.imageUri}
        />
      )}
    />
  </View>
);

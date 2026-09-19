import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import tw from "twrnc";

export interface HotelCardProps {
  imageUri?: string;
  badgeText?: string;
  hotelName?: string;
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomCount?: string;
  guestCount?: string;
}

export const HotelOrderCard: React.FC<HotelCardProps> = ({
  imageUri = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  badgeText = "Checked In",
  hotelName = "Palm Garden Resort",
  guestName = "Amara Yusuf",
  checkInDate = "Aug 22, 2026",
  checkOutDate = "Aug 27, 2026",
  roomCount = "2 Room",
  guestCount = "4 Guests",
}) => {
  return (
    <View
      style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs`}
    >
      {/* Top Banner Image with Badge */}
      <View style={tw`relative w-full h-44`}>
        <Image
          source={{ uri: imageUri }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
        {/* Checked In Badge */}
        <View
          style={tw`absolute top-3 right-3 bg-[#FFF5EC] px-3.5 py-1.5 rounded-full`}
        >
          <Text style={tw`text-[#FF8C38] text-xs font-semibold`}>
            {badgeText}
          </Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={tw`p-4`}>
        {/* Title & Guest Row */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text
            style={tw`text-base font-bold text-gray-900 flex-1 pr-2`}
            numberOfLines={1}
          >
            {hotelName}
          </Text>
          <Text style={tw`text-xs text-gray-500 font-medium`}>{guestName}</Text>
        </View>

        {/* Check-In / Check-Out Row */}
        <View
          style={tw`flex-row items-center justify-between py-3 border-t border-b border-gray-100`}
        >
          {/* Check-In */}
          <View>
            <Text
              style={tw`text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1`}
            >
              CHECK-IN
            </Text>
            <Text style={tw`text-xs font-bold text-gray-900`}>
              {checkInDate}
            </Text>
          </View>

          {/* Transfer Indicator */}
          <View style={tw`flex-row items-center gap-1.5`}>
            <View style={tw`w-5 h-[1px] bg-gray-300`} />
            <Ionicons name="arrow-forward" size={12} color="#F86B17" />
            <View style={tw`w-5 h-[1px] bg-gray-300`} />
          </View>

          {/* Check-Out */}
          <View style={tw`items-end`}>
            <Text
              style={tw`text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1`}
            >
              CHECK-OUT
            </Text>
            <Text style={tw`text-xs font-bold text-gray-900`}>
              {checkOutDate}
            </Text>
          </View>
        </View>

        {/* Footer Meta Details */}
        <View style={tw`flex-row justify-between items-center mt-3.5`}>
          {/* Rooms */}
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={tw`w-6 h-6 rounded-full bg-orange-50 items-center justify-center`}
            >
              <Ionicons name="briefcase-outline" size={13} color="#F86B17" />
            </View>
            <Text style={tw`text-xs text-gray-600 font-medium`}>
              {roomCount}
            </Text>
          </View>

          {/* Guests */}
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={tw`w-6 h-6 rounded-full bg-orange-50 items-center justify-center`}
            >
              <Ionicons name="person-outline" size={13} color="#F86B17" />
            </View>
            <Text style={tw`text-xs text-gray-600 font-medium`}>
              {guestCount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

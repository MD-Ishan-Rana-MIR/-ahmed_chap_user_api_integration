import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export interface RestaurantCardProps {
  orderId?: string;
  title?: string;
  itemsCount?: string;
  time?: string;
  price?: string;
  status?: string;
  imageUri?: string;
  tabStatus: string;
  onCancel?: () => void;
  onTrack?: () => void;
  onGiveFeedback?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  orderId = "#ORD-10421",
  title = "Beef Burger",
  itemsCount = "01 Item",
  tabStatus = "completed",
  time = "Today, 2:30 PM",
  price = "$42",
  status = "Completed",
  imageUri = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
  onCancel,
  onTrack,
  onGiveFeedback,
}) => {
  const isCompleted = status.toLowerCase() === "completed";
  const isCancelled = status.toLowerCase() === "cancelled";

  return (
    <View
      style={tw`bg-white rounded-2xl p-4 border border-gray-100 shadow-xs mb-3`}
    >
      {/* Order ID Header */}
      <Text
        style={tw`text-xs font-semibold text-[#FF8C38] pb-3 border-b border-gray-100 mb-3`}
      >
        {orderId}
      </Text>

      {/* Main Order Details */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center flex-1 pr-2 gap-3`}>
          {/* Item Thumbnail Container */}
          <View
            style={tw`w-16 h-16 bg-gray-100 rounded-xl overflow-hidden justify-center items-center`}
          >
            <Image
              source={{ uri: imageUri }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </View>

          {/* Details Column */}
          <View style={tw`flex-1 gap-1`}>
            <Text style={tw`text-sm font-bold text-gray-800`} numberOfLines={1}>
              {title}
            </Text>

            <View style={tw`flex-row items-center gap-3`}>
              <Text style={tw`text-xs text-gray-400 font-normal`}>
                {itemsCount}
              </Text>
              <Text style={tw`text-xs text-gray-400 font-normal`}>{time}</Text>
            </View>

            <Text style={tw`text-xs font-bold text-[#FF8C38]`}>{price}</Text>
          </View>
        </View>

        {/* Status Pill Badge */}
        <View style={tw`bg-[#FFF5EC] px-3 py-1 rounded-full self-start mt-1`}>
          <Text style={tw`text-xs font-semibold text-[#FF8C38]`}>{status}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {isCompleted ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGiveFeedback}
          style={tw`w-full bg-[#FFF5EC] py-3 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-[#FF8C38]`}>
            Give Feedback
          </Text>
        </TouchableOpacity>
      ) : isCancelled ? null : (
        <View style={tw`flex-row gap-3`}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCancel}
            style={tw`flex-1 bg-[#F5F5F3] py-3 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-xs font-bold text-gray-700`}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onTrack}
            style={tw`flex-1 bg-[#FFF5EC] py-3 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-xs font-bold text-[#FF8C38]`}>
              Track Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

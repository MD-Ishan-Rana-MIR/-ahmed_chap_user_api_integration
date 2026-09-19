import { router, type RelativePathString } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { OrderItem } from "../../../lib/type";

interface OrderCardProps {
  order: OrderItem;
  onCancel?: (id: string) => void;
  onTrack?: (id: string) => void;
  onOpenFeedback: (orderId: string) => void;
}

export const ProductOroderCard: React.FC<OrderCardProps> = ({
  order,
  onCancel,
  onTrack,
  onOpenFeedback,
}) => (
  <View style={tw`bg-white border border-gray-200 rounded-2xl p-4 shadow-xs`}>
    <Text
      style={tw`text-xs font-Manrope-Medium text-[#F86B17] pb-3 border-b border-[#EBEBEB] mb-4`}
    >
      {order.orderId}
    </Text>

    <View style={tw`flex-row justify-between items-start mb-4`}>
      <View style={tw`flex-row gap-3 flex-1 pr-2`}>
        <View
          style={tw`w-19.5 h-19.5 bg-[#F3F3F3] flex-row items-center justify-center rounded-[8px]`}
        >
          <Image
            source={{ uri: order.imageUri }}
            style={tw`w-14 h-14 rounded-xl`}
            resizeMode="cover"
          />
        </View>
        <View style={tw`flex-1 justify-center gap-0.5`}>
          <Text
            style={tw`text-sm font-Manrope-Medium text-[#505050]`}
            numberOfLines={1}
          >
            {order.title}
          </Text>
          <View style={tw`flex-row items-center gap-4 mt-1`}>
            <Text style={tw`text-xs text-[#858585] font-Manrope-Regular`}>
              {order.items}
            </Text>
            <Text style={tw`text-xs text-[#858585] font-Manrope-Regular`}>
              {order.time}
            </Text>
          </View>
          <Text style={tw`text-xs font-Manrope-Regular text-[#F86B17] mt-1`}>
            {order.price}
          </Text>
        </View>
      </View>

      <View style={tw`bg-[#FFF5E6] px-2 py-1 rounded-full`}>
        <Text style={tw`text-xs font-Manrope-Regular text-[#FF9800]`}>
          {order.status}
        </Text>
      </View>
    </View>

    {order.status.toLowerCase() === "completed" ? (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onOpenFeedback(order.id)}
        style={tw`flex-1 bg-[#FFF2EA] py-3 rounded-full items-center justify-center`}
      >
        <Text style={tw`text-xs font-bold text-[#F86B17]`}>Give Feedback</Text>
      </TouchableOpacity>
    ) : order.status.toLowerCase() === "cancelled" ? null : (
      <View style={tw`flex-row gap-3 flex-1`}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onCancel && onCancel(order.id)}
          style={tw`flex-1 bg-[#F5F5F3] py-3 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-gray-900`}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: "/order-live-tracking/[id]" as RelativePathString,
              params: { id: order.id },
            });
          }}
          style={tw`flex-1 bg-[#FFF2EA] py-3 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-[#F86B17]`}>Track Order</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

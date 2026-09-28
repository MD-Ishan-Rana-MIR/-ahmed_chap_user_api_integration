import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { NotificationItem } from "../../../lib/type/notificationType";

interface Props {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
}

export const NotificationCard: React.FC<Props> = ({ item, onPress }) => {
  // Format creation time relative or standard format
  const formattedTime = new Date(item.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={tw`px-4 rounded-2xl py-3.5 border-b border-gray-100 ${
        !item.read ? "bg-amber-50/50" : "bg-white"
      } flex-row items-start gap-3`}
    >
      {/* Read Status Dot Indicator */}
      <View style={tw`pt-1.5`}>
        <View
          style={tw`w-2.5 h-2.5 rounded-full ${
            !item.read ? "bg-[#FF5C00]" : "bg-transparent"
          }`}
        />
      </View>

      {/* Main Content */}
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center justify-between mb-1`}>
          <Text
            style={tw`font-semibold text-[15px] ${
              !item.read ? "text-gray-900" : "text-gray-700"
            }`}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text style={tw`text-[11px] text-gray-400 font-medium`}>
            {formattedDate} • {formattedTime}
          </Text>
        </View>

        <Text style={tw`text-xs text-gray-600 leading-4 mb-1.5`}>
          {item.message}
        </Text>

        {/* Optional Data Tag (Earned amount badge or order number) */}
        {item.data?.earned_amount && (
          <View style={tw`flex-row items-center mt-1`}>
            <View style={tw`bg-emerald-100 px-2 py-0.5 rounded-md`}>
              <Text style={tw`text-[11px] font-semibold text-emerald-700`}>
                +{item.data.currency} {item.data.earned_amount.toFixed(2)}
              </Text>
            </View>
            {item.data.order_number && (
              <Text style={tw`text-[11px] text-gray-400 ml-2 font-medium`}>
                {item.data.order_number}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

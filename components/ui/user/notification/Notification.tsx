import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";

interface NotificationItemProps {
  text: React.ReactNode;
  time: string;
}

const NotificationItem = ({ text, time }: NotificationItemProps) => {
  return (
    <View style={tw`flex-row items-start gap-3.5 mb-6`}>
      {/* Icon Circle */}
      <View
        style={tw`w-11 h-11 rounded-full bg-[#F4F4F6] items-center justify-center mt-0.5`}
      >
        <Ionicons name="notifications-outline" size={20} color="#1F2937" />
      </View>

      {/* Text Content */}
      <View style={tw`flex-1`}>
        <Text
          style={tw`text-sm text-[#222222] font-Manrope-Regular.ttf leading-5`}
        >
          {text}
        </Text>
        <Text
          style={tw`text-[10px] text-[#858585] font-Manrope-Regular.ttf mt-1.5`}
        >
          {time}
        </Text>
      </View>
    </View>
  );
};

export default function Notifications() {
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Notifications" showBackButton={true} />

      {/* Main Content Area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-2 pb-10`}
      >
        {/* TODAY Section Header */}
        <View style={tw`flex-row justify-between items-center mt-2 mb-5`}>
          <Text
            style={tw`text-sm font-Manrope-Medium.ttf text-[#484848] tracking-wider uppercase`}
          >
            TODAY
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={tw`text-sm font-Manrope-Medium.ttf text-[#1A1A1A]`}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        {/* TODAY Items */}
        <NotificationItem
          text="Your order has been delivered. Take a moment to rate the merchant and share your experience."
          time="11.00 AM"
        />

        <NotificationItem
          text="Your hotel check-in at Grand Palace Hotel is tomorrow. Get ready for your stay."
          time="11.00 AM"
        />

        <NotificationItem
          text={
            <Text>
              Your bus from Dhaka to Chittagong departs at{" "}
              <Text style={tw`font-bold text-[#111827]`}>8:00 AM</Text>. Don't
              forget to arrive early.
            </Text>
          }
          time="11.00 AM"
        />

        <NotificationItem
          text="There has been an update to your hotel booking. Please review the latest booking details."
          time="11.00 AM"
        />

        {/* YESTERDAY Section Header */}
        <View style={tw`mt-2 mb-5`}>
          <Text style={tw`text-sm font-semibold text-[#4B5563]`}>
            Yesterday
          </Text>
        </View>

        {/* YESTERDAY Items */}
        <NotificationItem
          text="Your order has been delivered. Take a moment to rate the merchant and share your experience."
          time="11.00 AM"
        />

        <NotificationItem
          text="Your hotel check-in at Grand Palace Hotel is tomorrow. Get ready for your stay."
          time="11.00 AM"
        />

        <NotificationItem
          text={
            <Text>
              Your bus from Dhaka to Chittagong departs at{" "}
              <Text style={tw`font-bold text-[#111827]`}>8:00 AM</Text>. Don't
              forget to arrive early.
            </Text>
          }
          time="11.00 AM"
        />

        <NotificationItem
          text="There has been an update to your hotel booking. Please review the latest booking details."
          time="11.00 AM"
        />
      </ScrollView>
    </View>
  );
}

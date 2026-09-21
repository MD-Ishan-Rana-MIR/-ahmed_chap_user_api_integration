import {
  useCancelFoodOrderMutation,
  useProvideFoodFeedbackMutation,
} from "@/redux/orderApi";
import { Ionicons } from "@expo/vector-icons"; // Star Icon এর জন্য
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";

export interface RestaurantCardProps {
  orderId?: string;
  rawId?: number | string;
  title?: string;
  itemsCount?: string;
  time?: string;
  price?: string;
  status?: string;
  imageUri?: string;
  tabStatus?: string;
  onTrack?: () => void;
  onGiveFeedback?: () => void;
  onCancelSubmit?: (reason: string) => Promise<void> | void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  orderId = "#ORD-10421",
  rawId,
  title = "Beef Burger",
  itemsCount = "01 Item",
  tabStatus = "completed",
  time = "Today, 2:30 PM",
  price = "$42",
  status = "Completed",
  imageUri = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
  onTrack,
}) => {
  // Cancel Modal States
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Feedback Modal States
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");

  const isCompleted = status.toLowerCase() === "completed";
  const isCancelled = status.toLowerCase() === "cancelled";

  // Mutations
  const [cancelFoodOrder, { isLoading: isCancelLoading }] =
    useCancelFoodOrderMutation();

  // ======================================== Feedback Api ==================================================

  const [provideFoodFeedback, { isLoading: isFeedbackLoading }] =
    useProvideFoodFeedbackMutation();

  // Cancel Handler
  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) return;

    try {
      const res = await cancelFoodOrder({
        id: rawId || orderId,
        reason: cancelReason,
      }).unwrap();
      if (res) {
        setIsCancelModalVisible(false);
        setCancelReason("");
        successMsg(res?.message || "Order cancelled successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      errorMsg(errorMessage);
    }
  };

  // Feedback Handler
  const handleConfirmFeedback = async () => {
    if (rating === 0) return;

    const payload = {
      rating: rating,
      review_comment: feedbackComment,
    };

    try {
      const res = await provideFoodFeedback({
        id: orderId,
        payload,
      }).unwrap();

      if (res) {
        setIsFeedbackModalVisible(false);
        setRating(0);
        setFeedbackComment("");
        successMsg(res?.message || "Feedback submitted successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      errorMsg(errorMessage);
    }
  };

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
          {/* Item Thumbnail */}
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

        {/* Status Badge */}
        <View style={tw`bg-[#FFF5EC] px-3 py-1 rounded-full self-start mt-1`}>
          <Text style={tw`text-xs font-semibold text-[#FF8C38]`}>{status}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {isCompleted ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsFeedbackModalVisible(true)}
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
            onPress={() => setIsCancelModalVisible(true)}
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

      {/* ================= Cancel Reason Modal ================= */}
      <Modal
        visible={isCancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isCancelLoading) setIsCancelModalVisible(false);
        }}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-5`}>
          <View style={tw`bg-white w-full rounded-2xl p-5 shadow-lg`}>
            <Text style={tw`text-base font-bold text-gray-800 mb-2`}>
              Cancel Order
            </Text>
            <Text style={tw`text-xs text-gray-500 mb-4`}>
              Please tell us why you want to cancel this order.
            </Text>

            <TextInput
              style={tw`border border-gray-200 rounded-xl p-3 text-sm text-gray-800 mb-4 bg-gray-50 min-h-[90px]`}
              placeholder="Enter your cancellation reason..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={cancelReason}
              onChangeText={setCancelReason}
              editable={!isCancelLoading}
            />

            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isCancelLoading}
                onPress={() => {
                  setIsCancelModalVisible(false);
                  setCancelReason("");
                }}
                style={tw`flex-1 bg-gray-100 py-3 rounded-xl items-center`}
              >
                <Text style={tw`text-xs font-bold text-gray-600`}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmCancel}
                disabled={!cancelReason.trim() || isCancelLoading}
                style={tw`flex-1 py-3 rounded-xl items-center justify-center ${
                  cancelReason.trim() && !isCancelLoading
                    ? "bg-[#FF8C38]"
                    : "bg-gray-300"
                }`}
              >
                {isCancelLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={tw`text-xs font-bold text-white`}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= Give Feedback Modal ================= */}
      <Modal
        visible={isFeedbackModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isFeedbackLoading) setIsFeedbackModalVisible(false);
        }}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-5`}>
          <View style={tw`bg-white w-full rounded-2xl p-5 shadow-lg`}>
            <Text style={tw`text-base font-bold text-gray-800 mb-1`}>
              Give Feedback
            </Text>
            <Text style={tw`text-xs text-gray-500 mb-4`}>
              How was your order experience?
            </Text>

            {/* Star Rating Section */}
            <View style={tw`flex-row justify-center items-center gap-2 mb-4`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.7}
                  onPress={() => setRating(star)}
                  disabled={isFeedbackLoading}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#FF8C38" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Input Box */}
            <TextInput
              style={tw`border border-gray-200 rounded-xl p-3 text-sm text-gray-800 mb-4 bg-gray-50 min-h-[90px]`}
              placeholder="Write your feedback here (optional)..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              editable={!isFeedbackLoading}
            />

            {/* Modal Action Buttons */}
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isFeedbackLoading}
                onPress={() => {
                  setIsFeedbackModalVisible(false);
                  setRating(0);
                  setFeedbackComment("");
                }}
                style={tw`flex-1 bg-gray-100 py-3 rounded-xl items-center`}
              >
                <Text style={tw`text-xs font-bold text-gray-600`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmFeedback}
                disabled={rating === 0 || isFeedbackLoading}
                style={tw`flex-1 py-3 rounded-xl items-center justify-center ${
                  rating > 0 && !isFeedbackLoading
                    ? "bg-[#FF8C38]"
                    : "bg-gray-300"
                }`}
              >
                {isFeedbackLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={tw`text-xs font-bold text-white`}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

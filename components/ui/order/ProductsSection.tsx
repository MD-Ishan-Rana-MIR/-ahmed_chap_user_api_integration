import {
  useCancelEcommerceOrderMutation,
  useGetEcommerceProductOrderQuery,
  useProvideEcommerceProductFeedbackMutation,
} from "@/redux/orderApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { NotFoundState } from "../../../components/NotFoundState";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import { OrderSkeleton } from "../skeleton/OrderSkeleton";

interface TabItem {
  id: string;
  label: string;
}

const TABS: TabItem[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

interface ProductsSectionProps {
  initialStatus?: string; // "active" | "completed" | "cancelled"
  onTrack?: (orderId: string) => void;
  onOpenFeedback?: (orderId: string) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  initialStatus = "active",
  onTrack,
  onOpenFeedback,
}) => {
  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [page, setPage] = useState(1);

  // Cancel Modal & Form State
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Feedback Modal & Form State
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  // Tab change handler
  const handleTabChange = (statusId: string) => {
    setActiveTab(statusId);
    setPage(1);
  };

  // RTK Query API Hook Call
  const { data, isLoading, isFetching, refetch } =
    useGetEcommerceProductOrderQuery({
      filter: activeTab,
      page: page,
      perPage: 10,
    });

  const [cancelEcommerceOrder, { isLoading: isCancelling }] =
    useCancelEcommerceOrderMutation();

  const [provideEcommerceProductFeedback, { isLoading: isSubmittingFeedback }] =
    useProvideEcommerceProductFeedbackMutation();

  const orderStatusPill = data?.data?.counts;
  const ordersList = data?.data?.orders?.data || [];
  const currentPage = data?.data?.orders?.current_page || 1;
  const lastPage = data?.data?.orders?.last_page || 1;

  const getTabCount = (tabId: string): number => {
    if (!orderStatusPill) return 0;
    switch (tabId) {
      case "active":
        return orderStatusPill.active ?? orderStatusPill.pending ?? 0;
      case "completed":
        return orderStatusPill.completed ?? 0;
      case "cancelled":
        return orderStatusPill.cancelled ?? orderStatusPill.failed ?? 0;
      default:
        return orderStatusPill[tabId] ?? 0;
    }
  };

  // Infinite Scroll Handler
  const handleLoadMore = useCallback(() => {
    if (!isFetching && currentPage < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, currentPage, lastPage]);

  // Refresh Handler
  const handleRefresh = () => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  };

  // Open Cancel Modal
  const handleOpenCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setErrorMessage("");
    setIsCancelModalVisible(true);
  };

  // Close Cancel Modal
  const handleCloseCancelModal = () => {
    if (isCancelling) return;
    setIsCancelModalVisible(false);
    setSelectedOrderId(null);
    setCancelReason("");
    setErrorMessage("");
  };

  // Confirm Order Cancellation with Validation
  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setErrorMessage("Please enter a reason for cancellation.");
      return;
    }

    if (!selectedOrderId) return;

    try {
      const res = await cancelEcommerceOrder({
        reason: cancelReason.trim(),
        id: selectedOrderId,
      }).unwrap();
      if (res) {
        handleCloseCancelModal();
        refetch();
        return successMsg(res?.message || "Order cancelled successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      return errorMsg(errorMessage);
    }
  };

  // Open Feedback Modal
  const handleOpenFeedbackModal = (orderId: string) => {
    setFeedbackOrderId(orderId);
    setRating(0);
    setFeedbackComment("");
    setFeedbackError("");
    setIsFeedbackModalVisible(true);

    // Call external callback if provided
    if (onOpenFeedback) {
      onOpenFeedback(orderId);
    }
  };

  // Close Feedback Modal
  const handleCloseFeedbackModal = () => {
    if (isSubmittingFeedback) return;
    setIsFeedbackModalVisible(false);
    setFeedbackOrderId(null);
    setRating(0);
    setFeedbackComment("");
    setFeedbackError("");
  };

  // Submit Feedback Handler
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setFeedbackError("Please select a star rating.");
      return;
    }

    if (!feedbackComment.trim()) {
      setFeedbackError("Please share your feedback comments.");
      return;
    }

    if (!feedbackOrderId) return;

    const payload = {
      rating: rating,
      review_comment: feedbackComment.trim(),
    };

    try {
      const res = await provideEcommerceProductFeedback({
        id: feedbackOrderId,
        payload,
      }).unwrap();

      successMsg(res?.message || "Feedback submitted successfully!");
      handleCloseFeedbackModal();
      refetch();
    } catch (error: any) {
      const msg =
        error?.data?.message || error?.message || "Failed to submit feedback.";
      errorMsg(msg);
    }
  };

  // Status Badge Color Map
  const getStatusColor = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <View style={tw`flex-1 bg-white px-4`}>
      {/* Dynamic Tab Bar Header with Badge Pills */}
      <View style={tw`flex-row border-b border-gray-200 mb-4`}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getTabCount(tab.id);

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabChange(tab.id)}
              style={tw`flex-1 py-3 flex-row items-center justify-center gap-x-1.5 border-b-2 ${
                isActive ? "border-[#5B7410]" : "border-transparent"
              }`}
              activeOpacity={0.7}
            >
              <Text
                style={tw`text-sm font-semibold ${
                  isActive ? "text-[#5B7410]" : "text-gray-500"
                }`}
              >
                {tab.label}
              </Text>

              <View
                style={tw`px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-[#5B7410]" : "bg-gray-100"
                }`}
              >
                <Text
                  style={tw`text-xs font-bold ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Loading Skeleton */}
      {isLoading && page === 1 ? (
        <OrderSkeleton />
      ) : (
        <FlatList
          data={ordersList}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-6 gap-y-3 ${
            ordersList.length === 0 ? "flex-1 justify-center" : ""
          }`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
              tintColor="#5B7410"
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <NotFoundState
                title="No Orders Found"
                message={`You have no ${activeTab} orders at this moment.`}
              />
            ) : null
          }
          renderItem={({ item }) => {
            const firstItem = item.items?.[0];
            return (
              <View
                style={tw`bg-white rounded-xl border border-gray-200 p-4 shadow-sm`}
              >
                {/* Top Row: Order ID & Status */}
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <Text style={tw`font-bold text-gray-800 text-sm`}>
                    {item.order_number}
                  </Text>
                  <View
                    style={tw`px-2.5 py-1 rounded-full ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    <Text style={tw`text-xs font-semibold capitalize`}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Item Details */}
                <View style={tw`flex-row items-center gap-x-3 my-2`}>
                  <View style={tw`w-15 h-15 bg-[#F3F3F3] rounded-[8px] p-1`}>
                    <Image
                      source={
                        firstItem?.image
                          ? { uri: firstItem.image }
                          : require("../../../assets/product/product.png")
                      }
                      style={tw`w-14 h-14 rounded-lg bg-gray-100`}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text
                      style={tw`font-semibold text-gray-900 text-sm`}
                      numberOfLines={1}
                    >
                      {firstItem?.name || "Product Name"}
                    </Text>
                    <Text style={tw`text-xs text-gray-500 mt-0.5`}>
                      {item.store?.business_name || "Store"} •{" "}
                      {item.items?.length || 0} Item(s)
                    </Text>
                    <Text style={tw`text-[#5B7410] text-xs mt-1 font-semibold`}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={tw`text-[10px] font-semibold text-gray-900`}>
                      {item.currency} {item.grand_total}
                    </Text>
                  </View>
                </View>

                {/* Footer: Actions */}
                <View
                  style={tw`flex-row justify-between items-center pt-3 mt-1 border-t border-gray-100`}
                >
                  <View>
                    {activeTab === "active" && (
                      <TouchableOpacity
                        onPress={() => handleOpenCancelModal(String(item.id))}
                        style={tw`bg-[#F5F5F5] px-4 py-2 rounded-full`}
                        activeOpacity={0.8}
                      >
                        <Text style={tw`text-black font-medium text-xs`}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={tw`flex-row gap-x-2`}>
                    {activeTab === "active" && (
                      <TouchableOpacity
                        onPress={() => onTrack?.(String(item.id))}
                        style={tw`bg-[#FEF0E8] px-4 py-2 rounded-full`}
                        activeOpacity={0.8}
                      >
                        <Text style={tw`text-[#F86B17] font-medium text-xs`}>
                          Track Order
                        </Text>
                      </TouchableOpacity>
                    )}

                    {activeTab === "completed" && (
                      <TouchableOpacity
                        onPress={() => handleOpenFeedbackModal(String(item.id))}
                        style={tw`bg-[#5B7410] px-4 py-2 rounded-full`}
                        activeOpacity={0.8}
                      >
                        <Text style={tw`text-white font-medium text-xs`}>
                          Feedback
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View style={tw`py-4 items-center justify-center`}>
                <ActivityIndicator size="small" color="#5B7410" />
              </View>
            ) : null
          }
        />
      )}

      {/* Middle Cancel Confirmation Modal */}
      <Modal
        transparent
        visible={isCancelModalVisible}
        animationType="fade"
        onRequestClose={handleCloseCancelModal}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-6`}>
          <View
            style={tw`bg-white w-full rounded-2xl p-5 items-center shadow-lg`}
          >
            <Text style={tw`text-lg font-bold text-gray-900 text-center mb-1`}>
              Cancel Order
            </Text>
            <Text style={tw`text-xs text-gray-500 text-center mb-4`}>
              Please tell us why you want to cancel this order.
            </Text>

            {/* Input Box */}
            <View style={tw`w-full mb-1`}>
              <TextInput
                value={cancelReason}
                onChangeText={(text) => {
                  setCancelReason(text);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Enter cancellation reason..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={tw`w-full bg-gray-50 border ${
                  errorMessage ? "border-red-500" : "border-gray-200"
                } rounded-xl p-3 text-sm text-gray-800 min-h-[80px]`}
              />
            </View>

            {/* Error Message Display */}
            {errorMessage ? (
              <Text
                style={tw`text-xs text-red-500 self-start mb-3 font-medium`}
              >
                {errorMessage}
              </Text>
            ) : (
              <View style={tw`mb-3`} />
            )}

            {/* Modal Actions */}
            <View style={tw`flex-row gap-x-3 w-full mt-2`}>
              <TouchableOpacity
                disabled={isCancelling}
                onPress={handleCloseCancelModal}
                style={tw`flex-1 bg-gray-100 py-3 rounded-xl items-center`}
                activeOpacity={0.7}
              >
                <Text style={tw`text-gray-700 font-semibold text-sm`}>
                  Keep Order
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isCancelling}
                onPress={handleConfirmCancel}
                style={tw`flex-1 bg-[#5B7410] py-3 rounded-xl items-center justify-center flex-row gap-x-2`}
                activeOpacity={0.7}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={tw`text-white font-semibold text-sm`}>
                    Confirm Cancel
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 5-Star Feedback Modal */}
      <Modal
        transparent
        visible={isFeedbackModalVisible}
        animationType="fade"
        onRequestClose={handleCloseFeedbackModal}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-6`}>
          <View
            style={tw`bg-white w-full rounded-2xl p-5 items-center shadow-lg`}
          >
            <Text style={tw`text-lg font-bold text-gray-900 text-center mb-1`}>
              Order Feedback
            </Text>
            <Text style={tw`text-xs text-gray-500 text-center mb-4`}>
              How was your experience with this order?
            </Text>

            {/* 5-Star Rating Component */}
            <View style={tw`flex-row gap-x-2 my-2 items-center justify-center`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => {
                    setRating(star);
                    if (feedbackError) setFeedbackError("");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#F59E0B" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Comment Input Box */}
            <View style={tw`w-full mt-3 mb-1`}>
              <TextInput
                value={feedbackComment}
                onChangeText={(text) => {
                  setFeedbackComment(text);
                  if (feedbackError) setFeedbackError("");
                }}
                placeholder="Write your review or experience..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={tw`w-full bg-gray-50 border ${
                  feedbackError ? "border-red-500" : "border-gray-200"
                } rounded-xl p-3 text-sm text-gray-800 min-h-[90px]`}
              />
            </View>

            {/* Error Message Display */}
            {feedbackError ? (
              <Text
                style={tw`text-xs text-red-500 self-start mb-3 font-medium`}
              >
                {feedbackError}
              </Text>
            ) : (
              <View style={tw`mb-3`} />
            )}

            {/* Modal Actions */}
            <View style={tw`flex-row gap-x-3 w-full mt-2`}>
              <TouchableOpacity
                disabled={isSubmittingFeedback}
                onPress={handleCloseFeedbackModal}
                style={tw`flex-1 bg-gray-100 py-3 rounded-xl items-center`}
                activeOpacity={0.7}
              >
                <Text style={tw`text-gray-700 font-semibold text-sm`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isSubmittingFeedback}
                onPress={handleSubmitFeedback}
                style={tw`flex-1 bg-[#5B7410] py-3 rounded-xl items-center justify-center flex-row gap-x-2`}
                activeOpacity={0.7}
              >
                {isSubmittingFeedback ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={tw`text-white font-semibold text-sm`}>
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductsSection;

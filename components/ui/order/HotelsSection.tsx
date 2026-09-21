import {
  useCancelBookingMutation,
  useFeedbackBookingMutation,
  useGetHotelBookingsQuery,
} from "@/redux/orderApi";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import { TabItem } from "../../../lib/type";
import { NotFoundState } from "../../NotFoundState";
import { OrderSkeleton } from "../skeleton/OrderSkeleton";

type TabType = "active" | "completed" | "cancelled";

// Status Badge Helper
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
    case "active":
      return { bg: "bg-[#FFF2E2]", text: "text-[#FF9500]", label: "Active" };
    case "completed":
      return { bg: "bg-green-50", text: "text-green-600", label: "Completed" };
    case "cancelled":
      return { bg: "bg-red-50", text: "text-red-500", label: "Cancelled" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600", label: status };
  }
};

const TABS: TabItem[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

// Date Formatter Helper
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const HotelsSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [page, setPage] = useState(1);

  // Selected Booking Item for Modals
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Modal States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetHotelBookingsQuery({
    filter: activeTab,
    page: page,
    perPage: 10,
  });

  const bookings = data?.data?.bookings?.data || [];
  const counts = data?.data?.counts;
  const lastPage = data?.data?.bookings?.last_page || 1;

  // RTK Query Mutations with isLoading state
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();
  const [feedbackBooking, { isLoading: isSubmittingFeedback }] =
    useFeedbackBookingMutation();

  // Tab count helper
  const getTabCount = (tabId: string) => {
    if (!counts) return 0;
    return counts[tabId as keyof typeof counts] || 0;
  };

  // Tab Filter Change Handler
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Infinite Scroll Handler
  const handleLoadMore = () => {
    if (!isFetching && page < lastPage) {
      setPage((prev) => prev + 1);
    }
  };

  // Cancel Handlers
  const handleOpenCancelModal = (item: any) => {
    setSelectedBooking(item);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim() || isCancelling) return;

    try {
      const res = await cancelBooking({
        id: selectedBooking?.id,
        reason: cancelReason,
      });

      if ("data" in res && res.data) {
        setIsCancelModalOpen(false);
        refetch();
        return successMsg(
          res.data?.message || "Booking cancelled successfully.",
        );
      }

      if ("error" in res && res.error) {
        const errorMessage =
          ("message" in res.error && typeof res.error.message === "string"
            ? res.error.message
            : undefined) || "An unexpected error occurred.";
        return errorMsg(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      return errorMsg(errorMessage);
    }
  };

  // Feedback Handlers
  const handleOpenFeedbackModal = (item: any) => {
    setSelectedBooking(item);
    setRating(0);
    setFeedbackText("");
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0 || !feedbackText.trim() || isSubmittingFeedback) return;

    const payload = {
      rating: rating,
      comment: feedbackText,
    };

    try {
      const res = await feedbackBooking({
        id: selectedBooking?.id,
        payload: payload,
      }).unwrap();

      if (res) {
        setIsFeedbackModalOpen(false);
        refetch();
        return successMsg(res?.message || "Feedback submitted successfully.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      return errorMsg(errorMessage);
    }
  };

  // Render Card Item
  const renderItem = ({ item }: { item: any }) => {
    const hotel = item?.hotel;
    const user = item?.user;
    const primaryImage =
      hotel?.images?.find((img: any) => img.is_primary)?.image_url ||
      hotel?.images?.[0]?.image_url ||
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39";

    const badge = getStatusBadge(item?.status);

    return (
      <View
        style={tw`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mx-4 my-2`}
      >
        {/* Top Banner Image with Status Pill */}
        <ImageBackground
          source={{ uri: primaryImage }}
          style={tw`w-full h-44 justify-start items-end p-3`}
          resizeMode="cover"
        >
          <View style={tw`${badge.bg} px-3.5 py-1.5 rounded-full`}>
            <Text style={tw`${badge.text} font-semibold text-xs uppercase`}>
              {badge.label}
            </Text>
          </View>
        </ImageBackground>

        {/* Details Container */}
        <View style={tw`p-4`}>
          {/* Title and Guest Name Row */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text
              style={tw`text-lg font-bold text-gray-900 flex-1 mr-2`}
              numberOfLines={1}
            >
              {hotel?.name || "Hotel Name"}
            </Text>
            <Text style={tw`text-xs text-gray-500 font-medium`}>
              {user?.name || "Guest"}
            </Text>
          </View>

          {/* Check-In & Check-Out Row */}
          <View
            style={tw`flex-row justify-between items-center py-2 border-t border-gray-100`}
          >
            <View>
              <Text
                style={tw`text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase`}
              >
                CHECK-IN
              </Text>
              <Text style={tw`text-sm font-bold text-gray-900`}>
                {formatDate(item?.check_in_date)}
              </Text>
            </View>

            <View style={tw`flex-row items-center gap-x-1 px-2`}>
              <View style={tw`w-4 h-[1px] bg-gray-300`} />
              <Feather name="arrow-right" size={14} color="#FF5B00" />
              <View style={tw`w-4 h-[1px] bg-gray-300`} />
            </View>

            <View style={tw`items-end`}>
              <Text
                style={tw`text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase`}
              >
                CHECK-OUT
              </Text>
              <Text style={tw`text-sm font-bold text-gray-900`}>
                {formatDate(item?.check_out_date)}
              </Text>
            </View>
          </View>

          {/* Room & Guest Footer Info */}
          <View
            style={tw`flex-row justify-between items-center pt-3 border-t border-gray-100 mt-2`}
          >
            <View style={tw`flex-row items-center gap-x-2`}>
              <View
                style={tw`w-7 h-7 rounded-full bg-[#FFF2E2] items-center justify-center`}
              >
                <Feather name="shopping-bag" size={13} color="#FF5B00" />
              </View>
              <Text style={tw`text-xs font-semibold text-gray-700`}>
                {item?.rooms_booked} Room{item?.rooms_booked > 1 ? "s" : ""}
              </Text>
            </View>

            <View style={tw`flex-row items-center gap-x-2`}>
              <View
                style={tw`w-7 h-7 rounded-full bg-[#FFF2E2] items-center justify-center`}
              >
                <FontAwesome5 name="user" size={12} color="#FF5B00" />
              </View>
              <Text style={tw`text-xs font-semibold text-gray-700`}>
                ${item?.total_price}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {activeTab === "active" && (
            <TouchableOpacity
              onPress={() => handleOpenCancelModal(item)}
              activeOpacity={0.7}
              style={tw`mt-4 bg-red-50 border border-red-200 py-2.5 rounded-xl items-center justify-center flex-row gap-x-2`}
            >
              <Feather name="x-circle" size={15} color="#EF4444" />
              <Text style={tw`text-xs font-bold text-red-500`}>
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}

          {activeTab === "completed" && (
            <TouchableOpacity
              onPress={() => handleOpenFeedbackModal(item)}
              activeOpacity={0.7}
              style={tw`mt-4 bg-[#FFF2E2] border border-[#FF5B00]/20 py-2.5 rounded-xl items-center justify-center flex-row gap-x-2`}
            >
              <Feather name="star" size={15} color="#FF5B00" />
              <Text style={tw`text-xs font-bold text-[#FF5B00]`}>
                Give Feedback
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Filter Tabs */}
      <View style={tw`flex-row border-b border-gray-200 mb-4 bg-white`}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getTabCount(tab.id);

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabChange(tab.id as TabType)}
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

      {/* Main List */}
      {isLoading && page === 1 ? (
        <View>
          <OrderSkeleton />
          <OrderSkeleton />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={refetch}
              colors={["#FF5B00"]}
            />
          }
          ListEmptyComponent={
            !isFetching ? (
              <NotFoundState
                title={`No ${activeTab} hotel bookings found.`}
                message=""
              />
            ) : null
          }
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View style={tw`py-4`}>
                <ActivityIndicator size="small" color="#FF5B00" />
              </View>
            ) : null
          }
          contentContainerStyle={tw`pb-6`}
        />
      )}

      {/* Cancel Booking Modal */}
      <Modal
        visible={isCancelModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => !isCancelling && setIsCancelModalOpen(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-4`}>
          <View style={tw`bg-white w-full rounded-2xl p-5`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-900`}>
                Cancel Booking
              </Text>
              <TouchableOpacity
                onPress={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
              >
                <Feather name="x" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Please provide a reason for cancelling your booking:
            </Text>

            <TextInput
              style={tw`border border-gray-200 rounded-xl p-3 text-sm min-h-[100px] text-gray-800 text-start`}
              placeholder="Write reason here..."
              multiline
              textAlignVertical="top"
              value={cancelReason}
              onChangeText={setCancelReason}
              editable={!isCancelling}
            />

            <View style={tw`flex-row gap-x-3 mt-5`}>
              <TouchableOpacity
                onPress={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                style={tw`flex-1 py-3 border border-gray-300 rounded-xl items-center`}
              >
                <Text style={tw`text-sm font-semibold text-gray-600`}>
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitCancel}
                disabled={!cancelReason.trim() || isCancelling}
                style={tw`flex-1 py-3 rounded-xl items-center justify-center flex-row gap-x-2 ${
                  cancelReason.trim() && !isCancelling
                    ? "bg-red-500"
                    : "bg-red-300"
                }`}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={tw`text-sm font-semibold text-white`}>
                    Confirm Cancel
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={isFeedbackModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() =>
          !isSubmittingFeedback && setIsFeedbackModalOpen(false)
        }
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-4`}>
          <View style={tw`bg-white w-full rounded-2xl p-5`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <Text style={tw`text-lg font-bold text-gray-900`}>
                Give Feedback
              </Text>
              <TouchableOpacity
                onPress={() => setIsFeedbackModalOpen(false)}
                disabled={isSubmittingFeedback}
              >
                <Feather name="x" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={tw`text-xs text-gray-500 mb-4`}>
              How was your experience staying at{" "}
              {selectedBooking?.hotel?.name || "the hotel"}?
            </Text>

            {/* Rating Stars */}
            <View style={tw`flex-row justify-center gap-x-2 mb-5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  disabled={isSubmittingFeedback}
                >
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={32}
                    color={star <= rating ? "#FF9500" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Input */}
            <TextInput
              style={tw`border border-gray-200 rounded-xl p-3 text-sm min-h-[100px] text-gray-800 text-start`}
              placeholder="Write your feedback here..."
              multiline
              textAlignVertical="top"
              value={feedbackText}
              onChangeText={setFeedbackText}
              editable={!isSubmittingFeedback}
            />

            <View style={tw`flex-row gap-x-3 mt-5`}>
              <TouchableOpacity
                onPress={() => setIsFeedbackModalOpen(false)}
                disabled={isSubmittingFeedback}
                style={tw`flex-1 py-3 border border-gray-300 rounded-xl items-center`}
              >
                <Text style={tw`text-sm font-semibold text-gray-600`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitFeedback}
                disabled={
                  rating === 0 || !feedbackText.trim() || isSubmittingFeedback
                }
                style={tw`flex-1 py-3 rounded-xl items-center justify-center flex-row gap-x-2 ${
                  rating > 0 && feedbackText.trim() && !isSubmittingFeedback
                    ? "bg-[#FF5B00]"
                    : "bg-[#FF5B00]/40"
                }`}
              >
                {isSubmittingFeedback ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={tw`text-sm font-semibold text-white`}>
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

export default HotelsSection;

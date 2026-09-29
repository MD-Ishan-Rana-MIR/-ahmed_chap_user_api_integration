import { useGetBusBookingsQuery } from "@/redux/busApi";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { Booking } from "../../../lib/type/busType";
import { NotFoundState } from "../../NotFoundState";
import { OrderSkeleton } from "../skeleton/OrderSkeleton";

const STATUS_TABS = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function MyBookingsScreen() {
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [page, setPage] = useState(1);

  // RTK Query hook
  const { data, isLoading, isFetching, refetch } = useGetBusBookingsQuery({
    page,
    filter: selectedStatus,
  });

  const bookings = data?.data?.bookings || [];
  const pagination = data?.data?.pagination;

  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!isFetching && pagination?.has_more) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  if (isLoading) {
    return <OrderSkeleton />;
  }

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <View style={tw`bg-white border border-gray-200 rounded-2xl p-4 shadow-xs`}>
      {/* Header: Operator/Bus Name & Travel Date */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View style={tw`flex-row items-center gap-x-2`}>
          <Image
            source={{
              uri:
                item.bus.primary_image ||
                item.operator.profile_image ||
                "https://img.icons8.com/color/96/bus.png",
            }}
            style={tw`w-8 h-8 rounded-lg bg-gray-100`}
            resizeMode="cover"
          />
          <View>
            <Text style={tw`text-base font-bold text-gray-900`}>
              {item.bus.name || item.operator.business_name}
            </Text>
            <Text style={tw`text-[10px] text-gray-400`}>
              Ref: {item.booking_reference}
            </Text>
          </View>
        </View>
        <Text style={tw`text-xs font-semibold text-[#F85606]`}>
          {item.travel_date_formatted}
        </Text>
      </View>

      {/* Travel Route & Timeline */}
      <View style={tw`flex-row items-center justify-between my-2`}>
        {/* Departure */}
        <View style={tw`items-start`}>
          <Text style={tw`text-base font-bold text-gray-800`}>
            {item.bus.departure_time}
          </Text>
          <Text style={tw`text-xs text-gray-400 font-medium mt-0.5`}>
            {item.bus.departure_place}
          </Text>
        </View>

        {/* Dotted Connection Line */}
        <View style={tw`flex-1 mx-3 items-center relative justify-center`}>
          <View
            style={tw`w-full border-b border-dashed border-gray-300 absolute`}
          />
          <View style={tw`flex-row items-center justify-between w-full`}>
            <View style={tw`w-2 h-2 rounded-full bg-gray-300`} />
            <View style={tw`bg-white px-2 z-10`}>
              <Text style={tw`text-xs text-gray-400 font-medium`}>
                {item.bus.journey_duration}
              </Text>
            </View>
            <View style={tw`w-2 h-2 rounded-full bg-gray-300`} />
          </View>
        </View>

        {/* Arrival */}
        <View style={tw`items-end`}>
          <Text style={tw`text-base font-bold text-gray-800`}>
            {item.bus.destination_time}
          </Text>
          <Text style={tw`text-xs text-gray-400 font-medium mt-0.5`}>
            {item.bus.destination_place}
          </Text>
        </View>
      </View>

      {/* Seats & Price Details */}
      <View
        style={tw`flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100`}
      >
        <View>
          <Text style={tw`text-[10px] text-gray-400`}>Seat Numbers</Text>
          <Text style={tw`text-xs font-bold text-gray-800 tracking-wide`}>
            {item.seat_numbers.join(", ")}
          </Text>
        </View>
        <View style={tw`items-end`}>
          <Text style={tw`text-[10px] text-gray-400`}>Total Amount</Text>
          <Text style={tw`text-xs font-bold text-[#F85606]`}>
            {item.currency} {item.total_price}
          </Text>
        </View>
      </View>

      {/* Action Button (Cancel) - Shown when paid/active */}
      {item.status === "paid" && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={tw`bg-[#F5F5F5] py-2 rounded-full items-center justify-center mt-3`}
        >
          <Text style={tw`text-gray-700 font-semibold text-xs`}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white pt-3`}>
      {/* Booking Status Tabs */}
      <View style={tw`flex-row border-b border-gray-200 mb-4`}>
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => handleStatusChange(tab.id)}
              style={tw`flex-1 items-center pb-2.5 border-b-2 ${
                isActive ? "border-[#F85606]" : "border-transparent"
              }`}
            >
              <Text
                style={tw`text-sm font-semibold ${
                  isActive ? "text-[#F85606]" : "text-gray-400"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Initial Loading Indicator */}
      {isLoading && page === 1 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#F85606" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`px-4 pb-6 gap-y-4`}
          showsVerticalScrollIndicator={false}
          renderItem={renderBookingCard}
          // Infinite Scroll Event Handlers
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          // Pull to Refresh
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
              colors={["#F85606"]}
            />
          }
          // Bottom Loader for pagination
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View style={tw`py-4`}>
                <ActivityIndicator size="small" color="#F85606" />
              </View>
            ) : null
          }
          // Empty State Handling
          ListEmptyComponent={
            !isFetching ? (
              <NotFoundState title="You have no booking." message="" />
            ) : null
          }
        />
      )}
    </View>
  );
}

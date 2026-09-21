import { useGetRestaurantOrdersQuery } from "@/redux/orderApi"; // আপনার RTK query path অনুযায়ী ইমপোর্ট করুন
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { NotFoundState } from "../../NotFoundState";
import { OrderSkeleton } from "../skeleton/OrderSkeleton";
import { RestaurantCard } from "./ResturantOrderCard";

interface TabItem {
  id: "active" | "completed" | "cancelled";
  label: string;
}

const TABS: TabItem[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

interface RestaurantsSectionProps {
  initialStatus?: "active" | "completed" | "cancelled";
  onTrack?: (id: number) => void;
  onOpenFeedback?: (id: number) => void;
}

export const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({
  initialStatus = "active",
  onTrack,
  onOpenFeedback,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [page, setPage] = useState<number>(1);

  // RTK Query Fetch
  const { data, isLoading, isFetching, refetch } = useGetRestaurantOrdersQuery({
    filter: activeTab,
    page: page,
    perPage: 10,
  });

  const counts = data?.data?.counts;
  const ordersList = data?.data?.orders?.data || [];
  const currentPage = data?.data?.orders?.current_page || 1;
  const lastPage = data?.data?.orders?.last_page || 1;

  // Tab Change Handler
  const handleTabChange = (tabId: string) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);
      setPage(1);
    }
  };

  // Infinite Scroll Handler (On reaching bottom)
  const handleLoadMore = useCallback(() => {
    if (!isFetching && currentPage < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, currentPage, lastPage]);

  // Pull to Refresh Handler
  const handleRefresh = () => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  };

  const getTabCount = (tabId: string): number => {
    if (!counts) return 0;
    switch (tabId) {
      case "active":
        return counts.active ?? 0;
      case "completed":
        return counts.completed ?? 0;
      case "cancelled":
        return counts.cancelled ?? 0;
      default:
        return 0;
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Category Tabs Header */}
      <View style={tw`flex-row border-b border-gray-200 px-4 mb-2`}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getTabCount(tab.id);

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabChange(tab.id)}
              style={tw`flex-1 py-3 flex-row items-center justify-center gap-x-1.5 border-b-2 ${
                isActive ? "border-[#FF5B00]" : "border-transparent"
              }`}
              activeOpacity={0.7}
            >
              <Text
                style={tw`text-sm font-semibold ${
                  isActive ? "text-[#FF5B00]" : "text-gray-500"
                }`}
              >
                {tab.label}
              </Text>

              <View
                style={tw`px-2 py-0.5 rounded-full ${
                  isActive ? "bg-[#FF5B00]" : "bg-gray-100"
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

      {/* Main Order List */}
      {isLoading && page === 1 ? (
        <OrderSkeleton />
      ) : (
        <FlatList
          data={ordersList}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={tw`p-4 pb-10 gap-y-3 ${
            ordersList.length === 0 ? "flex-1 justify-center" : ""
          }`}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
              tintColor="#FF5B00"
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <NotFoundState
                title={`No ${activeTab} restaurant orders found.`}
                message=""
              />
            ) : null
          }
          renderItem={({ item }) => {
            const firstItem = item.items?.[0];
            const dateFormatted = new Date(item.created_at).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" },
            );

            return (
              <RestaurantCard
                orderId={item.order_number}
                title={item.restaurant?.business_name || "Restaurant"}
                itemsCount={`${item.items?.length || 0} Item(s)`}
                time={dateFormatted}
                price={`${item.currency} ${item.grand_total}`}
                status={item.status}
                imageUri={
                  firstItem?.image ||
                  item.restaurant?.profile_image ||
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                }
                onTrack={() => onTrack?.(item.id)}
                onGiveFeedback={() => onOpenFeedback?.(item.id)}
              />
            );
          }}
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View style={tw`py-4 items-center justify-center`}>
                <ActivityIndicator size="small" color="#FF5B00" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

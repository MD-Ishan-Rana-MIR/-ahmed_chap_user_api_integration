import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/redux/userNotificationAp";
import { errorMsg } from "../../../../lib/msg/errorMsg";
import { successMsg } from "../../../../lib/msg/successMsg";
import { NotificationItem } from "../../../../lib/type/notificationType";
import { NotFoundState } from "../../../NotFoundState";
import BackButton from "../../BackButton";
import {
  NotificationSkeletonCard,
  NotificationSkeletonList,
} from "../../skeleton/NotificationSkeletonList";

export default function NotificationScreen() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState<number>(1);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const { data, isFetching, isLoading, refetch } = useGetNotificationsQuery({
    page,
    per_page: 15,
    filter,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const pagination = data?.pagination;
  const unreadCount = data?.unread_count ?? 0;
  const hasMore = pagination ? page < pagination.total_pages : false;

  // Pagination Management: Append or Reset Notifications
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setNotifications(data.data);
      } else {
        setNotifications((prev) => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  // Handle Tab Switch
  const handleFilterChange = (selectedFilter: "all" | "unread") => {
    if (filter !== selectedFilter) {
      setPage(1);
      setNotifications([]);
      setFilter(selectedFilter);
    }
  };

  // Infinite Scroll Load More
  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Pull to refresh
  const handleRefresh = async () => {
    if (page === 1) {
      await refetch();
    } else {
      setPage(1);
    }
  };

  // Handle Notification Item Click
  const handleItemPress = async (item: NotificationItem) => {
    if (!item.read) {
      try {
        await markAsRead({ id: item.id }).unwrap();
        // Local State Update on Read
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === item.id ? { ...notif, read: true } : notif,
          ),
        );
        successMsg("Notification marked as read");
      } catch (error) {
        return errorMsg(
          error && typeof error === "object" && "data" in error
            ? ((error as { data?: { message?: string } }).data?.message ??
                String(error))
            : error instanceof Error
              ? error.message
              : String(error),
        );
      }
    }

    // Example Navigation based on type
    if (item.order_id) {
      // router.push(`/order/${item.order_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* 1. Header Bar */}
      <View>
        <BackButton title="Notifications" />
      </View>

      {/* 2. Filter Tabs */}
      <View
        style={tw`flex-row items-center px-4 py-3 border-b border-gray-100 gap-2`}
      >
        <TouchableOpacity
          onPress={() => handleFilterChange("all")}
          style={tw`px-4 py-1.5 rounded-full ${
            filter === "all" ? "bg-[#5B7410]" : "bg-gray-200"
          }`}
        >
          <Text
            style={tw`text-xs font-semibold ${
              filter === "all" ? "text-white" : "text-gray-700"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFilterChange("unread")}
          style={tw`px-4 py-1.5 rounded-full flex-row items-center gap-1.5 ${
            filter === "unread" ? "bg-[#5B7410]" : "bg-gray-200"
          }`}
        >
          <Text
            style={tw`text-xs font-semibold ${
              filter === "unread" ? "text-white" : "text-gray-700"
            }`}
          >
            Unread
          </Text>
          {unreadCount > 0 && (
            <View
              style={tw`bg-red-500 rounded-full px-1.5 py-0.2 items-center justify-center`}
            >
              <Text style={tw`text-white text-[10px] font-bold`}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 3. Notifications List */}
      {isLoading && page === 1 ? (
        <NotificationSkeletonList count={7} />
      ) : (
        <FlatList
          style={tw`px-5 mt-5`}
          data={notifications}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <NotificationSkeletonCard item={item} onPress={handleItemPress} />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
              colors={["#5B7410"]}
            />
          }
          ListEmptyComponent={
            !isFetching ? (
              <View style={tw`mt-20 items-center justify-center`}>
                <NotFoundState
                  title={
                    filter === "unread"
                      ? "You Have No Unread Notifications"
                      : "No Notifications Found"
                  }
                  message=""
                />
              </View>
            ) : null
          }
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View style={tw`py-4 items-center`}>
                <ActivityIndicator size="small" color="#5B7410" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

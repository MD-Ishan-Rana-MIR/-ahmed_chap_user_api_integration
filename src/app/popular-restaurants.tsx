import {
    RestaurantItem,
    useGetPopularRestaurantsQuery,
} from "@/redux/restaurantsApi";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    View,
} from "react-native";
import { NotFoundState } from "../../components/NotFoundState";
import BackButton from "../../components/ui/BackButton";
import AllPopularRestaurantCard from "../../components/ui/resturant/AllPopularRestaurantCard";
import tw from "../../lib/tailwind";

export default function PopularRestaurantsScreen() {
  const [page, setPage] = useState(1);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);

  // RTK Query hook
  const { data, isLoading, isFetching, refetch } =
    useGetPopularRestaurantsQuery({ page, perPage: 10 });

  const totalPages = data?.data?.restaurants?.last_page || 1;

  // Append new page data to state
  useEffect(() => {
    if (data?.data?.restaurants?.data) {
      const incomingData = data.data.restaurants.data;
      if (page === 1) {
        setRestaurants(incomingData);
      } else {
        setRestaurants((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueItems = incomingData.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueItems];
        });
      }
    }
  }, [data, page]);

  // Handle load more on scroll
  const handleLoadMore = () => {
    if (!isFetching && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Handle pull to refresh
  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  // Initial Loading state
  if (isLoading && page === 1) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackButton title="Popular Restaurants" />
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#F95700" />
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Popular Restaurants" />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={tw`px-4 pt-4 pb-8 flex-grow`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AllPopularRestaurantCard item={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            tintColor="#F95700"
          />
        }
        ListEmptyComponent={
          !isFetching ? (
            <View style={tw`flex-1 justify-center items-center py-10`}>
              <NotFoundState
                title="No Popular Restaurants Found"
                message="We couldn't find any popular restaurants at the moment."
              />
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetching && page > 1 ? (
            <View style={tw`py-4 items-center justify-center`}>
              <ActivityIndicator size="small" color="#F95700" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

import {
  useGetNearRestaurantsQuery,
  useGetPopularRestaurantsQuery,
} from "@/redux/restaurantsApi";
import { NotFoundState } from "../../NotFoundState";
import PopularResturantSkeleton from "../skeleton/PopularResturantSkeleton";
import NearbyRestaurantCard from "./NearbyRestaurantCard";
import PopularRestaurantCard from "./PopularRestaurantCard";

export default function RestaurantSection() {
  const [popularPage, setPopularPage] = useState(1);
  const [nearPage, setNearPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  // User Location Fetching
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const storedLat = await AsyncStorage.getItem("latitude");
        const storedLon = await AsyncStorage.getItem("longitude");
        if (storedLat && storedLon) {
          setLocation({
            lat: parseFloat(storedLat),
            lon: parseFloat(storedLon),
          });
        }
      } catch (error) {
        console.error("Error reading location from AsyncStorage", error);
      }
    };
    fetchLocation();
  }, []);

  // 1. Fetch Popular Restaurants
  const {
    data: popularData,
    isLoading: isPopularLoading,
    isFetching: isPopularFetching,
    refetch: refetchPopular,
  } = useGetPopularRestaurantsQuery({ page: popularPage, perPage: 5 });

  // 2. Fetch Nearby Restaurants
  const {
    data: nearData,
    isLoading: isNearLoading,
    isFetching: isNearFetching,
    refetch: refetchNear,
  } = useGetNearRestaurantsQuery(
    {
      page: nearPage,
      lat: location?.lat || 0,
      lon: location?.lon || 0,
      perPage: 5,
    },
    { skip: !location },
  );

  // Extracted Data Lists
  const popularList = popularData?.data?.restaurants?.data || [];
  const popularLastPage = popularData?.data?.restaurants?.last_page || 1;

  const nearList = nearData?.data?.restaurants?.data || [];
  const nearLastPage = nearData?.data?.restaurants?.last_page || 1;

  // Horizontal Load More (Popular)
  const handlePopularScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isEndReached =
        layoutMeasurement.width + contentOffset.x >= contentSize.width - 50;

      if (isEndReached && !isPopularFetching && popularPage < popularLastPage) {
        setPopularPage((prev) => prev + 1);
      }
    },
    [isPopularFetching, popularPage, popularLastPage],
  );

  // Vertical Load More (Nearby)
  const handleMainScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isEndReached =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

      if (isEndReached && !isNearFetching && nearPage < nearLastPage) {
        setNearPage((prev) => prev + 1);
      }
    },
    [isNearFetching, nearPage, nearLastPage],
  );

  // Pull to Refresh Handler
  const handleRefresh = () => {
    setPopularPage(1);
    setNearPage(1);
    refetchPopular();
    if (location) refetchNear();
  };

  // Initial Loading Layout
  if (
    (isPopularLoading && popularPage === 1) ||
    (isNearLoading && nearPage === 1 && !nearList.length)
  ) {
    return <PopularResturantSkeleton />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1 bg-white px-4 pt-4`}
      onScroll={handleMainScroll}
      scrollEventThrottle={32}
      refreshControl={
        <RefreshControl
          refreshing={isPopularFetching && popularPage === 1}
          onRefresh={handleRefresh}
          tintColor="#F95700"
        />
      }
    >
      {/* Popular Restaurants Section */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-base font-bold text-gray-900`}>
          Popular Restaurants
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/popular-restaurants")}
          activeOpacity={0.7}
        >
          <Text style={tw`text-xs font-semibold text-[#F95700]`}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handlePopularScroll}
        scrollEventThrottle={32}
        contentContainerStyle={tw`gap-3 mb-6`}
      >
        {popularList.map((restaurant: any) => (
          <PopularRestaurantCard key={restaurant.id} item={restaurant} />
        ))}

        {isPopularFetching && popularPage > 1 && (
          <View style={tw`justify-center items-center px-4`}>
            <ActivityIndicator size="small" color="#F95700" />
          </View>
        )}
      </ScrollView>

      {/* Nearby Restaurants Section */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-base font-bold text-gray-900`}>
          Restaurants Near you
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/restaurants_near/1")}
          activeOpacity={0.7}
        >
          <Text style={tw`text-xs font-semibold text-[#F95700]`}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Vertical List / Empty State */}
      <View style={tw`gap-y-3 pb-8`}>
        {nearList.length > 0
          ? nearList.map((restaurant: any) => (
              <NearbyRestaurantCard key={restaurant.id} item={restaurant} />
            ))
          : !isNearFetching && (
              <NotFoundState title="You have no near restaurant card" />
            )}

        {isNearFetching && nearPage > 1 && (
          <View style={tw`py-4 items-center justify-center`}>
            <ActivityIndicator size="small" color="#F95700" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

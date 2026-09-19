import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import PopularResturantSkeleton from "../skeleton/PopularResturantSkeleton";
import NearbyRestaurantCard from "./NearbyRestaurantCard";
import PopularRestaurantCard from "./PopularRestaurantCard";

export default function RestaurantSection() {
  // State for Popular Restaurants Pagination
  const [popularPage, setPopularPage] = useState(1);

  // State for Nearby Restaurants Pagination
  const [nearPage, setNearPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  // Get user coordinates from AsyncStorage
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

  // 1. Fetch Popular Restaurants Query
  const {
    data: popularData,
    isLoading: isPopularLoading,
    isFetching: isPopularFetching,
    refetch: refetchPopular,
  } = useGetPopularRestaurantsQuery({ page: popularPage, perPage: 5 });

  // 2. Fetch Nearby Restaurants Query
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

  // Data Extraction
  const popularList = popularData?.data?.restaurants?.data || [];
  const popularLastPage = popularData?.data?.restaurants?.last_page || 1;

  const nearList = nearData?.data?.restaurants?.data || [];
  const nearLastPage = nearData?.data?.restaurants?.last_page || 1;

  // Horizontal Load More (Popular Restaurants)
  const handlePopularScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.width + contentOffset.x >= contentSize.width - 50;

    if (isEndReached && !isPopularFetching && popularPage < popularLastPage) {
      setPopularPage((prev) => prev + 1);
    }
  };

  // Vertical Load More (Nearby Restaurants via Main ScrollView)
  const handleMainScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isEndReached && !isNearFetching && nearPage < nearLastPage) {
      setNearPage((prev) => prev + 1);
    }
  };

  // Pull-to-refresh
  const handleRefresh = () => {
    setPopularPage(1);
    setNearPage(1);
    refetchPopular();
    if (location) refetchNear();
  };

  // Show Skeleton layout on initial load
  if (
    (isPopularLoading && popularPage === 1) ||
    (isNearLoading && nearPage === 1)
  ) {
    return <PopularResturantSkeleton />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1 bg-white px-4 pt-4`}
      onScroll={handleMainScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={isPopularFetching && popularPage === 1}
          onRefresh={handleRefresh}
          tintColor="#F95700"
        />
      }
    >
      {/* Popular Restaurants Header */}
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

      {/* Horizontal List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handlePopularScroll}
        scrollEventThrottle={16}
        contentContainerStyle={tw`gap-3 mb-6`}
      >
        {popularList.map((restaurant) => (
          <PopularRestaurantCard key={restaurant.id} item={restaurant} />
        ))}

        {isPopularFetching && popularPage > 1 && (
          <View style={tw`justify-center items-center px-4`}>
            <ActivityIndicator size="small" color="#F95700" />
          </View>
        )}
      </ScrollView>

      {/* Restaurants Near You Header */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-base font-bold text-gray-900`}>
          Restaurants Near you
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/restaurants_near/[id]")}
          activeOpacity={0.7}
        >
          <Text style={tw`text-xs font-semibold text-[#F95700]`}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Vertical List */}
      <View style={tw`gap-y-3 pb-8`}>
        {nearList.map((restaurant) => (
          <NearbyRestaurantCard key={restaurant.id} item={restaurant} />
        ))}

        {isNearFetching && nearPage > 1 && (
          <View style={tw`py-4 items-center justify-center`}>
            <ActivityIndicator size="small" color="#F95700" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

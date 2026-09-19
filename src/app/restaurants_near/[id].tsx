import {
  RestaurantItem,
  useGetNearRestaurantsQuery,
} from "@/redux/restaurantsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import BackButton from "../../../components/ui/BackButton";
import NearbyRestaurantCard from "../../../components/ui/resturant/NearbyRestaurantCard";
import PopularResturantSkeleton from "../../../components/ui/skeleton/PopularResturantSkeleton";
import tw from "../../../lib/tailwind";
// Update this import path based on your project setup

export default function NearRestaurants() {
  const [page, setPage] = useState(1);
  const [restaurantsList, setRestaurantsList] = useState<RestaurantItem[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  // 1. Get user latitude/longitude from AsyncStorage
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

  // 2. Fetch Nearby Restaurants using RTK Query
  const { data, isLoading, isFetching, refetch } = useGetNearRestaurantsQuery(
    {
      page,
      lat: location?.lat || 0,
      lon: location?.lon || 0,
      perPage: 10,
    },
    { skip: !location },
  );

  const totalPages = data?.data?.restaurants?.last_page || 1;

  // 3. Append newly fetched pages to the existing list
  useEffect(() => {
    if (data?.data?.restaurants?.data) {
      const incomingData = data.data.restaurants.data;
      if (page === 1) {
        setRestaurantsList(incomingData);
      } else {
        setRestaurantsList((prevList) => {
          // Filter duplicates by id
          const existingIds = new Set(prevList.map((item) => item.id));
          const newItems = incomingData.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prevList, ...newItems];
        });
      }
    }
  }, [data, page]);

  // 4. Handle End Reached (Infinite Scroll)
  const handleLoadMore = () => {
    if (!isFetching && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // 5. Handle Pull-to-Refresh
  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  // Initial Loading State
  if (isLoading && page === 1) {
    return (
      <View style={tw`bg-white flex-1`}>
        <BackButton title="Restaurants Near you" />
        <View style={tw`px-5 mt-5`}>
          <PopularResturantSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={tw`bg-white flex-1`}>
      <BackButton title="Restaurants Near you" />

      <FlatList
        data={restaurantsList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`mb-3`}>
            <NearbyRestaurantCard item={item} />
          </View>
        )}
        contentContainerStyle={tw`px-5 pt-5 pb-8`}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            tintColor="#F95700"
          />
        }
        ListFooterComponent={() =>
          isFetching && page > 1 ? (
            <View style={tw`py-4 items-center justify-center`}>
              <ActivityIndicator size="small" color="#F95700" />
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !isFetching ? (
            <View style={tw`items-center justify-center py-10`}>
              <Text style={tw`text-gray-500 font-medium`}>
                No nearby restaurants found.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

import {
  useGetNearHotelsQuery,
  useGetPopularHotelsQuery,
} from "@/redux/hotelApi";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";
import { NotFoundState } from "../../NotFoundState";
import { SectionHeader } from "../SectionHeader";
import PopularHotelSkeletonList from "../skeleton/PopularHotelSkeleton";
import { NearHotelCard } from "../user/hotel/NearHotelCard";
import { PopularHotelCard } from "../user/hotel/PopularHotelCard";
import HotelSearchCard from "./HotelSearchCard";

export default function HotelList({ category }: { category: string }) {
  const insets = useSafeAreaInsets();

  // Hotel State
  const [hotelFavorites, setHotelFavorites] = useState<Record<string, boolean>>(
    {
      "1": true,
    },
  );

  const handleToggleHotelFavorite = useCallback((id: string) => {
    setHotelFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const navigatePopularHotel = () => {
    router.push("/popular-hotel/[id]");
  };

  const navigateNearHotel = () => {
    router.push("/NearHotel");
  };

  // ====================================================== Popular Hotel API =====================================================
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading: isPopularLoading,
    isFetching: isPopularFetching,
    refetch,
  } = useGetPopularHotelsQuery({
    page,
    perPage: 5,
  });

  const propertiesList = response?.data?.properties?.data || [];
  const lastPage = response?.data?.properties?.last_page || 1;

  // Horizontal Scroll Handler for Popular Hotels Pagination
  const handlePopularScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.width + contentOffset.x >= contentSize.width - 50;

    if (isEndReached && !isPopularFetching && page < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // ====================================================== Near Hotel API =====================================================
  const [npage, nsetPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  // Fetch Lat/Long from AsyncStorage
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
        console.error("Failed to load location from AsyncStorage", error);
      }
    };

    fetchLocation();
  }, []);

  const {
    data: nearData,
    isLoading: nearLoading,
    isFetching: nearFetching,
    refetch: refetchNear,
  } = useGetNearHotelsQuery(
    {
      page: npage,
      lat: location?.lat || 0,
      lon: location?.lon || 0,
      perPage: 10,
    },
    {
      skip: !location,
    },
  );

  const hotelList = nearData?.data?.properties?.data || [];
  const nLastPage = nearData?.data?.properties?.last_page || 1;

  const handleNearLoadMore = () => {
    if (!nearFetching && npage < nLastPage) {
      nsetPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    nsetPage(1);
    refetchNear();
  };

  // Outer ScrollView Infinite Load Listener
  const handleMainScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isEndReached) {
      handleNearLoadMore();
    }
  };

  // Initial Loading Skeleton State
  if (isPopularLoading && page === 1) {
    return <PopularHotelSkeletonList />;
  }
  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="light" />

      {/* Header Navigation */}
      <View
        style={[
          tw`bg-[#5B7410] flex-row items-center justify-between px-5 pb-5 rounded-b-2xl`,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
      >
        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw`w-10 h-10 rounded-full border border-white/40 items-center justify-center`}
          >
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>

          <Text style={tw`text-white text-xl font-semibold capitalize`}>
            {category}
          </Text>
        </View>
      </View>

      {/* Search Card */}
      <View style={tw`px-5 mt-5`}>
        <HotelSearchCard />
      </View>

      {/* Main Page ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
        onScroll={handleMainScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={nearLoading && npage === 1}
            onRefresh={handleRefresh}
            tintColor="#F95700"
          />
        }
      >
        {/* Popular Hotels Section */}
        <SectionHeader
          title="Popular Hotels"
          onViewAll={navigatePopularHotel}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handlePopularScroll}
          scrollEventThrottle={16}
          contentContainerStyle={tw`gap-3.5 px-5 pb-2`}
        >
          {propertiesList.map((item: any) => (
            <PopularHotelCard key={item.id} item={item} refetch={refetch} />
          ))}

          {isPopularFetching && page > 1 && (
            <View style={tw`justify-center items-center px-4`}>
              <ActivityIndicator size="small" color="#FF5A1F" />
            </View>
          )}

          {propertiesList.length === 0 && !isPopularFetching && (
            <NotFoundState title="Not found popular hotel" message="" />
          )}
        </ScrollView>

        {/* Hotels Near You Section */}
        <SectionHeader title="Hotels Near you" onViewAll={navigateNearHotel} />

        <View style={tw`gap-y-3 px-5`}>
          {hotelList.map((item: any) => (
            <NearHotelCard key={item.id} item={item} />
          ))}

          {hotelList.length === 0 && !nearFetching && (
            <NotFoundState title="Not found your near hotel" message="" />
          )}

          {nearFetching && npage > 1 && (
            <View style={tw`py-4 items-center justify-center`}>
              <ActivityIndicator size="small" color="#F95700" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});

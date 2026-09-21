import { useGetNearHotelsQuery } from "@/redux/hotelApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { NotFoundState } from "../../components/NotFoundState";
import BackButton from "../../components/ui/BackButton";
import { NearHotelCard } from "../../components/ui/user/hotel/NearHotelCard";
import tw from "../../lib/tailwind";

const Hotel = () => {
  const [npage, nsetPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [isLocationLoading, setIsLocationLoading] = useState(true);

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
      } finally {
        setIsLocationLoading(false);
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

  // Initial Loading State
  if (isLocationLoading || (nearLoading && npage === 1)) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackButton title="Near Hotel" />
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#F95700" />
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Near Hotel" />

      <FlatList
        data={hotelList}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={tw`gap-y-3 px-5 pb-10 pt-3`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NearHotelCard item={item} refetch={refetchNear} />
        )}
        onEndReached={handleNearLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={nearLoading && npage === 1}
            onRefresh={handleRefresh}
            tintColor="#F95700"
          />
        }
        ListEmptyComponent={
          !nearFetching ? (
            <NotFoundState title="Not found your near hotel" message="" />
          ) : null
        }
        ListFooterComponent={
          nearFetching && npage > 1 ? (
            <View style={tw`py-4 items-center justify-center`}>
              <ActivityIndicator size="small" color="#F95700" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Hotel;

const styles = StyleSheet.create({});

import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import BusCard, { BusCardData } from "./BusCard";
// import { BusItem, useGetBusesQuery } from "./busesApi";
// import { BusSkeleton } from "./BusSkeleton";
import { BusItem, useGetBusesQuery } from "@/redux/busApi";
import { BusSkeleton } from "../skeleton/BusSkeleton";
import SearchCard from "./SearchCard";

export default function Transport() {
  const [searchParams, setSearchParams] = useState({
    departure_place: "",
    destination_place: "",
    travel_date: "",
  });

  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isFetching, refetch } = useGetBusesQuery({
    ...searchParams,
    page,
    per_page: 15,
  });

  const busesList = data?.data?.buses || [];
  const pagination = data?.data?.pagination;
  const totalBuses = pagination?.total || 0;
  const hasMore = pagination?.has_more || false;

  // Infinite Scroll Handler
  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Pull to Refresh Handler
  const handleRefresh = () => {
    setPage(1);
    // refetch();
  };

  // Search Submit Handler
  const handleSearchBus = (params: any) => {
    setSearchParams({
      departure_place: params?.departure || "Dhaka",
      destination_place: params?.destination || "Chittagong",
      travel_date: params?.date || "",
    });
    setPage(1);
  };

  const handleSelectSeat = (bus: BusCardData) => {};

  // Adapter function to match BusItem -> BusCardData
  const mapBusToCardData = (item: BusItem): BusCardData => ({
    id: item.id.toString(),
    operator: item.operator?.business_name || item.name,
    type: `${item.bus_type} • ${item.seat_pattern} Seating`,
    price: `${item.currency === "KES" ? "KSh " : "$"}${item.price_per_seat.toFixed(2)}`,
    seatsLeft: item.available_seats_count,
    departureTime: item.departure_time,
    arrivalTime: item.destination_time,
    origin: item.departure_place,
    destination: item.destination_place,
    duration: item.journey_duration,
    isAC: item.bus_type.toUpperCase().includes("AC"),
    logoBg: "bg-[#523AEB]",
    travel_date: item?.travel_date,
  });

  // Footer Component for Loading More Pages
  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View style={tw`py-4 items-center justify-center`}>
        <ActivityIndicator size="small" color="#F95700" />
      </View>
    );
  };

  // Not Found / Empty Component
  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={tw`items-center justify-center py-16 px-4`}>
        <View
          style={tw`w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4`}
        >
          <Text style={tw`text-3xl`}>🚌</Text>
        </View>
        <Text style={tw`text-base font-bold text-gray-900 mb-1 text-center`}>
          No Buses Found
        </Text>
        <Text
          style={tw`text-xs text-gray-500 text-center leading-5 max-w-[260px]`}
        >
          We couldn't find any available buses from{" "}
          {searchParams.departure_place} to {searchParams.destination_place}.
          Try changing route or travel date.
        </Text>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <FlatList
        data={busesList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-10`}
        ListHeaderComponent={
          <>
            {/* Reusable Search Bar Component */}
            <SearchCard onSearch={handleSearchBus} isLoading={isLoading} />

            {/* Header Title Section */}
            <View
              style={tw`flex-row justify-between items-center mb-3 px-1 mt-2`}
            >
              <Text style={tw`text-sm font-bold text-gray-900`}>
                {totalBuses} {totalBuses === 1 ? "Bus is" : "Buses are"}{" "}
                Available
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/all-transport?data=${busesList}`);
                }}
                activeOpacity={0.7}
              >
                <Text style={tw`text-xs font-semibold text-[#F95700]`}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Skeleton Loading State for initial load */}
            {isLoading && page === 1 && (
              <View>
                <BusSkeleton />
                <BusSkeleton />
                <BusSkeleton />
                <BusSkeleton />
                <BusSkeleton />
                <BusSkeleton />
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <BusCard
            bus={mapBusToCardData(item)}
            onSelectSeat={handleSelectSeat}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            colors={["#F95700"]}
            tintColor="#F95700"
          />
        }
      />
    </View>
  );
}

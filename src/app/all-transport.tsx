import { BusItem, useGetBusesQuery } from "@/redux/busApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { BusSkeleton } from "../../components/ui/skeleton/BusSkeleton";
import BusCard, { BusCardData } from "../../components/ui/transport/BusCard";
import FilterModal from "../../components/ui/transport/FilterModal";
import { busSearchIcon } from "../../lib/icon";
import tw from "../../lib/tailwind";

const AllTransPort = () => {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // State Management
  const [page, setPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBusType, setSelectedBusType] = useState<string>("");

  // RTK Query Request
  const { data, isLoading, isFetching, refetch } = useGetBusesQuery({
    departure_place: params.departure as string,
    destination_place: params.destination as string,
    travel_date: (params.date as string) || "",
    page,
    per_page: 15,
  });

  const rawBusesList = data?.data?.buses || [];
  const pagination = data?.data?.pagination;
  const hasMore = pagination?.has_more || false;

  // Filter local data based on Bus Type if selected
  const filteredBuses = selectedBusType
    ? rawBusesList.filter((bus) =>
        bus.bus_type.toLowerCase().includes(selectedBusType.toLowerCase()),
      )
    : rawBusesList;

  // Infinite Scroll Handler
  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Pull to Refresh Handler
  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  // Filter Apply Handler
  const handleApplyFilter = (filters: {
    busType: string;
    timeSlot: string;
  }) => {
    setSelectedBusType(filters.busType || "");
    setIsFilterOpen(false);
  };

  const handleSelectSeat = (bus: BusCardData) => {};

  // Adapter Function: BusItem -> BusCardData
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
  });

  // Footer Component for Scroll Loading
  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View style={tw`py-4 items-center justify-center`}>
        <ActivityIndicator size="small" color="#F95700" />
      </View>
    );
  };

  // Empty / Not Found State Component
  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={tw`items-center justify-center py-20 px-4`}>
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
          There are no buses available for the selected destination or applied
          filter.
        </Text>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-[#fff]`}>
      {/* Top Header */}
      <View
        style={[
          tw`bg-[#5B7410] flex-row items-center justify-between px-5 pb-5 rounded-b-2xl`,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
      >
        <View style={tw`flex-row items-center justify-between w-full`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={tw`w-10 h-10 rounded-full border border-white/40 items-center justify-center`}
            >
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>

            <Text style={tw`text-white text-xl font-semibold capitalize`}>
              Bus Tickets
            </Text>
          </View>

          {/* Right Filter Icon */}
          <TouchableOpacity
            onPress={() => setIsFilterOpen(true)}
            activeOpacity={0.8}
            style={tw`w-10 h-10 border border-white rounded-full items-center justify-center relative`}
          >
            <SvgXml xml={busSearchIcon} />
            {Boolean(selectedBusType) && (
              <View
                style={tw`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white`}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Bus List */}
      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-10`}
        ListHeaderComponent={
          isLoading && page === 1 ? (
            <View>
              <BusSkeleton />
              <BusSkeleton />
              <BusSkeleton />
            </View>
          ) : null
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

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
      />
    </View>
  );
};

export default AllTransPort;

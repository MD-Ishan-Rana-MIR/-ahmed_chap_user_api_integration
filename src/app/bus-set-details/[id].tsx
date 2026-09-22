import { useBusDetailsQuery } from "@/redux/busApi";
import { router, useLocalSearchParams } from "expo-router";
import { Armchair, Bath, Plug, Snowflake } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import BackButton from "../../../components/ui/BackButton";
import { busShowIcon, driverIcon } from "../../../lib/icon";
import tw from "../../../lib/tailwind";

// Data structures reflecting backend response
interface APISeat {
  id: string;
  seat_number: string;
  seat_type: string;
  is_available: boolean;
}

interface SeatRow {
  row: number;
  is_back_row: boolean;
  left?: APISeat[];
  right?: APISeat[];
  back_seats?: APISeat[];
}

export default function SeatSelectionScreen() {
  const { id, travel_date } = useLocalSearchParams();
  const { data: apiResponse, isLoading } = useBusDetailsQuery({
    id,
    travel_date,
  });

  const busData = apiResponse?.data?.bus;
  const seatMap: SeatRow[] = apiResponse?.data?.seat_map || [];

  // Track user-selected seat objects
  const [selectedSeats, setSelectedSeats] = useState<APISeat[]>([]);

  console.log("selectedSeats", selectedSeats?.length);

  // Toggle seat with max 4-seat limit
  const toggleSeatSelection = (seat: APISeat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 4) {
        Alert.alert("Limit Reached", "You can select a maximum of 4 seats.");
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const pricePerSeat = busData?.price_per_seat || 0;
  const currency = busData?.currency || "KES";

  const totalPrice = useMemo(
    () => selectedSeats.length * pricePerSeat,
    [selectedSeats, pricePerSeat],
  );

  // Formatted string of selected seat numbers (e.g., "1, 2")
  const selectedSeatNumbers = useMemo(
    () => selectedSeats.map((s) => s.seat_number).join(", "),
    [selectedSeats],
  );

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    const routeId = Array.isArray(id) ? id[0] : id;
    const routeTravelDate = Array.isArray(travel_date)
      ? travel_date[0]
      : travel_date;

    router.push({
      pathname: "/passanger-info/[id]",
      params: {
        id: routeId,
        bus_id: routeId,
        travel_date: routeTravelDate,
        selected_seat_ids: selectedSeats.map((s) => s.id).join(","),
        selected_seat_numbers: selectedSeatNumbers,
        total_price: totalPrice,
        totalSeat: selectedSeats?.length,
        currency: apiResponse?.data?.bus?.currency,
      },
    });
  };

  const renderSeatBox = (seat: APISeat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const isBooked = !seat.is_available;

    // Booked seats rendered with BLACK background
    if (isBooked) {
      return (
        <View
          key={seat.id}
          style={tw`w-10 h-10 rounded-xl bg-black items-center justify-center`}
        >
          <Armchair size={18} color="#FFFFFF" />
        </View>
      );
    }

    if (isSelected) {
      return (
        <TouchableOpacity
          key={seat.id}
          activeOpacity={0.8}
          onPress={() => toggleSeatSelection(seat)}
          style={tw`w-10 h-10 rounded-xl bg-[#F95700] items-center justify-center`}
        >
          <Armchair size={18} color="#FFFFFF" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={seat.id}
        activeOpacity={0.8}
        onPress={() => toggleSeatSelection(seat)}
        style={tw`w-10 h-10 rounded-xl border border-gray-200 bg-white items-center justify-center`}
      >
        <Text style={tw`text-[10px] text-gray-500 font-medium`}>
          {seat.seat_number}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#F95700" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Select Seats" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 mt-5 pb-36`}
      >
        {/* Top Ticket Summary Header */}
        <View style={tw`border border-[#E7E9EF] p-3 rounded-[12px]`}>
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center gap-x-2`}>
              <SvgXml xml={busShowIcon} width={33} height={20} />
              <Text style={tw`text-[16px] font-semibold text-black`}>
                {busData?.name || "Bus Service"}
              </Text>
            </View>
            <Text style={tw`text-[#F86B17] text-sm font-semibold`}>
              {busData?.available_seats_count ?? 0} Seats Left
            </Text>
          </View>

          {/* Route Time & Timeline */}
          <View style={tw`flex-row justify-between items-center my-4`}>
            <View>
              <Text style={tw`text-black font-semibold text-[16px]`}>
                {busData?.departure_time}
              </Text>
              <Text style={tw`text-[#6D717F] text-[10px]`}>
                {busData?.departure_place}
              </Text>
            </View>

            <View style={tw`flex-1 mx-3 flex-row items-center justify-center`}>
              <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-300`} />
              <View
                style={tw`flex-1 border-b border-dashed border-gray-300 mx-1`}
              />
              <Text style={tw`text-[11px] text-gray-400 font-medium px-1`}>
                {busData?.journey_duration}
              </Text>
              <View
                style={tw`flex-1 border-b border-dashed border-gray-300 mx-1`}
              />
              <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-300`} />
            </View>

            <View style={tw`items-end`}>
              <Text style={tw`text-black font-semibold text-[16px]`}>
                {busData?.destination_time}
              </Text>
              <Text style={tw`text-[#6D717F] text-[10px]`}>
                {busData?.destination_place}
              </Text>
            </View>
          </View>

          {/* Amenities Row */}
          <View style={tw`flex-row items-center justify-between px-1`}>
            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Snowflake size={14} color="#111827" />
              <Text style={tw`text-[10px] text-black`}>AC</Text>
            </View>
            <View style={tw`h-3 w-[1px] bg-gray-200`} />
            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Armchair size={14} color="#111827" />
              <Text style={tw`text-[10px] text-black`}>Reclining Seat</Text>
            </View>
            <View style={tw`h-3 w-[1px] bg-gray-200`} />
            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Plug size={14} color="#111827" />
              <Text style={tw`text-[10px] text-black`}>USB Charger</Text>
            </View>
            <View style={tw`h-3 w-[1px] bg-gray-200`} />
            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Bath size={14} color="#111827" />
              <Text style={tw`text-[10px] text-black`}>Toilet</Text>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={tw`flex-row items-center justify-center gap-x-5 my-6`}>
          <View style={tw`flex-row items-center gap-x-2`}>
            <View
              style={tw`w-4 h-4 rounded-full border border-gray-200 bg-white`}
            />
            <Text style={tw`text-xs text-gray-700 font-medium`}>Available</Text>
          </View>

          {/* Booked Indicator Updated to Black */}
          <View style={tw`flex-row items-center gap-x-2`}>
            <View style={tw`w-4 h-4 rounded-full bg-black`} />
            <Text style={tw`text-xs text-black font-medium`}>Booked</Text>
          </View>

          <View style={tw`flex-row items-center gap-x-2`}>
            <View style={tw`w-4 h-4 rounded-full bg-[#F95700]`} />
            <Text style={tw`text-xs text-gray-700 font-medium`}>Selected</Text>
          </View>
        </View>

        {/* Bus Layout Card */}
        <View
          style={tw`bg-white border border-gray-100 rounded-3xl p-5 shadow-xs`}
        >
          {/* Top Bus Controls */}
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View
              style={tw`px-6 py-2.5 border border-gray-200 rounded-2xl bg-white`}
            >
              <Text style={tw`text-sm font-semibold text-gray-800`}>Door</Text>
            </View>
            <View style={tw`w-12 h-12 items-center justify-center`}>
              <SvgXml xml={driverIcon} />
            </View>
          </View>

          {/* Dynamic Seat Map Rendering */}
          <View style={tw`gap-y-3`}>
            {seatMap.map((rowItem) => {
              if (rowItem.is_back_row) {
                return (
                  <View
                    key={`row-${rowItem.row}`}
                    style={tw`mt-2 pt-3 border-t border-gray-100`}
                  >
                    <View
                      style={tw`flex-row justify-between items-center px-1`}
                    >
                      {rowItem.back_seats?.map((seat) => renderSeatBox(seat))}
                    </View>
                  </View>
                );
              }

              return (
                <View
                  key={`row-${rowItem.row}`}
                  style={tw`flex-row items-center justify-between`}
                >
                  {/* Left Side Seats */}
                  <View style={tw`flex-row gap-x-2`}>
                    {rowItem.left?.map((seat) => renderSeatBox(seat))}
                  </View>

                  {/* Row Number */}
                  <Text
                    style={tw`flex-1 text-center font-bold text-gray-900 text-base`}
                  >
                    {rowItem.row}
                  </Text>

                  {/* Right Side Seats */}
                  <View style={tw`flex-row gap-x-2`}>
                    {rowItem.right?.map((seat) => renderSeatBox(seat))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 flex-row justify-between items-center`}
      >
        <View style={tw`flex-1 mr-3`}>
          <Text style={tw`text-xs text-gray-500`} numberOfLines={1}>
            {selectedSeats.length > 0
              ? `${selectedSeats.length}/4 Seat${
                  selectedSeats.length > 1 ? "s" : ""
                } Selected (${selectedSeatNumbers})`
              : "0/4 Seats Selected"}
          </Text>
          <Text style={tw`text-lg font-bold text-black`}>
            {currency} {totalPrice.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
          style={tw`bg-[#F95700] px-6 py-3.5 rounded-full items-center justify-center ${
            selectedSeats.length === 0 ? "opacity-50" : "opacity-100"
          }`}
        >
          <Text style={tw`text-white font-semibold text-sm`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

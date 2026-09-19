import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import BusCard, { BusCardData } from "../../components/ui/transport/BusCard";
import FilterModal from "../../components/ui/transport/FilterModal";
import { busSearchIcon } from "../../lib/icon";
import tw from "../../lib/tailwind";
const BUS_LIST: BusCardData[] = [
  {
    id: "1",
    operator: "Rahman Travels",
    type: "Regular AC • 2-2 Seating",
    price: "$150.00",
    seatsLeft: 32,
    departureTime: "08:00",
    arrivalTime: "10:30",
    origin: "Jakarta",
    destination: "Surabaya",
    duration: "9h 30m",
    isAC: true,
    logoBg: "bg-[#523AEB]",
  },
  {
    id: "2",
    operator: "Rahman Travels",
    type: "Non AC • 2-2 Seating",
    price: "$85.00",
    seatsLeft: 18,
    departureTime: "08:00",
    arrivalTime: "10:30",
    origin: "Jakarta",
    destination: "Surabaya",
    duration: "9h 30m",
    isAC: false,
    logoBg: "bg-[#2A3B5C]",
  },
];

const AllTransPort = () => {
  const insets = useSafeAreaInsets();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilter = (filters: {
    busType: string;
    timeSlot: string;
  }) => {
    console.log("Applied Filters:", filters);
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
            style={tw`w-10 h-10 border border-white rounded-full items-center justify-center`}
          >
            <SvgXml xml={busSearchIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={BUS_LIST}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-10`}
        renderItem={({ item }) => <BusCard bus={item} />}
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

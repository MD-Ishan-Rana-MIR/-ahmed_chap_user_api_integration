import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import BusCard, { BusCardData } from "./BusCard";
import SearchCard from "./SearchCard";

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

export default function Transport() {
  const handleSelectSeat = (bus: BusCardData) => {
    console.log("Selected Bus ID:", bus.id);
  };

  const handleSearchBus = (params: any) => {
    console.log("Search parameters:", params);
  };

  return (
    <View style={tw`flex-1 bg-[#fff]`}>
      <FlatList
        data={BUS_LIST}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-10`}
        ListHeaderComponent={
          <>
            {/* Reusable Search Bar Component */}
            <SearchCard onSearch={handleSearchBus} />

            {/* Header Title Section */}
            <View style={tw`flex-row justify-between items-center mb-3 px-1`}>
              <Text style={tw`text-sm font-bold text-gray-900`}>
                26 Buss are Available
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/all-transport");
                }}
                activeOpacity={0.7}
              >
                <Text style={tw`text-xs font-semibold text-[#F95700]`}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <BusCard bus={item} onSelectSeat={handleSelectSeat} />
        )}
      />
    </View>
  );
}

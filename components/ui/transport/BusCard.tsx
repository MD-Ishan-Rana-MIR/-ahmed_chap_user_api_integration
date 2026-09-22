import { router } from "expo-router";
import { Armchair, Bath, Plug, Snowflake } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "../../../lib/tailwind";

export interface BusCardData {
  id: string;
  operator: string;
  type: string;
  price: string;
  seatsLeft: number;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  duration: string;
  isAC: boolean;
  logoBg?: string;
  travel_date: string | null;
}

interface BusCardProps {
  bus: BusCardData;
  onSelectSeat?: (bus: BusCardData) => void;
}

export default function BusCard({ bus, onSelectSeat }: BusCardProps) {
  console.log(bus);
  return (
    <View
      style={tw`bg-[#fff] border border-gray-100 rounded-2xl p-4 shadow-xs mb-4`}
    >
      {/* Operator Info & Price Header */}
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View style={tw`flex-row items-center gap-x-2.5`}>
          {/* Logo / Icon */}
          <View
            style={tw`w-8 h-8 rounded-xl ${
              bus.logoBg || "bg-[#523AEB]"
            } items-center justify-center flex-row gap-x-0.5`}
          >
            <View style={tw`w-2 h-2 rounded-full bg-white`} />
            <View style={tw`w-2 h-2 rounded-full bg-white`} />
          </View>

          <View>
            <Text style={tw`text-sm font-bold text-gray-900`}>
              {bus.operator}
            </Text>
            <Text style={tw`text-[10px] text-gray-400 mt-0.5`}>{bus.type}</Text>
          </View>
        </View>

        <View style={tw`items-end`}>
          <Text style={tw`text-base font-bold text-[#F95700]`}>
            {bus.price}
          </Text>
          <Text style={tw`text-[10px] text-gray-400 mt-0.5`}>
            {bus.seatsLeft} Seat Left
          </Text>
        </View>
      </View>

      {/* Route & Timeline */}
      <View style={tw`flex-row justify-between items-center mb-3.5 px-1`}>
        <View>
          <Text style={tw`text-base font-bold text-gray-900`}>
            {bus.departureTime}
          </Text>
          <Text style={tw`text-[10px] text-gray-400 mt-0.5`}>{bus.origin}</Text>
        </View>

        <View style={tw`flex-1 mx-3 flex-row items-center justify-center`}>
          <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-300`} />
          <View
            style={tw`flex-1 border-b border-dashed border-gray-300 mx-1`}
          />
          <Text style={tw`text-[11px] text-gray-400 font-medium px-1`}>
            {bus.duration}
          </Text>
          <View
            style={tw`flex-1 border-b border-dashed border-gray-300 mx-1`}
          />
          <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-300`} />
        </View>

        <View style={tw`items-end`}>
          <Text style={tw`text-base font-bold text-gray-900`}>
            {bus.arrivalTime}
          </Text>
          <Text style={tw`text-[10px] text-gray-400 mt-0.5`}>
            {bus.destination}
          </Text>
        </View>
      </View>

      {/* Amenities Row */}
      <View
        style={tw`flex-row items-center justify-between pt-2.5 pb-3 border-t border-gray-100`}
      >
        <View style={tw`flex-row items-center gap-x-1`}>
          <Snowflake size={12} color={bus.isAC ? "#111827" : "#9CA3AF"} />
          <Text style={tw`text-[10px] text-gray-700`}>
            {bus.isAC ? "AC" : "Non AC"}
          </Text>
        </View>
        <View style={tw`h-2.5 w-[1px] bg-gray-200`} />
        <View style={tw`flex-row items-center gap-x-1`}>
          <Armchair size={12} color="#111827" />
          <Text style={tw`text-[10px] text-gray-700`}>Reclining Seat</Text>
        </View>
        <View style={tw`h-2.5 w-[1px] bg-gray-200`} />
        <View style={tw`flex-row items-center gap-x-1`}>
          <Plug size={12} color="#111827" />
          <Text style={tw`text-[10px] text-gray-700`}>USB Charger</Text>
        </View>
        <View style={tw`h-2.5 w-[1px] bg-gray-200`} />
        <View style={tw`flex-row items-center gap-x-1`}>
          <Bath size={12} color="#111827" />
          <Text style={tw`text-[10px] text-gray-700`}>Toilet</Text>
        </View>
      </View>

      {/* Select Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/bus-details/[id]",
            params: { travel_date: bus?.travel_date, id: bus?.id },
          })
        }
        style={tw`bg-[#FFF4EF] py-2.5 rounded-xl items-center justify-center`}
      >
        <Text style={tw`text-[#F95700] font-semibold text-xs`}>
          Select Seat
        </Text>
      </TouchableOpacity>
    </View>
  );
}

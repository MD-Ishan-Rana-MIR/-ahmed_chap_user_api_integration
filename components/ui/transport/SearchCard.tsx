import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ArrowUpDown, Calendar, User } from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc"; // Adjust import to your tailwind library path

interface SearchCardProps {
  onSearch?: (searchParams: {
    tripType: "oneWay" | "roundTrip";
    from: string;
    to: string;
    isRoundtrip: boolean;
    date: Date;
    passengers: number;
  }) => void;
}

export default function SearchCard({ onSearch }: SearchCardProps) {
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [isRoundtripToggle, setIsRoundtripToggle] = useState(false);
  const [fromLocation, setFromLocation] = useState("Jakarta");
  const [toLocation, setToLocation] = useState("Surabaya");

  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Passengers state
  const [passengers, setPassengers] = useState<string>("4");

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        tripType,
        from: fromLocation,
        to: toLocation,
        isRoundtrip: isRoundtripToggle,
        date: selectedDate,
        passengers: parseInt(passengers, 10) || 1,
      });
    }
  };

  return (
    <View
      style={tw`bg-white border border-[#F2F2F2] rounded-2xl px-3 py-4 mb-6 shadow-xs`}
    >
      {/* Trip Type Selector */}
      <View style={tw`flex-row gap-x-3 mb-4`}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setTripType("oneWay")}
          style={tw`flex-1 py-2.5 rounded-full border items-center justify-center ${
            tripType === "oneWay"
              ? "border-[#F86B17] bg-[#FDEFE7]"
              : "border-[#E7EBEB] bg-white"
          }`}
        >
          <Text
            style={tw`text-xs font-semibold ${
              tripType === "oneWay" ? "text-[#F86B17]" : "text-gray-500"
            }`}
          >
            One Way
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setTripType("roundTrip")}
          style={tw`flex-1 py-2.5 rounded-full border items-center justify-center ${
            tripType === "roundTrip"
              ? "border-[#F95700] bg-[#FFF4EF]"
              : "border-gray-200 bg-white"
          }`}
        >
          <Text
            style={tw`text-xs font-semibold ${
              tripType === "roundTrip" ? "text-[#F95700]" : "text-gray-500"
            }`}
          >
            Round Trip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Origin & Destination Inputs Container */}
      <View
        style={tw`bg-[#FBFBFB] rounded-2xl p-3 border border-gray-100 relative mb-3`}
      >
        {/* From Input */}
        <View style={tw`mb-2 pb-1 border-b border-gray-100 pr-10`}>
          <Text style={tw`text-[11px] text-gray-400 font-medium mb-0.5`}>
            From
          </Text>
          <TextInput
            value={fromLocation}
            onChangeText={setFromLocation}
            placeholder="Enter departure city"
            placeholderTextColor="#9CA3AF"
            style={tw`text-sm font-semibold text-gray-800 p-0 h-6`}
          />
        </View>

        {/* To Input */}
        <View style={tw`pr-10 pt-1`}>
          <Text style={tw`text-[11px] text-gray-400 font-medium mb-0.5`}>
            To
          </Text>
          <TextInput
            value={toLocation}
            onChangeText={setToLocation}
            placeholder="Enter destination city"
            placeholderTextColor="#9CA3AF"
            style={tw`text-sm font-semibold text-gray-800 p-0 h-6`}
          />
        </View>

        {/* Swap Location Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSwapLocations}
          style={tw`absolute right-3 top-1/2 -mt-4 w-9 h-9 bg-white rounded-full border border-gray-100 items-center justify-center shadow-xs z-10`}
        >
          <ArrowUpDown size={16} color="#F95700" />
        </TouchableOpacity>
      </View>

      {/* Date & Toggle */}
      <View
        style={tw`flex-row justify-between items-center bg-[#FBFBFB] rounded-2xl p-3 border border-gray-100 mb-3`}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowDatePicker(true)}
          style={tw`flex-row items-center gap-x-2.5 flex-1`}
        >
          <Calendar size={18} color="#6B7280" />
          <Text style={tw`text-xs font-semibold text-gray-800`}>
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center gap-x-2`}>
          <Text style={tw`text-xs text-gray-400`}>Roundtrip?</Text>
          <Switch
            value={isRoundtripToggle}
            onValueChange={setIsRoundtripToggle}
            trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Date Picker Component */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Passenger Input */}
      <View
        style={tw`flex-row items-center gap-x-2.5 bg-[#FBFBFB] rounded-2xl p-3 border border-gray-100 mb-4`}
      >
        <User size={18} color="#6B7280" />
        <TextInput
          value={passengers}
          onChangeText={(text) => setPassengers(text.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="1"
          placeholderTextColor="#9CA3AF"
          style={tw`text-xs font-semibold text-gray-800 p-0 flex-1 h-5`}
        />
      </View>

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSearch}
        style={tw`bg-[#F86B17] py-3.5 rounded-full items-center justify-center shadow-xs`}
      >
        <Text style={tw`text-white font-semibold text-sm`}>Search Bus</Text>
      </TouchableOpacity>
    </View>
  );
}

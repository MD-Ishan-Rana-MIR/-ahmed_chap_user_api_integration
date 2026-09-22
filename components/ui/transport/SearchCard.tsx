import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ArrowUpDown, Calendar, User } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

export interface SearchParams {
  tripType: "oneWay" | "roundTrip";
  departure: string;
  destination: string;
  isRoundtrip: boolean;
  date: string; // YYYY-MM-DD
  passengers: number;
}

interface SearchCardProps {
  onSearch?: (searchParams: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchCard({ onSearch, isLoading }: SearchCardProps) {
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [isRoundtripToggle, setIsRoundtripToggle] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Passengers state
  const [passengers, setPassengers] = useState<string>("1");

  // Validation state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
    setErrorMessage(null);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Convert Date object to YYYY-MM-DD format for Backend API
  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Validation Logic
  const validateForm = (): boolean => {
    const trimmedFrom = fromLocation.trim();
    const trimmedTo = toLocation.trim();
    const numPassengers = parseInt(passengers, 10);

    if (!trimmedFrom) {
      setErrorMessage("Please enter departure city (From)");
      return false;
    }

    if (!trimmedTo) {
      setErrorMessage("Please enter destination city (To)");
      return false;
    }

    if (trimmedFrom.toLowerCase() === trimmedTo.toLowerCase()) {
      setErrorMessage("Departure and destination cannot be the same");
      return false;
    }

    if (isNaN(numPassengers) || numPassengers < 1) {
      setErrorMessage("Please enter at least 1 passenger");
      return false;
    }

    if (numPassengers > 10) {
      setErrorMessage("Maximum 10 passengers allowed per booking");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSearch = () => {
    if (!validateForm()) return;

    if (onSearch) {
      onSearch({
        tripType,
        departure: fromLocation.trim(),
        destination: toLocation.trim(),
        isRoundtrip: isRoundtripToggle,
        date: formatDateForApi(selectedDate),
        passengers: parseInt(passengers, 10) || 1,
      });
    }
  };

  return (
    <View
      style={tw`bg-white border border-[#F2F2F2] rounded-2xl px-3 py-4 mb-4 shadow-xs`}
    >
      {/* Trip Type Selector */}
      <View style={tw`flex-row gap-x-3 mb-4`}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setTripType("oneWay");
            setIsRoundtripToggle(false);
          }}
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
          onPress={() => {
            setTripType("roundTrip");
            setIsRoundtripToggle(true);
          }}
          style={tw`flex-1 py-2.5 rounded-full border items-center justify-center ${
            tripType === "roundTrip"
              ? "border-[#F86B17] bg-[#FDEFE7]"
              : "border-gray-200 bg-white"
          }`}
        >
          <Text
            style={tw`text-xs font-semibold ${
              tripType === "roundTrip" ? "text-[#F86B17]" : "text-gray-500"
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
            onChangeText={(text) => {
              setFromLocation(text);
              if (errorMessage) setErrorMessage(null);
            }}
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
            onChangeText={(text) => {
              setToLocation(text);
              if (errorMessage) setErrorMessage(null);
            }}
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
          <ArrowUpDown size={16} color="#F86B17" />
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
            {formatDateDisplay(selectedDate)}
          </Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center gap-x-2`}>
          <Text style={tw`text-xs text-gray-400`}>Roundtrip?</Text>
          <Switch
            value={isRoundtripToggle}
            onValueChange={(val) => {
              setIsRoundtripToggle(val);
              setTripType(val ? "roundTrip" : "oneWay");
            }}
            trackColor={{ false: "#E5E7EB", true: "#F86B17" }}
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
        style={tw`flex-row items-center gap-x-2.5 bg-[#FBFBFB] rounded-2xl p-3 border border-gray-100 mb-3`}
      >
        <User size={18} color="#6B7280" />
        <TextInput
          value={passengers}
          onChangeText={(text) => {
            setPassengers(text.replace(/[^0-9]/g, ""));
            if (errorMessage) setErrorMessage(null);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="1"
          placeholderTextColor="#9CA3AF"
          style={tw`text-xs font-semibold text-gray-800 p-0 flex-1 h-5`}
        />
        <Text style={tw`text-xs text-gray-400`}>Passenger(s)</Text>
      </View>

      {/* Validation Error Message */}
      {errorMessage && (
        <View style={tw`bg-red-50 border border-red-100 p-2.5 rounded-xl mb-3`}>
          <Text style={tw`text-red-500 text-xs font-medium text-center`}>
            {errorMessage}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSearch}
        disabled={isLoading}
        style={tw`bg-[#F86B17] py-3.5 rounded-full items-center justify-center shadow-xs ${
          isLoading ? "opacity-70" : ""
        }`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={tw`text-white font-semibold text-sm`}>Search Bus</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { memo, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "../../../../lib/tailwind";

interface SearchCardProps {
  onSearch?: (searchData: {
    location: string;
    date: string;
    guests: string;
  }) => void;
}

export const SearchCard = memo(({ onSearch }: SearchCardProps) => {
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState("");

  // Handle Date Change from Picker
  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  // Format Date to YYYY-MM-DD
  const formattedDate = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  // Validation Logic before Triggering Search
  const handleSearch = () => {
    if (!location.trim()) {
      Alert.alert("Validation Error", "Please enter a destination location.");
      return;
    }

    if (!selectedDate) {
      Alert.alert("Validation Error", "Please select a valid date.");
      return;
    }
    // location, date, guests

    if (selectedDate && location) {
      router.push(
        `/hotel-search/[Search]?location=${location}&date=${selectedDate}&guests=${guests}`,
      );
    }
  };

  return (
    <View
      style={tw`bg-white rounded-3xl p-4 border border-gray-100 shadow-xs mb-6`}
    >
      <Text
        style={tw`text-xl text-[#000000AD] mb-3.5 font-Manrope-Regular.ttf`}
      >
        Find Your{" "}
        <Text style={tw`font-Manrope-Medium.ttf text-[#000]`}>Dream Stay</Text>
      </Text>

      {/* Location Input */}
      <View style={tw`mb-2.5`}>
        <Text style={tw`text-xs font-Manrope-Medium.ttf text-[#101010] mb-2`}>
          Location *
        </Text>
        <View
          style={tw`flex-row items-center bg-[#F5F5F7] rounded-2xl px-3.5 py-2`}
        >
          <Ionicons
            name="location-outline"
            size={18}
            color="#9CA3AF"
            style={tw`mr-2`}
          />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your destination"
            placeholderTextColor="#A1A1AA"
            style={tw`flex-1 text-xs text-[#222222]`}
          />
        </View>
      </View>

      {/* Date & Guest Inputs */}
      <View style={tw`flex-row gap-3 mb-4`}>
        {/* Date Input with Calendar Modal Trigger */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-xs font-Manrope-Medium.ttf text-[#101010] mb-2`}>
            Date *
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
            style={tw`flex-row items-center bg-[#F5F5F7] rounded-2xl px-3 py-4`}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#9CA3AF"
              style={tw`mr-2`}
            />
            <Text
              style={tw`text-xs ${
                formattedDate ? "text-[#222222]" : "text-[#A1A1AA]"
              }`}
            >
              {formattedDate || "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guest Input */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-xs font-Manrope-Medium.ttf text-[#101010] mb-2`}>
            Guest
          </Text>
          <View
            style={tw`flex-row items-center bg-[#F5F5F7] rounded-2xl px-3 py-2`}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color="#9CA3AF"
              style={tw`mr-2`}
            />
            <TextInput
              value={guests}
              onChangeText={setGuests}
              placeholder="Add guest"
              placeholderTextColor="#A1A1AA"
              keyboardType="number-pad"
              style={tw`flex-1 text-xs text-[#222222]`}
            />
          </View>
        </View>
      </View>

      {/* Native Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* Search Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleSearch}
        style={tw`w-full bg-[#FF5A1F] py-3.5 rounded-full items-center justify-center shadow-xs`}
      >
        <Text style={tw`text-white font-Manrope-Medium.ttf text-sm`}>
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
});

import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";

export default function HotelSearchCard() {
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guest, setGuest] = useState("");

  // Controls for DatePicker & Errors
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ location?: string; date?: string }>(
    {},
  );

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleSearch = () => {
    const newErrors: { location?: string; date?: string } = {};

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);

    // location, date, guests

    if (location && selectedDate) {
      router.push(
        `/hotel-search/[Search]?location=${location}&date=${selectedDate}&guests=${guest}`,
      );
    }
  };

  return (
    <View
      style={tw`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full mb-6`}
    >
      {/* Title */}
      <Text style={tw`text-2xl text-gray-700 mb-5`}>
        Find Your <Text style={tw`font-bold text-black`}>Dream Stay</Text>
      </Text>

      {/* Location Section */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-base font-medium text-black mb-2`}>Location</Text>
        <View
          style={tw`flex-row items-center bg-[#F5F5F5] rounded-full px-4 py-3.5 ${
            errors.location ? "border border-red-500" : ""
          }`}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color="#8E8E93"
            style={tw`mr-2`}
          />
          <TextInput
            placeholder="Enter your destination"
            placeholderTextColor="#A0A0A5"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) {
                setErrors((prev) => ({ ...prev, location: undefined }));
              }
            }}
            style={tw`flex-1 text-base text-gray-800 p-0`}
          />
        </View>
        {errors.location && (
          <Text style={tw`text-xs text-red-500 mt-1 ml-3`}>
            {errors.location}
          </Text>
        )}
      </View>

      {/* Date & Guest Section */}
      <View style={tw`flex-row justify-between mb-6 gap-3`}>
        {/* Date Field */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-medium text-black mb-2`}>Date</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDatePicker(true)}
            style={tw`flex-row items-center bg-[#F5F5F5] rounded-full px-4 py-3.5 ${
              errors.date ? "border border-red-500" : ""
            }`}
          >
            <Octicons
              name="calendar"
              size={18}
              color="#8E8E93"
              style={tw`mr-2.5`}
            />
            <Text
              style={tw`flex-1 text-base p-0 ${
                selectedDate ? "text-gray-800" : "text-[#A0A0A5]"
              }`}
              numberOfLines={1}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Select Date"}
            </Text>
          </TouchableOpacity>
          {errors.date && (
            <Text style={tw`text-xs text-red-500 mt-1 ml-3`}>
              {errors.date}
            </Text>
          )}
        </View>

        {/* Guest Field */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-medium text-black mb-2`}>Guest</Text>
          <View
            style={tw`flex-row items-center bg-[#F5F5F5] rounded-full px-4 py-3.5`}
          >
            <Feather name="user" size={18} color="#8E8E93" style={tw`mr-2.5`} />
            <TextInput
              placeholder="Add guest"
              placeholderTextColor="#A0A0A5"
              value={guest}
              onChangeText={setGuest}
              keyboardType="number-pad"
              style={tw`flex-1 text-base text-gray-800 p-0`}
            />
          </View>
        </View>
      </View>

      {/* DatePicker Component */}
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
        activeOpacity={0.8}
        onPress={handleSearch}
        style={tw`bg-[#F95A12] rounded-full py-4 items-center justify-center`}
      >
        <Text style={tw`text-white font-semibold text-lg`}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

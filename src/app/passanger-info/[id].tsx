import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackButton from "../../../components/ui/BackButton";
import tw from "../../../lib/tailwind";

type FormData = {
  name: string;
  phoneNumber: string;
  email?: string;
};

// Country Code List
const COUNTRY_CODES = [
  { code: "+218", name: "Libya", flag: ["#E52533", "#000000", "#239E46"] },
  { code: "+254", name: "Kenya", flag: ["#000000", "#990000", "#006600"] },
  { code: "+880", name: "Bangladesh", flag: ["#006A4E", "#F42A41", "#006A4E"] },
  {
    code: "+1",
    name: "United States",
    flag: ["#B22234", "#FFFFFF", "#3C3B6E"],
  },
  {
    code: "+44",
    name: "United Kingdom",
    flag: ["#00247D", "#CF142B", "#FFFFFF"],
  },
  { code: "+971", name: "UAE", flag: ["#FF0000", "#007A3D", "#FFFFFF"] },
];

export default function PassengerInfo() {
  const {
    id,
    bus_id,
    travel_date,
    selected_seat_ids,
    selected_seat_numbers,
    total_price,
    totalSeat,
    currency,
  } = useLocalSearchParams();

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // React Hook Form setup (Without Yup)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
    },
  });

  const filteredCountries = COUNTRY_CODES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery),
  );

  const toStringParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value.join(",") : (value ?? "");

  const toNumberParam = (value: string | string[] | undefined) => {
    const normalized = Array.isArray(value) ? value[0] : value;
    return Number(normalized ?? 0);
  };

  const onSubmit = (data: FormData) => {
    router.push({
      pathname: "/booking-details/[id]",
      params: {
        id: toStringParam(id),
        bus_id: toStringParam(bus_id),
        travel_date: toStringParam(travel_date),
        selected_seat_ids: toStringParam(selected_seat_ids),
        selected_seat_numbers: toStringParam(selected_seat_numbers),
        total_price: toNumberParam(total_price),
        passenger_name: data.name,
        passenger_phone: `${selectedCountry.code}${data.phoneNumber}`,
        passenger_email: data.email || "",
        totalSeat: toStringParam(totalSeat),
        currency: currency,
      },
    });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Name of Passenger" />

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          contentContainerStyle={tw`px-5 pt-8 pb-10 flex-grow justify-between`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields Section */}
          <View style={tw`gap-y-6`}>
            {/* Name Input */}
            <View>
              <Text style={tw`text-[15px] text-[#6B7280] font-normal mb-2.5`}>
                Name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Name is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={tw`h-[54px] border ${
                      errors.name ? "border-red-500" : "border-[#E5E7EB]"
                    } rounded-full px-5 justify-center bg-white`}
                  >
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter Name"
                      placeholderTextColor="#9CA3AF"
                      style={tw`text-[15px] text-[#374151] font-normal p-0`}
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text style={tw`text-red-500 text-xs mt-1 ml-3`}>
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Phone Number Input */}
            <View>
              <Text style={tw`text-[15px] text-[#6B7280] font-normal mb-2.5`}>
                Phone Number
              </Text>
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Phone number must contain only digits",
                  },
                  minLength: {
                    value: 7,
                    message: "Phone number must be at least 7 digits",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={tw`h-[54px] border ${
                      errors.phoneNumber ? "border-red-500" : "border-[#E5E7EB]"
                    } rounded-full px-4 flex-row items-center bg-white`}
                  >
                    {/* Country Dropdown Trigger */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setIsModalVisible(true)}
                      style={tw`flex-row items-center gap-x-1.5 pr-3 border-r border-[#E5E7EB] h-6`}
                    >
                      <View
                        style={tw`w-5 h-5 rounded-full overflow-hidden bg-black border border-[#E5E7EB] justify-center items-center`}
                      >
                        <View
                          style={tw`w-full h-[33%]`}
                          backgroundColor={selectedCountry.flag[0]}
                        />
                        <View
                          style={tw`w-full h-[34%]`}
                          backgroundColor={selectedCountry.flag[1]}
                        />
                        <View
                          style={tw`w-full h-[33%]`}
                          backgroundColor={selectedCountry.flag[2]}
                        />
                      </View>

                      <Text style={tw`text-[14px] text-[#6B7280] font-normal`}>
                        {selectedCountry.code}
                      </Text>
                      <ChevronDown size={16} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Input Text Field */}
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter phone number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      style={tw`flex-1 text-[15px] text-[#374151] font-normal pl-3 p-0`}
                    />
                  </View>
                )}
              />
              {errors.phoneNumber && (
                <Text style={tw`text-red-500 text-xs mt-1 ml-3`}>
                  {errors.phoneNumber.message}
                </Text>
              )}
            </View>

            {/* Email Address Input (Optional) */}
            <View>
              <View style={tw`flex-row items-center mb-2.5`}>
                <Text style={tw`text-[15px] text-[#6B7280] font-normal`}>
                  Email Address{" "}
                </Text>
                <Text style={tw`text-[15px] text-[#9CA3AF] font-normal`}>
                  (optional)
                </Text>
              </View>

              <Controller
                control={control}
                name="email"
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={tw`h-[54px] border ${
                      errors.email ? "border-red-500" : "border-[#E5E7EB]"
                    } rounded-full px-5 justify-center bg-white`}
                  >
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter Your Email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={tw`text-[15px] text-[#374151] font-normal p-0`}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={tw`text-red-500 text-xs mt-1 ml-3`}>
                  {errors.email.message}
                </Text>
              )}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit(onSubmit)}
            style={tw`w-full h-[54px] bg-[#587211] rounded-full items-center justify-center mt-10 shadow-xs`}
          >
            <Text style={tw`text-white font-semibold text-[16px]`}>
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>

      {/* Country Code Selection Dropdown Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
          style={tw`flex-1 bg-black/40 justify-end`}
        >
          <View
            style={tw`bg-[#ffffff] rounded-t-3xl px-5 pt-5 pb-8 max-h-[70%]`}
            onStartShouldSetResponder={() => true}
          >
            {/* Modal Header */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-semibold text-gray-900`}>
                Select Country Code
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={tw`p-1 rounded-full bg-gray-100`}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
              style={tw`flex-row items-center bg-gray-100 rounded-xl px-3 py-2 mb-4`}
            >
              <Search size={18} color="#9CA3AF" style={tw`mr-2`} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search country or code"
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 text-sm text-gray-800 p-0`}
              />
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedCountry.code === item.code;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedCountry(item);
                      setIsModalVisible(false);
                      setSearchQuery("");
                    }}
                    style={tw`flex-row items-center justify-between py-3.5 border-b border-gray-100`}
                  >
                    <View style={tw`flex-row items-center gap-x-3`}>
                      <View
                        style={tw`w-6 h-6 rounded-full overflow-hidden bg-black border border-[#E5E7EB] justify-center items-center`}
                      >
                        <View
                          style={tw`w-full h-[33%]`}
                          backgroundColor={item.flag[0]}
                        />
                        <View
                          style={tw`w-full h-[34%]`}
                          backgroundColor={item.flag[1]}
                        />
                        <View
                          style={tw`w-full h-[33%]`}
                          backgroundColor={item.flag[2]}
                        />
                      </View>
                      <Text style={tw`text-base text-gray-800 font-medium`}>
                        {item.name}
                      </Text>
                    </View>

                    <View style={tw`flex-row items-center gap-x-2`}>
                      <Text style={tw`text-sm font-semibold text-gray-500`}>
                        {item.code}
                      </Text>
                      {isSelected && <Check size={18} color="#587211" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

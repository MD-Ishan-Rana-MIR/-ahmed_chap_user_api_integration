import { useCreateAddressMutation } from "@/redux/deliverAddressApi";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { errorMsg } from "../../lib/msg/errorMsg";
import { successMsg } from "../../lib/msg/successMsg";
import tw from "../../lib/tailwind";

// Replace with your actual base URL variable or environment config
const GOOGLE_MAPS_API_KEY = "AIzaSyDpXUCYWUfawKwLO0KlT0V9Y1t2DTBNx-A";

export interface AddressFormData {
  id?: string | number;
  title: string;
  address_text: string;
  phone_number: string;
  latitude: number;
  longitude: number;
}

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  initialValues?: AddressFormData | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
  initialValues,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Omit<AddressFormData, "latitude" | "longitude" | "id">>({
    defaultValues: {
      title: "",
      address_text: "",
      phone_number: "",
    },
  });

  const [lat, setLat] = useState<number | null>(null);
  const [long, setLong] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        reset({
          title: initialValues.title || "",
          address_text: initialValues.address_text || "",
          phone_number: initialValues.phone_number || "",
        });
        setLat(initialValues.latitude ?? null);
        setLong(initialValues.longitude ?? null);
      } else {
        reset({
          title: "",
          address_text: "",
          phone_number: "",
        });
        setLat(null);
        setLong(null);
      }
      setSuggestions([]);
    }
  }, [visible, initialValues, reset]);

  const fetchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_MAPS_API_KEY}`,
      );

      setSuggestions(response?.data?.results || []);
    } catch (error) {
      console.error("Places API Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressChange = (
    text: string,
    onChange: (val: string) => void,
  ) => {
    onChange(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchPlaces(text);
    }, 400);
  };

  const handleSelectPlace = (place: any) => {
    const formattedAddress = place.formatted_address || place.name;
    const selectedLat = place.geometry?.location?.lat;
    const selectedLng = place.geometry?.location?.lng;

    setValue("address_text", formattedAddress, { shouldValidate: true });
    if (selectedLat && selectedLng) {
      setLat(selectedLat);
      setLong(selectedLng);
    }
    setSuggestions([]);
  };

  const [createAddress] = useCreateAddressMutation();

  const onSubmit = async (
    data: Omit<AddressFormData, "latitude" | "longitude" | "id">,
  ) => {
    const payload = {
      ...data,
      latitude: lat,
      longitude: long,
    };
    try {
      const res = await createAddress(payload).unwrap();
      if (res) {
        reset();
        onClose();
        return successMsg(res?.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      return errorMsg(errorMessage);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        style={tw`flex-1`}
        contentContainerStyle={tw`flex-grow bg-black/50 justify-center items-center px-4 py-6`}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={tw`bg-white rounded-2xl w-full max-w-md p-5 shadow-lg gap-y-4`}
        >
          {/* Header */}
          <View
            style={tw`flex-row justify-between items-center pb-4 border-b border-gray-100`}
          >
            <Text style={tw`text-lg font-bold text-gray-900`}>
              {initialValues ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity onPress={onClose} style={tw`p-1`}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1.5`}>
              Title
            </Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: "Title is required (e.g. Home, Office)" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={tw`border ${
                    errors.title ? "border-red-500" : "border-gray-200"
                  } rounded-xl px-4 py-3 bg-gray-50 text-base text-[#111827]`}
                  placeholder="e.g. Home, Office"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.title && (
              <Text style={tw`text-xs text-red-500 mt-1`}>
                {errors.title.message}
              </Text>
            )}
          </View>

          {/* Address Input */}
          <View style={tw`z-10`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1.5`}>
              Full Address
            </Text>
            <Controller
              control={control}
              name="address_text"
              rules={{ required: "Address is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={tw`relative`}>
                  <View
                    style={tw`h-12 border ${
                      errors.address_text ? "border-red-500" : "border-gray-200"
                    } rounded-xl px-4 bg-gray-50 flex-row items-center justify-between`}
                  >
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={(text) =>
                        handleAddressChange(text, onChange)
                      }
                      value={value}
                      placeholder="City, Area or Street address"
                      placeholderTextColor="#9CA3AF"
                      style={tw`flex-1 text-base text-[#111827]`}
                    />
                    {isSearching ? (
                      <ActivityIndicator size="small" color="#6B7280" />
                    ) : (
                      <Ionicons
                        name="location-sharp"
                        size={18}
                        color="#6B7280"
                      />
                    )}
                  </View>

                  {/* Auto-suggest dropdown */}
                  {suggestions.length > 0 && (
                    <View
                      style={tw`mt-1 border border-gray-200 rounded-xl bg-white shadow-md max-h-48 overflow-hidden`}
                    >
                      <ScrollView keyboardShouldPersistTaps="handled">
                        {suggestions.map((item, index) => (
                          <TouchableOpacity
                            key={item.place_id || index.toString()}
                            style={tw`p-3 border-b border-gray-100 flex-row items-center gap-x-2`}
                            onPress={() => handleSelectPlace(item)}
                          >
                            <Ionicons
                              name="location-outline"
                              size={16}
                              color="#6B7280"
                            />
                            <Text
                              style={tw`text-xs text-gray-700 flex-1`}
                              numberOfLines={2}
                            >
                              {item.formatted_address || item.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
            {errors.address_text && (
              <Text style={tw`text-xs text-red-500 mt-1`}>
                {errors.address_text.message}
              </Text>
            )}
          </View>

          {/* Phone Input */}
          <View>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1.5`}>
              Phone Number
            </Text>
            <Controller
              control={control}
              name="phone_number"
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Enter valid 11 digit mobile number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={tw`border ${
                    errors.phone_number ? "border-red-500" : "border-gray-200"
                  } rounded-xl px-4 py-3 bg-gray-50 text-base text-[#111827]`}
                  placeholder="01726543647"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.phone_number && (
              <Text style={tw`text-xs text-red-500 mt-1`}>
                {errors.phone_number.message}
              </Text>
            )}
          </View>

          {/* Submit Action */}
          <View style={tw`mt-2`}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={tw`bg-[#5A7314] py-3.5 rounded-full items-center justify-center flex-row gap-x-2`}
            >
              {isSubmitting && (
                <ActivityIndicator color="#FFFFFF" size="small" />
              )}
              <Text style={tw`text-white font-semibold text-base`}>
                {isSubmitting ? "Saving..." : "Save Address"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

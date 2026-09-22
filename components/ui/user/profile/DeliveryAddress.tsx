import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAllAddressQuery,
} from "@/redux/deliverAddressApi";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { errorMsg } from "../../../../lib/msg/errorMsg";
import { successMsg } from "../../../../lib/msg/successMsg";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";
import Button from "../../Button";
import AddressSkeleton from "../../skeleton/AddressSkeleton";

interface AddressCardProps {
  title: string;
  address_text: string;
  isLast?: boolean;
  phone_number: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface FormErrors {
  title?: string;
  address?: string;
  phone?: string;
  location?: string;
}

const AddressCardItem = ({
  title,
  address_text,
  isLast = false,
  onDelete,
  phone_number,
}: AddressCardProps) => (
  <View
    style={[
      tw`flex-row items-center justify-between py-4 px-4`,
      !isLast && tw`border-b border-gray-100`,
    ]}
  >
    <View style={tw`flex-row items-center gap-x-3.5 flex-1 mr-2`}>
      <View
        style={tw`w-11 h-11 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] items-center justify-center`}
      >
        <Ionicons name="location-outline" size={20} color="#374151" />
      </View>

      <View style={tw`flex-1`}>
        <Text style={tw`text-xs font-Manrope-SemiBold text-blackText`}>
          {title}
        </Text>
        <Text
          style={tw`text-xs font-Manrope-Regular text-[#909090] mt-1`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {[address_text, phone_number].filter(Boolean).join(" • ")}
        </Text>
      </View>
    </View>

    <View style={tw`flex-row items-center gap-x-3`}>
      <TouchableOpacity
        onPress={onDelete}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function DeliveryAddress() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ==================================== Address Delete APi ==================================================

  const [deleteAddress] = useDeleteAddressMutation();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteAddress(id).unwrap();
              if (res) {
                return successMsg(res?.message);
              }
            } catch (error: any) {
              const errorMessage =
                error?.data?.message ||
                error?.message ||
                "An unexpected error occurred.";
              return errorMsg(errorMessage);
            }
          },
        },
      ],
    );
  };

  // Fetch coordinates with basic error handling
  const handleFetchCoordinates = async (text: string) => {
    if (!text || text.trim().length < 5) {
      setLatitudeInput("");
      setLongitudeInput("");
      return;
    }

    try {
      setIsGeocoding(true);
      const geocodedLocation = await Location.geocodeAsync(text);

      if (geocodedLocation && geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        setLatitudeInput(latitude.toString());
        setLongitudeInput(longitude.toString());
        setErrors((prev) => ({ ...prev, location: undefined }));
      } else {
        setLatitudeInput("");
        setLongitudeInput("");
        setErrors((prev) => ({
          ...prev,
          location: "Could not find coordinates for this address",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        location: "Error fetching coordinates",
      }));
    } finally {
      setIsGeocoding(false);
    }
  };

  // Debounced input change handler
  const handleAddressChange = (text: string) => {
    setAddressInput(text);
    if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleFetchCoordinates(text);
    }, 800);
  };

  // Form Validation Logic
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!titleInput.trim()) {
      newErrors.title = "Title is required";
    }

    if (!addressInput.trim()) {
      newErrors.address = "Street address is required";
    } else if (addressInput.trim().length < 5) {
      newErrors.address = "Address is too short";
    }

    if (!phoneInput.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(phoneInput.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!latitudeInput || !longitudeInput) {
      newErrors.location = "Valid coordinates are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [createAddress, { isLoading: createLoading }] =
    useCreateAddressMutation();

  const resetForm = () => {
    setTitleInput("");
    setAddressInput("");
    setPhoneInput("");
    setLatitudeInput("");
    setLongitudeInput("");
    setErrors({});
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    const payload = {
      title: titleInput,
      address_text: addressInput,
      phone_number: phoneInput,
      latitude: latitudeInput,
      longitude: longitudeInput,
    };

    try {
      const res = await createAddress(payload).unwrap();

      if (res) {
        resetForm();
        setIsModalVisible(false);
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

  const { data, isLoading } = useGetAllAddressQuery({});
  const addresses = data?.data?.addresses || [];

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Delivery Address" showBackButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-5 pb-6`}
      >
        {isLoading ? (
          <AddressSkeleton />
        ) : (
          <View
            style={tw`bg-[#FCFCFC] rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden`}
          >
            {addresses.map((item, index) => (
              <AddressCardItem
                key={item.id}
                title={item.title}
                address_text={item.address_text}
                phone_number={item?.phone_number}
                isLast={index === addresses.length - 1}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={tw`px-5 py-4 border-t border-gray-100 bg-white`}>
        <Button
          text="Add new"
          showIcon={true}
          onPress={() => {
            resetForm();
            setIsModalVisible(true);
          }}
        />
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
          style={tw`flex-1 bg-black/50 justify-center items-center px-5`}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={tw`bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-xl`}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-900`}>
                Add New Address
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={tw`max-h-100`}
            >
              <View style={tw`gap-y-3.5 mb-5`}>
                {/* Title Input */}
                <View>
                  <Text style={tw`text-xs font-medium text-gray-700 mb-1`}>
                    Title (e.g. Home, Office)
                  </Text>
                  <TextInput
                    placeholder="Home"
                    value={titleInput}
                    onChangeText={(text) => {
                      setTitleInput(text);
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    style={[
                      tw`bg-[#F9FAFB] border rounded-xl px-4 py-2.5 text-sm text-gray-900`,
                      errors.title ? tw`border-red-500` : tw`border-gray-200`,
                    ]}
                  />
                  {errors.title && (
                    <Text style={tw`text-xs text-red-500 mt-1`}>
                      {errors.title}
                    </Text>
                  )}
                </View>

                {/* Street Address Input */}
                <View>
                  <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={tw`text-xs font-medium text-gray-700`}>
                      Street Address
                    </Text>
                    {isGeocoding && (
                      <ActivityIndicator size="small" color="#FF5A1F" />
                    )}
                  </View>
                  <TextInput
                    placeholder="Enter full address"
                    value={addressInput}
                    onChangeText={handleAddressChange}
                    onBlur={() => handleFetchCoordinates(addressInput)}
                    style={[
                      tw`bg-[#F9FAFB] border rounded-xl px-4 py-2.5 text-sm text-gray-900`,
                      errors.address ? tw`border-red-500` : tw`border-gray-200`,
                    ]}
                  />
                  {errors.address && (
                    <Text style={tw`text-xs text-red-500 mt-1`}>
                      {errors.address}
                    </Text>
                  )}
                </View>

                {/* Phone Input */}
                <View>
                  <Text style={tw`text-xs font-medium text-gray-700 mb-1`}>
                    Phone Number
                  </Text>
                  <TextInput
                    placeholder="+1 234 567 890"
                    keyboardType="phone-pad"
                    value={phoneInput}
                    onChangeText={(text) => {
                      setPhoneInput(text);
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    style={[
                      tw`bg-[#F9FAFB] border rounded-xl px-4 py-2.5 text-sm text-gray-900`,
                      errors.phone ? tw`border-red-500` : tw`border-gray-200`,
                    ]}
                  />
                  {errors.phone && (
                    <Text style={tw`text-xs text-red-500 mt-1`}>
                      {errors.phone}
                    </Text>
                  )}
                </View>

                {/* Disabled Lat / Long Fields */}
                <View style={tw`flex-row gap-x-3`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs font-medium text-gray-700 mb-1`}>
                      Latitude
                    </Text>
                    <TextInput
                      editable={false}
                      placeholder="Auto-detected"
                      value={latitudeInput}
                      style={tw`bg-[#F3F4F6] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500`}
                    />
                  </View>

                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs font-medium text-gray-700 mb-1`}>
                      Longitude
                    </Text>
                    <TextInput
                      editable={false}
                      placeholder="Auto-detected"
                      value={longitudeInput}
                      style={tw`bg-[#F3F4F6] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500`}
                    />
                  </View>
                </View>

                {/* Location Error Display */}
                {errors.location && (
                  <Text style={tw`text-xs text-red-500`}>
                    {errors.location}
                  </Text>
                )}
              </View>
            </ScrollView>

            <Button
              text="Save Address"
              onPress={handleSaveAddress}
              isLoading={createLoading}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

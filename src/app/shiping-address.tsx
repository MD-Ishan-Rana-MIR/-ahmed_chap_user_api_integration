import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../lib/tailwind";

interface AddressItem {
  id: string;
  label: string;
  address: string;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "1",
    label: "Home",
    address: "House 12, Road 5, Mohakhali, Dhaka",
  },
  {
    id: "2",
    label: "Office",
    address: "House 12, Road 5, Mohakhali, Dhaka",
  },
  {
    id: "3",
    label: "Friend's House",
    address: "House 12, Road 5, Mohakhali, Dhaka",
  },
  {
    id: "4",
    label: "Parent's House",
    address: "House 12, Road 5, Mohakhali, Dhaka",
  },
];

export default function ShippingAddress() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [selectedId, setSelectedId] = useState<string>("1");

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [location, setLocation] = useState("");

  const handleAddAddress = () => {
    if (!placeName.trim() || !location.trim()) return;

    const newAddressItem: AddressItem = {
      id: Date.now().toString(),
      label: placeName.trim(),
      address: location.trim(),
    };

    setAddresses((prev) => [...prev, newAddressItem]);
    setSelectedId(newAddressItem.id);

    // Reset Form & Close Modal
    setPlaceName("");
    setLocation("");
    setIsModalVisible(false);
  };

  const handleConfirmAddress = () => {
    // Navigate back to cart or checkout after selecting an address
    router.back();
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="dark" />

      {/* Fixed Header */}
      <View
        style={[
          tw`flex-row items-center px-5 pb-4 border-b border-gray-100 bg-white z-10`,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={tw`w-9 h-9 rounded-full border border-gray-200 items-center justify-center mr-3`}
        >
          <Ionicons name="chevron-back" size={18} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-[#222222]`}>
          Shipping Address
        </Text>
      </View>

      {/* Scrollable Address List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom + 100, 120),
        }}
      >
        <View
          style={tw`border border-gray-100 rounded-2xl bg-white px-2 py-1 shadow-xs`}
        >
          {addresses.map((item, index) => {
            const isSelected = selectedId === item.id;
            const isLast = index === addresses.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                activeOpacity={0.7}
                style={[
                  tw`flex-row items-center justify-between py-4 px-3`,
                  !isLast && tw`border-b border-gray-100`,
                ]}
              >
                {/* Location Icon */}
                <View
                  style={tw`w-11 h-11 rounded-full bg-[#F3F4F6] items-center justify-center mr-3`}
                >
                  <Ionicons name="location-outline" size={20} color="#4B5563" />
                </View>

                {/* Address Labels */}
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-xs font-semibold text-[#222222] mb-0.5`}>
                    {item.label}
                  </Text>
                  <Text style={tw`text-xs text-[#909090]`}>{item.address}</Text>
                </View>

                {/* Radio Indicator */}
                <View
                  style={tw`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    isSelected ? "border-[#587511]" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <View style={tw`w-2.5 h-2.5 rounded-full bg-[#587511]`} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add New Address Outline Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsModalVisible(true)}
          style={tw`w-full border border-[#587511] border-dashed py-3.5 rounded-2xl items-center justify-center flex-row gap-2 mt-4 bg-[#587511]/5`}
        >
          <Ionicons name="add-circle-outline" size={20} color="#587511" />
          <Text style={tw`text-[#587511] font-semibold text-sm`}>
            Add New Address
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Apply Button */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 border-t border-gray-100 shadow-lg`,
          { paddingBottom: Math.max(insets.bottom + 12, 20) },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleConfirmAddress}
          style={tw`w-full bg-[#587511] py-4 rounded-full items-center justify-center shadow-sm`}
        >
          <Text style={tw`text-white font-bold text-base`}>
            Apply Selected Address
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add New Address Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={tw`flex-1 bg-black/50 justify-center items-center px-5`}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`w-full bg-white rounded-3xl p-5`}
              >
                {/* Modal Header */}
                <View
                  style={tw`flex-row justify-between items-center mb-5 pb-3 border-b border-gray-100`}
                >
                  <Text style={tw`text-lg font-bold text-[#222222]`}>
                    Add New Address
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-outline" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Form Inputs */}
                <View style={tw`gap-4 mb-6`}>
                  {/* Place Name Input */}
                  <View>
                    <Text
                      style={tw`text-xs font-semibold text-[#222222] mb-1.5`}
                    >
                      Place Name
                    </Text>
                    <TextInput
                      value={placeName}
                      onChangeText={setPlaceName}
                      placeholder="e.g. Home, Office, Gym"
                      placeholderTextColor="#A1A1AA"
                      style={tw`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#222222] bg-[#F9FAFB]`}
                    />
                  </View>

                  {/* Location Input */}
                  <View>
                    <Text
                      style={tw`text-xs font-semibold text-[#222222] mb-1.5`}
                    >
                      Location
                    </Text>
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      placeholder="Enter full address"
                      placeholderTextColor="#A1A1AA"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      style={tw`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#222222] bg-[#F9FAFB] h-24`}
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleAddAddress}
                  style={tw`w-full bg-[#587511] py-3.5 rounded-full items-center justify-center shadow-sm`}
                >
                  <Text style={tw`text-white font-bold text-base`}>
                    Save Address
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

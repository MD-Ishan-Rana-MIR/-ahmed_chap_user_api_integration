import { X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import tw from "../../../lib/tailwind";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: { busType: string; timeSlot: string }) => void;
}

const BUS_TYPES = ["Ac", "Non-AC", "Economic"];

const TIME_SLOTS = [
  "4AM - 8AM",
  "8AM - 12PM",
  "12PM - 4PM",
  "4PM - 8PM",
  "8PM - 12AM",
  "12AM - 4AM",
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
}: FilterModalProps) {
  const [selectedBusType, setSelectedBusType] = useState<string>("Ac");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("4AM - 8AM");

  const handleClearAll = () => {
    setSelectedBusType("");
    setSelectedTimeSlot("");
  };

  const handleApply = () => {
    onApply?.({
      busType: selectedBusType,
      timeSlot: selectedTimeSlot,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <View style={tw`flex-1 bg-black/40 justify-center items-center px-4`}>
        {/* Modal Card */}
        <View style={tw`bg-white w-full rounded-3xl p-5 shadow-lg`}>
          {/* Header */}
          <View
            style={tw`flex-row justify-between items-center pb-4 border-b border-gray-100 mb-4`}
          >
            <Text style={tw`text-lg font-semibold text-gray-900`}>Filter</Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={tw`p-1`}
            >
              <X size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Bus Type Section */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-xs font-medium text-gray-500 mb-2.5`}>
              Bus Type
            </Text>
            <View style={tw`flex-row flex-wrap gap-2`}>
              {BUS_TYPES.map((type) => {
                const isSelected = selectedBusType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.8}
                    onPress={() => setSelectedBusType(type)}
                    style={tw`px-4 py-2 rounded-full border ${
                      isSelected
                        ? "border-[#FFF4EF] bg-[#FFF4EF]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text
                      style={tw`text-xs font-medium ${
                        isSelected ? "text-[#F95700]" : "text-gray-600"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Time Section */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xs font-medium text-gray-500 mb-2.5`}>
              Time
            </Text>
            <View style={tw`flex-row flex-wrap gap-2`}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTimeSlot(slot)}
                    style={tw`px-4 py-2.5 rounded-full border ${
                      isSelected
                        ? "border-[#FFF4EF] bg-[#FFF4EF]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text
                      style={tw`text-xs font-medium ${
                        isSelected ? "text-[#F95700]" : "text-gray-600"
                      }`}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row gap-x-3`}>
            {/* Clear All Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleClearAll}
              style={tw`flex-1 py-3.5 rounded-full bg-[#F7F9F2] items-center justify-center`}
            >
              <Text style={tw`text-[#5B7410] font-semibold text-sm`}>
                Clear all
              </Text>
            </TouchableOpacity>

            {/* Apply Filter Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleApply}
              style={tw`flex-1 py-3.5 rounded-full bg-[#5B7410] items-center justify-center`}
            >
              <Text style={tw`text-white font-semibold text-sm`}>
                Apply filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

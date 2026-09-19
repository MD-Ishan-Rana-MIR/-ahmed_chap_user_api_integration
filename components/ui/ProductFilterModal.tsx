import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import tw from "../../lib/tailwind";

export interface FilterValues {
  maxPrice: string;
  minPrice: string;
  category: string;
  color: string;
  size: string;
  gender: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

const CATEGORIES = [
  "Men",
  "Women",
  "Shoes",
  "Bags",
  "Accessories",
  "Sportswear",
  "Streetwear",
];
const COLORS = ["Black", "White", "Red", "Blue", "Green"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["All", "Men", "Women", "Unisex"];

const INITIAL_FILTERS: FilterValues = {
  maxPrice: "",
  minPrice: "",
  category: "Men",
  color: "Black",
  size: "XS",
  gender: "All",
};

export const ProductFilterModal = ({
  visible,
  onClose,
  onApply,
}: FilterModalProps) => {
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS);

  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const renderChip = (
    label: string,
    selectedValue: string,
    onSelect: (val: string) => void,
  ) => {
    const isSelected = selectedValue === label;
    return (
      <TouchableOpacity
        key={label}
        onPress={() => onSelect(label)}
        activeOpacity={0.7}
        style={tw`px-4 py-2 rounded-full border ${
          isSelected
            ? "bg-[#FFF0E6] border-[#F15A24]"
            : "bg-white border-gray-200"
        }`}
      >
        <Text
          style={tw`text-xs font-semibold ${
            isSelected ? "text-[#F15A24]" : "text-gray-500"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={tw`flex-1 bg-black/50 justify-center px-4 py-8`}>
          <TouchableWithoutFeedback>
            <View style={tw`bg-white rounded-3xl p-5 max-h-[90%]`}>
              {/* Header */}
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>Filter</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <Ionicons name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-4 gap-y-4`}
              >
                {/* Price Range */}
                <View style={tw`flex-row justify-between gap-3`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1.5 font-medium`}>
                      Maximum price
                    </Text>
                    <TextInput
                      style={tw`border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-800`}
                      placeholder="$00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={filters.maxPrice}
                      onChangeText={(val) =>
                        setFilters((prev) => ({ ...prev, maxPrice: val }))
                      }
                    />
                  </View>

                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1.5 font-medium`}>
                      Minimum price
                    </Text>
                    <TextInput
                      style={tw`border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-800`}
                      placeholder="$10000"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={filters.minPrice}
                      onChangeText={(val) =>
                        setFilters((prev) => ({ ...prev, minPrice: val }))
                      }
                    />
                  </View>
                </View>

                {/* Category */}
                <View>
                  <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
                    Category
                  </Text>
                  <View style={tw`flex-row flex-wrap gap-2`}>
                    {CATEGORIES.map((cat) =>
                      renderChip(cat, filters.category, (val) =>
                        setFilters((prev) => ({ ...prev, category: val })),
                      ),
                    )}
                  </View>
                </View>

                {/* Color */}
                <View>
                  <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
                    Color
                  </Text>
                  <View style={tw`flex-row flex-wrap gap-2`}>
                    {COLORS.map((col) =>
                      renderChip(col, filters.color, (val) =>
                        setFilters((prev) => ({ ...prev, color: val })),
                      ),
                    )}
                  </View>
                </View>

                {/* Size */}
                <View>
                  <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
                    Size
                  </Text>
                  <View style={tw`flex-row flex-wrap gap-2`}>
                    {SIZES.map((sz) =>
                      renderChip(sz, filters.size, (val) =>
                        setFilters((prev) => ({ ...prev, size: val })),
                      ),
                    )}
                  </View>
                </View>

                {/* Gender */}
                <View>
                  <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
                    Gender
                  </Text>
                  <View style={tw`flex-row flex-wrap gap-2`}>
                    {GENDERS.map((gnd) =>
                      renderChip(gnd, filters.gender, (val) =>
                        setFilters((prev) => ({ ...prev, gender: val })),
                      ),
                    )}
                  </View>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={tw`flex-row gap-3 pt-3 border-t border-gray-100`}>
                <TouchableOpacity
                  onPress={handleClearAll}
                  activeOpacity={0.8}
                  style={tw`flex-1 bg-[#F4F5F0] py-3.5 rounded-full items-center justify-center`}
                >
                  <Text style={tw`text-[#5B7410] font-semibold text-sm`}>
                    Clear all
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleApply}
                  activeOpacity={0.8}
                  style={tw`flex-1 bg-[#5B7410] py-3.5 rounded-full items-center justify-center`}
                >
                  <Text style={tw`text-white font-semibold text-sm`}>
                    Apply filter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

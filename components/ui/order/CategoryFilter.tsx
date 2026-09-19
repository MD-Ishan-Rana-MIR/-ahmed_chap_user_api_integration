import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { CategoryItem, CategoryType } from "../../../lib/type";

interface CategoryFilterProps {
  categories: CategoryItem[];
  selectedCategory: CategoryType;
  onSelectCategory: (id: CategoryType) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => (
  <View style={tw`mb-4`}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-4 gap-2`}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelectCategory(cat.id)}
            activeOpacity={0.8}
            style={tw`flex-row items-center gap-1.5 px-3 py-2 rounded-full border ${
              isSelected
                ? "bg-[#F86B17] border-[#FF5C00]"
                : "bg-white border-gray-200"
            }`}
          >
            <Ionicons
              name={cat.icon}
              size={12}
              color={isSelected ? "#FFFFFF" : "#6B7280"}
            />
            <Text
              style={tw`${
                isSelected
                  ? "text-white font-Manrope-Medium text-[10px]"
                  : "text-[#666666] font-Manrope-Regular text-[10px]"
              }`}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

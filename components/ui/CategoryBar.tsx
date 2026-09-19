import { ScrollView, Text, TouchableOpacity } from "react-native";
import tw from "../../lib/tailwind";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5 gap-2.5 py-1.5`}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelectCategory(cat)}
            activeOpacity={0.7}
            style={tw`px-5 h-10 items-center justify-center rounded-full border ${
              isSelected
                ? "bg-[#FFF0E6] border-[#F15A24]"
                : "bg-white border-gray-100"
            }`}
          >
            <Text
              style={tw`text-xs font-semibold ${
                isSelected ? "text-[#F15A24]" : "text-gray-500"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

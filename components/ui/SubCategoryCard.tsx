import { useGetCategoriesQuery } from "@/redux/eProductApi";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "../../lib/tailwind";

// Helper to map category names to ionic icons
const getCategoryIcon = (name: string): keyof typeof Ionicons.glyphMap => {
  const lowerName = name.toLowerCase();
  if (lowerName === "all") return "grid-outline";
  if (lowerName.includes("fashion")) return "shirt-outline";
  if (lowerName.includes("grocery")) return "basket-outline";
  if (lowerName.includes("electronics")) return "phone-portrait-outline";
  if (lowerName.includes("beauty")) return "flask-outline";
  return "apps-outline";
};

// Skeleton Component for design matching
const CategorySkeleton = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={tw`px-5 gap-4 py-4`}
  >
    {[1, 2, 3, 4, 5].map((item) => (
      <View key={item} style={tw`items-center`}>
        <View style={tw`w-16 h-16 rounded-full bg-gray-200 opacity-60`} />
        <View style={tw`w-10 h-2.5 bg-gray-200 rounded mt-2 opacity-60`} />
      </View>
    ))}
  </ScrollView>
);

interface SubCategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryIdentifier: string) => void;
}

export const SubCategoryBar = ({
  selectedCategory,
  onSelectCategory,
}: SubCategoryBarProps) => {
  const { data, isLoading, isError } = useGetCategoriesQuery();

  // Extract parent categories only (parent_id === null)
  const apiCategories =
    data?.data?.categories?.filter((cat) => cat.parent_id === null) || [];

  // Prepend "All" item with slug included
  const allCategoryItem = { id: "all", name: "All", slug: "all" };
  const categories = [allCategoryItem, ...apiCategories];

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (isError) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5 gap-4 py-4`}
    >
      {categories.map((category) => {
        // Value to pass on select (fallback to slug, name, or id)
        const categoryValue = category.slug;

        // Selection check normalized with lowerCase
        const isSelected =
          String(selectedCategory).toLowerCase() ===
            String(categoryValue).toLowerCase() ||
          String(selectedCategory).toLowerCase() ===
            String(category.name).toLowerCase() ||
          String(selectedCategory).toLowerCase() ===
            String(category.id).toLowerCase();

        const iconName = getCategoryIcon(category.name);

        return (
          <TouchableOpacity
            key={String(category.id)}
            onPress={() => onSelectCategory(categoryValue)}
            activeOpacity={0.8}
            style={tw`items-center`}
          >
            {/* Circular Icon Wrapper */}
            <View
              style={tw`w-16 h-16 rounded-full items-center justify-center bg-[#F4F4F4] ${
                isSelected ? "border-2 border-[#F15A24] bg-[#F86B17]" : ""
              }`}
            >
              <Ionicons
                name={iconName}
                size={26}
                color={isSelected ? "#fff" : "#6B7280"}
              />
            </View>

            {/* Label */}
            <Text
              numberOfLines={1}
              style={tw`text-[10px] text-center font-medium mt-1.5 text-[#4B4B4B] max-w-[70px]`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default SubCategoryBar;

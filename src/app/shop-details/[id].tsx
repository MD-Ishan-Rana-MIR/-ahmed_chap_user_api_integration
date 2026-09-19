import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

// Mock Subcategories
const TABS = ["Fruits", "Vegetables", "Spices", "Ingredients"];

// Mock Products
interface ProductItem {
  id: string;
  title: string;
  price: string;
  unit: string;
  rating: string;
  reviews: string;
  category: string;
  image: any;
}

const PRODUCTS: ProductItem[] = [
  {
    id: "1",
    title: "Fresh Banana",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Fruits",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "2",
    title: "Red Apple",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Vegetables",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "15",
    title: "Fresh Banana",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Fruits",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "20",
    title: "Red Apple",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Vegetables",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "16",
    title: "Fresh Banana",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Fruits",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "21 b",
    title: "Red Apple",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Vegetables",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "15",
    title: "Fresh Banana",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Fruits",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "20",
    title: "Red Apple",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Vegetables",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "3",
    title: "Red Apple",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Spices",
    image: require("../../../assets/product/product.png"),
  },
  {
    id: "4",
    title: "Fresh Banana",
    price: "$42",
    unit: "/1kg",
    rating: "4.5",
    reviews: "1k",
    category: "Fruits",
    image: require("../../../assets/product/product.png"),
  },
];

export default function ShopDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("Fruits");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Filter products matching active tab
  const filteredProducts = PRODUCTS.filter(
    (product) => product.category.toLowerCase() === activeTab.toLowerCase(),
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderHeader = () => (
    <View style={tw`bg-white`}>
      {/* Banner Image & Back Button */}
      <View style={tw`relative h-56 w-full bg-gray-200`}>
        <Image
          source={require("../../../assets/product/product.png")}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />

        {/* Floating Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={[
            tw`absolute left-5 w-10 h-10 rounded-full bg-white items-center justify-center shadow-md z-10`,
            { top: Math.max(insets.top, 12) },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Store Logo & Details */}
      <View style={tw`px-5 pb-4`}>
        {/* Overlapping Store Logo */}
        <View
          style={tw`-mt-8  w-25 h-25 rounded-full border-4 border-white bg-white overflow-hidden shadow-md items-center justify-center`}
        >
          <Image
            source={require("../../../assets/product/product.png")}
            style={tw` w-full h-full `}
            resizeMode="cover"
          />
        </View>

        <View style={tw`ml-28 -mt-14 `}>
          {/* Store Title */}
          <Text
            style={tw`text-[16px] font-Manrope-SemiBold.ttf text-[#303030] mb-1.5`}
          >
            Mina Bazar
          </Text>

          {/* Store Location & Rating */}
          <View style={tw`flex-row items-center gap-x-3  mb-3`}>
            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="location-outline" size={15} color="#6B7280" />
              <Text
                style={tw`text-xs text-[#505050] font-Manrope-Regular.ttf `}
              >
                1.2 km
              </Text>
            </View>

            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="star" size={12} color="#FDC700" />
              <Text style={tw`text-xs font-Manrope-Regular.ttf text-[#4A5565]`}>
                4.5{" "}
                <Text
                  style={tw`text-[#4A5565] text-[10px] font-Manrope-Regular.ttf `}
                >
                  (1k)
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={tw`text-sm text-[#757575] mt-4 leading-5 mb-4`}>
          Premium fashion brand offering contemporary styles for the modern
          individual. Established in 2015, we bring you curated collections that
          blend comfort with elegance.
        </Text>

        {/* Tabs */}
        <View style={tw`flex-row border-b border-gray-200 justify-between`}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
                style={tw`pb-3 px-1 border-b-2 ${
                  isActive ? "border-[#F86B17]" : "border-transparent"
                }`}
              >
                <Text
                  style={tw`text-xs  font-Manrope-Medium.ttf  ${
                    isActive ? "text-[#F86B17]" : "text-[#B1B1B1]"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section Title */}
        <Text
          style={tw`text-[16px] font-Manrope-SemiBold.ttf text-[#222222] mt-5 mb-2.5`}
        >
          All Products
        </Text>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="light" />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-10`}>
            <Text style={tw`text-xs text-gray-400`}>
              No products found in {activeTab}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw``}
        columnWrapperStyle={
          filteredProducts.length > 0
            ? tw`justify-between px-5 mb-4`
            : undefined
        }
        renderItem={({ item }) => (
          <View style={tw`w-[48%] bg-[#F8F9FA] rounded-2xl p-3 relative`}>
            {/* Heart Icon */}
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              activeOpacity={0.8}
              style={tw`absolute top-3 right-3 z-10`}
            >
              <Ionicons
                name={favorites[item.id] ? "heart" : "heart-outline"}
                size={18}
                color={favorites[item.id] ? "#EF4444" : "#FF6B00"}
              />
            </TouchableOpacity>

            {/* Product Image */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/product-details",
                  params: { id: item?.id },
                })
              }
              style={tw`items-center justify-center my-2 h-28`}
            >
              <Image
                source={item.image}
                style={tw`w-24 h-24`}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Product Meta */}
            <View style={tw`flex-row justify-between items-center mb-1`}>
              <Text
                style={tw`text-xs font-Manrope-SemiBold.ttf text-[#303030]`}
              >
                {item.title}
              </Text>
              <View style={tw`flex-row items-center gap-0.5`}>
                <Ionicons name="star" size={11} color="#FDC700" />
                <Text
                  style={tw`text-xs font-Manrope-SemiBold.ttf text-[#4A5565]`}
                >
                  {item.rating}{" "}
                  <Text
                    style={tw` font-Manrope-Regular.ttf text-[#4A5565] text-[10px] `}
                  >
                    ({item.reviews})
                  </Text>
                </Text>
              </View>
            </View>

            {/* Price & Cart Button */}
            <View style={tw`flex-row justify-between items-center mt-1`}>
              <Text
                style={tw`text-[16px] font-Manrope-SemiBold.ttf text-[#303030]`}
              >
                {item.price}{" "}
                <Text
                  style={tw`text-[10px] font-Manrope-Regular.ttf text-[#303030]`}
                >
                  {item.unit}
                </Text>
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={tw`w-7 h-7 rounded-full bg-white border border-gray-200 items-center justify-center shadow-xs`}
              >
                <Ionicons name="cart-outline" size={14} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

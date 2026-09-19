import { router } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MapPin,
  ShoppingBag,
  Star,
} from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "../../../lib/tailwind"; // Adjust import to your tailwind path

interface FoodItem {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: string;
  image: string;
}

const CATEGORIES = ["Burgers", "Pizza", "Chinese", "Thai"];

const BURGER_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Beef Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
  {
    id: "2",
    name: "Cheese Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500",
  },
  {
    id: "3",
    name: "Chicken Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500",
  },
  {
    id: "4",
    name: "Grilled Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500",
  },
];

export default function RestaurantDetailScreen() {
  const [activeCategory, setActiveCategory] = useState("Burgers");
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Header Image */}
        <View style={tw`relative w-full h-56 bg-gray-100`}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
            }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw`absolute top-12 left-4 w-9 h-9 bg-white rounded-full items-center justify-center shadow-xs z-10`}
          >
            <ArrowLeft size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Section */}
        <View style={tw`px-4 pt-3 pb-4 border-b border-gray-100 relative`}>
          <View style={tw`flex-row items-end mb-3`}>
            {/* Circular Avatar overlap */}
            <View
              style={tw`-mt-12 border-4 border-white rounded-full bg-white overflow-hidden shadow-sm`}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
                }}
                style={tw`w-20 h-20 rounded-full`}
              />
            </View>
          </View>

          {/* Title & Stats */}
          <Text style={tw`text-xl font-bold text-gray-900 mb-1`}>
            The Urban Fork
          </Text>

          <View style={tw`flex-row items-center gap-x-4 mb-3`}>
            <View style={tw`flex-row items-center gap-x-1`}>
              <MapPin size={14} color="#9CA3AF" />
              <Text style={tw`text-xs text-gray-500 font-medium`}>1.2 km</Text>
            </View>

            <View style={tw`flex-row items-center gap-x-1`}>
              <Star size={14} color="#EAB308" fill="#EAB308" />
              <Text style={tw`text-xs font-semibold text-gray-800`}>4.5</Text>
              <Text style={tw`text-xs text-gray-400`}>(1k)</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={tw`text-xs text-gray-400 leading-5`}>
            The Urban Fork Kitchen brings together a variety of flavors from
            around the world in a warm and welcoming atmosphere. We focus on
            fresh ingredients, quality preparation, and great taste in every
            dish.
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`border-b border-gray-100`}
          contentContainerStyle={tw`px-4`}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(category)}
                style={tw`py-3.5 mr-8 border-b-2 ${
                  isActive ? "border-[#F95700]" : "border-transparent"
                }`}
              >
                <Text
                  style={tw`text-xs font-semibold ${
                    isActive ? "text-[#F95700]" : "text-gray-400"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Grid Title */}
        <View style={tw`px-4 pt-5 pb-3`}>
          <Text style={tw`text-base font-bold text-gray-900`}>
            All {activeCategory}
          </Text>
        </View>

        {/* Food Items Grid (2 Columns) */}
        <View style={tw`px-4 pb-8 flex-row flex-wrap justify-between`}>
          {BURGER_ITEMS.map((item) => {
            const isFav = !!favorites[item.id];
            return (
              <View key={item.id} style={tw`w-[48.5%] mb-4`}>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/restaurants_product_details/[id]");
                  }}
                  activeOpacity={0.9}
                  style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
                >
                  {/* Image with Heart Button */}
                  <View
                    style={tw`relative w-full h-32 rounded-xl overflow-hidden mb-2.5`}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleFavorite(item.id)}
                      style={tw`absolute top-2 right-2 w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs z-10`}
                    >
                      <Heart
                        size={14}
                        color="#F95700"
                        fill={isFav ? "#F95700" : "transparent"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Title & Rating */}
                  <Text
                    numberOfLines={1}
                    style={tw`text-xs font-bold text-gray-900 mb-1`}
                  >
                    {item.name}
                  </Text>

                  <View style={tw`flex-row items-center gap-x-1 mb-2`}>
                    <Star size={12} color="#EAB308" fill="#EAB308" />
                    <Text style={tw`text-[11px] font-semibold text-gray-700`}>
                      {item.rating}
                    </Text>
                    <Text style={tw`text-[11px] text-gray-400`}>
                      ({item.reviews})
                    </Text>
                  </View>

                  {/* Price & Add to Cart */}
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-sm font-bold text-[#F95700]`}>
                      {item.price}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={tw`w-7 h-7 bg-white rounded-full border border-gray-100 items-center justify-center shadow-xs`}
                    >
                      <ShoppingBag size={13} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

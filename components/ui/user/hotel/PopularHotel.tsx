import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../../lib/tailwind";

export interface Hotel {
  id: string;
  title: string;
  location: string;
  price: string | number;
  rating: string | number;
  image: string | ImageSourcePropType;
  isFavorite?: boolean;
}

const MOCK_HOTELS: Hotel[] = [
  {
    id: "1",
    title: "The Dreamland by Young Villas",
    location: "Kuta, Denpasar, Bali",
    price: "34",
    rating: "4.8",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "The Dreamland by Young Villas",
    location: "Kuta, Denpasar, Bali",
    price: "34",
    rating: "4.8",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "The Dreamland by Young Villas",
    location: "Kuta, Denpasar, Bali",
    price: "34",
    rating: "4.8",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
  },
];

export default function PopularHotel() {
  const insets = useSafeAreaInsets();
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);

  const handleToggleFavorite = useCallback((id: string) => {
    setHotels((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  }, []);

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="light" />

      {/* Header Navigation */}
      <View
        style={[
          tw`bg-[#5B7410] flex-row items-center px-5 pb-5 rounded-b-2xl gap-3`,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={tw`w-10 h-10 rounded-full border border-white/40 items-center justify-center`}
        >
          <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>

        <Text style={tw`text-white text-xl font-semibold`}>Popular Hotels</Text>
      </View>

      {/* Hotel List */}
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-10`}
        renderItem={({ item }) => {
          const imageSource =
            typeof item.image === "string" ? { uri: item.image } : item.image;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/(user-tab)/hotel-details",
                  params: { id: 1 },
                });
              }}
              style={tw`bg-white border border-gray-100 rounded-2xl p-3 mb-4 shadow-xs`}
            >
              {/* Card Image & Favorite Icon */}
              <View
                style={tw`relative w-full h-44 rounded-xl overflow-hidden mb-2.5`}
              >
                <Image
                  source={imageSource}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleToggleFavorite(item.id)}
                  style={tw`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 items-center justify-center shadow-xs`}
                >
                  <Ionicons
                    name={item.isFavorite ? "heart" : "heart-outline"}
                    size={18}
                    color="#FF5A1F"
                  />
                </TouchableOpacity>
              </View>

              {/* Title */}
              <Text
                style={tw`text-sm font-bold text-[#1F2937] mb-1`}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              {/* Location Row */}
              <View style={tw`flex-row items-center gap-1 mb-2.5`}>
                <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                <Text
                  style={tw`text-xs text-gray-400 flex-1`}
                  numberOfLines={1}
                >
                  {item.location}
                </Text>
              </View>

              {/* Price & Rating Row */}
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-sm font-bold text-[#FF5A1F]`}>
                  ${item.price}
                  <Text style={tw`text-xs font-normal text-gray-400`}>
                    /night
                  </Text>
                </Text>

                <View style={tw`flex-row items-center gap-1`}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={tw`text-xs font-bold text-[#1F2937]`}>
                    {item.rating}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

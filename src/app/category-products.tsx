import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButton from "../../components/ui/BackButton";
import ECommerce from "../../components/ui/e-commerce/ECommerce";
import HotelList from "../../components/ui/hotel/hotel";
import RestaurantSection from "../../components/ui/resturant/Restaurant";
import Transport from "../../components/ui/transport/Transport";
import tw from "../../lib/tailwind";

export default function CategoryProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category?: string }>();

  // Render Hotels Branch
  if (category?.toLowerCase() === "hotels") {
    return <HotelList category={category} />;
  } else if (category?.toLowerCase() === "transport") {
    return (
      <View style={tw`flex-1 bg-white`}>
        <StatusBar style="light" />

        {/* Header Navigation */}
        <View
          style={[
            tw`bg-[#5B7410] flex-row items-center justify-between px-5 pb-5 rounded-b-2xl`,
            { paddingTop: Math.max(insets.top + 8, 20) },
          ]}
        >
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={tw`w-10 h-10 rounded-full border border-white/40 items-center justify-center`}
            >
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>

            <Text style={tw`text-white text-xl font-semibold capitalize`}>
              {category}
            </Text>
          </View>
        </View>
        <Transport />
      </View>
    );
  } else if (category?.toLowerCase() === "restaurants") {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackButton title="Restaurants" />
        <RestaurantSection />
      </View>
    );
  }
  return <ECommerce />;
}

import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import BackButton from "../../../components/ui/BackButton";
import HotelFavorites from "../../../components/ui/favorites/HotelFavorites";
import ProductFavorites from "../../../components/ui/favorites/ProductFavorites";
import RestaurantFavorites from "../../../components/ui/favorites/RestaurantFavorites";
import tw from "../../../lib/tailwind";

const MAIN_TABS = ["Product", "Hotel", "Restaurant"] as const;
type MainTab = (typeof MAIN_TABS)[number];

export default function Favorites() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("Product");

  const handleMainTabChange = (tab: MainTab) => {
    setActiveMainTab(tab);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="My Favorites" showBackButton={false} />

      {/* Parent Tabs */}
      <View
        style={tw`flex-row justify-around border-b border-gray-100 px-5 pt-3`}
      >
        {MAIN_TABS.map((tab) => {
          const isActive = activeMainTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleMainTabChange(tab)}
              style={tw`pb-3 px-2 ${isActive ? "border-b-2 border-[#FF5A1F]" : ""}`}
            >
              <Text
                style={tw`text-base font-semibold ${
                  isActive ? "text-[#FF5A1F]" : "text-gray-400"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Dynamic View Rendering */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-4 mt-2`}
      >
        {activeMainTab === "Product" && <ProductFavorites />}

        {activeMainTab === "Hotel" && <HotelFavorites />}

        {activeMainTab === "Restaurant" && <RestaurantFavorites />}
      </ScrollView>
    </View>
  );
}

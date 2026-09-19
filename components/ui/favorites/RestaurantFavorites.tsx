import { View } from "react-native";
import tw from "../../../lib/tailwind";

export interface Restaurant {
  id: string;
  title: string;
  category: string;
  rating: number;
  cuisine: string;
  image?: string;
}

interface RestaurantFavoritesProps {
  restaurants?: Restaurant[];
  selectedCategory: string;
}

export default function RestaurantFavorites() {
  return <View style={tw`flex-row flex-wrap justify-between`}></View>;
}

import { View } from "react-native";
import tw from "../../../lib/tailwind";

export interface Hotel {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  location: string;
  image?: string;
}

export default function HotelFavorites() {
  return (
    <View style={tw`flex-row flex-wrap justify-between`}>
      {/* <View
          key={hotel.id}
          style={tw`w-[48.5%] bg-white border border-gray-100 rounded-2xl p-3 mb-4 shadow-xs`}
        >
          <Text style={tw`text-sm font-bold text-gray-900`}>{hotel.title}</Text>
          <Text style={tw`text-xs text-gray-400`}>{hotel.location}</Text>
          <Text style={tw`text-xs font-bold text-[#FF5A1F] mt-2`}>
            ${hotel.price}/night
          </Text>
        </View> */}
    </View>
  );
}

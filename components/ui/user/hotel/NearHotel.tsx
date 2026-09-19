import { ScrollView } from "react-native";
import { NEAR_HOTELS } from "../../../../lib/data";
import tw from "../../../../lib/tailwind";
import { NearHotelCard } from "./NearHotelCard";

const NearHotel = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`gap-3 px-5 pb-10`}
    >
      {NEAR_HOTELS.map((item) => (
        <NearHotelCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

export default NearHotel;

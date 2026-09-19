import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import BackButton from "../../../components/ui/BackButton";
import { CategoryCard, ServiceItem } from "../../../components/ui/CategoryCard";
import {
  hotelIcon,
  resturantIcon,
  shopIcon,
  transportIcon,
} from "../../../lib/icon";
import tw from "../../../lib/tailwind";

const SERVICES_DATA: ServiceItem[] = [
  { id: "1", name: "Shops", icon: shopIcon, slug: "shops" },
  { id: "2", name: "Hotels", icon: hotelIcon, slug: "hotels" },
  { id: "3", name: "Restaurant", icon: resturantIcon, slug: "transports" },
  { id: "4", name: "Transports", icon: transportIcon, slug: "hotels" },
  { id: "5", name: "Hotels", icon: hotelIcon, slug: "shops" },
  { id: "6", name: "Shops", icon: shopIcon, slug: "transports" },
];

export default function AllCategoryScreen() {
  const router = useRouter();

  const handleServiceClick = (service: ServiceItem) => {
    router.push({
      pathname: "/category-products",
      params: { category: service.slug },
    });
  };

  return (
    <View style={tw`flex-1 bg-[#5B7410]`}>
      {/* Header Bar */}

      <BackButton title="Available Services" showBackButton={true} />

      {/* Grid Content Container */}
      <View style={tw`flex-1 bg-white rounded-t-3xl pt-6 px-5 mt-4 `}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={tw`flex-row flex-wrap justify-between gap-y-2 pb-8`}>
            {SERVICES_DATA.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onPress={handleServiceClick}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

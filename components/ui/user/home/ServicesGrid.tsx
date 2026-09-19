// components/ui/ServicesGrid.tsx
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import {
  hotelIcon,
  RestaurantIcon,
  shopIcon,
  transportIcon,
} from "../../../../lib/icon";
import tw from "../../../../lib/tailwind";

export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  isMore?: boolean;
}

const SERVICES: ServiceItem[] = [
  { id: "1", name: "Shops", icon: shopIcon },
  { id: "2", name: "Hotels", icon: hotelIcon },
  { id: "3", name: "Restaurants", icon: RestaurantIcon },
  { id: "4", name: "Transport", icon: transportIcon },
];

interface ServicesGridProps {
  onSelectService?: (service: ServiceItem) => void;
}

export const ServicesGrid = ({ onSelectService }: ServicesGridProps) => {
  const router = useRouter();

  const handlePress = (item: ServiceItem) => {
    if (item.isMore) {
      router.push("/all-category");
    } else if (onSelectService) {
      onSelectService(item);
    } else {
      router.push({
        pathname: "/category-products",
        params: { title: item.name, category: item.name.toLowerCase() },
      });
    }
  };

  return (
    <View style={tw`flex-row justify-between px-5`}>
      {SERVICES.map((item) => {
        const iconColor = item.isMore ? "#F15A24" : "#5B7410";

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            onPress={() => handlePress(item)}
            style={tw`items-center`}
          >
            {/* Icon Circle */}
            <View
              style={tw`w-18 h-18 rounded-full bg-[#F5F5F5] items-center justify-center mb-2`}
            >
              <SvgXml xml={item?.icon} />
            </View>

            {/* Label */}
            <Text style={tw`text-xs font-semibold text-[#4B4B4B] text-center`}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

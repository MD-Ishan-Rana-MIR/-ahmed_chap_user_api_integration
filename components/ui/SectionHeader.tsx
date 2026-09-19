// components/ui/SectionHeader.tsx
import { Text, TouchableOpacity, View } from "react-native";
import tw from "../../lib/tailwind";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

export const SectionHeader = ({ title, onViewAll }: SectionHeaderProps) => (
  <View style={tw`flex-row items-center justify-between px-5 mb-4  `}>
    <Text style={tw`font-Manrope-SemiBold.ttf text-[16px] text-[#1A1A1A]  `}>
      {title}
    </Text>
    <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
      <Text style={tw`text-[#F86B17] font-Manrope-SemiBold.ttf text-sm`}>
        View All
      </Text>
    </TouchableOpacity>
  </View>
);

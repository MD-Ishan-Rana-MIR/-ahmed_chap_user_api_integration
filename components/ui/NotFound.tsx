import { SearchX } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "../../lib/tailwind";

interface NotFoundProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetButtonText?: string;
}

export default function NotFound({
  title = "No Buses Found",
  description = "We couldn't find any buses matching your search criteria. Try adjusting your filters or search date.",
  onReset,
  resetButtonText = "Reset Filters",
}: NotFoundProps) {
  return (
    <View
      style={tw`flex-1 items-center justify-center py-12 px-6 bg-white rounded-2xl border border-gray-100 my-4`}
    >
      {/* Icon Wrapper */}
      <View
        style={tw`w-20 h-20 bg-[#FFF4EF] rounded-full items-center justify-center mb-4`}
      >
        <SearchX size={40} color="#F95700" />
      </View>

      {/* Content */}
      <Text style={tw`text-lg font-bold text-gray-900 text-center mb-1.5`}>
        {title}
      </Text>
      <Text style={tw`text-xs text-gray-400 text-center leading-5 mb-6 px-4`}>
        {description}
      </Text>

      {/* Reset Action */}
      {onReset && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onReset}
          style={tw`bg-[#5B7410] px-6 py-2.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-white text-xs font-semibold`}>
            {resetButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

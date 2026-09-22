import { FlatList, View } from "react-native";
import tw from "../../../lib/tailwind";

// Single Skeleton Card matching PopularHotelCard layout exactly
export function PopularHotelSkeletonItem() {
  return (
    <View
      style={tw`bg-white border border-gray-100 rounded-2xl p-3 mb-4 shadow-xs`}
    >
      {/* Image Placeholder */}
      <View
        style={tw`w-full h-44 rounded-xl bg-gray-200 animate-pulse mb-2.5`}
      />

      {/* Title Placeholder */}
      <View style={tw`h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2`} />

      {/* Location Row Placeholder */}
      <View style={tw`flex-row items-center gap-2 mb-3`}>
        <View style={tw`w-3.5 h-3.5 rounded-full bg-gray-200 animate-pulse`} />
        <View style={tw`h-3 w-1/2 bg-gray-200 animate-pulse rounded`} />
      </View>

      {/* Price & Rating Row Placeholder */}
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`h-4 w-20 bg-gray-200 animate-pulse rounded`} />
        <View style={tw`h-4 w-12 bg-gray-200 animate-pulse rounded`} />
      </View>
    </View>
  );
}

// Skeleton List showing multiple placeholder cards
export default function PopularHotelSkeletonList({
  count = 14,
}: {
  count?: number;
}) {
  const dummyData = Array.from({ length: count }, (_, i) => i);

  return (
    <FlatList
      data={dummyData}
      keyExtractor={(item) => item.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`p-4 pb-10`}
      renderItem={() => <PopularHotelSkeletonItem />}
    />
  );
}

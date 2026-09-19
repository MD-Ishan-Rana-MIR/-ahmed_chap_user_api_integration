import { FlatList, View } from "react-native";
import tw from "twrnc";

// --- SKELETON COMPONENTS ---
function HotelGridSkeletonItem() {
  return (
    <View
      style={tw`w-[48.5%] bg-white border border-gray-100 rounded-2xl p-2.5 mb-4 shadow-xs`}
    >
      {/* Image Skeleton */}
      <View
        style={tw`w-full h-36 rounded-xl bg-gray-200 animate-pulse mb-2.5`}
      />
      {/* Title Skeleton */}
      <View style={tw`h-3.5 w-3/4 bg-gray-200 animate-pulse rounded mb-2`} />
      {/* Location Skeleton */}
      <View style={tw`flex-row items-center gap-1 mb-3`}>
        <View style={tw`w-3 h-3 rounded-full bg-gray-200 animate-pulse`} />
        <View style={tw`h-2.5 w-1/2 bg-gray-200 animate-pulse rounded`} />
      </View>
      {/* Price & Rating Skeleton */}
      <View style={tw`flex-row justify-between items-center mt-auto`}>
        <View style={tw`h-3.5 w-12 bg-gray-200 animate-pulse rounded`} />
        <View style={tw`h-3.5 w-8 bg-gray-200 animate-pulse rounded`} />
      </View>
    </View>
  );
}

export default function HotelGridSkeletonList({
  count = 6,
}: {
  count?: number;
}) {
  const dummyArray = Array.from({ length: count }, (_, i) => i);
  return (
    <FlatList
      data={dummyArray}
      keyExtractor={(item) => item.toString()}
      numColumns={2}
      style={tw``}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={tw`justify-between`}
      renderItem={() => <HotelGridSkeletonItem />}
    />
  );
}

import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

// 1. Skeleton Loading Component (Matches ProductDetails Layout)
export const ProductDetailsSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-[#F6F6F6]`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section Skeleton */}
        <View style={tw`bg-[#F8F9FA] relative pt-4 pb-6 px-5`}>
          {/* Top Bar Floating Buttons */}
          <View
            style={[
              tw`flex-row justify-between items-center z-10 w-full absolute left-5 right-5`,
              { top: Math.max(insets.top, 12) },
            ]}
          >
            <View style={tw`w-10 h-10 rounded-full bg-gray-200 opacity-60`} />
            <View style={tw`w-10 h-10 rounded-full bg-gray-200 opacity-60`} />
          </View>

          {/* Featured Image Skeleton */}
          <View style={tw`items-center justify-center mt-12 mb-4 h-64`}>
            <View style={tw`w-64 h-64 bg-gray-200 rounded-2xl opacity-60`} />
          </View>

          {/* Thumbnail Strip Skeleton */}
          <View style={tw`flex-row justify-center items-center gap-2.5 mt-2`}>
            {[1, 2, 3, 4, 5].map((key) => (
              <View
                key={key}
                style={tw`w-13 h-13 rounded-xl bg-gray-200 opacity-60`}
              />
            ))}
          </View>
        </View>

        {/* Product Meta Info Skeleton */}
        <View style={tw`px-5 pt-5`}>
          {/* Title & Rating */}
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <View style={tw`w-40 h-7 bg-gray-200 rounded-md opacity-60`} />
            <View style={tw`w-24 h-4 bg-gray-200 rounded opacity-60`} />
          </View>

          {/* Price & Shop Badge */}
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <View style={tw`w-20 h-6 bg-gray-200 rounded-md opacity-60`} />
            <View style={tw`w-24 h-6 bg-gray-200 rounded-full opacity-60`} />
          </View>

          {/* Description Skeleton */}
          <View style={tw`mb-6`}>
            <View style={tw`w-24 h-4 bg-gray-200 rounded opacity-60 mb-2`} />
            <View
              style={tw`w-full h-3 bg-gray-200 rounded opacity-60 mb-1.5`}
            />
            <View
              style={tw`w-full h-3 bg-gray-200 rounded opacity-60 mb-1.5`}
            />
            <View style={tw`w-3/4 h-3 bg-gray-200 rounded opacity-60`} />
          </View>

          {/* Delivery & Payment Features Skeleton */}
          <View style={tw`gap-4`}>
            {[1, 2].map((key) => (
              <View key={key} style={tw`flex-row items-center gap-3`}>
                <View
                  style={tw`w-10 h-10 rounded-full bg-gray-200 opacity-60`}
                />
                <View style={tw`gap-1.5`}>
                  <View style={tw`w-48 h-3.5 bg-gray-200 rounded opacity-60`} />
                  <View style={tw`w-28 h-3 bg-gray-200 rounded opacity-60`} />
                </View>
              </View>
            ))}
          </View>

          {/* Related Products Section Skeleton */}
          <View style={tw`mt-6`}>
            <View style={tw`w-32 h-5 bg-gray-200 rounded opacity-60 mb-2.5`} />
            <View style={tw`flex-row flex-wrap justify-between gap-y-4`}>
              {[1, 2, 3, 4].map((key) => (
                <View
                  key={key}
                  style={tw`w-[48%] bg-white p-3 rounded-[12px] shadow-xs`}
                >
                  <View
                    style={tw`w-full h-24 bg-gray-200 rounded-lg opacity-60 my-2`}
                  />
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <View style={tw`w-16 h-3 bg-gray-200 rounded opacity-60`} />
                    <View style={tw`w-10 h-3 bg-gray-200 rounded opacity-60`} />
                  </View>
                  <View style={tw`flex-row justify-between items-center mt-1`}>
                    <View style={tw`w-12 h-4 bg-gray-200 rounded opacity-60`} />
                    <View
                      style={tw`w-7 h-7 bg-gray-200 rounded-full opacity-60`}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* User Feedbacks Skeleton */}
          <View style={tw`mt-6`}>
            <View style={tw`w-32 h-5 bg-gray-200 rounded opacity-60 mb-2.5`} />
            <View style={tw`gap-3`}>
              {[1, 2].map((key) => (
                <View key={key} style={tw`bg-white rounded-2xl p-4`}>
                  <View style={tw`flex-row justify-between items-start mb-2`}>
                    <View style={tw`gap-1`}>
                      <View
                        style={tw`w-28 h-3.5 bg-gray-200 rounded opacity-60`}
                      />
                      <View
                        style={tw`w-20 h-3 bg-gray-200 rounded opacity-60`}
                      />
                    </View>
                    <View style={tw`w-16 h-3 bg-gray-200 rounded opacity-60`} />
                  </View>
                  <View
                    style={tw`w-full h-3 bg-gray-200 rounded opacity-60 mb-1`}
                  />
                  <View style={tw`w-2/3 h-3 bg-gray-200 rounded opacity-60`} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Action Bar Skeleton */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 flex-row gap-3 border-t border-gray-100`,
          { paddingBottom: Math.max(insets.bottom, 4) },
        ]}
      >
        <View style={tw`flex-1 h-12 bg-gray-200 rounded-full opacity-60`} />
        <View style={tw`flex-1 h-12 bg-gray-200 rounded-full opacity-60`} />
      </View>
    </View>
  );
};

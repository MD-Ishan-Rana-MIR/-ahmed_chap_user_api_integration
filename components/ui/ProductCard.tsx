import { useAddToCartMutation } from "@/redux/eProductApi";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { errorMsg } from "../../lib/msg/errorMsg";
import { successMsg } from "../../lib/msg/successMsg";
import tw from "../../lib/tailwind";
import { Product } from "../../lib/type/productType";

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onFavoriteToggle?: (id: number) => void;
}

export const ProductCard = ({
  product,
  onPress,
  onFavoriteToggle,
}: ProductCardProps) => {
  // Fallback image handling
  const imageSource = product.primary_image
    ? { uri: product.primary_image }
    : product.images && product.images.length > 0
      ? { uri: product.images[0] }
      : require("../../assets/product/product.png");

  // ============================================ Add To Cart Api ===================================================

  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = (id: number) => {
    const payload = {
      product_id: id,
    };

    Alert.alert(
      "Add to Cart",
      "Are you sure you want to add this item to your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          style: "default",
          onPress: async () => {
            try {
              const res = await addToCart(payload).unwrap();
              if (res) {
                return successMsg(res?.message || "Item added to cart!");
              }
            } catch (error: any) {
              const errorMessage =
                error?.data?.message ||
                error?.message ||
                "An unexpected error occurred.";
              return errorMsg(errorMessage);
            }
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={tw`bg-[#F8F9FA] rounded-2xl p-3 w-[48%] mb-3.5 flex-col justify-between`}
    >
      {/* Image Container with Heart Button */}
      <View
        style={tw`relative w-full h-36 bg-white rounded-xl items-center justify-center p-2 mb-2.5`}
      >
        {/* Favorite Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onFavoriteToggle?.(product.id)}
          style={tw`absolute top-2 right-2 z-10 w-7 h-7 border border-[#E5E5E5] bg-white rounded-full items-center justify-center shadow-xs`}
        >
          <Ionicons
            name={product.is_favorite ? "heart" : "heart-outline"}
            size={16}
            color="#FF5A1F"
          />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          source={imageSource}
          style={tw`w-full h-full`}
          resizeMode="contain"
        />
      </View>

      {/* Product Information */}
      <View>
        {/* Title & Star Rating */}
        <View style={tw`flex-row items-center justify-between mb-1.5`}>
          <Text
            style={tw`font-semibold text-xs text-[#303030] flex-1 mr-1`}
            numberOfLines={1}
          >
            {product.name}
          </Text>

          <View style={tw`flex-row items-center gap-0.5`}>
            <Ionicons name="star" size={12} color="#FDC700" />
            <Text style={tw`text-xs text-[#4A5565]`}>{product.rating}</Text>
            <Text style={tw`text-[10px] text-[#4A5565]`}>
              ({product.reviews_count})
            </Text>
          </View>
        </View>

        {/* Price & Add to Cart */}
        <View style={tw`flex-row items-center justify-between mt-1`}>
          <View style={tw`flex-row items-baseline`}>
            <Text style={tw`text-[15px] font-semibold text-[#303030]`}>
              {product.currency} {product.discount_price ?? product.price}
            </Text>
            {product.unit_type && (
              <Text style={tw`text-[10px] text-gray-400 ml-0.5`}>
                /{product.unit_type}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAddToCart(product?.id)}
            style={tw`w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs`}
          >
            <Ionicons name="cart-outline" size={15} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

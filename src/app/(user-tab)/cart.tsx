import { useGetAllAddressQuery } from "@/redux/deliverAddressApi";
import {
  useRemoveCartApiMutation,
  useUpdateCartQuantityMutation,
  useViewCartQuery,
} from "@/redux/eProductApi";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CartSkeleton from "../../../components/ui/skeleton/CartSkeleton";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

const DEFAULT_IMAGE = require("../../../assets/product/product.png");

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // View Cart API Call
  const { data, isLoading } = useViewCartQuery({});

  const cartData = data?.data;
  const stores = cartData?.stores || [];
  const summary = cartData?.summary;
  const defaultAddress = cartData?.default_address;

  // Mutations
  const [updateCartQuantity] = useUpdateCartQuantityMutation();
  const [removeCartApi] = useRemoveCartApiMutation();

  const handleUpdateQuantity = async (
    cartItemId: number,
    currentQuantity: number,
    delta: number,
  ) => {
    const newQuantity = currentQuantity + delta;

    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      setUpdatingItemId(cartItemId);
      const res = await updateCartQuantity({
        id: cartItemId,
        payload: { quantity: newQuantity },
      }).unwrap();

      if (res?.message) successMsg(res.message);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update quantity.";
      errorMsg(errorMessage);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = (cartItemId: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdatingItemId(cartItemId);
              const res = await removeCartApi(cartItemId).unwrap();
              if (res?.message) successMsg(res.message);
            } catch (error: any) {
              const errorMessage =
                error?.data?.message ||
                error?.message ||
                "An unexpected error occurred.";
              errorMsg(errorMessage);
            } finally {
              setUpdatingItemId(null);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };
  // =============================================  Address Api =============================================

  const { data: addData, isLoading: addLaoding } = useGetAllAddressQuery({});
  const addressList = addData?.data?.addresses || [];

  const addressData = addressList.at(-1);
  if (isLoading || addLaoding) {
    return <CartSkeleton />;
  }

  const hasItems = (summary?.items_count || 0) > 0;

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={[
          tw`flex-row justify-between items-center bg-bgOlive px-5 pb-5 rounded-b-[12px] shadow-sm z-10`,
          { paddingTop: Math.max(insets.top + 12, 40) },
        ]}
      >
        <Text style={tw`text-lg font-Manrope-SemiBold.ttf text-white`}>
          My Cart
        </Text>
        <Text style={tw`text-[16px] font-Manrope-Regular.ttf text-[#F86B17]`}>
          {summary?.items_count || 0} items
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: hasItems ? Math.max(insets.bottom + 90, 110) : 40,
        }}
      >
        {!hasItems ? (
          <View style={tw`items-center justify-center py-20 px-5`}>
            <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
            <Text
              style={tw`text-base font-Manrope-SemiBold.ttf text-[#222222] mt-4`}
            >
              Your cart is empty
            </Text>
          </View>
        ) : (
          <>
            {/* Merchant Stores */}
            <View style={tw`gap-6 px-5 mb-6`}>
              {stores.map((store: any) => (
                <View
                  key={store.merchant_id}
                  style={tw`border border-[#E5E5E5] rounded-2xl p-4 bg-white shadow-xs gap-3`}
                >
                  <View
                    style={tw`flex-row items-center gap-2 border-b border-[#F3F3F3] pb-2.5`}
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={18}
                      color="#587511"
                    />
                    <Text
                      style={tw`text-sm font-Manrope-SemiBold.ttf text-[#222222] flex-1`}
                    >
                      {store.merchant_name}
                    </Text>
                    <Text
                      style={tw`text-xs font-Manrope-Regular.ttf text-[#606060]`}
                    >
                      ({store.items_count}{" "}
                      {store.items_count === 1 ? "item" : "items"})
                    </Text>
                  </View>

                  <View style={tw`gap-3`}>
                    {store.items.map((cartItem: any) => {
                      const product = cartItem.product;
                      const price = Number(
                        product?.discount_price || product?.base_price || 0,
                      );
                      const quantity = Math.round(Number(cartItem.quantity));
                      const imageUrl = product?.images?.[0]?.image_url;
                      const isItemLoading = updatingItemId === cartItem.id;

                      return (
                        <View
                          key={cartItem.id}
                          style={tw`flex-row items-center bg-[#F9FAFB] rounded-xl p-2.5`}
                        >
                          <View
                            style={tw`w-20 h-20 rounded-xl bg-white items-center justify-center mr-3 border border-[#F3F3F3]`}
                          >
                            <Image
                              source={
                                imageUrl ? { uri: imageUrl } : DEFAULT_IMAGE
                              }
                              style={tw`w-18 h-18`}
                              resizeMode="contain"
                            />
                          </View>

                          <View style={tw`flex-1`}>
                            <View
                              style={tw`flex-row justify-between items-start mb-1`}
                            >
                              <Text
                                style={tw`text-xs font-Manrope-Medium.ttf text-[#222222] flex-1 mr-2`}
                                numberOfLines={1}
                              >
                                {product?.name}
                              </Text>
                              <TouchableOpacity
                                onPress={() => handleRemoveItem(cartItem.id)}
                                disabled={isItemLoading}
                                activeOpacity={0.7}
                              >
                                <Ionicons
                                  name="trash-outline"
                                  size={18}
                                  color="#EF4444"
                                />
                              </TouchableOpacity>
                            </View>

                            <Text
                              style={tw`text-[10px] font-Manrope-Regular.ttf text-[#505050] mb-2`}
                            >
                              Unit: {product?.unit_value || 1}{" "}
                              {product?.unit_type}
                            </Text>

                            <View
                              style={tw`flex-row justify-between items-center`}
                            >
                              <Text
                                style={tw`text-xs font-Manrope-SemiBold.ttf text-[#404040]`}
                              >
                                {store.currency} {price.toFixed(2)}
                              </Text>

                              <View
                                style={tw`flex-row items-center bg-white border border-[#E5E5E5] rounded-full px-1.5 py-0.5 gap-2.5`}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    handleUpdateQuantity(
                                      cartItem.id,
                                      quantity,
                                      -1,
                                    )
                                  }
                                  disabled={isItemLoading}
                                  activeOpacity={0.8}
                                  style={tw`w-6 h-6 rounded-full bg-[#F3F4F6] items-center justify-center`}
                                >
                                  <Feather
                                    name="minus"
                                    size={12}
                                    color="#4B5563"
                                  />
                                </TouchableOpacity>

                                {isItemLoading ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#587511"
                                  />
                                ) : (
                                  <Text
                                    style={tw`text-xs font-Manrope-SemiBold.ttf text-[#606060]`}
                                  >
                                    {String(quantity).padStart(2, "0")}
                                  </Text>
                                )}

                                <TouchableOpacity
                                  onPress={() =>
                                    handleUpdateQuantity(
                                      cartItem.id,
                                      quantity,
                                      1,
                                    )
                                  }
                                  disabled={isItemLoading}
                                  activeOpacity={0.8}
                                  style={tw`w-6 h-6 rounded-full bg-[#F3F4F6] items-center justify-center`}
                                >
                                  <Feather
                                    name="plus"
                                    size={12}
                                    color="#4B5563"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <View
                    style={tw`pt-2 border-t border-[#F3F3F3] flex-row justify-between items-center`}
                  >
                    <Text
                      style={tw`text-xs font-Manrope-Regular.ttf text-[#606060]`}
                    >
                      Delivery Fee: {store.currency} {store.delivery_fee}
                    </Text>
                    <Text
                      style={tw`text-xs font-Manrope-SemiBold.ttf text-[#222222]`}
                    >
                      Subtotal: {store.currency} {store.sub_total}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Shipping Address Section */}
            <View style={tw`px-5 mb-6`}>
              <Text
                style={tw`text-[#222222] font-Manrope-SemiBold.ttf text-sm mb-2`}
              >
                Shipping Address
              </Text>

              <View
                style={tw`border border-[#E5E5E5] rounded-2xl p-3.5 flex-row items-center bg-[#F8F8F8] shadow-xs`}
              >
                <View
                  style={tw`w-12 h-12 rounded-full bg-[#F3F4F6] items-center justify-center mr-3`}
                >
                  <Ionicons name="location-outline" size={22} color="#4B5563" />
                </View>

                <View style={tw`flex-1 mr-2`}>
                  <Text
                    style={tw`text-sm font-Manrope-SemiBold.ttf text-[#222222] mb-0.5`}
                  >
                    {addressData?.title}
                  </Text>
                  <Text
                    style={tw`text-xs text-[#505050] font-Manrope-Regular.ttf`}
                    numberOfLines={1}
                  >
                    {addressData?.address_text},{addressData?.phone_number}
                  </Text>
                </View>

                {/* <TouchableOpacity activeOpacity={0.4}>
                  <Text
                    style={tw`text-xs font-Manrope-Regular.ttf text-[#505050] underline`}
                  >
                    Change
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Order Summary Breakdown */}
            <View style={tw`px-5 gap-2`}>
              <Text
                style={tw`text-[#222222] font-Manrope-SemiBold.ttf text-sm mb-1`}
              >
                Order Summary
              </Text>
              <View
                style={tw`border border-[#E5E5E5] rounded-2xl p-4 bg-white gap-2`}
              >
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-xs text-[#606060]`}>Subtotal</Text>
                  <Text style={tw`text-xs text-[#222222]`}>
                    {summary?.currency} {summary?.sub_total}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-xs text-[#606060]`}>Delivery Fee</Text>
                  <Text style={tw`text-xs text-[#222222]`}>
                    {summary?.currency} {summary?.delivery_charge}
                  </Text>
                </View>
                <View
                  style={tw`border-t border-[#E5E5E5] pt-2 mt-1 flex-row justify-between`}
                >
                  <Text style={tw`text-sm font-bold text-[#222222]`}>
                    Total
                  </Text>
                  <Text style={tw`text-sm font-bold text-[#587511]`}>
                    {summary?.currency} {summary?.total_cost}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Bottom Button */}
      {hasItems && (
        <View
          style={[
            tw`absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 border-t border-[#F3F3F3]`,
            { paddingBottom: Math.max(insets.bottom + 12, 20) },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/checkout")}
            style={tw`w-full bg-[#587511] py-4 rounded-full items-center justify-center shadow-sm`}
          >
            <Text style={tw`text-white font-bold text-base`}>
              Proceed to Checkout ({summary?.currency || "KES"}{" "}
              {summary?.total_cost || 0})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

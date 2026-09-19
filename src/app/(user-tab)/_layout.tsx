import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

interface TabItem {
  name: string;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}

const TAB_ITEMS: TabItem[] = [
  {
    name: "index",
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  {
    name: "cart",
    label: "Cart",
    activeIcon: "bag-handle",
    inactiveIcon: "bag-handle-outline",
  },
  {
    name: "favorites",
    label: "Favorites",
    activeIcon: "heart",
    inactiveIcon: "heart-outline",
  },
  {
    name: "orders",
    label: "Orders",
    activeIcon: "receipt",
    inactiveIcon: "receipt-outline",
  },
  {
    name: "profile",
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
];

// Define routes that should be hidden from the bottom bar
const HIDDEN_ROUTES = [
  "all-category",
  "category-products",
  "product-details",
  "shop-details",
  "hotel",
  "hotel-details",
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  // Determine current active route name
  const currentRouteName = state.routes[state.index]?.name;
  const isHiddenRouteActive = HIDDEN_ROUTES.includes(currentRouteName);

  // Filter out hidden screens from tab bar
  const visibleRoutes = state.routes.filter(
    (route: any) => !HIDDEN_ROUTES.includes(route.name),
  );

  return (
    <View
      style={[
        tw`bg-white flex-row items-center justify-around px-3 py-2 border-t border-gray-100`,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      {visibleRoutes.map((route: any) => {
        const index = state.routes.findIndex((r: any) => r.key === route.key);
        const { options } = descriptors[route.key];

        // Check exact focus vs active state
        const isActualFocused = state.index === index;
        const isFocused =
          isActualFocused || (route.name === "index" && isHiddenRouteActive);

        const tabInfo = TAB_ITEMS.find((item) => item.name === route.name) || {
          label: options.title || route.name,
          activeIcon: "square",
          inactiveIcon: "square-outline",
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          // Navigate if user taps a different screen or taps Home while on a hidden sub-screen
          if (!isActualFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            activeOpacity={0.7}
            style={
              isFocused
                ? tw`flex-row items-center bg-[#F4F5F0] px-4 py-2.5 rounded-full`
                : tw`p-2.5 items-center justify-center`
            }
          >
            <Ionicons
              name={
                isFocused
                  ? (tabInfo.activeIcon as any)
                  : (tabInfo.inactiveIcon as any)
              }
              size={22}
              color={isFocused ? "#5B7410" : "#555D67"}
            />

            {isFocused && (
              <Text style={tw`text-[#5B7410] font-semibold text-base ml-2`}>
                {tabInfo.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="cart" options={{ title: "Cart" }} />
        <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
        <Tabs.Screen name="orders" options={{ title: "Orders" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen
          name="all-category"
          options={{ title: "Category", href: null }}
        />
        <Tabs.Screen
          name="category-products"
          options={{ title: "CategoryProducts", href: null }}
        />
        <Tabs.Screen
          name="product-details"
          options={{ title: "Product", href: null }}
        />
        <Tabs.Screen
          name="shop-details"
          options={{ title: "Product", href: null }}
        />
        <Tabs.Screen
          name="hotel"
          options={{ title: "Popular Hotel", href: null }}
        />
        <Tabs.Screen
          name="hotel-details"
          options={{ title: "HotelDetails", href: null }}
        />
      </Tabs>
    </>
  );
}

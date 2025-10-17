import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ThemedText } from "../../components/ui/themed-text";
import { ThemedView } from "../../components/ui/themed-view";
import useThemeColor from "../../hooks/use-theme-color";
import { AuthContext } from "../../context/AuthContext";
import { fontSizes, spacing } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { StackParamList, UserRole } from "../../types/router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const API_BASE_URL = process.env.API_BASE_URL || "https://api.agrosetufarmfix.com";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  productName: string;
  quantity: number;
  status: string;
  deliveryDate?: string;
}

export function HomeScreen() {
  const { userRole } = useContext(AuthContext);
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<{ registrations: number; approvals: number; payments: number; tickets: number }>({
    registrations: 0,
    approvals: 0,
    payments: 0,
    tickets: 0,
  });

  useEffect(() => {
    if (!userRole) return;
    setLoading(true);
    if (userRole === "Farmer") {
      fetchProducts();
    } else if (userRole === "Dealer") {
      fetchDealerOrders();
    } else if (userRole === "Admin") {
      fetchAdminStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  async function fetchProducts() {
    try {
      const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDealerOrders() {
    try {
      const response = await axios.get<Order[]>(`${API_BASE_URL}/dealer/orders`);
      setOrders(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminStats() {
    try {
      const response = await axios.get<{ registrations: number; approvals: number; payments: number; tickets: number }>(
        `${API_BASE_URL}/admin/dashboard`
      );
      setStats(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load dashboard stats. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderProduct({ item }: { item: Product }) {
    return (
      <TouchableOpacity
        style={[styles.productCard, { borderColor: useThemeColor("border") }]}
        onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
      >
        <Image
          source={{ uri: item.imageUrl || "https://picsum.photos/100/100?random=1" }}
          style={styles.productImage}
          resizeMode="cover"
          defaultSource={{ uri: "https://picsum.photos/100/100?random=1" }}
        />
        <View style={styles.productInfo}>
          <ThemedText style={[styles.productName, { color: textColor }]}>{item.name}</ThemedText>
          <ThemedText style={[styles.productDescription, { color: textColor }]} numberOfLines={2}>
            {item.description}
          </ThemedText>
          <ThemedText style={[styles.productPrice, { color: textColor }]}>₹ {item.price.toFixed(2)}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  }

  function renderOrder({ item }: { item: Order }) {
    return (
      <TouchableOpacity
        style={[styles.orderCard, { borderColor: useThemeColor("border") }]}
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
      >
        <ThemedText style={[styles.orderName, { color: textColor }]}>{item.productName}</ThemedText>
        <ThemedText style={{ color: textColor }}>Qty: {item.quantity}</ThemedText>
        <ThemedText style={{ color: textColor }}>Status: {item.status}</ThemedText>
        {item.deliveryDate && <ThemedText style={{ color: textColor }}>Delivery: {item.deliveryDate}</ThemedText>}
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={useThemeColor("primary")} />
      </ThemedView>
    );
  }

  if (!userRole) {
    return (
      <ThemedView style={[styles.container, { backgroundColor, justifyContent: "center", alignItems: "center" }]}>
        <ThemedText style={{ color: textColor }}>Please login to see your dashboard.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {userRole === "Farmer" && (
        <>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Product Catalog</ThemedText>
          {products.length === 0 ? (
            <ThemedText style={{ color: textColor, paddingHorizontal: spacing.md }}>No products available.</ThemedText>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={renderProduct}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {userRole === "Dealer" && (
        <>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Assigned Orders</ThemedText>
          {orders.length === 0 ? (
            <ThemedText style={{ color: textColor, paddingHorizontal: spacing.md }}>No orders assigned.</ThemedText>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrder}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {userRole === "Admin" && (
        <View style={styles.adminStatsContainer}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Admin Dashboard</ThemedText>
          <View style={styles.statRow}>
            <ThemedText style={[styles.statLabel, { color: textColor }]}>Registrations:</ThemedText>
            <ThemedText style={[styles.statValue, { color: textColor }]}>{stats.registrations}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={[styles.statLabel, { color: textColor }]}>Product Approvals:</ThemedText>
            <ThemedText style={[styles.statValue, { color: textColor }]}>{stats.approvals}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={[styles.statLabel, { color: textColor }]}>Payments:</ThemedText>
            <ThemedText style={[styles.statValue, { color: textColor }]}>{stats.payments}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={[styles.statLabel, { color: textColor }]}>Support Tickets:</ThemedText>
            <ThemedText style={[styles.statValue, { color: textColor }]}>{stats.tickets}</ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: "bold",
    margin: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  productCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: "space-between",
  },
  productName: {
    fontWeight: "600",
    fontSize: fontSizes.medium,
  },
  productDescription: {
    fontSize: fontSizes.small,
    color: "#666666",
  },
  productPrice: {
    fontWeight: "700",
    fontSize: fontSizes.medium,
  },
  orderCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderName: {
    fontWeight: "600",
    fontSize: fontSizes.medium,
    marginBottom: spacing.xs,
  },
  adminStatsContainer: {
    padding: spacing.md,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: spacing.sm,
  },
  statLabel: {
    fontWeight: "600",
    fontSize: fontSizes.medium,
  },
  statValue: {
    fontWeight: "700",
    fontSize: fontSizes.medium,
  },
});

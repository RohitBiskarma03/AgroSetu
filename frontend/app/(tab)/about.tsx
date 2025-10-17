import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "../../components/ui/themed-text";
import { ThemedView } from "../../components/ui/themed-view";
import useThemeColor from "../../hooks/use-theme-color";
import { spacing, fontSizes } from "../../constants/theme";

export function AboutScreen() {
  const textColor = useThemeColor("text");
  const backgroundColor = useThemeColor("background");

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={[styles.title, { color: textColor }]}>AgroSetuFarmFix</ThemedText>
        <ThemedText style={[styles.paragraph, { color: textColor }]}>
          AgroSetuFarmFix is dedicated to empowering farmers, dealers, and administrators through a
          seamless digital platform. Our mission is to modernize farming by connecting all
          stakeholders, providing AI advisory, enabling secure payments, and promoting sustainable
          agriculture.
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>Our Mission</ThemedText>
        <ThemedText style={[styles.paragraph, { color: textColor }]}>
          To enhance agricultural productivity and sustainability by leveraging technology, providing
          transparent services, and supporting organic and carbon credit farming initiatives.
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>Contact Us</ThemedText>
        <ThemedText style={[styles.paragraph, { color: textColor }]}>
          Email: support@agrosetufarmfix.com
        </ThemedText>
        <ThemedText style={[styles.paragraph, { color: textColor }]}>
          Phone: +91 12345 67890
        </ThemedText>
        <ThemedText style={[styles.paragraph, { color: textColor }]}>
          Website: www.agrosetufarmfix.com
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xlarge,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.large,
    fontWeight: "600",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: fontSizes.medium,
    lineHeight: 22,
  },
});

import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function MainScreen({navigation}) {
  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
            style={{ alignItems: "flex-end", margin: 16, marginTop: 25 }}
            onPress={navigation.openDrawer}
          >
          <FontAwesome name="bars" size={28} color="black" />
        </TouchableOpacity>
        <Text>Main</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

import { Image, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.title}>Flashcards</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.page}>
          <Text style={styles.pageNum}>1 / 149</Text>
        </View>
        <View style={styles.flashcard}>
          <Text>Hello World</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "blue",
    width: "100%",
    height: "15%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 60,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  page: {
    backgroundColor: "#dedede",
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100,
  },
  pageNum: {
    fontWeight: "500",
    color: "#2f2f2f"
  },
  container: {
    backgroundColor: "#dedede",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flashcard: {
    backgroundColor: "white",
    height: "70%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  }
});

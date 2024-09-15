import { View, StyleSheet } from "react-native";

type Flashcard = {
  question: string;
  answer: string;
};

type PageIndicatorProps = {
  cards: Flashcard[];
  currentIndex: number;
};

export const PageIndicator = ({ cards, currentIndex }: PageIndicatorProps) => {
  return (
    <View style={styles.pageIndicator}>
      {cards.map((_, idx) => (
        <View
          key={idx}
          style={[
            styles.dot,
            { backgroundColor: currentIndex === idx ? '#1955ff' : '#d3d3d3' }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
  },
})
import { Animated, Pressable, Text, StyleSheet } from "react-native";

type FlashcardProps = {
    question: string;
    answer: string;
    flipAnim: Animated.Value;
    flipCard: (duration: number) => void;
};

export const Flashcard: React.FC<FlashcardProps> = ({ question, answer, flipAnim, flipCard }) => {
    const frontInterpolate = flipAnim.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = flipAnim.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
  
    return (
      <Pressable onPress={() => flipCard(500)}>
        <Animated.View style={[styles.flashcard, { transform: [{ rotateX: frontInterpolate }] }]}>
          <Text style={styles.questionText}>{question}</Text>
        </Animated.View>
        <Animated.View style={[styles.flashcard, styles.flashcardBack, { transform: [{ rotateX: backInterpolate }] }]}>
          <Text style={styles.answerText}>{answer}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    flashcard: {
        backgroundColor: "white",
        height: 280,
        width: 335,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        borderStyle: "solid",
        borderColor: "#3066ff",
        borderWidth: 5,
        padding: 20,
        backfaceVisibility: "hidden",
    },
    questionText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    answerText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    flashcardBack: {
        position: "absolute",
        top: 0,
        backfaceVisibility: "hidden",
    },
  })
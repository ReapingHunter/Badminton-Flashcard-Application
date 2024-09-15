import { StyleSheet, Text, View, StatusBar, Button, Pressable, PanResponder, Animated } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type FlashcardData = {
  question: string,
  answer: string,
}[];

const data : FlashcardData = [
  {question: "A stroke made on the nonracquet side of the body", answer: "Backhand"},
  {question: "Any infraction of the rules which results in the loss of a serve or in a point for the server", answer: "Fault"},
  {question: "The object which is volleyed back and forth over the net", answer: "Shuttlecock"},
  {question: "An overhead stroke hit downward with great velocity and angle", answer: "Smash"},
  {question: "If the shuttle hits the net and still lands in the proper court is it a Legal or Illegal serve?", answer: "Legal"},
  {question: "When is the serve in singles made from the right service court?", answer: "When the server's score is an even number"},
  {question: "What are the 5 basic groups of shots?", answer: "serves, clears, smash, blocks, drop shots"},
  {question: "What is the mid-line separating the service courts?", answer: "Center line"},
  {question: "A high, deep serve landing near the long service line in doubles or back boundary line in singles", answer: "Long Serve",},
  {question: "Badminton became an olympic sport in what year?",answer: "1992"}
]

export default function HomeScreen() {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [cards, setCards] = useState<FlashcardData>(data);  // Holds flashcard data
  const [isPlaying, setIsPlaying] = useState(false);        // Controls autoplay

  const handleSwipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : data.length - 1))
        } else if (gestureState.dx < -50) {
          setIndex(prevIndex => (prevIndex < data.length - 1 ? prevIndex + 1 : 0))
        }
        setShowAnswer(false)
      },
    })
  ).current



  
  // Animated value for flip
  const flipAnim = useRef(new Animated.Value(0)).current;
  const flipToFront = useRef(true); // Keeps track of flip direction

  // Interpolations for flip animations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Flip animation function
  const flipCard = () => {
    if (flipToFront.current) {
      Animated.timing(flipAnim, {
        toValue: 180,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        flipToFront.current = false;
        setShowAnswer(true);
      });
    } else {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        flipToFront.current = true;
        setShowAnswer(false);
      });
    }
  };

  // Shuffle function (Fisher-Yates algorithm)
  const shuffleCards = () => {
  const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setIndex(0); // Reset to first card after shuffle
    setShowAnswer(false); // Reset to question side
  };

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let flipTimeout: NodeJS.Timeout;
  
    if (isPlaying) {
      // Initially, show the question for 2 seconds
      flipTimeout = setTimeout(() => {
        flipCard(); // Flip to show the answer
      }, 2000); // Show question for 2 seconds
  
      // Move to the next card after 4 seconds (2 seconds for question, 2 for answer)
      interval = setInterval(() => {
        flipCard(); // Flip back to question first
        setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % cards.length); // Move to the next card
          setShowAnswer(false); // Ensure the next card starts on the question face
        }, 500); // Delay before showing the new card
      }, 4000); // Autoplay interval (4 seconds total)
    }

      return () => {
        clearInterval(interval); // Cleanup interval
        clearTimeout(flipTimeout); // Cleanup timeout for flipping
    };
  }, [isPlaying, cards]);

  // Autoplay toggle
  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <View style={styles.body}>
      <StatusBar 
        backgroundColor="#000000"
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.title}>Badminton Flashcards</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.page}>
          <Text style={styles.pageNum}>{index + 1} / {cards.length}</Text>
        </View>
        <View  {...handleSwipe.panHandlers}>
        <Pressable onPress={flipCard} >
            <Animated.View style={[styles.flashcard, { transform: [{ rotateX: frontInterpolate }] }]}>
              <Text style={styles.questionText}>{cards[index].question}</Text>
            </Animated.View>
            <Animated.View style={[styles.flashcard, styles.flashcardBack, { transform: [{ rotateX: backInterpolate }] }]}>
              <Text style={styles.answerText}>{cards[index].answer}</Text>
            </Animated.View>
          </Pressable>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.actions}>
          <Pressable style={styles.iconButton} onPress={toggleAutoplay}>
            <Ionicons name="play" size={60} color={"white"}/>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={shuffleCards}>
            <Ionicons name="shuffle" size={60} color={"white"}/>
            </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#9cec7f",
    width: "100%",
    height: "20%",
    justifyContent: "flex-end",
    alignItems: "center",
    elevation: 10,
    zIndex: 1,
  },
  title: {
    color: "#3e752b",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 35,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  page: {
    backgroundColor: "transparent",
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
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flashcard: {
    backgroundColor: "white",
    height: 280,
    width: 335,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 8,
    margin: 10,
    borderStyle: "solid",
    borderColor: "#3e752b",
    borderWidth: 5,
    padding: 20,
    backfaceVisibility: "hidden",
  },
  flashcardBack: {
    elevation: 8,
    position: "absolute",
    top: 0,
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
    color: '#d9534f',
  },
  actions: {
    height: "20%",
    width: "90%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    margin:10,
  },
  iconButton: {
    backgroundColor: "#3e752b",
    borderRadius: 80,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalLine: {
    width: '80%',
    height: 0.75,
    backgroundColor: '#9c9c9c',
    marginVertical: 20,
  },
  flashcardContainer: {
    width: "100%",
    alignItems: "center",
  }
});

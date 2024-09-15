import { StyleSheet, Text, View, StatusBar, Button, Pressable, PanResponder, Animated, } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { ActionButton } from '@/components/ActionButton';

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
  const [cards, setCards] = useState<FlashcardData>(data);
  const [isPlaying, setIsPlaying] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const flipToFront = useRef(true);
  const instructionY = useRef(new Animated.Value(100)).current

  useEffect(() => {
    const animateInstruction = () => {
      Animated.sequence([
        Animated.timing(instructionY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(5000), // Wait for 5 seconds
        Animated.timing(instructionY, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateInstruction();
  }, []);

  // Flip animation function
  const flipCard = (duration: number) => {
    Animated.timing(flipAnim, {
      toValue: flipToFront.current ? 180 : 0,
      duration: duration,
      useNativeDriver: true,
    }).start(() => {
      flipToFront.current = !flipToFront.current;
    });
  }; 
  // Swipe animation function
  const swipeCard = (value: number, duration: number, callback: () => void) => {
    Animated.timing(translateX, {
      toValue: value,
      duration: duration,
      useNativeDriver: true,
    }).start(callback)
  }

  // Interpolations for flip animations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const handleSwipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        setIsPlaying(false)
        return Math.abs(gestureState.dx) > 20
      },
      onPanResponderMove: (evt, gestureState) => {
        setIsPlaying(false)
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsPlaying(false)
        if (gestureState.dx > 50) {
          swipeCard(500, 200, () => {
            setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1))
            if(!flipToFront.current){
              flipCard(0)
            }
            translateX.setValue(-500)
            swipeCard(0, 200, ()=>{})
          })
        } else if (gestureState.dx < -50) {
          swipeCard(-500, 200, () => {
            setIndex(prevIndex => (prevIndex < data.length - 1 ? prevIndex + 1 : 0))
            if(!flipToFront.current){
              flipCard(0)
            }
            translateX.setValue(500);
            swipeCard(0, 200, ()=>{})
          })
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current

  // Shuffle function (Fisher-Yates algorithm)
  const shuffleCards = () => {
  const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setIndex(0); // Reset to first card after shuffle
    setIsPlaying(false)
  };

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout
    const animateAutoplay = () => {
      // Start flip animation
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 180,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000), // Wait for 3 seconds after flipping
        Animated.timing(translateX, {
          toValue: -500,
          duration: 200,
          useNativeDriver: true,
        }),
        // Flip back to the front side
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if(isPlaying){
          setIndex((prevIndex) => (prevIndex < cards.length - 1 ? prevIndex + 1 : 0));
          translateX.setValue(500)
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }
        
      });
    }
    if (isPlaying) {
      timeout = setTimeout(() => {
        animateAutoplay()
        interval = setInterval(() => {
          animateAutoplay()
        }, 7000);
      }, 3500)
    }
    return () => {
      clearInterval(interval); // Cleanup interval
      clearTimeout(timeout)
    };
  }, [isPlaying, cards]);  

  // Autoplay toggle
  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
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
        <View style={styles.pageIndicator}>
          {cards.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                { backgroundColor: index === idx ? '#1955ff' : '#d3d3d3' }
              ]}
            />
          ))}
        </View>
        <Animated.View  {...handleSwipe.panHandlers} style={{transform: [{translateX}]}}>
          <Pressable onPress={() => flipCard(500)}>
            <Animated.View style={[styles.flashcard, { transform: [{ rotateX: frontInterpolate }] }]}>
              <Text style={styles.questionText}>{cards[index].question}</Text>
            </Animated.View>
            <Animated.View style={[styles.flashcard, styles.flashcardBack, { transform: [{ rotateX: backInterpolate }] }]}>
              <Text style={styles.answerText}>{cards[index].answer}</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
        <View style={styles.horizontalLine} />
        <View style={styles.actions}>
          <ActionButton
            style={isPlaying ? styles.playingButton : styles.iconButton}
            onPress={toggleAutoplay}
            iconName={isPlaying ? "pause" : "play"}
            color={isPlaying ? "#1955ff" : "white"}>
          </ActionButton>
          <ActionButton
            style={styles.iconButton}
            onPress={shuffleCards}
            iconName={"shuffle"}
            color={"white"}>
          </ActionButton>
        </View>
      </View>
      <Animated.View style={[styles.instruction, { transform: [{ translateY: instructionY }] }]}>
        <Text style={styles.instructionText}>Tap on the flashcard to flip. Swipe to go to the next or previous flashcard</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1955ff",
    width: "100%",
    height: "20%",
    justifyContent: "flex-end",
    alignItems: "center",
    elevation: 10,
    zIndex: 1,
  },
  title: {
    color: "#ffffff",
    fontWeight: "300",
    fontSize: 32,
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
    margin: 10,
    borderStyle: "solid",
    borderColor: "#3066ff",
    borderWidth: 5,
    padding: 20,
    backfaceVisibility: "hidden",
  },
  flashcardBack: {
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
  },
  actions: {
    height: "20%",
    width: "90%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    margin:10,
  },
  iconButton: {
    backgroundColor: "#1955ff",
    borderRadius: 80,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  playingButton: {
    backgroundColor: "#eaeaea",
    borderRadius: 80,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: "#1955ff",
    borderWidth: 2,
  },
  horizontalLine: {
    width: '80%',
    height: 0.75,
    backgroundColor: '#9c9c9c',
    marginVertical: 20,
  },
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
  instruction: {
    backgroundColor: "#0030b6",
    bottom: 0,
    width: "100%",
    height: "3%",
    alignItems: "center",
    padding: 5,
    position: "absolute",

  },
  instructionText: {
    fontSize: 12,
    color: "white",
  }
});
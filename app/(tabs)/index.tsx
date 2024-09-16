import { StyleSheet, Text, View, StatusBar, Button, Pressable, PanResponder, Animated, } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { ActionButton } from '@/components/ActionButton';
import { Autoplay } from '@/utils/Autoplay';
import { Flashcard } from '@/components/FlashCard';
import { Instruction } from '@/components/Instructions';
import { PageIndicator } from '@/components/PageIndicator';
import { Shuffle } from '@/utils/Shuffle';

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

  
  const shuffleCards = () => {
    const shuffled = Shuffle(cards)
    setCards(shuffled);
    setIndex(0); // Reset to first card after shuffle
    setIsPlaying(false)
    if(!flipToFront.current){
      flipCard(0)
    }
  }
  

  return (
    <View style={styles.body}>
      <StatusBar 
        backgroundColor="#000000"
        barStyle="light-content"
      />
      <Autoplay
        isPlaying={isPlaying}
        cards={cards}
        flipAnim={flipAnim}
        translateX={translateX}
        setIndex={setIndex}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Badminton Flashcards</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.page}>
          <Text style={styles.pageNum}>{index + 1} / {cards.length}</Text>
        </View>
        <PageIndicator
          cards={cards}
          currentIndex={index}/>
        <Animated.View  {...handleSwipe.panHandlers} style={{transform: [{translateX}]}}>
        <Flashcard
          question={cards[index].question}
          answer={cards[index].answer}
          flipAnim={flipAnim}
          flipCard={flipCard}
        />
        </Animated.View>
        <View style={styles.horizontalLine} />
        <View style={styles.actions}>
          <ActionButton
            style={isPlaying ? styles.playingButton : styles.iconButton}
            onPress={() => setIsPlaying(!isPlaying)}
            iconName={isPlaying ? "pause" : "play"}
            color={isPlaying ? "#0b7fab" : "white"}>
          </ActionButton>
          <ActionButton
            style={styles.iconButton}
            onPress={shuffleCards}
            iconName={"shuffle"}
            color={"white"}>
          </ActionButton>
        </View>
      </View>
      <Instruction 
        instructionY={instructionY}
        text="Tap on the flashcard to flip. Swipe to go to the next or previous flashcard" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0b7fab",
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
  actions: {
    height: "20%",
    width: "90%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    margin:10,
  },
  iconButton: {
    backgroundColor: "#0b7fab",
    borderRadius: 80,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  playingButton: {
    backgroundColor: "#89c4f4",
    borderRadius: 80,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: "#0b7fab",
    borderWidth: 2,
  },
  horizontalLine: {
    width: '80%',
    height: 0.75,
    backgroundColor: '#9c9c9c',
    marginVertical: 20,
  },
});
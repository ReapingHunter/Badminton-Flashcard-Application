import { useEffect } from "react";
import { Animated, Text, StyleSheet } from "react-native";

type InstructionProps = {
    instructionY: Animated.Value,
    text: string,
}
export const Instruction = ({ instructionY, text}: InstructionProps) => {
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
    return (
        <Animated.View style={[styles.instruction, { transform: [{ translateY: instructionY }] }]}>
        <Text style={styles.instructionText}>{text}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
})
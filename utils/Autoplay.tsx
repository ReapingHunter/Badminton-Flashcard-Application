import { useEffect } from "react";
import { Animated } from "react-native";

type AutoplayProps = {
    isPlaying: boolean,
    cards: { question: string; answer: string }[],
    flipAnim: Animated.Value,
    translateX: Animated.Value,
    setIndex: (index: number) => void,
}

export const Autoplay = ({ isPlaying, cards, flipAnim, translateX, setIndex }: AutoplayProps) => {
    useEffect(() => {
        let interval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        const animateAutoplay = () => {
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
                if (isPlaying) {
                    setIndex(index => {
                        const nextIndex = index < cards.length - 1 ? index + 1 : 0;
                        return nextIndex;
                    });

                    translateX.setValue(500);
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            });
        };

        if (isPlaying) {
            timeout = setTimeout(() => {
                animateAutoplay();
                interval = setInterval(() => {
                    animateAutoplay();
                }, 7000);
            }, 3500);
        }

        return () => {
            clearInterval(interval); // Cleanup interval
            clearTimeout(timeout);
        };
    }, [isPlaying, cards, flipAnim, translateX, setIndex]);
    return null
};

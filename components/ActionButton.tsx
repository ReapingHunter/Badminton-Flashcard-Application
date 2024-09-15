import { Pressable,  Animated, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useRef } from 'react';
interface ActionButtonProps {
    style: any;
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
}

export const ActionButton = ({ style, onPress, iconName, color }: ActionButtonProps) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animateButtonPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.9, // Scale down to 90%
        friction: 5,
        tension: 150,
        useNativeDriver: true,
      }).start();
    };

    const animateButtonPressOut = () => {
      Animated.spring(scale, {
        toValue: 1, // Scale back to original size
        friction: 5,
        tension: 150,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={style}
          onPress={onPress}
          onPressIn={animateButtonPressIn}
          onPressOut={animateButtonPressOut}
        >
          <Ionicons name={iconName} size={60} color={color} />
        </Pressable>
      </Animated.View>
    );
  };
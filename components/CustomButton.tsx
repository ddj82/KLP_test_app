import {TouchableOpacity, Text, View} from 'react-native';
import React, { useState } from 'react';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    bgColor: string;
    disabled?: boolean;
    RightIcon?: React.ReactNode;
}

const CustomButton = ({ title, onPress, bgColor, disabled = false, RightIcon, }: CustomButtonProps) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <TouchableOpacity
            className={`
                py-3 px-6 
                rounded-lg 
                items-center 
                justify-center
                shadow-lg
                ${bgColor}
                ${disabled ? 'opacity-60' : ''}
            `}
            style={{ opacity: disabled ? 0.6 : isPressed ? 0.85 : 1 }}
            disabled={disabled}
            onPress={disabled ? undefined : onPress}
            onPressIn={() => !disabled && setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            activeOpacity={1}
        >
            <View className="items-center justify-center">
                {RightIcon ? (
                    <Text>{RightIcon}</Text>
                ) : (
                    <Text className="text-white font-bold">{title}</Text>
                )}
            </View>

        </TouchableOpacity>
    );
};

export default CustomButton;
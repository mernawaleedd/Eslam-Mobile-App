import { ActivityIndicator, Image, Text, TouchableOpacity } from "react-native";

const MainButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
    icon,
    iconStyles,
    disabled,
    ActivityIndicatorColor,
    alternative = false,
}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`${
                alternative ? " border border-primary " : "bg-[#d9d9d9]"
            }  rounded-lg min-h-[100px]  w-1/2 mr-2 justify-center  items-center ${containerStyles} ${
                isLoading ? "opacity-50" : ""
            }`}
            disabled={isLoading || disabled ? true : false}>
            {icon ? (
                <Image
                    source={icon}
                    className={`  ${iconStyles}`}
                />
            ) : (
                ""
            )}
            <Text
                className={`${
                    alternative ? "text-primary" : "text-[#2B2B2B]"
                }  text-lg font-tmedium  ${textStyles} `}>
                {title}
            </Text>

            {isLoading && (
                <ActivityIndicator
                    animating={isLoading}
                    color={
                        ActivityIndicatorColor
                            ? ActivityIndicatorColor
                            : alternative
                            ? "#227099"
                            : "#fff"
                    }
                    size="small"
                    className="ml-2"
                />
            )}
        </TouchableOpacity>
    );
};

export default MainButton;
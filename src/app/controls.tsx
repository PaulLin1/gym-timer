import { Pressable, Text, View } from "react-native";

const buttons = [
  { name: "ROUND TIME", action: "roundTime" },
  { name: "REST TIME", action: "restTime" },
  { name: "INT BEEP", action: "intBeep" },
  { name: "ROUNDS", action: "rounds" },
  { name: "UP", action: "up" },
  { name: "DOWN", action: "down" },
  { name: "START / PAUSE", action: "start" },
  { name: "STOP / RESET", action: "stop" },
] as const;

function getButtonColor(action: string) {
  switch (action) {
    case "start":
      return "bg-green-600";
    case "stop":
      return "bg-red-600";
    default:
      return "bg-black";
  }
}

type ControlsProps = {
  onButtonPress: (action: string) => void;
};

export default function Controls({ onButtonPress }: ControlsProps) {
  return (
    <View className="flex-[2] bg-[#7f7f7f] items-center justify-center">
      <View className="flex-row flex-wrap">
        {buttons.map((button) => (
          <Pressable
            key={button.action}
            className="w-1/2 h-40 items-center justify-center"
            onPress={() => onButtonPress(button.action)}
          >
            <View
              className={`w-36 h-36 rounded-full items-center justify-center ${getButtonColor(button.action)}`}
            >
              <Text className="text-white text-center text-3xl">
                {button.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

import { useFonts } from "expo-font";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Digital: require("../../assets/fonts/digital-7 (italic).ttf"),
  });

  const buttons: string[] = [
    "ROUND TIME",
    "REST TIME",
    "INT BEEP",
    "ROUNDS",
    "UP",
    "DOWN",
    "START / PAUSE",
    "STOP / RESET",
  ];

  return (
    <View className="flex-1 border-[5px] border-red-500 rounded-[60px] overflow-hidden">
      <View className="flex-1 bg-black items-center justify-center">
        <Text
          className="text-white/20 text-[175px]"
          style={{ fontFamily: "Digital" }}
        >
          8.8.8.
        </Text>
        <Text
          className="absolute text-red-500 text-[175px]"
          style={{ fontFamily: "Digital" }}
        >
          8.3.0.
        </Text>
      </View>

      <View className="flex-[2] bg-[#7f7f7f] items-center justify-center">
        <View className="flex-row flex-wrap">
          {buttons.map((name, i) => (
            <Pressable
              key={i}
              className="w-1/2 h-44 items-center justify-center"
              onPress={() => console.log(name)}
            >
              <View
                className={`w-36 h-36 rounded-full items-center justify-center ${
                  name === "START / PAUSE"
                    ? "bg-green-600"
                    : name === "STOP / RESET"
                      ? "bg-red-600"
                      : "bg-black"
                }`}
              >
                <Text className="text-white text-center text-l">{name}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

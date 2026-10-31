import { useFonts } from "expo-font";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Digital: require("../../assets/fonts/digital-7 (italic).ttf"),
  });

  return (
    <View className="flex-1 border-[10px] border-red-500 rounded-[60px] overflow-hidden">
      <View className="flex-1 bg-black items-center justify-center">
        <Text
          className="text-white/20 text-[150px]"
          style={{ fontFamily: "Digital" }}
        >
          88:88
        </Text>

        <Text
          className="absolute text-red-500 text-[150px]"
          style={{ fontFamily: "Digital" }}
        >
          08:30
        </Text>
      </View>

      <View className="flex-[2] bg-[#7f7f7f] items-center justify-center">
        <View className="flex-row flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <Pressable
              key={i}
              className="w-1/2 h-36 items-center justify-center"
              onPress={() => console.log(i + 1)}
            >
              <View className="bg-green-500 w-24 h-24 rounded-full items-center justify-center">
                <Text className="text-white">{i + 1}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

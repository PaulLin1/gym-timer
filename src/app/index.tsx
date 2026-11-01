import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

type Mode = "roundTime" | "restTime" | "intBeep" | "rounds" | "runningRound" | "runningRest";

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

type ButtonAction = (typeof buttons)[number]["action"];

const displayTextStyle = { fontFamily: "Digital", lineHeight: 130 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function styleTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const secondsTen = Math.floor(seconds / 10);
  const secondsOne = seconds % 10;

  return `${minutes}.${secondsTen}.${secondsOne}.`;
}

function getButtonColor(action: ButtonAction) {
  switch (action) {
    case "start":
      return "bg-green-600";
    case "stop":
      return "bg-red-600";
    default:
      return "bg-black";
  }
}

export default function Index() {
  useFonts({
    Digital: require("../../assets/fonts/digital-7 (mono italic).ttf"),
  });

  const [time, setTime] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isRound, setIsRound] = useState(true);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const [roundTime, setRoundTime] = useState(60);
  const [restTime, setRestTime] = useState(90);
  const [intBeep, setIntBeep] = useState(60);
  const [rounds, setRounds] = useState(1);

  const [mode, setMode] = useState<Mode>();

  function adjustSetting(direction: 1 | -1) {
    switch (mode) {
      case "roundTime":
        setRoundTime((prev) => clamp(prev + direction * 60, 60, 9 * 60));
        break;
      case "restTime":
        setRestTime((prev) => clamp(prev + direction * 5, 0, 90));
        break;
      case "intBeep":
        setIntBeep((prev) => clamp(prev + direction * 5, 0, 60));
        break;
      case "rounds":
        setRounds((prev) => clamp(prev + direction, 1, 9));
        break;
    }
  }

  function handleButtonPress(action: ButtonAction) {
    switch (action) {
      case "roundTime":
      case "restTime":
      case "intBeep":
      case "rounds":
        setMode(action);
        break;
      case "up":
        adjustSetting(1);
        break;
      case "down":
        adjustSetting(-1);
        break;
      case "start":
        setTime(roundTime);
        setIsRunning(true);
        break;
      case "stop":
        setIsRunning(false);
        setTime(roundTime);
        break;
    }
  }

  return (
    <View className="flex-1 border-4 border-red-500 rounded-[60px] overflow-hidden">
      <View className="flex-1 bg-black items-center justify-center">
        <View>
          <Text
            numberOfLines={1}
            className="text-white/20 text-[125px]"
            style={displayTextStyle}
          >
            8.8.8
          </Text>

          <Text
            numberOfLines={1}
            className="absolute top-0 left-0 text-red-500 text-[125px]"
            style={displayTextStyle}
          >
            {(() => {
              let out;

              if (isRunning) {
                out = time;
              } else {
              switch (mode) {
                case "roundTime":
                  out = roundTime;
                  break;
                case "restTime":
                  out = restTime;
                  break;
                case "intBeep":
                  out = intBeep;
                  break;
                case "rounds":
                  out = rounds;
                  break;
                default:
                  out = 0;
              }
              }


              return styleTime(out);
            })()}
          </Text>
        </View>
      </View>

      <View className="flex-[2] bg-[#7f7f7f] items-center justify-center">
        <View className="flex-row flex-wrap">
          {buttons.map((button) => (
            <Pressable
              key={button.action}
              className="w-1/2 h-40 items-center justify-center"
              onPress={() => handleButtonPress(button.action)}
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
    </View>
  );
}

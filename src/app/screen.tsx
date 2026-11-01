
import { Text, View } from "react-native";
import type { Phase } from "./timer";

type Mode = "roundTime" | "restTime" | "intBeep" | "rounds";

type ScreenProps = {
  time: number;
  phase: Phase;
  mode: Mode | undefined;
  roundTime: number;
  restTime: number;
  intBeep: number;
  rounds: number;
  currentRound: number;
};

const displayTextStyle = {
  fontFamily: "Digital",
  lineHeight: 130,
};

function styleTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const secondsTen = Math.floor(seconds / 10);
  const secondsOne = seconds % 10;

  return `${minutes}.${secondsTen}.${secondsOne}.`;
}

export default function Screen({
  time,
  phase,
  mode,
  roundTime,
  restTime,
  intBeep,
  rounds,
  currentRound,
}: ScreenProps) {
  let out: number;

  // Display current timer while running or paused
  if (phase !== "ready" || mode === undefined) {
    out = time;
  } else {
    // Display selected setting
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
        out = time;
    }
  }

  const label =
    phase === "runningRound"
      ? `ROUND ${currentRound}`
      : phase === "runningRest"
        ? "REST"
        : phase === "finished"
          ? "FINISHED"
          : mode?.toUpperCase() ?? "READY";

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-2xl mb-4">{label}</Text>

      <View>
        <Text
          numberOfLines={1}
          className="text-white/20 text-[125px]"
          style={displayTextStyle}
        >
          8.8.8.
        </Text>

        <Text
          numberOfLines={1}
          className="absolute top-0 left-0 text-red-500 text-[125px]"
          style={displayTextStyle}
        >
          {styleTime(out)}
        </Text>
      </View>
    </View>
  );
}

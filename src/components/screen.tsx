import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Mode, Phase } from "./timer-logic";

type ScreenProps = {
  time: number;
  phase: Phase;
  mode: Mode | undefined;
  isRunning: boolean;
  roundTime: number;
  restTime: number;
  intBeep: number;
  rounds: number;
  currentRound: number;
};

const modeLabels: Record<Mode, string> = {
  roundTime: "round time",
  restTime: "rest time",
  intBeep: "interval beep",
  rounds: "rounds",
};

const LIGHT_FONT = Platform.select({ ios: "Avenir-Light", default: "sans-serif-light" });

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Screen({
  time,
  phase,
  mode,
  isRunning,
  roundTime,
  restTime,
  intBeep,
  rounds,
  currentRound,
}: ScreenProps) {
  let out = formatTime(time);

  // Show the selected setting until the timer starts
  if (phase === "ready" && mode !== undefined) {
    switch (mode) {
      case "roundTime":
        out = formatTime(roundTime);
        break;
      case "restTime":
        out = formatTime(restTime);
        break;
      case "intBeep":
        out = intBeep === 0 ? "OFF" : formatTime(intBeep);
        break;
      case "rounds":
        out = String(rounds);
        break;
    }
  }

  const insets = useSafeAreaInsets();

  const paused = !isRunning && (phase === "runningRound" || phase === "runningRest");

  const label = paused
    ? "paused"
    : phase === "runningRound"
      ? `round ${currentRound} of ${rounds}`
      : phase === "runningRest"
        ? "rest"
        : phase === "finished"
          ? "finished"
          : mode
            ? modeLabels[mode]
            : "ready";

  const marker = paused
    ? "#F5E900"
    : phase === "runningRound"
      ? "#00A9D6"
      : phase === "runningRest"
        ? "#E60083"
        : "#1F1D1E";

  return (
    <View className="flex-1 items-center justify-center" style={{ paddingTop: insets.top }}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          fontFamily: LIGHT_FONT,
          color: "#1F1D1E",
          fontSize: 124,
          fontVariant: ["tabular-nums"],
          paddingHorizontal: 24,
        }}
      >
        {out}
      </Text>

      <View className="flex-row items-center" style={{ gap: 10 }}>
        <View style={{ width: 12, height: 12, backgroundColor: marker }} />
        <Text
          style={{ fontFamily: LIGHT_FONT, color: "#1F1D1E", fontSize: 22, letterSpacing: 1 }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

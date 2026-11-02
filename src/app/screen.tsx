import { Text, View } from "react-native";
import type { Phase } from "./timer";

type Mode = "roundTime" | "restTime" | "intBeep" | "rounds";

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
    ? "#F1EB22"
    : phase === "runningRound"
      ? "#159FD0"
      : phase === "runningRest"
        ? "#D10B78"
        : "#171516";

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ fontFamily: "Silkscreen", color: "#171516", fontSize: 112 }}
      >
        {out}
      </Text>

      <View className="flex-row items-center" style={{ gap: 10, marginTop: 8 }}>
        <View style={{ width: 16, height: 16, backgroundColor: marker }} />
        <Text style={{ fontFamily: "BodoniModa", color: "#171516", fontSize: 28 }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

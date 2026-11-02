
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SevenSegment from "../components/seven-segment";
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
// Case border plus faceplate margin on each side
const WINDOW_INSET = 22;

function toDigits(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return [minutes, Math.floor(seconds / 10), seconds % 10];
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

  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const windowW = windowWidth - WINDOW_INSET * 2;
  const cellWidth = windowW / 3;
  const cellHeight = Math.min(cellWidth * 1.3, windowHeight * 0.18);

  const label =
    phase === "runningRound"
      ? `ROUND ${currentRound}`
      : phase === "runningRest"
        ? "REST"
        : phase === "finished"
          ? "FINISHED"
          : mode?.toUpperCase() ?? "READY";

  return (
    <View style={{ alignItems: "center", paddingTop: insets.top }}>
      <Text
        style={{
          fontFamily: "Anton",
          color: "#fff",
          fontSize: 34,
          lineHeight: 48,
          letterSpacing: 1,
        }}
      >
        TITLE
      </Text>

      {/* Display window: three smoked digit cells */}
      <View style={{ flexDirection: "row", width: windowW, backgroundColor: "#000" }}>
        {toDigits(out).map((digit, index) => (
          <View
            key={index}
            style={{
              width: cellWidth,
              height: cellHeight,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1f0305",
              borderLeftWidth: index === 0 ? 0 : 2,
              borderLeftColor: "#000",
            }}
          >
            <SevenSegment
              digit={digit}
              width={cellWidth - 4}
              height={cellHeight - 8}
            />
          </View>
        ))}
      </View>

      {/* CLASSIC wordmark, with the status where the real unit has small print */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: windowW,
          marginTop: 6,
        }}
      >
        <Text
          style={{ fontFamily: "AlfaSlabOne", color: "#fff", fontSize: 32, lineHeight: 42 }}
        >
          CLASSIC
        </Text>
        <Text numberOfLines={1} style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

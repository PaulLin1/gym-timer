import { Pressable, Text, View } from "react-native";
import { formatTime } from "./screen";
import type { Phase } from "./timer";

const INK = "#171516";
const PIXEL = "Silkscreen";
const SERIF = "BodoniModa";

type ControlsProps = {
  onButtonPress: (action: string) => void;
  mode: string | undefined;
  phase: Phase;
  isRunning: boolean;
  roundTime: number;
  restTime: number;
  intBeep: number;
  rounds: number;
};

export default function Controls({
  onButtonPress,
  mode,
  phase,
  isRunning,
  roundTime,
  restTime,
  intBeep,
  rounds,
}: ControlsProps) {
  const settings = [
    {
      name: "round",
      action: "roundTime",
      value: formatTime(roundTime),
      background: "#159FD0",
      color: INK,
    },
    {
      name: "rest",
      action: "restTime",
      value: formatTime(restTime),
      background: "#D10B78",
      color: "#FFFFFF",
    },
    {
      name: "interval",
      action: "intBeep",
      value: intBeep === 0 ? "OFF" : formatTime(intBeep),
      background: "#F1EB22",
      color: INK,
    },
    {
      name: "rounds",
      action: "rounds",
      value: String(rounds),
      background: INK,
      color: "#FFFFFF",
    },
  ];

  const startLabel = isRunning
    ? "PAUSE"
    : phase === "runningRound" || phase === "runningRest"
      ? "RESUME"
      : "START";

  return (
    <View>
      {/* Four solid colour blocks, edge to edge */}
      <View className="flex-row flex-wrap">
        {settings.map((setting) => {
          const selected = mode === setting.action;

          return (
            <Pressable
              key={setting.action}
              onPress={() => onButtonPress(setting.action)}
              style={{
                width: "50%",
                height: 112,
                padding: 14,
                justifyContent: "space-between",
                backgroundColor: setting.background,
                borderWidth: selected ? 5 : 0,
                borderColor: "#FFFFFF",
              }}
            >
              <Text style={{ fontFamily: SERIF, color: setting.color, fontSize: 22 }}>
                {setting.name}
              </Text>
              <Text style={{ fontFamily: PIXEL, color: setting.color, fontSize: 32 }}>
                {setting.value}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row" style={{ padding: 16, gap: 10 }}>
        {[
          { symbol: "-", action: "down", label: "Decrease" },
          { symbol: "+", action: "up", label: "Increase" },
        ].map((button) => (
          <Pressable
            key={button.action}
            accessibilityLabel={button.label}
            disabled={mode === undefined}
            onPress={() => onButtonPress(button.action)}
            style={{
              flex: 1,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: INK,
              opacity: mode === undefined ? 0.3 : 1,
            }}
          >
            <Text style={{ fontFamily: PIXEL, color: INK, fontSize: 30 }}>
              {button.symbol}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row" style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 10 }}>
        <Pressable
          onPress={() => onButtonPress("stop")}
          style={{
            flex: 1,
            height: 72,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: INK,
          }}
        >
          <Text style={{ fontFamily: SERIF, color: INK, fontSize: 24 }}>reset</Text>
        </Pressable>

        <Pressable
          onPress={() => onButtonPress("start")}
          style={{
            flex: 2,
            height: 72,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isRunning ? "#F1EB22" : INK,
          }}
        >
          <Text
            style={{
              fontFamily: PIXEL,
              color: isRunning ? INK : "#FFFFFF",
              fontSize: 28,
            }}
          >
            {startLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

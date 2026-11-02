import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatTime } from "./screen";
import { isActive, type Phase } from "./timer-logic";

const INK = "#1F1D1E";
const LIGHT_FONT = Platform.select({ ios: "Avenir-Light", default: "sans-serif-light" });

const STEP_HEIGHT = 76;
const ACTION_HEIGHT = 92;
const SETTING_HEIGHT = 116;
// The selection bar ends where the settings blocks begin
export const BAR_BOTTOM_OFFSET = SETTING_HEIGHT + STEP_HEIGHT + ACTION_HEIGHT;

export const SETTING_COLORS = {
  roundTime: "#00A9D6",
  restTime: "#F5E900",
  intBeep: "#E60083",
  rounds: "#303F88",
} as const;

type ControlsProps = {
  onButtonPress: (action: string) => void;
  phase: Phase;
  mode: string | undefined;
  isRunning: boolean;
  roundTime: number;
  restTime: number;
  intBeep: number;
  rounds: number;
};

export default function Controls({
  onButtonPress,
  phase,
  mode,
  isRunning,
  roundTime,
  restTime,
  intBeep,
  rounds,
}: ControlsProps) {
  const insets = useSafeAreaInsets();
  const locked = isActive(phase);
  const steppersOff = locked || mode === undefined;

  const settings = [
    {
      name: "round",
      action: "roundTime",
      value: formatTime(roundTime),
      background: SETTING_COLORS.roundTime,
      color: INK,
    },
    {
      name: "rest",
      action: "restTime",
      value: formatTime(restTime),
      background: SETTING_COLORS.restTime,
      color: INK,
    },
    {
      name: "interval",
      action: "intBeep",
      value: intBeep === 0 ? "off" : formatTime(intBeep),
      background: SETTING_COLORS.intBeep,
      color: "#FFFFFF",
    },
    {
      name: "rounds",
      action: "rounds",
      value: String(rounds),
      background: SETTING_COLORS.rounds,
      color: "#FFFFFF",
    },
  ];

  const startLabel = isRunning
    ? "pause"
    : phase === "runningRound" || phase === "runningRest"
      ? "resume"
      : "start";

  return (
    <View>
      {/* Horizontal band of settings */}
      <View className="flex-row">
        {settings.map((setting) => (
          <Pressable
            key={setting.action}
            disabled={locked}
            onPress={() => onButtonPress(setting.action)}
            style={{
              flex: 1,
              height: SETTING_HEIGHT,
              paddingHorizontal: 10,
              paddingVertical: 14,
              justifyContent: "space-between",
              backgroundColor: setting.background,
            }}
          >
            <Text style={{ fontFamily: LIGHT_FONT, color: setting.color, fontSize: 16 }}>
              {setting.name}
            </Text>
            <Text
              style={{
                fontFamily: LIGHT_FONT,
                color: setting.color,
                fontSize: 28,
                fontVariant: ["tabular-nums"],
              }}
            >
              {setting.value}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row">
        {[
          { symbol: "−", action: "down", label: "Decrease", background: "#EF9CB8" },
          { symbol: "+", action: "up", label: "Increase", background: "#9999BC" },
        ].map((button) => (
          <Pressable
            key={button.action}
            accessibilityLabel={button.label}
            disabled={steppersOff}
            onPress={() => onButtonPress(button.action)}
            style={{
              flex: 1,
              height: STEP_HEIGHT,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: button.background,
            }}
          >
            <Text
              style={{
                fontFamily: LIGHT_FONT,
                color: INK,
                fontSize: 36,
                opacity: steppersOff ? 0.35 : 1,
              }}
            >
              {button.symbol}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row">
        <Pressable
          onPress={() => onButtonPress("stop")}
          style={{
            flex: 1,
            height: ACTION_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#D04435",
          }}
        >
          <Text style={{ fontFamily: LIGHT_FONT, color: "#FFFFFF", fontSize: 22 }}>reset</Text>
        </Pressable>

        <Pressable
          onPress={() => onButtonPress("start")}
          style={{
            flex: 3,
            height: ACTION_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isRunning ? "#F5E900" : INK,
          }}
        >
          <Text
            style={{
              fontFamily: LIGHT_FONT,
              color: isRunning ? INK : "#FFFFFF",
              fontSize: 32,
              letterSpacing: 2,
            }}
          >
            {startLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

import { Pressable, Text, useWindowDimensions, View } from "react-native";

const buttons = [
  { lines: ["ROUND", "TIME"], action: "roundTime", color: "#0e0e0e" },
  { lines: ["REST", "TIME"], action: "restTime", color: "#0e0e0e" },
  { lines: ["INT", "BEEP"], action: "intBeep", color: "#0e0e0e" },
  { lines: ["ROUNDS"], action: "rounds", color: "#0e0e0e" },
  { lines: ["UP"], action: "up", color: "#0e0e0e" },
  { lines: ["DOWN"], action: "down", color: "#0e0e0e" },
  { lines: ["START", "PAUSE"], action: "start", color: "#1c8a46", divided: true },
  { lines: ["STOP", "RESET"], action: "stop", color: "#cf2f25", divided: true },
] as const;

type ControlsProps = {
  onButtonPress: (action: string) => void;
};

export default function Controls({ onButtonPress }: ControlsProps) {
  const { height: windowHeight } = useWindowDimensions();
  const buttonSize = Math.min(88, windowHeight * 0.1);

  return (
    <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 16 }}>
      {/* Recessed black bezel around the membrane panel */}
      <View
        style={{
          flex: 1,
          padding: 5,
          backgroundColor: "#000",
          borderWidth: 1,
          borderColor: "#262626",
          borderRadius: 4,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingTop: 12,
            backgroundColor: "#a9abab",
            borderRadius: 2,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{
              backgroundColor: "#141414",
              borderWidth: 1,
              borderColor: "#d0d0d0",
              paddingHorizontal: 12,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: "#d6d6d6", fontSize: 14, letterSpacing: 1.5 }}>
              DIGITAL TIMER
            </Text>
          </View>

          <View style={{ flex: 1, width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
            {buttons.map((button) => (
              <Pressable
                key={button.action}
                style={{
                  width: "50%",
                  height: "25%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => onButtonPress(button.action)}
              >
                <View
                  style={{
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: buttonSize / 2,
                    backgroundColor: button.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {button.lines.map((line, index) => (
                    <View key={line} style={{ alignItems: "center" }}>
                      {"divided" in button && index === 1 && (
                        <View
                          style={{
                            width: buttonSize * 0.72,
                            height: 1,
                            backgroundColor: "#d6d6d6",
                          }}
                        />
                      )}
                      <Text style={{ color: "#c9c9c9", fontSize: 15, lineHeight: 19 }}>
                        {line}
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            ))}
          </View>

          <Text
            style={{
              position: "absolute",
              bottom: 12,
              color: "#1a1a1a",
              fontSize: 15,
              fontWeight: "500",
            }}
          >
            CE
          </Text>
        </View>
      </View>
    </View>
  );
}

import { useAudioPlayer, type AudioPlayer } from "expo-audio";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Controls from "./controls";
import Screen from "./screen";

type Mode = "roundTime" | "restTime" | "intBeep" | "rounds";

export type Phase = "ready" | "runningRound" | "runningRest" | "finished";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// seekTo is async: playing before it finishes does nothing on a sound that already ended
function replay(player: AudioPlayer) {
  player.seekTo(0).then(() => player.play());
}

export default function Timer() {
  const [fontsLoaded, fontError] = useFonts({
    Anton: require("../../assets/fonts/Anton-Regular.ttf"),
    AlfaSlabOne: require("../../assets/fonts/AlfaSlabOne-Regular.ttf"),
  });

  // Timer state
  const [time, setTime] = useState(60);
  const [phase, setPhase] = useState<Phase>("ready");
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  // Timer settings
  const [roundTime, setRoundTime] = useState(60);
  const [restTime, setRestTime] = useState(90);
  const [intBeep, setIntBeep] = useState(60);
  const [rounds, setRounds] = useState(1);

  const [mode, setMode] = useState<Mode>();

  // Countdown
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Round start / end beep
  const roundBeep = useAudioPlayer(
    require("../../assets/sounds/round-beep.wav"),
  );

  // Handle round/rest transitions
  useEffect(() => {
    if (!isRunning || time !== 0) return;

    replay(roundBeep);

    if (phase === "runningRound") {
      if (currentRound >= rounds) {
        setPhase("finished");
        setIsRunning(false);
      } else {
        setPhase("runningRest");
        setTime(restTime);
      }
    } else if (phase === "runningRest") {
      setCurrentRound((prev) => prev + 1);
      setPhase("runningRound");
      setTime(roundTime);
    }
  }, [
    time,
    isRunning,
    phase,
    currentRound,
    rounds,
    roundTime,
    restTime,
    roundBeep,
  ]);

  // Interval beep
  const beep = useAudioPlayer(require("../../assets/sounds/beep.wav"));
  const lastBeepCheck = useRef(time);

  useEffect(() => {
    if (lastBeepCheck.current === time) return;
    lastBeepCheck.current = time;

    if (!isRunning || phase !== "runningRound" || intBeep === 0) return;

    const elapsed = roundTime - time;
    if (time > 0 && elapsed > 0 && elapsed % intBeep === 0) {
      replay(beep);
    }
  }, [time, isRunning, phase, intBeep, roundTime, beep]);

  // Adjust settings
  function adjustSetting(direction: 1 | -1) {
    switch (mode) {
      case "roundTime":
        setRoundTime((prev) => clamp(prev + direction * 60, 60, 9 * 60));
        break;
      case "restTime":
        setRestTime((prev) => clamp(prev + direction * 5, 10, 90));
        break;
      case "intBeep":
        setIntBeep((prev) => clamp(prev + direction * 5, 0, 60));
        break;
      case "rounds":
        setRounds((prev) => clamp(prev + direction, 1, 9));
        break;
    }
  }

  // Start / pause / resume
  function start() {
    if (phase === "ready" || phase === "finished") {
      replay(roundBeep);
      setCurrentRound(1);
      setTime(roundTime);
      setPhase("runningRound");
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  }

  // Stop / reset
  function stop() {
    setIsRunning(false);
    setPhase("ready");
    setCurrentRound(1);
    setTime(roundTime);
  }

  // Button handling
  function handleButtonPress(action: string) {
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
        start();
        break;
      case "stop":
        stop();
        break;
    }
  }

  // Text measured before the font loads keeps the wrong width and gets truncated
  if (!fontsLoaded && !fontError) return null;

  return (
    <View className="flex-1 border-[8px] border-[#d9402c] rounded-[60px] overflow-hidden bg-[#050505]">
      <StatusBar style="light" />
      <Screen
        time={time}
        phase={phase}
        mode={mode}
        roundTime={roundTime}
        restTime={restTime}
        intBeep={intBeep}
        rounds={rounds}
        currentRound={currentRound}
      />

      <Controls onButtonPress={handleButtonPress} />
    </View>
  );
}

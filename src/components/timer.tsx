import { setAudioModeAsync, useAudioPlayer, type AudioPlayer } from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";
import { useEffect, useReducer, useRef } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Controls, { BAR_BOTTOM_OFFSET, SETTING_COLORS } from "./controls";
import Screen from "./screen";
import { initialState, isActive, timerReducer } from "./timer-logic";

const KEEP_AWAKE_TAG = "gym-timer";
const SETTING_ORDER = ["roundTime", "restTime", "intBeep", "rounds"] as const;
const PLAYER_OPTIONS = { keepAudioSessionActive: true };

// seekTo is async: playing before it finishes does nothing on a sound that already ended
function replay(player: AudioPlayer) {
  player
    .seekTo(0)
    .then(() => player.play())
    .catch(() => {});
}

function playOnLoop(player: AudioPlayer) {
  player.loop = true;
  player.play();
}

// Plays the sound each time count goes up
function useBeepOnChange(player: AudioPlayer, count: number) {
  const lastCount = useRef(count);

  useEffect(() => {
    if (lastCount.current === count) return;
    lastCount.current = count;
    replay(player);
  }, [count, player]);
}

export default function Timer() {
  const insets = useSafeAreaInsets();
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const { phase, isRunning, mode } = state;

  useBeepOnChange(
    useAudioPlayer(require("../../assets/sounds/round-beep.wav"), PLAYER_OPTIONS),
    state.roundBeeps,
  );
  useBeepOnChange(
    useAudioPlayer(require("../../assets/sounds/beep.wav"), PLAYER_OPTIONS),
    state.intervalBeeps,
  );

  // A silent loop keeps the app running behind the lock screen so beeps still play
  const silence = useAudioPlayer(require("../../assets/sounds/silence.wav"), PLAYER_OPTIONS);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "mixWithOthers",
    }).catch(() => {});
  }, []);

  // Countdown from the real clock, so it stays right if the app is put to sleep
  const lastTick = useRef(0);
  const pausedRemainder = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    lastTick.current = Date.now() - pausedRemainder.current;
    pausedRemainder.current = 0;

    const advance = () => {
      const seconds = Math.floor((Date.now() - lastTick.current) / 1000);
      if (seconds < 1) return;

      lastTick.current += seconds * 1000;
      dispatch({ type: "tick", seconds });
    };

    const interval = setInterval(advance, 200);

    // JS timers can stop in the background; audio status updates keep arriving
    const statusUpdates = silence.addListener("playbackStatusUpdate", advance);
    playOnLoop(silence);
    // Android needs this for background playback to last beyond about 3 minutes
    if (Platform.OS === "android") {
      silence.setActiveForLockScreen(true, { title: "Gym timer running" });
    }

    return () => {
      clearInterval(interval);
      statusUpdates.remove();
      silence.pause();
      if (Platform.OS === "android") {
        silence.setActiveForLockScreen(false);
      }
    };
  }, [isRunning, silence]);

  // Keep the screen on through the whole workout, including pauses
  const workoutActive = isActive(phase);

  useEffect(() => {
    if (!workoutActive) return;

    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, [workoutActive]);

  function handleButtonPress(action: string) {
    // Resume partway through the second that was interrupted
    if (action === "start" && isRunning) {
      pausedRemainder.current = (Date.now() - lastTick.current) % 1000;
    } else if (action === "stop") {
      pausedRemainder.current = 0;
    }

    dispatch({ type: "press", action });
  }

  return (
    <View className="flex-1" style={{ backgroundColor: "#C8C4C4" }}>
      <StatusBar style="dark" />
      <Screen
        time={state.time}
        phase={phase}
        mode={mode}
        isRunning={isRunning}
        roundTime={state.roundTime}
        restTime={state.restTime}
        intBeep={state.intBeep}
        rounds={state.rounds}
        currentRound={state.currentRound}
      />

      <Controls
        onButtonPress={handleButtonPress}
        mode={mode}
        phase={phase}
        isRunning={isRunning}
        roundTime={state.roundTime}
        restTime={state.restTime}
        intBeep={state.intBeep}
        rounds={state.rounds}
      />

      {/* Selected setting: a band in its own colour, only until the timer starts */}
      {mode !== undefined && phase === "ready" && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            bottom: BAR_BOTTOM_OFFSET + insets.bottom,
            left: `${SETTING_ORDER.indexOf(mode) * 25}%`,
            width: "25%",
            backgroundColor: SETTING_COLORS[mode],
            opacity: 0.45,
          }}
        />
      )}
    </View>
  );
}

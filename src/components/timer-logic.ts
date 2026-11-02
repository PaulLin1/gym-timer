export type Mode = "roundTime" | "restTime" | "intBeep" | "rounds";

export type Phase = "ready" | "runningRound" | "runningRest" | "finished";

export type TimerState = {
  time: number;
  phase: Phase;
  isRunning: boolean;
  currentRound: number;
  roundTime: number;
  restTime: number;
  intBeep: number;
  rounds: number;
  mode: Mode | undefined;
  // Each increase means "play this sound once"
  roundBeeps: number;
  intervalBeeps: number;
};

export type TimerAction =
  | { type: "tick"; seconds: number }
  | { type: "press"; action: string };

export const initialState: TimerState = {
  time: 60,
  phase: "ready",
  isRunning: false,
  currentRound: 1,
  roundTime: 60,
  restTime: 90,
  intBeep: 30,
  rounds: 1,
  mode: undefined,
  roundBeeps: 0,
  intervalBeeps: 0,
};

// A gap longer than this means the app was asleep: catch up silently
const MAX_AUDIBLE_CATCH_UP = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function isActive(phase: Phase) {
  return phase === "runningRound" || phase === "runningRest";
}

function stepOneSecond(state: TimerState): TimerState {
  const time = state.time - 1;

  if (time > 0) {
    const elapsed = state.roundTime - time;
    const intervalDue =
      state.phase === "runningRound" &&
      state.intBeep > 0 &&
      elapsed % state.intBeep === 0;

    return {
      ...state,
      time,
      intervalBeeps: state.intervalBeeps + (intervalDue ? 1 : 0),
    };
  }

  const roundBeeps = state.roundBeeps + 1;

  if (state.phase === "runningRest") {
    return {
      ...state,
      roundBeeps,
      phase: "runningRound",
      currentRound: state.currentRound + 1,
      time: state.roundTime,
    };
  }

  if (state.currentRound >= state.rounds) {
    return { ...state, roundBeeps, phase: "finished", isRunning: false, time: 0 };
  }

  return { ...state, roundBeeps, phase: "runningRest", time: state.restTime };
}

function tick(state: TimerState, seconds: number): TimerState {
  let next = state;

  for (let i = 0; i < seconds && next.isRunning; i++) {
    next = stepOneSecond(next);
  }

  return seconds > MAX_AUDIBLE_CATCH_UP
    ? { ...next, roundBeeps: state.roundBeeps, intervalBeeps: state.intervalBeeps }
    : next;
}

function reset(state: TimerState): TimerState {
  return {
    ...state,
    isRunning: false,
    phase: "ready",
    currentRound: 1,
    time: state.roundTime,
  };
}

function adjust(state: TimerState, direction: 1 | -1): TimerState {
  switch (state.mode) {
    case "roundTime": {
      const roundTime = clamp(state.roundTime + direction * 60, 60, 9 * 60);
      return { ...state, roundTime, time: roundTime };
    }
    case "restTime":
      return { ...state, restTime: clamp(state.restTime + direction * 5, 10, 90) };
    case "intBeep":
      return { ...state, intBeep: clamp(state.intBeep + direction * 5, 0, 60) };
    case "rounds":
      return { ...state, rounds: clamp(state.rounds + direction, 1, 9) };
    default:
      return state;
  }
}

function press(state: TimerState, action: string): TimerState {
  switch (action) {
    case "start":
      if (isActive(state.phase)) {
        return { ...state, isRunning: !state.isRunning };
      }
      return {
        ...state,
        phase: "runningRound",
        isRunning: true,
        currentRound: 1,
        time: state.roundTime,
        roundBeeps: state.roundBeeps + 1,
      };
    case "stop":
      return reset(state);
  }

  // Settings are locked during a workout; the finished screen returns to ready
  if (isActive(state.phase)) return state;
  const ready = state.phase === "finished" ? reset(state) : state;

  switch (action) {
    case "roundTime":
    case "restTime":
    case "intBeep":
    case "rounds":
      return { ...ready, mode: action };
    case "up":
      return adjust(ready, 1);
    case "down":
      return adjust(ready, -1);
    default:
      return state;
  }
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  return action.type === "tick"
    ? tick(state, action.seconds)
    : press(state, action.action);
}

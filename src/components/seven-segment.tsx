import { View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";

const VIEW_WIDTH = 120;
const VIEW_HEIGHT = 150;

const LEFT = 10;
const RIGHT = 90;
const TOP = 8;
const MIDDLE = 75;
const BOTTOM = 142;
const THICKNESS = 14;
const GAP = 2.5;
const SLANT = 0.09;

const LIT = "#ff2418";
const UNLIT = "#3d060a";

type Point = [number, number];

// Leans the digit to the right around its vertical centre
function toPoints(points: Point[]) {
  return points.map(([x, y]) => `${x + (MIDDLE - y) * SLANT},${y}`).join(" ");
}

function vertical(x: number, top: number, bottom: number, inward: 1 | -1): Point[] {
  const inner = x + inward * THICKNESS;
  return [
    [x, top + GAP],
    [inner, top + THICKNESS + GAP],
    [inner, bottom - THICKNESS / 2 - GAP],
    [x, bottom - GAP],
  ];
}

const half = THICKNESS / 2;

const SEGMENTS: Record<string, string> = {
  a: toPoints([
    [LEFT + GAP, TOP],
    [RIGHT - GAP, TOP],
    [RIGHT - THICKNESS - GAP, TOP + THICKNESS],
    [LEFT + THICKNESS + GAP, TOP + THICKNESS],
  ]),
  b: toPoints(vertical(RIGHT, TOP, MIDDLE, -1)),
  c: toPoints([
    [RIGHT, MIDDLE + GAP],
    [RIGHT - THICKNESS, MIDDLE + half + GAP],
    [RIGHT - THICKNESS, BOTTOM - THICKNESS - GAP],
    [RIGHT, BOTTOM - GAP],
  ]),
  d: toPoints([
    [LEFT + GAP, BOTTOM],
    [RIGHT - GAP, BOTTOM],
    [RIGHT - THICKNESS - GAP, BOTTOM - THICKNESS],
    [LEFT + THICKNESS + GAP, BOTTOM - THICKNESS],
  ]),
  e: toPoints([
    [LEFT, MIDDLE + GAP],
    [LEFT + THICKNESS, MIDDLE + half + GAP],
    [LEFT + THICKNESS, BOTTOM - THICKNESS - GAP],
    [LEFT, BOTTOM - GAP],
  ]),
  f: toPoints(vertical(LEFT, TOP, MIDDLE, 1)),
  g: toPoints([
    [LEFT + GAP, MIDDLE],
    [LEFT + THICKNESS + GAP, MIDDLE - half],
    [RIGHT - THICKNESS - GAP, MIDDLE - half],
    [RIGHT - GAP, MIDDLE],
    [RIGHT - THICKNESS - GAP, MIDDLE + half],
    [LEFT + THICKNESS + GAP, MIDDLE + half],
  ]),
};

const DIGIT_SEGMENTS = [
  "abcdef",
  "bc",
  "abdeg",
  "abcdg",
  "bcfg",
  "acdfg",
  "acdefg",
  "abc",
  "abcdefg",
  "abcdfg",
];

const DOT = { cx: 106, cy: 136, r: 6.5 };

function DigitLayer({
  segments,
  color,
  width,
  height,
}: {
  segments: string;
  color: string;
  width: number;
  height: number;
}) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}>
      {segments.split("").map((segment) => (
        <Polygon key={segment} points={SEGMENTS[segment]} fill={color} />
      ))}
      <Circle {...DOT} fill={color} />
    </Svg>
  );
}

export default function SevenSegment({
  digit,
  width,
  height,
}: {
  digit: number;
  width: number;
  height: number;
}) {
  return (
    <View style={{ width, height }}>
      <DigitLayer segments="abcdefg" color={UNLIT} width={width} height={height} />
      <View
        style={{
          position: "absolute",
          shadowColor: LIT,
          shadowOpacity: 0.8,
          shadowRadius: 7,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <DigitLayer
          segments={DIGIT_SEGMENTS[digit]}
          color={LIT}
          width={width}
          height={height}
        />
      </View>
    </View>
  );
}

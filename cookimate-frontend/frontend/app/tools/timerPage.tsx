import { View, Text } from 'react-native';
import { useState, useRef } from 'react';

export default function TimerPage() {
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [timeText, setTimeText] = useState("00:00:00");

  const stopRef = useRef(null);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return(
    <View>
      <Text></Text>
    </View>
  );

}
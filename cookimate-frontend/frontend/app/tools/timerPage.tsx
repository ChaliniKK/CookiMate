import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import DropDownPicker from 'react-native-dropdown-picker';

export default function TimerPage() {
  const [running, setRunning] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [timeText, setTimeText] = useState<string>("00:00:00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const alarms = [
    {name: "🛎️  Classic", file: require('../../assets/sounds/classic.mp3')},
    {name: "🔊  Beep", file: require('../../assets/sounds/beep.mp3')},
    {name: "⏰  Chime", file: require('../../assets/sounds/chime.mp3')},
    {name: "📳  Buzz", file: require('../../assets/sounds/buzz.mp3')},
    {name: "🎵  Melody", file: require('../../assets/sounds/melody.mp3')},
    {name: "🎹  Tune", file: require('../../assets/sounds/tune.mp3')},
  ];

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState(
    alarms.map((alarm, index) => ({
      label: alarm.name,
      value: index.toString(),
    }))
  );


const [selectedAlarmValue, setSelectedAlarmValue] = useState<string | null>(null);

const selectedAlarm = selectedAlarmValue !== null
  ? alarms[parseInt(selectedAlarmValue)]
  : null;

  const alarmPlayer = useAudioPlayer(selectedAlarm ? selectedAlarm.file : null);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const parseTimeText = () => {
    const parts = timeText.split(":");
    if (parts.length !== 3) return 0;
    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    const s = parseInt(parts[2]) || 0;
    return h * 3600 + m * 60 + s;
  };

  const startTimer = (): void => {
    if (running) return;
    const totalSeconds = parseTimeText();
    if (totalSeconds <= 0) return;
    setSecondsLeft(totalSeconds);
    setRunning(true);
    setEditMode(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev: number) => {
        if (prev <= 1) {
          if (intervalRef.current != null) clearInterval(intervalRef.current);
          setRunning(false);
          setTimeText("00:00:00");
          playAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (running) setTimeText(formatTime(secondsLeft));
  }, [secondsLeft, running]);

  const stopTimer = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopAlarm();
    setRunning(false);
  };

  const resetTimer = (): void => {
    stopTimer();
    setSecondsLeft(0);
    setTimeText("00:00:00");
  };

  const playAlarm = () => {
    alarmPlayer.seekTo(0);
    alarmPlayer.play();
  };

  const stopAlarm = () => {
    alarmPlayer.pause();
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.timerLabelContainer}>
          <Text style={styles.timerLabel}>hr</Text>
          <Text style={styles.timerLabel}>min</Text>
          <Text style={styles.timerLabel}>sec</Text>
        </View>

        {editMode ? (
          <TextInput
            style={styles.timerInput}
            value={timeText}
            onChangeText={setTimeText}
            placeholder='HH:MM:SS'
            autoFocus
            onBlur={() => setEditMode(false)}
          />
        ) : (
          <Text style={styles.timerInput} onPress={() => !running && setEditMode(true)}>
            {timeText}
          </Text>
        )}

        <View style={{ marginTop: 20, zIndex: 1000 }}>
          <DropDownPicker
            open={open}
            value={selectedAlarmValue}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedAlarmValue}
            setItems={setItems}
            schema={{
              label: 'label',
              value: 'value'
            }}
            placeholder="🔔 Alarm sounds"
            placeholderStyle={{
              textAlign: 'center',
            }}
            labelStyle={{
              textAlign: 'center',
            }}
            containerStyle={styles.dropDownContainer} 
            style={styles.dropDown}
            dropDownContainerStyle={styles.dropDownList}

          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={startTimer}>
            <Text style={styles.btn}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={stopTimer}>
            <Text style={styles.btn}>Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetTimer}>
            <Text style={styles.btn}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignSelf: "center", 
    padding: 30 
  },

  subContainer: { 
    backgroundColor: "#E0C2A0", 
    paddingVertical: 100, 
    paddingHorizontal: 30, 
    borderRadius: 20 
  },

  timerLabelContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 30 
  },

  timerLabel: { 
    fontSize: 18, 
    paddingLeft: 8 
  },

  buttons: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 40 
  },

  btn: { 
    borderWidth: 1, 
    padding: 12, 
    marginLeft: 10, 
    borderRadius: 5, 
    fontWeight: "bold", 
    textTransform: "uppercase",
    backgroundColor: '#F2ECE2' 
  },

  timerInput: { 
    textAlign: "center", 
    fontSize: 50 
  },

  dropDownContainer: {
    width: 180,         
    alignSelf: 'center', 
  },

  dropDown: {
    backgroundColor: '#F2ECE2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center', 
  },

  dropDownList: {
    backgroundColor: '#F2ECE2',
    borderRadius: 10,
    borderColor: '#000',
  }
});

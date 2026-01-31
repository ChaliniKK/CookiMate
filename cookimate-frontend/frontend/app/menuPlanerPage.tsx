import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Calendar } from 'react-native-calendars';



const Page = () => {
  return (
    <View>
      <Calendar
        theme={calendarStyles}
        onDayPress={(day) => {
          alert("let's plan a meal suckerzzzzz"); 
        }}
      />
    </View>
  );
};

export const calendarStyles = {
    calendarBackground: '#f2ece2',
    dayTextColor: 'black',
    monthTextColor: 'black',
    textSectionTitleColor: 'black',
    todayBackgroundColor: '#cfac8c',
    todayTextColor: 'white',
    arrowColor: '#553232',
}

export default Page;
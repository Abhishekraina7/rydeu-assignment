import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import moment from 'moment';
import MonthView from './MonthView';

const CustomCalendar = () => {
    const today = moment();
    const months = [];

    for (let i = 0; i < 6; i++) {
        months.push(today.clone().add(i, 'months'));
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {months.map((month, index) => (
                <MonthView key={index} month={month} />
            ))}
        </ScrollView>
    );
};

export default CustomCalendar;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
    },
});

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setSelectedTime } from '../features/calendar/calendarSlice';

const generateTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const formatted =
                `${hour.toString().padStart(2, '0')}:` +
                `${min.toString().padStart(2, '0')}`;
            times.push(formatted);
        }
    }
    return times;
};

const TimePicker = () => {
    const dispatch = useAppDispatch();
    const { selectedTime } = useAppSelector((state) => state.calendar);

    const times = generateTimes();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Time</Text>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={times}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                    const isSelected = selectedTime === item;

                    return (
                        <TouchableOpacity
                            style={[
                                styles.timeItem,
                                isSelected && styles.selectedTime,
                            ]}
                            onPress={() => dispatch(setSelectedTime(item))}
                        >
                            <Text
                                style={[
                                    styles.timeText,
                                    isSelected && styles.selectedText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

export default TimePicker;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    timeItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
    },
    selectedTime: {
        backgroundColor: '#2E86DE',
        borderColor: '#2E86DE',
    },
    timeText: {
        fontSize: 14,
    },
    selectedText: {
        color: '#fff',
        fontWeight: '600',
    },
});

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import moment, { Moment } from 'moment';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setSelectedDate } from '../features/calendar/calendarSlice';

interface Props {
    month: Moment;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthView: React.FC<Props> = ({ month }) => {
    const dispatch = useAppDispatch();
    const { selectedDate } = useAppSelector(
        (state) => state.calendar
    );

    const today = moment().format('YYYY-MM-DD');

    const startOfMonth = month.clone().startOf('month');
    const endOfMonth = month.clone().endOf('month');

    const days = [];

    // Add empty slots before first weekday
    const startWeekday = startOfMonth.day();
    for (let i = 0; i < startWeekday; i++) {
        days.push(null);
    }

    let day = startOfMonth.clone();

    while (day.isSameOrBefore(endOfMonth)) {
        days.push(day.clone());
        day.add(1, 'day');
    }

    return (
        <View style={styles.card}>
            <Text style={styles.monthTitle}>
                {month.format('MMMM YYYY')}
            </Text>

            <View style={styles.weekHeader}>
                {WEEK_DAYS.map((day) => (
                    <Text key={day} style={styles.weekDay}>
                        {day}
                    </Text>
                ))}
            </View>

            <View style={styles.grid}>
                {days.map((d, index) => {
                    if (!d) {
                        return <View key={index} style={styles.emptyDay} />;
                    }

                    const formatted = d.format('YYYY-MM-DD');
                    const isSelected = selectedDate === formatted;
                    const isToday = formatted === today;

                    return (
                        <TouchableOpacity
                            key={formatted}
                            style={[
                                styles.day,
                                isSelected && styles.selectedDay,
                                isToday && styles.todayDay,
                            ]}
                            onPress={() =>
                                dispatch(setSelectedDate(formatted))
                            }
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    isSelected && styles.selectedText,
                                ]}
                            >
                                {d.format('D')}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default MonthView;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        elevation: 3,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    weekHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDay: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
        color: '#666',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    emptyDay: {
        width: '14.28%',
        height: 40,
    },
    day: {
        width: '14.28%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    selectedDay: {
        backgroundColor: '#2E86DE',
    },
    todayDay: {
        borderWidth: 1,
        borderColor: '#2E86DE',
    },
    dayText: {
        fontSize: 14,
    },
    selectedText: {
        color: '#fff',
        fontWeight: '600',
    },
});

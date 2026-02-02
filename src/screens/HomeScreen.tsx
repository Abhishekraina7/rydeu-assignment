import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Modal,
    Platform,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setSelectedDate, setSelectedTime } from '../features/calendar/calendarSlice';
import { logout } from '../features/auth/authSlice';
import moment from 'moment';

// Icon components (replace with your preferred icon library like react-native-vector-icons)
const UserIcon = () => (
    <View style={styles.userIconPlaceholder}>
        <Text style={styles.userIconText}>👤</Text>
    </View>
);

const LogoutIcon = () => (
    <Text style={styles.logoutIcon}>↪</Text>
);

const CalendarIcon = () => (
    <View style={styles.calendarIconContainer}>
        <Text style={styles.calendarIconText}>🗓️</Text>
    </View>
);

interface DateItem {
    day: string;
    date: number;
    fullDate: Date;
}

interface TimeSlot {
    id: string;
    time: string;
}

interface CalendarOverlayProps {
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: Date) => void;
    selectedDate: Date | null;
}

const CalendarOverlay = ({ visible, onClose, onSelectDate, selectedDate }: CalendarOverlayProps) => {
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    const months = [];
    let currentDate = new Date(today);
    currentDate.setDate(1); // Start from the first day of the current month

    // Generate 6 months of calendar data
    while (currentDate <= sixMonthsLater) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // Get days from previous month to fill the first week
        const prevMonthDays = [];
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            prevMonthDays.push({
                day: daysInPrevMonth - i,
                month: prevMonth,
                year: prevMonthYear,
                isCurrentMonth: false,
                date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i)
            });
        }

        // Get days of current month
        const currentMonthDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            currentMonthDays.push({
                day,
                month,
                year,
                isCurrentMonth: true,
                date: new Date(year, month, day)
            });
        }

        // Get days from next month to complete the last week
        const nextMonthDays = [];
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextMonthYear = month === 11 ? year + 1 : year;
        const daysToAdd = 42 - (prevMonthDays.length + daysInMonth); // 6 rows * 7 days

        for (let day = 1; day <= daysToAdd; day++) {
            nextMonthDays.push({
                day,
                month: nextMonth,
                year: nextMonthYear,
                isCurrentMonth: false,
                date: new Date(nextMonthYear, nextMonth, day)
            });
        }

        const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

        months.push({
            year,
            month,
            monthName: currentDate.toLocaleString('default', { month: 'long' }),
            days: allDays
        });

        // Move to first day of next month
        currentDate.setMonth(month + 1);
    }

    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isToday = (date) => {
        const today = new Date();
        return isSameDay(date, today);
    };

    const handleDayPress = (day) => {
        if (day.isCurrentMonth) {
            onSelectDate(day.date);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.overlayContent}>
                    <View style={styles.overlayHeader}>
                        <Text style={styles.overlayTitle}>Select a Date</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {months.map(({ year, month, monthName, days }) => (
                            <View key={`${year}-${month}`} style={styles.monthContainer}>
                                <Text style={styles.monthTitle}>{monthName} {year}</Text>
                                <View style={styles.weekDaysContainer}>
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                        <Text key={index} style={styles.weekDay}>
                                            {day}
                                        </Text>
                                    ))}
                                </View>
                                <View style={styles.daysContainer}>
                                    {days.map((day, index) => {
                                        const isSelected = selectedDate && isSameDay(day.date, selectedDate);
                                        const isDayToday = isToday(day.date);

                                        return (
                                            <TouchableOpacity
                                                key={`${year}-${month}-${day.day}-${index}`}
                                                style={[
                                                    styles.dayButton,
                                                    !day.isCurrentMonth && styles.otherMonthDay,
                                                    isDayToday && styles.todayButton,
                                                    isSelected && styles.selectedDayButton,
                                                ]}
                                                onPress={() => handleDayPress(day)}
                                                disabled={!day.isCurrentMonth}
                                            >
                                                <Text
                                                    style={[
                                                        styles.dayText,
                                                        !day.isCurrentMonth && styles.otherMonthText,
                                                        isSelected && styles.selectedDayText,
                                                        isDayToday && styles.todayText,
                                                    ]}
                                                >
                                                    {day.day}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={onClose}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const HomeScreen: React.FC = () => {
    const dispatch = useAppDispatch();

    const { selectedDate, selectedTime } = useAppSelector(
        (state) => state.calendar);

    const { user } = useAppSelector((state) => state.auth);


    const dates: DateItem[] = Array.from({ length: 5 }).map((_, index) => {
        const date = moment().add(index, 'days');
        return {
            day: date.format('ddd').toUpperCase(),
            date: date.date(),
            fullDate: date.toDate(),
        };
    });


    const timeSlots: TimeSlot[] = [
        { id: '1', time: '09:00 AM' },
        { id: '2', time: '10:30 AM' },
        { id: '3', time: '12:00 PM' },
        { id: '4', time: '02:30 PM' },
    ];

    const formatSelectedDate = (): string => {
        if (!selectedDate || !selectedTime) return 'Select date & time';

        return `${moment(selectedDate).format('MMM D, YYYY')} • ${selectedTime}`;
    };



    const handleConfirm = () => {
        // Handle confirmation logic
        console.log('Confirmed:', formatSelectedDate());
    };

    const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);
    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

    const handleDateSelect = (date: Date) => {
        setTempSelectedDate(date);
        dispatch(setSelectedDate(date.toISOString()));
    };

    const calendarHeader = (
        <View style={styles.calendarHeader}>
            <Text style={styles.monthText}>
                {moment(selectedDate).format('MMMM YYYY')}
            </Text>
            <TouchableOpacity onPress={() => setShowCalendarOverlay(true)}>
                <Text style={styles.viewCalendarText}>View Calendar</Text>
            </TouchableOpacity>
        </View>
    );

    const handleDateCardPress = (date: Date) => {
        setTempSelectedDate(date);
        dispatch(setSelectedDate(date.toISOString()));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <UserIcon />
                    </View>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.userName}>
                            Hello, {user?.name ?? 'User'}
                        </Text>

                    </View>
                </View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => dispatch(logout())}>
                    <LogoutIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Book Your Exploration */}
                <Text style={styles.sectionTitle}>Choose Day and Time</Text>

                {calendarHeader}

                {/* Date Picker */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.datePickerContainer}
                >
                    {dates.map((item) => (
                        <TouchableOpacity
                            key={item.date.toString()}
                            style={[
                                styles.dateCard,
                                selectedDate && moment(selectedDate).isSame(item.fullDate, 'day') && styles.dateCardSelected,
                            ]}
                            onPress={() => handleDateCardPress(item.fullDate)}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    selectedDate && moment(selectedDate).isSame(item.fullDate, 'day') && styles.dayTextSelected,
                                ]}
                            >
                                {item.day}
                            </Text>
                            <Text
                                style={[
                                    styles.dateText,
                                    selectedDate && moment(selectedDate).isSame(item.fullDate, 'day') && styles.dateTextSelected,
                                ]}
                            >
                                {item.date}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Select Pickup Time */}
                <Text style={styles.pickupTimeTitle}>Select Pickup Time</Text>

                {/* Time Slots */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.timeSlotsContainer}
                >
                    {timeSlots.map((slot) => (
                        <TouchableOpacity
                            key={slot.id}
                            style={[
                                styles.timeSlot,
                                selectedTime === slot.time && styles.timeSlotSelected,
                            ]}
                            onPress={() => dispatch(setSelectedTime(slot.time))}
                        >
                            <Text
                                style={[
                                    styles.timeSlotText,
                                    selectedTime === slot.time && styles.timeSlotTextSelected,
                                ]}
                            >
                                {slot.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ScrollView>

            {/* Bottom Selection Card */}
            <View style={styles.selectionCard}>
                <View style={styles.selectionContent}>
                    <CalendarIcon />
                    <View style={styles.selectionTextContainer}>
                        <Text style={styles.selectionLabel}>YOUR SELECTION</Text>
                        <Text style={styles.selectionValue}>
                            {selectedDate
                                ? `${moment(selectedDate).format('MMM D, YYYY')}${selectedTime ? ` • ${selectedTime}` : ''}`
                                : 'Select date & time'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        (!selectedDate || !selectedTime) && { opacity: 0.5 },
                    ]}
                    onPress={handleConfirm}
                    disabled={!selectedDate || !selectedTime}
                >

                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>

            {/* Calendar Overlay */}
            <CalendarOverlay
                visible={showCalendarOverlay}
                onClose={() => setShowCalendarOverlay(false)}
                onSelectDate={handleDateSelect}
                selectedDate={tempSelectedDate || (selectedDate ? new Date(selectedDate) : null)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF0E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userIconPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userIconText: {
        fontSize: 20,
    },
    greetingContainer: {
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutIcon: {
        fontSize: 20,
        color: '#1A1A1A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 100, // Add padding at the bottom to prevent content from being hidden behind the confirm button
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 24,
        marginBottom: 20,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    viewCalendarText: {
        fontSize: 14,
        color: '#E07B39',
        fontWeight: '500',
    },
    datePickerContainer: {
        paddingVertical: 8,
        gap: 12,
    },
    dateCard: {
        width: 72,
        height: 88,
        borderRadius: 20,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dateCardSelected: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    dayText: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
        marginBottom: 8,
    },
    dayTextSelected: {
        color: '#666666',
    },
    dateText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    dateTextSelected: {
        color: '#1A1A1A',
    },
    pickupTimeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginTop: 32,
        marginBottom: 16,
    },
    timeSlotsContainer: {
        paddingVertical: 8,
        gap: 12,
    },
    timeSlot: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginRight: 12,
    },
    timeSlotSelected: {
        borderColor: '#1A1A1A',
        borderWidth: 2,
    },
    timeSlotText: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    timeSlotTextSelected: {
        color: '#1A1A1A',
        fontWeight: '600',
    },
    selectionCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    },
    selectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    calendarIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF0E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    calendarIconText: {
        fontSize: 16,
    },
    selectionTextContainer: {
        justifyContent: 'center',
    },
    selectionLabel: {
        fontSize: 11,
        color: '#666666',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    selectionValue: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginLeft: 12,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    overlayContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '90%',
    },
    overlayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    overlayTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    closeButton: {
        fontSize: 24,
        color: '#666666',
        padding: 8,
    },
    monthContainer: {
        marginBottom: 24,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    weekDay: {
        width: 40,
        textAlign: 'center',
        color: '#999999',
        fontSize: 12,
        fontWeight: '500',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayButton: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 4,
    },
    otherMonthDayText: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    otherMonthDay: {
        opacity: 0.3,
    },
    otherMonthText: {
        color: '#999999',
    },
    todayButton: {
        backgroundColor: '#FFF0E6',
    },
    todayText: {
        color: '#F28C52',
        fontWeight: '600',
    },
    selectedDayButton: {
        backgroundColor: '#F28C52',
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    doneButton: {
        backgroundColor: '#F28C52',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeScreen;

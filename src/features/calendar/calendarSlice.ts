import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
    selectedDate: string | null;
    selectedTime: string | null;
}

const initialState: CalendarState = {
    selectedDate: null,
    selectedTime: null,
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setSelectedTime: (state, action: PayloadAction<string>) => {
            state.selectedTime = action.payload;
        },
    },
});

export const { setSelectedDate, setSelectedTime } =
    calendarSlice.actions;

export default calendarSlice.reducer;

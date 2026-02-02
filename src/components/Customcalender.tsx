import React, { useRef, useEffect } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import moment from 'moment';
import MonthView from './MonthView';

const { width } = Dimensions.get('window');

const CustomCalendar = () => {
    const today = moment();
    const flatListRef = useRef<FlatList>(null);

    const months = [];

    for (let i = 0; i < 6; i++) {
        months.push(today.clone().add(i, 'months'));
    }

    useEffect(() => {
        flatListRef.current?.scrollToIndex({ index: 0 });
    }, []);

    return (
        <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={months}
            keyExtractor={(item) => item.format('YYYY-MM')}
            renderItem={({ item }) => (
                <View style={{ width }}>
                    <MonthView month={item} />
                </View>
            )}
        />
    );
};

export default CustomCalendar;

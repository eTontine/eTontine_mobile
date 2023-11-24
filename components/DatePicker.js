import React, { useEffect, useState } from 'react';
import {StyleSheet, View,Pressable,Text, ScrollView} from 'react-native';
import CalendarPicker from "react-native-calendar-picker";
import { useCustomDate } from '../hooks/useCustomDate';
import { formatDate, getDate } from '../utils/date';
import {appTheme} from "../constants";
import {Block} from "galio-framework";

const CUSTOM = "custom"
const END_DATE = "END_DATE"


const fromDateToDate = (dateString) => {
    return formatDate(getDate(dateString))
}

const ReadyToUseDate = ({name, active, onPress}) => {
    const style  = active ? styles.active : styles.inactive

    return (
        <Pressable style={style} onPress={onPress}>
            <Text className="text-md capitalize font-semibold text-center" style={{color: active ? appTheme.COLORS.WHITE : appTheme.COLORS.SECONDARY}}>{name}</Text>
        </Pressable>
    )
}


export const DatePicker = ({id,startDate, endDate, onDateChange}) => {

    const [visible, setVisible] = useState(false)
    const [label, setLabel] = useState(id)
    const [start, setStart] = useState(startDate)
    const [end, setEnd] = useState(endDate)

    const {CUSTOM_DATES} = useCustomDate()

    useEffect(() => {
        if(label == CUSTOM){
            setVisible(true)
        }
    }, [label])

    const handleDateChange = (date,type) => {
        if(type == END_DATE){
            setEnd(date)
        }else{
            setStart(date) 
            setEnd(null)
        }

        if(start && date && type == END_DATE){
            onDateChange({startDate: fromDateToDate(start), endDate: fromDateToDate(date)},label)
        }

    }

    const handleReadyToUseDatePress = (index) => {
        
        let dateStart = CUSTOM_DATES[index].startDate
        let dateEnd = CUSTOM_DATES[index].endDate

        if(index && index != label){
            setVisible(false)
            setLabel(index)
            setStart(dateStart)
            setEnd(dateEnd) 
            onDateChange({startDate: formatDate(dateStart), endDate: formatDate(dateEnd)},index)
        }

        if(index && index == label){
            setVisible(false)
            setLabel('')
            setStart('')
            setEnd('') 
            onDateChange({startDate: '', endDate: ''})
        }
    }

    const handleCustomPress = () => {
        if(label == CUSTOM){
            setVisible(false)
            setLabel('')
            setStart('')
            setEnd('') 
            onDateChange({startDate: '', endDate: ''})
        }else{
            setLabel(CUSTOM)
        }
    }

    return (
        <>
            <CalendarPicker
                previousTitle={("préc")}
                nextTitle={("suiv")}
                selectYearTitle={("Année")}
                startFromMonday={true}
                initialDate={new Date()}
                selectedYear={true}
                allowRangeSelection={false}
                todayBackgroundColor={appTheme.COLORS.PRIMARY}
                selectedYearColor={appTheme.COLORS.PRIMARY}
                selectedYearTextColor="#FFFFFF"
                enableDateChange={false}
                onDateChange={handleDateChange}
                previousTitleStyle={{fontSize: 15, fontWeight: "bold"}}
                nextTitleStyle={{fontSize: 15, fontWeight: "bold"}}
                minDate={new Date(1900, 0, 0)}
                maxDate={new Date(3000, 0, 0)}
            />
               
        </>
    );
}




const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:'center',
        borderRadius: 20,
        padding:10,
        marginVertical:6,
        paddingHorizontal:10,
        paddingVertical:10,
        
    },
    active:{
        backgroundColor: appTheme.COLORS.PRIMARY,
        color:"#fff",
        borderRadius:10,
        padding:10,
        marginHorizontal:3,
        width:150
    },
    inactive:{
        backgroundColor: appTheme.COLORS.WHITE,
        color:appTheme.COLORS.SECONDARY,
        borderRadius:10,
        padding:10,
        borderWidth:1,
        borderColor:appTheme.COLORS.SECONDARY,
        marginHorizontal:3,
        width:150
    }
})










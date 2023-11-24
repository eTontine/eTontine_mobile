import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {formatDate, formatDateToString} from "../utils/date";
import CalendarPicker from "react-native-calendar-picker";
import {appTheme} from "../constants";
import Modal from "react-native-modal";
import {Icon} from "./index";
import {Block, Text} from "galio-framework";

const ModalSheet = (props) => {
    return (
        <Modal
            onBackdropPress={props.hide}
            style={props.style ? props.style : {
                justifyContent: 'flex-end',
                margin: 0
            }}
            useNativeDriver={true}
            animationInTiming={300}
            animationOutTiming={300}
            hideModalContentWhileAnimating
            isVisible={props.visible}
        >
            {!props.contentStyle && <Block style={{
                height: 5,
                width: 50,
                borderRadius: 10,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 5
            }}/>}
            <Block  style={props.contentStyle ? props.contentStyle : {borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: "#fff"}}>
                { props.title && <Pressable onPress={props.hide} className="p-4 flex-row justify-between items-center">
                    <Text style={{color: appTheme.COLORS.PRIMARY}}>{props.title}</Text>
                    <Block flex row end start style={{ marginBottom: 10 }}>
                        <Icon family={"AntDesign"} name={"close"} size={24} color={appTheme.COLORS.SECONDARY}/>
                    </Block>
                </Pressable> }
                {props.children}
            </Block>
        </Modal>
    );
}

export const DateInput = ({label, date, onSelect,title="",description, errorText,min=new Date(1900, 0, 0),max=new Date(2050, 0, 0),...props}) => {

    const [visible, setVisible] = useState(false)
    const handleDateChange = (date) => {
        onSelect(date)
        setVisible(false)
    }

    const RenderCaption = () => {
        return (
            <Block style={{ marginBottom: 5 }}>
                {
                    description && !errorText ? (
                        <Text >{description}</Text>
                    ) : (
                        <Text style={{color:"red"}}>{errorText}</Text>
                    )
                }
            </Block>
        )
    }

    return (
        <>
            <Text color={appTheme.COLORS.SECONDARY} size={12} >{label}</Text>
            <Pressable onPress={() => setVisible(true)}>
                <Block center middle style={{ margin: 5}}>
                    <Block row>
                        <Text center middle size={13} style={{ fontWeight: "700", marginHorizontal: 15 }} >
                            {date ? formatDateToString(date) : label}
                        </Text>
                        <Icon family={"AntDesign"} name={"caretdown"}></Icon>
                    </Block>
                </Block>
            </Pressable>
            <RenderCaption/>
            <ModalSheet visible={visible} hide={() => setVisible(false)}>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={false}
                    todayBackgroundColor={appTheme.COLORS.PRIMARY}
                    selectedDayColor={appTheme.COLORS.SECONDARY}
                    selectedDayTextColor="#FFFFFF"
                    previousTitleStyle={{fontSize: 15, fontWeight: "bold"}}
                    nextTitleStyle={{fontSize: 15, fontWeight: "bold"}}
                    onDateChange={handleDateChange}
                    minDate={min}
                    maxDate={max}
                />
            </ModalSheet>
        </>
    );
}












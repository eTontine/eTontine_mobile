
import React from 'react';
import Modal from "react-native-modal";
import {Pressable, View,Text} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {appTheme} from "../constants";

export const ModalSheet = (props) => {
    return (
        <Modal
            onBackdropPress={props.hide}
            style={props.style ? props.style : {
                justifyContent: 'flex-end',
                backgroundColor: '#FFF',
                margin: 0
            }}
            useNativeDriver={true}
            animationInTiming={300}
            animationOutTiming={300}
            hideModalContentWhileAnimating
            isVisible={props.visible}
        >
            {!props.contentStyle && <View style={{
                height: 5,
                width: 50,
                borderRadius: 10,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 5
            }}/>}
            <View  style={props.contentStyle ? props.contentStyle : {borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: "#fff"}}>
                { props.title && <Pressable onPress={props.hide} className="p-4 flex-row justify-between items-center">
                    <Text className="text-xl font-bold" style={{color: appTheme.COLORS.PRIMARY}}>{props.title}</Text>
                    <View className="flex-row justify-end items-start bottom-1">
                        <MaterialCommunityIcons name={"close"} size={24} color={appTheme.COLORS.SECONDARY}/>
                    </View>
                </Pressable> }
                { !props.title &&<Pressable onPress={props.hide} className="flex-row justify-end items-start bottom-1 pt-4 px-4">
                        <MaterialCommunityIcons name={"close"} size={24} color={appTheme.COLORS.SECONDARY}/>
                    </Pressable>
                }
                {props.children}
            </View>
        </Modal>
    );
};


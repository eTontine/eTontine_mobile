import React from 'react';
import Modal from "react-native-modal";
import {Pressable, View,Text} from "react-native";
import {appTheme} from "../constants";
import Icon from "./Icon";
import {Block} from "galio-framework";

export const ModalSheet = (props) => {
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
            {!props.contentStyle && <View style={{
                height: 5,
                width: 50,
                borderRadius: 20,
                backgroundColor: "#dcdcdc",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 5
            }}/>}
            <Block style={[props.contentStyle ? props.contentStyle : {borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: "#fff"}]}>
                { props.title && <Pressable onPress={props.hide} className="p-4 flex-row justify-between items-center">
                    <Text className="text-xl font-bold" >{props.title}</Text>
                    <View className="flex-row justify-end items-start bottom-1">
                        <Icon family="" name="close" color={appTheme.COLORS.PRIMARY} />
                    </View>
                </Pressable> }
               
                {props.children}
            </Block>
        </Modal>
    );
};


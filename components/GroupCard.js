import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import {appTheme} from "../constants";
import {useRouter} from "expo-router";
import Icon from "./Icon";
import {Button} from "./index";

const JGroupCard = ({  item, style }) => {

    const router = useRouter()

    const navigateTo = () => {
        router.push({ pathname: '/tontine/group/[id]', params: { id: item.id } })
    }
    const cardContainer = [styles.card, styles.shadow, style]

    return (
        <TouchableWithoutFeedback onPress={navigateTo}>
            <Block flex space={"between"} style={cardContainer}>
                <Block flex row space={"between"}>
                    <Block>
                        <Text  size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.name}</Text>
                    </Block>
                    <Block right>
                        <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                            Taxe: <Text> {item?.gain} </Text>
                        </Text>
                    </Block>
                </Block>
                <Block flex row center>
                    <Block>
                        <Text
                            size={12}
                            bold style={{ marginVertical: 10, marginHorizontal: 5 }}
                        >
                            {item?.status == 'INSCRIPTION' ? "Phase d'inscription" : item?.status}
                        </Text>
                    </Block>
                </Block>
                <Block flex row space={"between"}>
                    <Block>
                        <Text  size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                            {item?.amount}
                        </Text>
                    </Block>
                    <Block right>
                        <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                            {item?.day_contribution}{item?.time_contribution}{item?.contribution_period}
                        </Text>
                    </Block>
                </Block>
            </Block>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: appTheme.COLORS.SECONDARY,
        padding: 5,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        marginBottom: 2,
    },
    cardTitle: {
        flex: 1,
        flexWrap: 'wrap',
    },
    imageContainer: {
        borderRadius: 3,
        elevation: 1,
        overflow: 'hidden',
    },
    image: {
        // borderRadius: 3,
    },
    horizontalStyles: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    verticalStyles: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
    },
});


export default JGroupCard;
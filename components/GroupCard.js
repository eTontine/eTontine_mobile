import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import {useRouter} from "expo-router";
import {CardStatus, InvitationStatus} from "../constants/status";

const JGroupCard = ({  item, style, onPress }) => {

    const router = useRouter()

    const groupStatus = () => {
        const invitationStatus = item?.invitation_status
        const tranStatus = item?.transaction_status
        const status = item?.status
        if(invitationStatus === InvitationStatus.PENDING.value) {
            return InvitationStatus.PENDING
        }else if (invitationStatus === InvitationStatus.ACCEPTED.value && status === CardStatus.NOT_COLLECTED.value) {
            return CardStatus.NOT_COLLECTED
        } else {
            return CardStatus.NOT_COLLECTED
        }
    }

    const navigateTo = () => {
        console.log("card press", item)
        router.push({ pathname: '/group/show/[id]', params: { id: item.id, name: item?.groupe?.name } })
    }
    const cardContainer = [styles.card, styles.shadow, style]

    return (
        <TouchableWithoutFeedback onPress={() => navigateTo()}>
            <Block flex space={"between"} style={cardContainer}>
                <Block flex row space={"between"}>
                    <Block>
                        <Text  size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.groupe?.name}</Text>
                    </Block>
                    <Block right>
                        <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                            Taxe: <Text> {item?.groupe?.gain} </Text>
                        </Text>
                    </Block>
                </Block>
                <Block flex row center>
                    <Block>
                        <Text
                            size={12}
                            bold style={{ marginVertical: 10, marginHorizontal: 5 }}
                        >
                            {groupStatus()?.name}
                        </Text>
                    </Block>
                </Block>
                <Block flex row space={"between"}>
                    <Block>
                        <Text  size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                            {item?.groupe?.amount}
                        </Text>
                    </Block>
                    <Block right>
                        <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                            {item?.groupe?.day_contribution}{item?.groupe?.time_contribution}{item?.groupe?.contribution_period}
                        </Text>
                    </Block>
                </Block>
                {/*<Block row center>*/}
                {/*    <Button*/}
                {/*        small*/}
                {/*        onPress={() => navigateTo()}*/}
                {/*        color="secondary"*/}
                {/*        style={{ paddingHorizontal: 5, paddingVertical: 7 }}*/}
                {/*    >*/}
                {/*        <Text bold size={10} color={appTheme.COLORS.WHITE}>*/}
                {/*            Voir*/}
                {/*        </Text>*/}
                {/*    </Button>*/}

                {/*</Block>*/}
            </Block>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
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
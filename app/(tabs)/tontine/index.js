import {
    StyleSheet,
    Dimensions,
    ImageBackground, Image, ScrollView, ActivityIndicator, Pressable
} from 'react-native'
import {Block, Text, theme} from "galio-framework";

import {AssociateCard, Header, Icon} from "../../../components";
import {Link, useRouter} from "expo-router";
import {appImages, appTheme} from "../../../constants";
import Stack from "expo-router/src/layouts/Stack";
import React, {useEffect, useState} from "react";
import Images from "../../../constants/images";
import {useGetStatsQuery} from "../../../store/features/core/core.services";
import {CardStatus, InvitationStatus} from "../../../constants/status";
const { width, height } = Dimensions.get('screen');

const StatCard = ({item}) => {
    return (
        <Block card center middle shadow
               style={{ backgroundColor: appTheme.COLORS.WHITE, elevation: 3, padding: 5, height: 65, width: 100 }}>
            <Icon
                family={item.icon.family}
                name={item.icon.name}
                style={{
                    textAlign: "center",
                    alignSelf:"center",
                    justifyContent:"center",
                    alignItems:"center"}}
                color={ appTheme.COLORS.SECONDARY} size={30} />
            <Text bold size={12}> {item.title}: {item.total} </Text>
        </Block>
    );
}


const HomeScreen = () => {
    const router = useRouter();

    const {isFetching: loading, data} = useGetStatsQuery()

    useEffect(() => {
        console.log("loading", loading, data)
    }, [loading])

    const stats = [
        {
            title: 'Cartes',
            total: 15,
            icon: {
                name: 'v-card',
                family: 'Entypo'
            }
        },
        {
            title: 'Cartes',
            total: 5,
            icon: {
                name: 'carryout',
                family: 'AntDesign'
            }
        },
        {
            title: 'Groupe',
            total: 10,
            icon: {
                name: 'group',
                family: 'FontAwesome'
            }
        },
        {
            title: 'Demandes',
            total: 15,
            icon: {
                name: 'group',
                family: 'FontAwesome'
            }
        }
    ]

    const cardStatus = ({item}) => {
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

    const groupStatus = ({item}) => {
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

    if(loading) {
        return (
            <Block flex center middle>
                <ActivityIndicator color={appTheme.COLORS.SECONDARY} />
            </Block>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    header: ({ navigation, scene }) => <Header title="E-Tontine"  navigation={navigation} scene={scene} />,
                    cardStyle: { backgroundColor: '#F8F9FE' },
                }}
            />
            <Block>
                <ImageBackground
                    source={appImages.HomeBg} style={{ height: 150, zIndex: 1, borderRadius: 20 }}>
                    <Block row
                           space={"around"}>
                        <Block flex={0.5} space={"between"} style={{ flexWrap: 'wrap', gap: 2, padding: 5 }}>
                            {stats.map((item, index) => (
                                <StatCard key={index} item={item} />
                            ))}
                        </Block>
                        <Block flex={0.5}>

                        </Block>
                    </Block>
                </ImageBackground>
            </Block>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Block flex style={{ backgroundColor: appTheme.COLORS.WHITE, marginTop: 20 }}>
                    <Block style={{ borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER }}>
                        <Block>
                            <Text bold>  Cartes  </Text>
                            <Text size={10} color={appTheme.COLORS.MUTED}> Les 03 dernières cartes </Text>
                        </Block>
                    </Block>
                    <Block flex row center middle style={{ flexWrap: 'wrap', gap: 20, marginTop: 10, padding: 5, height: 250 }}>
                        {data && data?.last_three_cartes && data?.last_three_cartes.map((item, index) => (
                            <Block key={index} card style={{ height: 100, width: width / 2.5, paddingHorizontal: 5 }}>
                                <Block flex row space={"between"}>
                                    <Block>
                                        <Text size={9} bold style={{ marginVertical: 10, }}>{item?.carte?.name}</Text>
                                    </Block>
                                    <Block right>
                                        <Text size={9} bold style={{ marginVertical: 10}}>
                                            Taxe: <Text size={9}> {item?.carte?.gain} </Text>
                                        </Text>
                                    </Block>
                                </Block>
                                <Block flex row center>
                                    <Block>
                                        <Text
                                            size={9}
                                            bold
                                            style={{
                                                marginVertical: 10,
                                                marginHorizontal: 5,
                                                color: appTheme.COLORS[cardStatus(item)?.color]
                                        }}
                                        >
                                            {cardStatus(item)?.name}
                                        </Text>
                                    </Block>
                                </Block>
                                <Block flex row space={"between"}>
                                    <Block>
                                        <Text size={9} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                                            {item?.carte?.amount}<Text size={9}>/Tour</Text>
                                        </Text>
                                    </Block>
                                    <Block right>
                                        <Text size={9} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.carte?.number_day}</Text>
                                    </Block>
                                </Block>
                            </Block>
                        ))}
                        <Pressable onPress={() => router.replace('/card')}>
                            <Block card center middle style={{ height: 100, width: width / 2.5}}>
                                <Icon
                                    family={"AntDesign"}
                                    name={"pluscircleo"}
                                    size={35}
                                />
                                <Text bold size={14}> Voir plus </Text>
                            </Block>
                        </Pressable>
                    </Block>
                    <Block style={{ paddingHorizontal: 5, paddingVertical: 15, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER }}>
                        <Block>
                            <Text bold>  Groupes  </Text>
                            <Text size={10} color={appTheme.COLORS.MUTED}> Les 03 derniers groupes </Text>
                        </Block>
                    </Block>
                    <Block flex row center middle style={{ flexWrap: 'wrap', gap: 20, marginTop: 10, padding: 5, height: 250 }}>
                        {data && data?.last_three_groupes && data?.last_three_groupes.map((item, index) => (
                            <Block key={index} card style={{ height: 100, width: width / 2.5, paddingHorizontal: 5 }}>
                                <Block flex row space={"between"}>
                                    <Block>
                                        <Text size={9} bold style={{ marginVertical: 10, }}>{item?.groupe?.name}</Text>
                                    </Block>
                                    <Block right>
                                        <Text size={9} bold style={{ marginVertical: 10}}>
                                            Taxe: <Text size={9}> {item?.groupe?.gain} </Text>
                                        </Text>
                                    </Block>
                                </Block>
                                <Block flex row center>
                                    <Block>
                                        <Text
                                            size={9}
                                            bold
                                            style={{
                                                marginVertical: 10,
                                                marginHorizontal: 5,
                                                color: appTheme.COLORS[groupStatus(item)?.color]
                                            }}
                                        >
                                            {groupStatus(item)?.name}
                                        </Text>
                                    </Block>
                                </Block>
                                <Block flex row space={"between"}>
                                    <Block>
                                        <Text size={9} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                                            {item?.groupe?.amount}
                                        </Text>
                                    </Block>
                                    <Block right>
                                        <Text size={9} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                                            {item?.groupe?.day_contribution}{item?.groupe?.time_contribution}{item?.groupe?.contribution_period}
                                        </Text>
                                    </Block>
                                </Block>
                            </Block>
                        ))}
                        <Pressable onPress={() => router.replace('/group')}>
                            <Block card center middle style={{ height: 100, width: width / 2.5}}>
                                <Icon
                                    family={"AntDesign"}
                                    name={"pluscircleo"}
                                    size={35}
                                />
                                <Text bold size={14}> Voir plus </Text>
                            </Block>
                        </Pressable>
                    </Block>
                </Block>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    home: {
        width: width,
    },
    groups: {
        width: width - theme.SIZES.BASE * 2,
    },
    link: {
        color: appTheme.COLORS.PRIMARY,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: appTheme.COLORS.WHITE,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    tabItemActive: {
        borderBottomWidth: 5,
        borderRadius: 5,
        borderColor: appTheme.COLORS.PRIMARY
    }
});

export default HomeScreen;

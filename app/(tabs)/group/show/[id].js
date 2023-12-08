import {useLocalSearchParams, useRouter} from 'expo-router';
import {Accordion, Block, Text} from "galio-framework";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../../../utils/hooks";
import {
    useAssociateGroupMutation,
    useGetAssociateGroupDetailQuery,
    useGetTontinerGroupDetailQuery, useStartGroupTontineMutation, useValidateGroupAssociateMutation
} from "../../../../store/features/group/group.services";
import accountType from "../../../../constants/accountType";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../../components/Header";
import {Button, Icon, Input, ModalSheet} from "../../../../components";
import {appTheme} from "../../../../constants";
import {ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {CardStatus, GroupStatus, InvitationStatus} from "../../../../constants/status";
import {SceneMap, TabView} from "react-native-tab-view";
import {Formik} from "formik";
import {formatDateToString} from "../../../../utils/date";

const { width } = Dimensions.get('screen')

export default function GroupeAssociateScreen() {
    const { id, name } = useLocalSearchParams();
    const router = useRouter();

    const [routes] = useState([
        { key: 'info', title: 'Informations' },
        { key: 'member', title: 'Membres' },
        { key: 'rule', title: 'Règles' },
    ]);
    const [index, setIndex] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false)
    const [isTontiner, setIsTontiner] = useState(false);
    const user = useAppSelector((state) => state.user.currentUser);

    const group = useAppSelector((state) => state.group.currentGroup);

    const [startTontine, {loading: isStartingTontine}] = useStartGroupTontineMutation()
    const [addUserToGroup, {loading: isAdding}] = useAssociateGroupMutation()
    const [validateAssociate, { isLoading: validating }] = useValidateGroupAssociateMutation();

    const {isFetching, data} = useGetTontinerGroupDetailQuery({id, refresh}, {
        skip: !id
    })

    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        setIsTontiner(user?.account_type === accountType.tontiner);
    }, [user]);

    useEffect(() => {
        console.log("useEffect groupe", group)
    }, [group])

    useEffect(() => {
        setRefresh(refresh+1)
    }, [])


    const _handleRefresh = () => {
        setRefresh(refresh + 1)
    }

    const groupStatus = (item) => {
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

    const handleIndexChange = (index) => {
        setIndex(index);
    };

    const handleAddPress = async (values) => {
        try {
            const data = {
                groupe: id,
                user_phones: values.phones.split('-')
            }
            console.log("data", data)
            await addUserToGroup(data)

            setShowAddModal(false)
        }catch (e) {

        }
    }

    const handleStartTontine = async () => {
        try {
            const data = {
                id: id,
                status: "IN_PROGESS"
            }
            console.log(data)
            const res = await startTontine(data)

            if(res.ok) {
                refresh()
            }

        }catch (e) {

        }
    }

    const handleValidateAssociation = async (id) => {
        try {
            const data = {
                id: id,
                status: 'ACCEPTED',
            };

            let res = await validateAssociate(data);

        } catch (e) {}
    };

    const infoScene = () => {
        return(
            <ScrollView
                refreshControl={<RefreshControl
                    style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                    colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                    refreshing={isFetching}
                    onRefresh={_handleRefresh} />}
                showsVerticalScrollIndicator={false} style={{flex:1,paddingBottom:30}}>
                <Block flex>
                    <Block style={{ margin: 30 }}>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Cotisation: </Text>
                            <Text>
                                {group?.groupe?.amount}/Tour
                            </Text>
                        </Block>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Taxe: </Text>
                            <Text>
                                {group?.groupe?.gain}
                            </Text>
                        </Block>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Période de contribution: </Text>
                            <Text>
                                {group?.groupe?.contribution_period}
                            </Text>
                        </Block>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Jour de contribution: </Text>
                            <Text>
                                {group?.groupe?.day_contribution}
                            </Text>
                        </Block>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Heure de contribution: </Text>
                            <Text>
                                {group?.groupe?.time_contribution}
                            </Text>
                        </Block>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Date de début : </Text>
                            <Text>
                                {formatDateToString(group?.groupe?.start_date)} {group?.id}
                            </Text>
                        </Block>
                        <Block row space={'between'} style={{ padding: 5, marginVertical: 5, borderBottomWidth: 1, borderColor: appTheme.COLORS.BORDER_COLOR }}>
                            <Text bold> Cotisation Status : </Text>
                            <Text>
                                {GroupStatus[group?.groupe?.status]?.name}
                            </Text>
                        </Block>
                    </Block>
                    <Block>
                        {group?.groupe?.status == 'INSCRIPTION' && isTontiner &&
                            <Button
                                onPress={() => router.push({pathname: '/group/edit',  params: { id: group?.groupe?.id }})}
                                color="white"
                                style={{ width: width * 0.85 }}
                            >
                                {/*<Icon family={'AntDesign'} name={'link'} size={14} />*/}
                                <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                    Modifier
                                </Text>
                            </Button>
                        }
                        {group?.groupe?.status == 'INSCRIPTION' && isTontiner &&
                            <Button
                                onPress={() =>  setShowAddModal(true)}
                                color="white"
                                style={{ width: width * 0.85 }}
                            >
                                {/*<Icon family={'AntDesign'} name={'link'} size={14} />*/}
                                <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                    Ajouter participants
                                </Text>
                            </Button>
                        }
                        {group?.groupe?.status == 'INSCRIPTION' && isTontiner &&
                            <Button
                                onPress={() =>  handleStartTontine(group)}
                                color="white"
                                style={{ width: width * 0.85 }}
                                isProcess={isStartingTontine}
                            >
                                {/*<Icon family={'AntDesign'} name={'link'} size={14} />*/}
                                <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                    Démarrer la tontine
                                </Text>
                            </Button>
                        }
                        {!isTontiner && group?.groupe?.collection_date?.invitation_status === InvitationStatus.PENDING.value &&
                            <Button
                                onPress={() => handleValidateAssociation(id)}
                                color="white"
                                style={{ width: width * 0.85 }}
                            >
                                <Icon family={'AntDesign'} name={'link'} size={14} />
                                <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                    Souscrire
                                </Text>
                            </Button>
                        }
                    </Block>
                </Block>
            </ScrollView>
        );
    }

    const memberScene = () => {
        return(
            <ScrollView
                refreshControl={<RefreshControl
                    style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                    colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                    refreshing={isFetching}
                    onRefresh={_handleRefresh} />}
                showsVerticalScrollIndicator={false} style={{flex:1,paddingBottom:30}}>
                <Block style={{ margin: 30 }}>
                    {group?.members && group.members.map((member, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                backgroundColor: appTheme.COLORS.WHITE,
                                flexDirection: 'row',
                                borderStyle: 'solid',
                                borderRadius: 10,
                                borderColor: appTheme.COLORS.BORDER_COLOR,
                                paddingHorizontal: 10,
                                paddingVertical: 20,
                                marginBottom: 10 }}>
                            <Icon family={'AntDesign'} name={'user'} />
                            <Text bold color={appTheme.COLORS.BLACK} size={16} style={{ marginStart: 10 }}> {member?.user?.name}  </Text>
                            {/*<Text color={InvitationStatus[member?.invitation_status]?.color}> {InvitationStatus[member?.invitation_status]?.name} </Text>*/}
                        </TouchableOpacity>
                    ))}
                </Block>
            </ScrollView>
        );
    }

    const RuleContent = ({desc, amount, title}) => {
        return (
            <Block card style={{ width: width * 0.85, backgroundColor: appTheme.COLORS.WHITE, marginVertical: 5}}>
                <Text size={11} bold style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: appTheme.COLORS.BORDER_COLOR }}> {title} </Text>
                <Block center style={{ paddingVertical: 15, }}>
                    <Text> {desc}</Text>
                </Block>
                <Block row style={{ padding: 5, }}>
                    <Text size={14}> Montant: </Text>
                    <Text bold size={14} style={{ marginStart: 5 }}> {amount} </Text>
                </Block>
            </Block>
        );
    }

    const ruleScene = () => {
        // const data = group?.rules?.map((item) => {
        //     return {
        //         title: item?.rule?.title,
        //         content: <RuleContent desc={item?.rule?.description} amount={item?.value} />
        //     }
        // })
        return (
            <ScrollView
                refreshControl={<RefreshControl
                    style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                    colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                    refreshing={isFetching}
                    onRefresh={_handleRefresh} />}
                showsVerticalScrollIndicator={false} style={{flex:1,paddingBottom:30}}>
                <Block flex center>
                    {group?.rules?.map((item, index) => (
                        <RuleContent key={index} desc={item?.rule?.description} amount={item?.value} title={item?.rule?.title}/>
                    ))}
                </Block>
            </ScrollView>
        );
    }

    const renderScene = SceneMap({
        info: infoScene,
        member: memberScene,
        rule: ruleScene,
    });

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <Block style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) => (inputIndex === i ? 1 : 0.5)),
                    });
                    return (
                        <TouchableOpacity
                            key={i}
                            style={[styles.tabItem, index === i ? styles.tabItemActive : null]}
                            onPress={() => handleIndexChange(i)}>
                            <Text style={{ textAlign: 'center' }} color={index === i ? appTheme.COLORS.PRIMARY : appTheme.COLORS.BLACK}>{route.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </Block>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    header: ({ navigation, scene }) => (
                        <Header title={'Groupe: ' + name} back navigation={navigation} scene={scene} />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" },
                }}
            />
            <TabView navigationState={{ index, routes }}
                     renderScene={renderScene}
                     renderTabBar={renderTabBar}
                     onIndexChange={(index) => handleIndexChange(index)}
            />

            <ModalSheet visible={showAddModal} hide={() => setShowAddModal(false)}>
                <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Block center style={{ padding: 10 }}>
                        <Formik
                            initialValues={{ phones:  ''}}
                            onSubmit={(values) => handleAddPress(values)}
                        >
                            {formikProps => (
                                <>
                                    <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                        <Input
                                            shadowless={true}
                                            label="Numéro de téléphone"
                                            type="phone-pad"
                                            onChangeText={formikProps.handleChange('phones')}
                                            error={!!formikProps.errors.phones}
                                            errorText={formikProps.errors.phones}
                                            returnKeyType="next"
                                        />
                                        <Text> Vous pouvez ajoute plusieurs participant en séparant les numéros par - Ex: 9090902-90909093 </Text>
                                    </Block>
                                    <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                                        <Button
                                            onPress={formikProps.handleSubmit}
                                            isProcess={isAdding}
                                            style={{
                                                height: 35,
                                                width: width / 4,
                                                backgroundColor: appTheme.COLORS.SECONDARY
                                            }}
                                        >
                                            <Text
                                                color={appTheme.COLORS.WHITE}
                                                size={12}
                                                style={{ textTransform: 'capitalize'}}
                                                loaderColor={appTheme.COLORS.WHITE}
                                            > Envoyer  </Text>
                                        </Button>
                                    </Block>
                                </>
                            )}
                        </Formik>
                    </Block>
                </Block>
            </ModalSheet>
        </>
    );
}

const styles = StyleSheet.create({
    link: {
        color: appTheme.COLORS.PRIMARY,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: appTheme.COLORS.WHITE,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    tabItemActive: {
        borderBottomWidth: 5,
        borderRadius: 5,
        borderColor: appTheme.COLORS.PRIMARY
    }
});

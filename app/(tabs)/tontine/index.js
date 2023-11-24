import {
    StyleSheet,
    Dimensions,
    ScrollView,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import {Block, Text, theme} from "galio-framework";

import {AssociateCard, Header, ModalSheet, Button, Card, GroupCard, Icon, Input, TontinerCard} from "../../../components";
import groups from '../../../constants/groups';
import cards from '../../../constants/cards';
import {Link, useRouter} from "expo-router";
import {appTheme} from "../../../constants";
import Stack from "expo-router/src/layouts/Stack";
import React, {useEffect, useState} from "react";
import {Formik} from "formik";
import {
    useAssociateCardMutation,
    useGetCardsQuery,
    useGetTontinerCardsQuery
} from "../../../store/features/card/card.services";
import {useAppSelector} from "../../../utils/hooks";
import accountType from "../../../constants/accountType";
import {useCards} from "../../../hooks/useCards";
import {SceneMap, TabView} from "react-native-tab-view";
import {useGroupes} from "../../../hooks/useGroupes";
import TontinerGroupCard from "../../../components/TontinerGroupCard";

const { width, height } = Dimensions.get('screen');

function getRandomInt(min = 1, max = 99999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HomeScreen = () => {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'cards', title: 'Cartes' },
        { key: 'groups', title: 'Groupes' },
    ]);
    const [isTontiner, setIsTontiner] = useState(false);
    const [associateCardId, setAssociateCardId] = useState('');
    const [addGroupId, setAddGroupId] = useState('');
    const user = useAppSelector((state) => state.user.currentUser);

    const [query, setQuery] = useState({
        page: 0,
        search: ''
    })

    const [showAssociateModal, setShowAssociateModal] = useState(false)

    const [showAddModal, setShowAddModal] = useState(false)

    const [associateCard, {loading: isAssociating}] = useAssociateCardMutation()

    const { loading, pages, associateCards, tontinerCards, resetCards } = useCards({
        tontinier: isTontiner ? user?.id : '',
        user: !isTontiner ? user?.id : '',
        search: query.search,
        page: query.page,
        isTontiner,
    });

    const {
        loading: loadingGroup,
        pages: pagesGroup,
        associateGroupes, tontinerGroupes, resetGroupes } = useGroupes({
        user: user?.id,
        search: query.search,
        page: query.page,
        isTontiner,
    });

    useEffect(() => {
        // setQuery({
        //     search: '',
        //     page: 1
        // })
    }, [associateCards, tontinerCards])

    useEffect(() => {
        setIsTontiner(user?.account_type === accountType.tontiner);
    }, [user]);

    const toggleAssociateModal = (item) => {
        setAssociateCardId(item.id)
        setShowAssociateModal(true)
    }

    const handleIndexChange = (index) => {
        setIndex(index);
    };

    const toggleAddModal = (item) => {
        setAddGroupId(item.id)
        setShowAddModal(true)
    }

    const handleAssociate = async (values) => {

        try {
            const data = {
                carte: associateCardId,
                phone: values.phone
            }

            await associateCard(data)

            setShowAssociateModal(false)
        }catch (e) {

        }
    }

    const handleAddPress = async (values) => {
        try {
            const data = {
                carte: addGroupId,
                phone: values.phone
            }

            // await associateCard(data)

            // setShowAssociateModal(false)
        }catch (e) {

        }
    }

    const handleCardsRefresh = () => {
        // setQuery({
        //     page: 0,
        //     search: ''
        // })
    }

    const showCard = async (item) => {
        router.push({pathname: '/tontine/card/associate/[id]', params: {id: item.id}})
    }

    const GroupList = () => {
        return (
            <Block flex center style={styles.home}>
                <Block style={styles.groups}>
                    {isTontiner && (
                        <Button
                            onPress={() => router.push({ pathname: '/tontine/group/tontiner/update' })}
                            color="white"
                            style={{ width: width * 0.85 }}
                        >
                            <Icon family={'AntDesign'} name={'plus'} size={14} />
                            <Text bold size={12} color={appTheme.COLORS.SECONDARY} style={{ marginLeft: 10 }}>
                                Crée un groupe
                            </Text>
                        </Button>
                    )}
                    {tontinerGroupes && associateGroupes && isTontiner && (
                        <FlatList
                            data={[
                                { title: "Tontiner Groupes", data: tontinerGroupes, horizontal: false },
                                { title: "Mes groupes", data: associateGroupes, horizontal: false },
                            ]}
                            style={{marginBottom: 70}}
                            contentContainerStyle={{ marginBottom: 70 }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => getRandomInt().toString()}
                            renderItem={({ item }) => (
                                <>
                                    <Text bold color={appTheme.COLORS.SECONDARY} size={16} style={{ marginTop: 10 }}>
                                        {item.title}
                                    </Text>
                                    <FlatList
                                        data={item.data}
                                        renderItem={({ item: group }) => (
                                            item.title === "Tontiner Groupes"  ? (
                                                <TontinerGroupCard key={group.id} onPressAdd={() => toggleAddModal(item)} onPress={() => console.log(group)} item={group} />
                                            ) : (
                                                <GroupCard key={group.id} onPress={() => console.log(group)} item={group} />
                                            )
                                        )}
                                        keyExtractor={(card) => getRandomInt().toString()}
                                        horizontal={item.horizontal}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        ListEmptyComponent={<>
                                            <Block center middle
                                                   style={{
                                                       height: '100%',
                                                       flex: 1,
                                                       flexDirection: 'column',
                                                       alignItems: 'center',
                                                       justifyContent: 'center'
                                                   }}>
                                                <Text> Aucun groupe trouvée </Text>
                                            </Block>
                                        </>}
                                    />
                                </>
                            )}
                        />
                    )}
                    { associateGroupes && !isTontiner && (
                        <FlatList
                            data={associateGroupes}
                            renderItem={({ item: group }) => (<GroupCard key={group.id} onPress={() => console.log(group)} item={group} />)}
                            keyExtractor={(card) =>getRandomInt().toString()}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<>
                                <Block center middle
                                       style={{
                                           height: '100%',
                                           flex: 1,
                                           flexDirection: 'column',
                                           alignItems: 'center',
                                           justifyContent: 'center'
                                       }}>
                                    <Text> Aucun groupe trouvée </Text>
                                </Block>
                            </>}
                        />
                    )}
                </Block>
                <ModalSheet visible={showAddModal} hide={() => setShowAddModal(false)}>
                    <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Block center style={{ padding: 10 }}>
                            <Formik
                                initialValues={{ phone:  ''}}
                                onSubmit={(values) => handleAddPress(values)}
                            >
                                {formikProps => (
                                    <>
                                        <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                            <Input
                                                shadowless={true}
                                                placeholder="Numéro de téléphone"
                                                type="phone-pad"
                                                onChangeText={formikProps.handleChange('phone')}
                                                error={!!formikProps.errors.phone}
                                                errorText={formikProps.errors.phone}
                                                returnKeyType="next"
                                            />
                                        </Block>
                                        <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                                            <Button
                                                onPress={formikProps.handleSubmit}
                                                isProcess={isAssociating}
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
            </Block>
        );
    };

    const CardList = () => {
        return (
            <Block flex center style={styles.home}>
                <Block style={styles.groups}>
                    {isTontiner && (
                        <Button
                            onPress={() => router.push({ pathname: '/tontine/card/tontiner/update' })}
                            color="white"
                            style={{ width: width * 0.85 }}
                        >
                            <Icon family={'AntDesign'} name={'plus'} size={14} />
                            <Text bold size={12} color={appTheme.COLORS.SECONDARY} style={{ marginLeft: 10 }}>
                                Créer une carte
                            </Text>
                        </Button>
                    )}
                    {tontinerCards && associateCards && isTontiner &&(
                        <FlatList
                            data={[
                                { title: "Tontiner Card", data: tontinerCards, horizontal: true },
                                { title: "Mes cartes", data: associateCards, horizontal: false },
                            ]}
                            style={{marginBottom: 50}}
                            contentContainerStyle={{ marginBottom: 50 }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => getRandomInt().toString()}
                            refreshControl={<RefreshControl
                                style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                                colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                                size={'large'}
                                refreshing={loading || loadingGroup}
                            />}
                            refreshing={loading}
                            onRefresh={handleCardsRefresh}
                            renderItem={({ item }) => (
                                <>
                                    <Text bold color={appTheme.COLORS.SECONDARY} size={16} style={{ marginTop: 10 }}>
                                        {item.title}
                                    </Text>
                                    <FlatList
                                        data={item.data}
                                        renderItem={({ item: card }) => (
                                            item.title === "Tontiner Card" && isTontiner ? (
                                                <TontinerCard key={card.id} onPress={() => toggleAssociateModal(card)} item={card} />
                                            ) : (
                                                <AssociateCard key={card.id} onPress={() => showCard(card)} item={card} />
                                            )
                                        )}
                                        keyExtractor={(card) => getRandomInt().toString()}
                                        horizontal={item.horizontal}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        ListEmptyComponent={<>
                                            <Block center middle
                                                   style={{
                                                       height: '100%',
                                                       flex: 1,
                                                       flexDirection: 'column',
                                                       alignItems: 'center',
                                                       justifyContent: 'center'
                                                   }}>
                                                <Text> Aucune carte trouvée </Text>
                                            </Block>
                                        </>}
                                    />
                                </>
                            )}
                        />
                    )}

                    { associateCards && !isTontiner && (
                        <FlatList
                            data={associateCards}
                            renderItem={({ item: card }) => (
                                <AssociateCard key={card.id} onPress={() => showCard(card)} item={card} />)}
                            keyExtractor={(card) => getRandomInt().toString()}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<>
                                <Block center middle
                                       style={{
                                           height: '100%',
                                           flex: 1,
                                           flexDirection: 'column',
                                           alignItems: 'center',
                                           justifyContent: 'center'
                                       }}>
                                    <Text> Aucune carte trouvée </Text>
                                </Block>
                            </>}
                        />
                    )}
                </Block>
                <ModalSheet visible={showAssociateModal} hide={() => setShowAssociateModal(false)}>
                    <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Block center style={{ padding: 10 }}>
                            <Formik
                                initialValues={{ phone:  ''}}
                                onSubmit={(values) => handleAssociate(values)}
                            >
                                {formikProps => (
                                    <>
                                        <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                            <Input
                                                shadowless={true}
                                                placeholder="Numéro de téléphone"
                                                type="phone-pad"
                                                onChangeText={formikProps.handleChange('phone')}
                                                error={!!formikProps.errors.phone}
                                                errorText={formikProps.errors.phone}
                                                returnKeyType="next"
                                            />
                                        </Block>
                                        <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                                            <Button
                                                onPress={formikProps.handleSubmit}
                                                isProcess={isAssociating}
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
            </Block>
        );
    };

    const renderScene = SceneMap({
        cards: CardList,
        groups: GroupList,
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
                            <Text color={index === i ? appTheme.COLORS.PRIMARY : appTheme.COLORS.BLACK}>{route.title}</Text>
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
                    header: ({ navigation, scene }) => <Header title="Tontine" search navigation={navigation} scene={scene} />,
                    cardStyle: { backgroundColor: '#F8F9FE' },
                }}
            />
            <TabView navigationState={{ index, routes }} renderScene={renderScene} renderTabBar={renderTabBar} onIndexChange={(index) => handleIndexChange(index)} />
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

import {Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet} from "react-native";
import {Block, Text, theme} from "galio-framework";
import {appTheme} from "../../../constants";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../components/Header";
import React, {useEffect, useState} from "react";
import {Button, GroupCard, Icon, Input, ModalSheet, TontinerGroupCard} from "../../../components";
import {useRouter} from "expo-router";
import {useAppSelector} from "../../../utils/hooks";
import accountType from "../../../constants/accountType";
import {useGroupes} from "../../../hooks/useGroupes";
import {getRandomInt} from "../../../utils/helpers";
import {useAssociateGroupMutation, useStartGroupTontineMutation} from "../../../store/features/group/group.services";
import {Formik} from "formik";
import {GroupStatus} from "../../../constants/status";


const { width } = Dimensions.get('screen');

const GroupScreen = () => {
    const router = useRouter();
    const [isTontiner, setIsTontiner] = useState(false);
    const user = useAppSelector((state) => state.user.currentUser);
    const [addGroupId, setAddGroupId] = useState('');
    const [showAddModal, setShowAddModal] = useState(false)
    const [showAssociateModal, setShowAssociateModal] = useState(false)
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [query, setQuery] = useState({
        tontinerGroupPage: 0,
        associateGroupPage: 0,
        search: '',
        start_date: '',
        end_date: ''
    })

    useEffect(() => {
        setIsTontiner(user?.account_type === accountType.tontiner);
    }, [user]);

    useEffect(() => {
        setQuery({...query, tontinerGroupPage: 1, associateGroupPage: 1})
    }, [associateGroupes, tontinerGroupes])

    const [startTontine, {loading: isStartingTontine}] = useStartGroupTontineMutation()
    const [addUserToGroup, {loading: isAdding}] = useAssociateGroupMutation()

    const {
        loading: loadingGroup,
        associateGroupPages,
        tontinerGroupPages,
        associateGroupes, tontinerGroupes, resetGroupes } = useGroupes({
        tontinier: isTontiner ? user?.id : '',
        user: !isTontiner ? user?.id : '',
        search: query.search,
        tontinerGroupPage: query.tontinerGroupPage,
        associateGroupPage: query.associateGroupPage,
        start_date: query.start_date,
        end_date: query.end_date,
        isTontiner,
    });

    const toggleAddModal = (item) => {
        setAddGroupId(item.id)
        setShowAddModal(true)
    }

    const _handleRefresh = () => {
        setQuery({
            tontinerGroupPage: 0,
            associateGroupPage: 0,
            search: '',
            start_date: '',
            end_date: ''
        })
    }
    const handleSearch = () => {
        console.log("text", searchKeyword)
        setQuery({...query, search: searchKeyword})
    }

    const handleFilter = () => {
        console.log(filter)
    }

    const handleStartTontine = async (item) => {
        try {
            const data = {
                id: item.id,
                status: "IN_PROGESS"
            }

            const res = await startTontine(data)

            if(res.ok) {
                _handleRefresh()
            }

        }catch (e) {

        }
    }

    const handleAddPress = async (values) => {
        try {
            const data = {
                groupe: addGroupId,
                user_phones: values.phones.split('-')
            }
            console.log("data", data)
            await addUserToGroup(data)

            setShowAddModal(false)
        }catch (e) {

        }
    }

    return (
        <Block flex>
            <Stack.Screen
                options={{
                    header: ({ navigation, scene }) =>
                        <Header title="Groupes" search
                                searchText={searchKeyword}
                                setSearchText={setSearchKeyword}
                                handleSearch={handleSearch}
                                filter={filter}
                                setFilter={setFilter}
                                filterOptions={['En cours', "Phase d'inscription"]}
                                navigation={navigation} scene={scene} />,
                    cardStyle: { backgroundColor: '#F8F9FE' },
                }}
            />
           <Block flex style={{ marginTop: 10, width: width }}>
               {isTontiner && (
                   <Block center>
                       <Button
                           onPress={() => router.push({ pathname: '/group/edit' })}
                           color="white"
                           style={{ width: width * 0.85 }}
                       >
                           <Icon family={'AntDesign'} name={'plus'} size={14} />
                           <Text bold size={12} color={appTheme.COLORS.SECONDARY} style={{ marginLeft: 10 }}>
                               Crée un groupe
                           </Text>
                       </Button>
                   </Block>
               )}
               {isTontiner && (
                   <>
                       <FlatList
                           data={tontinerGroupes}
                           extraData={tontinerGroupes}
                           renderItem={({ item: group }) => ( <TontinerGroupCard
                                   key={group.id}
                                   onPressAdd={() => toggleAddModal(group)}
                                   onPressStart={() => handleStartTontine(group)} item={group} />
                           )}
                           keyExtractor={(card) => getRandomInt().toString()}
                           showsHorizontalScrollIndicator={false}
                           showsVerticalScrollIndicator={false}
                           contentContainerStyle={{ marginHorizontal: 10, padding: 10 }}
                           refreshControl={<RefreshControl
                               style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                               colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                               refreshing={loadingGroup}
                               onRefresh={_handleRefresh}
                           />}
                           refreshing={loadingGroup}
                           onRefresh={_handleRefresh}
                           onEndReachedThreshold={0.9}
                           removeClippedSubviews={false}
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
               { associateGroupes && !isTontiner && (
                   <FlatList
                       data={associateGroupes}
                       extraData={associateGroupes}
                       renderItem={({ item: group }) => (<GroupCard key={group.id} onPress={() => console.log(group)} item={group} />)}
                       keyExtractor={(card) => getRandomInt().toString()}
                       showsHorizontalScrollIndicator={false}
                       showsVerticalScrollIndicator={false}
                       contentContainerStyle={{ marginHorizontal: 10, padding: 10 }}
                       refreshControl={<RefreshControl
                           style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                           colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                           refreshing={loadingGroup}
                           onRefresh={_handleRefresh}
                       />}
                       refreshing={loadingGroup}
                       onRefresh={_handleRefresh}
                       onEndReachedThreshold={0.9}
                       removeClippedSubviews={false}
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
        </Block>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        minHeight: 70,
        backgroundColor: appTheme.COLORS.WHITE,
        padding: 5,
        marginHorizontal: 10,
        marginVertical: 5
    },
    in: {
        color: appTheme.COLORS.SUCCESS
    },
    out: {
        color: appTheme.COLORS.ERROR
    }
})

export default GroupScreen;
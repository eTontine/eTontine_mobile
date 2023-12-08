import {ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet} from "react-native";
import {Block, Text, theme} from "galio-framework";
import {appTheme} from "../../../constants";

import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../components/Header";
import React,{useState, useEffect} from "react";
import {AssociateCard, Button, Icon, Input, ModalSheet, TontinerCard} from "../../../components";
import {useRouter} from "expo-router";
import {useAppSelector} from "../../../utils/hooks";
import accountType from "../../../constants/accountType";
import {getRandomInt} from "../../../utils/helpers";
import {useAssociateCardMutation} from "../../../store/features/card/card.services";
import {useCards} from "../../../hooks/useCards";
import {Formik} from "formik";

const { width } = Dimensions.get('screen');

const CardScreen = () => {
    const router = useRouter();
    const [isTontiner, setIsTontiner] = useState(false);
    const [showAssociateModal, setShowAssociateModal] = useState(false)
    const [associateCard, {isLoading: isAssociating}] = useAssociateCardMutation()
    const [associateCardId, setAssociateCardId] = useState('');
    const user = useAppSelector((state) => state.user.currentUser);
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState({
        search: '',
        start_date: '',
        end_date: ''
    })
    const { loading, totalPage, associateCards, tontinerCards, resetCards } = useCards({
        tontinier: isTontiner ? user?.id : '',
        user: !isTontiner ? user?.id : '',
        search: query.search,
        page: page,
        start_date: query.start_date,
        end_date: query.end_date,
        isTontiner,
    });

    useEffect(() => {
        setIsTontiner(user?.account_type === accountType.tontiner);
    }, [user]);

    useEffect(() => {
        setPage(1)
        console.log("set query", page )
    }, [associateCards])

    const handleSearch = () => {
        console.log("text", searchKeyword)
        setQuery({...query, search: searchKeyword})
    }

    const handleFilter = () => {
        console.log(filter)
    }

    const _handleRefresh = () => {
        setPage(0)
        setQuery({
            search: '',
            start_date: '',
            end_date: ''
        })
    }

    const handleLoadAssociateCard = () => {
        let nextPage = page + 1
        if(nextPage <= totalPage){
            setPage(nextPage)
        }
    }

    const showCard = async (item) => {
        router.push({pathname: '/card/show/[id]', params: {id: item?.id, name: item?.carte?.name}})
    }

    const toggleAssociateModal = (id) => {
        console.log("ici")
        setAssociateCardId(id)
        setShowAssociateModal(true)
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

    return (
        <Block flex>
            <Stack.Screen
                options={{
                    header: ({ navigation, scene }) =>
                        <Header title="Cartes"
                                search
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
                          onPress={() => router.push({ pathname: '/card/update' })}
                          color="white"
                          style={{ width: width * 0.85 }}
                      >
                          <Icon family={'AntDesign'} name={'plus'} size={14} />
                          <Text bold size={12} color={appTheme.COLORS.SECONDARY} style={{ marginLeft: 10 }}>
                              Créer une carte
                          </Text>
                      </Button>
                  </Block>
               )}
               {loading && <ActivityIndicator color={appTheme.COLORS.SECONDARY} size={'large'}  />}
               {!loading && tontinerCards && associateCards && isTontiner &&(
                   <FlatList
                       data={[
                           { title: "Tontiner Card", data: tontinerCards, horizontal: true },
                           { title: "Cartes", data: associateCards, horizontal: false },
                       ]}
                       style={{marginBottom: 50}}
                       contentContainerStyle={{ margin: 5, marginBottom: 50, gap: 2 }}
                       showsVerticalScrollIndicator={false}
                       keyExtractor={(item, index) => getRandomInt().toString()}
                       renderItem={({ item }) => (
                           <>
                               <Text bold color={appTheme.COLORS.SECONDARY} size={16} style={{ marginTop: 10 }}>
                                   {item.title}
                               </Text>
                               <FlatList
                                   data={item.data}
                                   renderItem={({ item: card }) => (
                                       item.title === "Tontiner Card" && isTontiner ? (
                                           <TontinerCard key={card.id} onPress={() => toggleAssociateModal(card.id)} item={card} />
                                       ) : (
                                           <AssociateCard key={card.id} onPress={() => showCard(card)} item={card} />
                                       )
                                   )}
                                   keyExtractor={(card) => getRandomInt().toString()}
                                   horizontal={item.horizontal}
                                   showsHorizontalScrollIndicator={false}
                                   showsVerticalScrollIndicator={false}
                                   numColumns={!item.horizontal && 2}
                                   refreshControl={<RefreshControl
                                       style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                                       colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                                       refreshing={loading}
                                       onRefresh={_handleRefresh}
                                   />}
                                   refreshing={loading}
                                   onRefresh={_handleRefresh}
                                   onEndReachedThreshold={0.9}
                                   removeClippedSubviews={false}
                                   onEndReached = {handleLoadAssociateCard}
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
                       numColumns={2}
                       refreshControl={<RefreshControl
                           style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                           colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                           refreshing={loading}
                           onRefresh={_handleRefresh}
                       />}
                       refreshing={loading}
                       onRefresh={_handleRefresh}
                       onEndReachedThreshold={0.9}
                       removeClippedSubviews={false}
                       onEndReached = {handleLoadAssociateCard}
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
                                            shadowless={false}
                                            label={"Entrez le numéro de l'utilisateur"}
                                            type="phone-pad"
                                            onChangeText={formikProps.handleChange('phone')}
                                            error={!!formikProps.errors.phone}
                                            errorText={formikProps.errors.phone}
                                            returnKeyType="next"
                                        />
                                    </Block>
                                    <Block row right style={{ justifyContent: "flex-end", marginTop: 5 }}>
                                        <Button
                                            onPress={formikProps.handleSubmit}
                                            isProcess={isAssociating}
                                            style={{
                                                height: 50,
                                                width: width / 2,
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

export default CardScreen;
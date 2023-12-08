import {ActivityIndicator,BackHandler, Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Block, Text, theme} from "galio-framework";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../../components/Header";
import {useAppSelector} from "../../../../utils/hooks";
import {useGetRequestsQuery} from "../../../../store/features/request/request.services";
import {appTheme} from "../../../../constants";
import React, {useEffect, useState} from "react";
import {formatDateToString} from "../../../../utils/date";
import {useRouter} from "expo-router";

const Request = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Block card style={{ elevation: 1, margin: 5, padding: 10 }}>
                <Block style={{ borderStartWidth: 2, borderStartColor: appTheme.COLORS.BORDER, marginStart: 5, marginVertical: 5 }}>
                    <Block row flex space={"between"}>
                        <Text bold size={9}> Date demande: </Text>
                        <Text bold size={9}> {formatDateToString(item?.payment_date)} </Text>
                    </Block>
                    <Block row flex space={"between"}>
                        <Text bold size={9}> Demande Pour: </Text>
                        <Text bold size={9}> {item?.type_de_tontine} </Text>
                    </Block>
                    <Block row flex space={"between"}>
                        <Text bold size={9}> Status: </Text>
                        <Text bold size={9}> {item?.status} </Text>
                    </Block>
                    <Block row flex space={"between"}>
                        <Text bold size={9}> Type de transaction:  </Text>
                        <Text bold size={9}> {item?.type_transaction} </Text>
                    </Block>
                    <Block row flex space={"between"}>
                        <Text bold size={9}> Montant: </Text>
                        <Text bold size={9}> {item?.amount} </Text>
                    </Block>
                    <Block row flex space={"between"}>
                        <Text bold size={9}> User: </Text>
                        <Text bold size={9}> {item?.receiver_phone} </Text>
                    </Block>
                </Block>
            </Block>
        </TouchableOpacity>
    );
}

const RequestScreen = () => {
    const router = useRouter()
    const user = useAppSelector((state) => state.user.currentUser);
    const [refresh, setRefresh] = useState(0)
    const {isFetching:loading, data: requests} = useGetRequestsQuery(
        {userId: user?.id, start: '', end: '', refresh},
        {skip: !user, refetchOnMountOrArgChange: true, refetchOnReconnect: true,}
    )

    useEffect(() => {
        const goBack = () => {
            router.replace('/tontine')
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            goBack,
        );
        return () => backHandler.remove();
    }, []);


    useEffect(() => {
        setRefresh(refresh+1)
    }, [])


    const _handleRefresh = () => {
        setRefresh(refresh + 1)
    }

    const goTo = (id, requestId) => {
        router.push({pathname: '/card/show/[id]', params: {id, requestId }})
    }

    return (
        <>
            <Stack.Screen options={{
                header: () => <Header back title="Demande" />
            }} />
            {loading && <ActivityIndicator color={appTheme.COLORS.SECONDARY} />}
            {!loading &&
                <Block flex style={{ marginTop: 10 }}>
                    <ScrollView
                        refreshControl={<RefreshControl
                        style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                        colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                        refreshing={loading}
                        onRefresh={_handleRefresh} />}
                        showsVerticalScrollIndicator={false} style={{flex:1,paddingBottom:30}}
                    >
                        { requests && requests.length > 0 && requests.map((request, index) => (
                            <Request key={request?.id} item={request} onPress={() => goTo(request?.object, request?.id)} />
                        ))}

                        {
                            requests && requests.length <= 0 &&
                            <Block flex center middle>
                                <Block>
                                    <Text> Aucune demande de retrait en cour </Text>
                                </Block>
                            </Block>
                        }
                    </ScrollView>
                </Block>
            }
        </>
    );
}

const styles = StyleSheet.create({
})

export default RequestScreen;
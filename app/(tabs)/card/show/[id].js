import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import { Block, Text } from "galio-framework";
import Header from "../../../../components/Header";
import Stack from "expo-router/src/layouts/Stack";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList, RefreshControl,
    ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { appTheme } from "../../../../constants";
import {
    useAssociateCardMutation,
    useDeleteCardMutation,
    useGetAssociateCardDetailQuery,
    useGetTontinerCardDetailQuery,
    useMakeCashOutRequestMutation,
    useMakePaymentMutation,
    useValidateAssociateMutation,
    useValidateCashOutRequestMutation,
} from "../../../../store/features/card/card.services";
import { useAppSelector } from "../../../../utils/hooks";
import {Button, Icon, Input, ModalSheet} from "../../../../components";
import {TransactionStatus, InvitationStatus, CardStatus} from "../../../../constants/status";
import {Formik} from "formik";
import accountType from "../../../../constants/accountType";

const { width } = Dimensions.get('screen');

const Grid = ({ marked }) => {
    const data = new Array(31).fill(null).map((_, index) => index + 1);
    const dataMarked = new Array(marked).fill(null).map((_, index) => index + 1);

    const _renderGridItem = ({ item }) => (
        <Block key={item} style={[styles.gridItem, dataMarked.includes(item) ? styles.gridItemMarked : {backgroundColor: "#FFFFFF"}]}>
            <Text>{item}</Text>
        </Block>
    );

    const generateGrid = (data) => {
        const grid = [];
        for (let i = 0; i < data.length; i += 7) {
            const row = data.slice(i, i + 7);
            const rowComponents = row.map((item) => (
                _renderGridItem({item})
            ));
            grid.push(
                <Block key={i} style={styles.gridRow}>
                    {rowComponents}
                </Block>
            );
        }
        return grid;
    };

    return (
        <Block style={styles.container}>
            {generateGrid(data)}
        </Block>
    );

    // return (
    //     <Block style={{
    //         width,
    //         borderColor: appTheme.COLORS.BORDER,
    //         backgroundColor: appTheme.COLORS.WHITE,
    //         marginVertical: 10
    //     }}>
    //         <FlatList
    //             data={data}
    //             renderItem={renderGridItem}
    //             keyExtractor={(item) => item.toString()}
    //             numColumns={7}
    //             contentContainerStyle={styles.gridContainer}
    //         />
    //     </Block>
    // );
};

export default function CardPage() {
    const { id, requestId } = useLocalSearchParams();
    const router = useRouter();
    const [showAssociateModal, setShowAssociateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showValidateRequestModal, setShowValidateRequestModal] = useState(false);

    const [deleteCard, { loading }] = useDeleteCardMutation();

    const [refresh, setRefresh] = useState(0)

    const user = useAppSelector((state) => state.user.currentUser);
    const card = useAppSelector((state) => state.card.currentCard);
    const [isTontiner, setIsTontiner] = useState(false);

    const {isFetching} = useGetAssociateCardDetailQuery({ id, refresh }, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        skip: !id
    });

    const [validateAssociate, { isLoading: validating }] = useValidateAssociateMutation();
    const [makePayment, { isLoading: processPayment }] = useMakePaymentMutation();
    const [makeCollectRequest, {isLoading: processRequest}] = useMakeCashOutRequestMutation();
    const [validateCollectRequest, {isLoading: processValidateRequest}] = useValidateCashOutRequestMutation();

    useEffect(() => {
        setIsTontiner(user?.account_type === accountType.tontiner);
    }, [user]);

    useEffect(() => {
        setRefresh(refresh+1)
    }, [])


    const _handleRefresh = () => {
        setRefresh(refresh + 1)
    }

    const handleValidateAssociation = async (values) => {
        try {
            const data = {
                ...values,
                id: id,
                status: 'ACCEPTED',
            };

            let res = await validateAssociate(data);
            setShowAssociateModal(false);
            // if(res) {
            //     _handleRefresh()
            // }

        } catch (e) {}
    };

    const handlePayment = async (values) => {
        try {
            const data = {
                ...values,
                number_payment: parseInt(values.number_payment)
            };
            let res = await makePayment(data);
            setShowPayModal(false);
        } catch (e) {}
    };

    const handleRequest = async (values) => {
        try {
            console.log("handleRequest", values)
            let res = await makeCollectRequest(values);
            setShowRequestModal(false);
        } catch (e) {}
    };

    const handleValidateRequest = async (values) => {
        try {
            const data = {
                id: requestId,
                ...values
            }
            console.log("handleRequest", data)
            let res = await validateCollectRequest(data);
            setShowValidateRequestModal(false);
        } catch (e) {}
    };

    const cardStatus = () => {
        const invitationStatus = card?.data?.invitation_status
        const tranStatus = card?.data?.transaction_status
        const status = card?.data?.status
        if(invitationStatus === InvitationStatus.PENDING.value) {
            return InvitationStatus.PENDING
        }else if (invitationStatus === InvitationStatus.ACCEPTED.value && status === CardStatus.NOT_COLLECTED.value) {
            return CardStatus.NOT_COLLECTED
        } else {
            return CardStatus.NOT_COLLECTED
        }
    }

    const handleCashRender =  () => {
        const renderCash = () => {
            console.log("render cash")
        }
        Alert.alert(
            'Rendre Argent',
            'Etes-vous sur de vouloir effectuer cette opération',
            [
                {text: "Annuler", onPress: () => {}, style: 'cancel'},
                {text: "Continuer", onPress: () => renderCash()}
            ]
        )
    };

    return (
        <>
            <ScrollView
                refreshControl={<RefreshControl
                    style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                    colors={[appTheme.COLORS.SECONDARY,appTheme.COLORS.SECONDARY]}
                    refreshing={isFetching}
                    onRefresh={_handleRefresh} />}
                        showsVerticalScrollIndicator={false} style={{flex:1,paddingBottom:30}}>
                <Stack.Screen
                    options={{
                        header: ({ navigation, scene }) => (
                            <Header title={'Cartes N° ' + id} back navigation={navigation} scene={scene} />
                        ),
                        cardStyle: { backgroundColor: "#F8F9FE" },
                    }}
                />
                { !isFetching && (
                    <Block flex style={{ width: width }}>
                        <Block center>
                            <Text size={26} style={{ fontWeight: '600' }}> {card?.data?.carte?.name} </Text>
                        </Block>
                        <Text bold style={{ marginVertical: 5, textAlign: "center" }}>{card?.data?.carte?.description} </Text>
                        <Block row space={"between"} style={{ marginHorizontal: 15 }}>
                            <Text bold> Cotisation: </Text>
                            <Text>
                                {card?.data?.carte?.amount}/Tour
                            </Text>
                        </Block>
                        <Block row space={"between"} style={{ marginHorizontal: 15 }}>
                            <Text bold> Taxe: </Text>
                            <Text>
                                {card?.data?.carte?.gain}
                            </Text>
                        </Block>
                        <Block row space={"between"} style={{ marginHorizontal: 15 }}>
                            <Text bold> Prix de la carte: </Text>
                            <Text>
                                {card?.data?.carte?.sale_price}
                            </Text>
                        </Block>
                        <Block row space={"between"} style={{ marginHorizontal: 15 }}>
                            <Text bold> Carte status : </Text>
                            <Text>
                                {InvitationStatus[card?.data?.invitation_status]?.name}
                            </Text>
                        </Block>
                        <Block row space={"between"} style={{ marginHorizontal: 15 }}>
                            <Text bold> Cotisation status : </Text>
                            <Text>
                                {CardStatus[card?.data?.status]?.name}
                            </Text>
                        </Block>
                        <Grid marked={card?.total_pay} />
                        <Block center>
                            {!isTontiner && cardStatus()?.value === InvitationStatus.PENDING.value &&
                                <Button
                                    onPress={() => setShowAssociateModal(true)}
                                    color="white"
                                    style={{ width: width * 0.85 }}
                                >
                                    <Icon family={'AntDesign'} name={'link'} size={14} />
                                    <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                        Souscrire
                                    </Text>
                                </Button>
                            }
                            {/*Bouton pour que le tontinier rend l'argent cotiser au user: s'il a payer plus d'une fois */}
                            {isTontiner && cardStatus()?.value === CardStatus.NOT_COLLECTED.value &&
                                card?.total_pay >= card?.data?.data?.number_day &&
                                <Button
                                    onPress={() => handleCashRender()}
                                    color="white"
                                    style={{ width: width * 0.85 }}
                                >
                                    <Icon family={'MaterialIcons'} name={'payments'} size={14} />
                                    <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                        Rendre l'argent
                                    </Text>
                                </Button>
                            }
                            {isTontiner && card?.data?.status === CardStatus.REQUEST_SENT.value && requestId &&
                                <Button
                                    onPress={() => setShowValidateRequestModal(true)}
                                    color="white"
                                    isProcess={processValidateRequest}
                                    style={{ width: width * 0.85 }}
                                >
                                    <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                        Valider Retrait
                                    </Text>
                                </Button>
                            }
                            {/*Bouton pour que l'utilisateur payer une cotisation: s'il na pas encore finir de payer */}
                            {!isTontiner && cardStatus()?.value === CardStatus.NOT_COLLECTED.value &&
                                card?.total_pay < card?.data?.data?.number_day &&
                                <Button
                                    onPress={() => setShowPayModal(true)}
                                    color="white"
                                    style={{ width: width * 0.85 }}
                                >
                                    <Icon family={'MaterialIcons'} name={'payments'} size={14} />
                                    <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                        Payer
                                    </Text>
                                </Button>
                            }

                            {!isTontiner && card?.data?.status === CardStatus.NOT_COLLECTED.value &&
                                card?.total_pay >= 2 &&
                                <Button
                                    onPress={() => setShowRequestModal(true)}
                                    color="white"
                                    isProcess={processRequest}
                                    style={{ width: width * 0.85 }}
                                >
                                    <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                        Demander retrait
                                    </Text>
                                </Button>
                            }

                        </Block>
                        <ModalSheet visible={showAssociateModal} hide={() => setShowAssociateModal(false)}>
                            <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                                <Block center style={{ padding: 10 }}>
                                    <Formik
                                        initialValues={{ phone:  ''}}
                                        onSubmit={(values) => handleValidateAssociation(values)}
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
                                                        isProcess={validating}
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
                                                        > Valider  </Text>
                                                    </Button>
                                                </Block>
                                            </>
                                        )}

                                    </Formik>
                                </Block>
                            </Block>
                        </ModalSheet>
                        <ModalSheet visible={showPayModal} hide={() => setShowPayModal(false)}>
                            <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                                <Block center style={{ padding: 10 }}>
                                    <Formik
                                        initialValues={{
                                            send_phone:  '',
                                            number_payment: 1,
                                            object_id: id}}
                                        onSubmit={(values) => handlePayment(values)}
                                    >
                                        {formikProps => (
                                            <>
                                                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                                    <Input
                                                        shadowless={true}
                                                        placeholder="Numéro pour le paiment"
                                                        type="numeric"
                                                        onChangeText={formikProps.handleChange('send_phone')}
                                                        error={!!formikProps.errors.send_phone}
                                                        errorText={formikProps.errors.send_phone}
                                                        returnKeyType="next"
                                                    />
                                                </Block>
                                                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                                    <Input
                                                        shadowless={true}
                                                        placeholder="Nombre de paiement"
                                                        type="numeric"
                                                        onChangeText={formikProps.handleChange('number_payment')}
                                                        error={!!formikProps.errors.number_payment}
                                                        errorText={formikProps.errors.number_payment}
                                                        returnKeyType="next"
                                                    />
                                                </Block>
                                                <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                                                    <Button
                                                        onPress={formikProps.handleSubmit}
                                                        isProcess={processPayment}
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
                                                        > Valider  </Text>
                                                    </Button>
                                                </Block>
                                            </>
                                        )}

                                    </Formik>
                                </Block>
                            </Block>
                        </ModalSheet>
                        <ModalSheet visible={showRequestModal} hide={() => setShowRequestModal(false)}>
                            <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                                <Block center style={{ padding: 10 }}>
                                    <Formik
                                        initialValues={{
                                            receiver_phone:  '',
                                            object_id: id}}
                                        onSubmit={(values) => handleRequest(values)}
                                    >
                                        {formikProps => (
                                            <>
                                                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                                    <Input
                                                        shadowless={true}
                                                        placeholder="Numéro pour le paiment"
                                                        type="numeric"
                                                        onChangeText={formikProps.handleChange('receiver_phone')}
                                                        error={!!formikProps.errors.receiver_phone}
                                                        errorText={formikProps.errors.receiver_phone}
                                                        returnKeyType="next"
                                                    />
                                                </Block>
                                                <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                                                    <Button
                                                        onPress={formikProps.handleSubmit}
                                                        isProcess={processRequest}
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
                                                        > Valider  </Text>
                                                    </Button>
                                                </Block>
                                            </>
                                        )}

                                    </Formik>
                                </Block>
                            </Block>
                        </ModalSheet>
                        <ModalSheet visible={showValidateRequestModal} hide={() => setShowValidateRequestModal(false)}>
                            <Block style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                                <Block center style={{ padding: 10 }}>
                                    <Formik
                                        initialValues={{
                                            sender_phone:  '',
                                        }}
                                        onSubmit={(values) => handleValidateRequest(values)}
                                    >
                                        {formikProps => (
                                            <>
                                                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                                                    <Input
                                                        shadowless={true}
                                                        placeholder="Numéro pour le paiment"
                                                        type="numeric"
                                                        onChangeText={formikProps.handleChange('sender_phone')}
                                                        error={!!formikProps.errors.sender_phone}
                                                        errorText={formikProps.errors.sender_phone}
                                                        returnKeyType="next"
                                                    />
                                                </Block>
                                                <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                                                    <Button
                                                        onPress={formikProps.handleSubmit}
                                                        isProcess={processValidateRequest}
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
                                                        > Valider  </Text>
                                                    </Button>
                                                </Block>
                                            </>
                                        )}

                                    </Formik>
                                </Block>
                            </Block>
                        </ModalSheet>
                    </Block>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        justifyContent: 'space-between',
        padding: 10,
    },
    gridItemMarked: {
        backgroundColor: appTheme.COLORS.PRIMARY,
        color: appTheme.COLORS.WHITE,
    },
    container: {
        flex: 1,
        margin: 5,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    gridItem: {
        width: '14.28%', // 100% / 7
        aspectRatio: 1, // Ensure square items, adjust as needed
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
    },
});

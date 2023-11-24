import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import { Block, Text } from "galio-framework";
import Header from "../../../../../components/Header";
import Stack from "expo-router/src/layouts/Stack";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { appTheme } from "../../../../../constants";
import {
    useAssociateCardMutation,
    useDeleteCardMutation,
    useGetAssociateCardDetailQuery,
    useGetTontinerCardDetailQuery, useMakePaymentMutation, useValidateAssociateMutation,
} from "../../../../../store/features/card/card.services";
import { useAppSelector } from "../../../../../utils/hooks";
import {Button, Icon, Input, ModalSheet} from "../../../../../components";
import {TransactionStatus, InvitationStatus, CardStatus} from "../../../../../constants/status";
import {Formik} from "formik";

const { width } = Dimensions.get('screen');

const Grid = ({ marked }) => {
    const data = new Array(31).fill(null).map((_, index) => index + 1);
    const dataMarked = new Array(marked).fill(null).map((_, index) => index + 1);

    const renderGridItem = ({ item }) => (
        <Block style={[styles.gridItem, dataMarked.includes(item) ? styles.gridItemMarked : ""]}>
            <Text>{item}</Text>
        </Block>
    );

    return (
        <Block style={{ width: width, borderColor: appTheme.COLORS.BORDER, backgroundColor: appTheme.COLORS.WHITE }}>
            <FlatList
                data={data}
                renderItem={renderGridItem}
                keyExtractor={(item) => item.toString()}
                numColumns={7}
                contentContainerStyle={styles.gridContainer}
            />
        </Block>
    );
};

export default function CardPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [showAssociateModal, setShowAssociateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

    const [deleteCard, { loading }] = useDeleteCardMutation();

    const user = useAppSelector((state) => state.user.currentUser);
    const card = useAppSelector((state) => state.card.currentCard);

    const {isFetching} = useGetAssociateCardDetailQuery({ id }, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        skip: !id
    });

    const [validateAssociate, { loading: validating }] = useValidateAssociateMutation();
    const [makePayment, { loading: processPayment }] = useMakePaymentMutation();

    const handleValidateAssociation = async (values) => {
        try {
            const data = {
                ...values,
                id: id,
                status: 'ACCEPTED',
            };

            await validateAssociate(data);

            setShowAssociateModal(false);
        } catch (e) {}
    };

    const handlePayment = async (values) => {
        try {
            const data = {
                ...values,
                send_phone: card?.data?.carte?.tontinier?.phone
            };
            console.log("values", data)
            await makePayment(values);

            setShowPayModal(false);
        } catch (e) {}
    };

    const cardStatus = () => {
        const invitationStatus = card?.data?.invitation_status
        const tranStatus = card?.data?.transaction_status
        const status = card?.data?.status
        console.log(card?.total_pay < card?.data?.data?.number_day)
        if(invitationStatus === InvitationStatus.PENDING.value) {
            return InvitationStatus.PENDING
        }else if (invitationStatus === InvitationStatus.ACCEPTED.value && status === CardStatus.NOT_COLLECTED.value) {
            return CardStatus.NOT_COLLECTED
        } else {
            return CardStatus.NOT_COLLECTED
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    header: ({ navigation, scene }) => (
                        <Header title={'Cartes N° ' + id} back navigation={navigation} scene={scene} />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" },
                }}
            />
            {isFetching &&
                <Block flex center middle>
                    <ActivityIndicator size={'large'} color={appTheme.COLORS.SECONDARY} />
                </Block>
            }
            { !isFetching && (
                <Block flex center style={{ width: width }}>
                    <Block center style={{ marginVertical: 10 }}>
                        <Block center>
                            <Text size={26} style={{ fontWeight: '600' }}> {card?.data?.carte?.name} </Text>
                        </Block>
                        <Text bold style={{ marginVertical: 5 }}>{card?.data?.carte?.description} </Text>
                        <Text style={{ marginVertical: 5 }}>
                            <Text bold> Cotisation: </Text>
                            {card?.data?.carte?.amount}/Tour
                        </Text>
                        <Text style={{ marginVertical: 5 }}>
                            <Text bold> Taxe: </Text>
                            {card?.data?.carte?.gain}
                        </Text>
                        <Text style={{ marginVertical: 5 }}>
                            <Text bold> Prix de la carte: </Text>
                            {card?.data?.carte?.sale_price}
                        </Text>
                        <Text style={{ marginVertical: 5 }}>
                            <Text bold> Status : </Text>
                            {cardStatus()?.name}
                        </Text>
                    </Block>
                    <Grid marked={card?.total_pay} />
                    <Block>
                        {/*<Button*/}
                        {/*    onPress={() => router.push({ pathname: '/tontine/card/tontiner/update', params: { id: id } })}*/}
                        {/*    color="white"*/}
                        {/*    style={{ width: width * 0.85 }}*/}
                        {/*>*/}
                        {/*    <Icon family={'AntDesign'} name={'edit'} size={14} />*/}
                        {/*    <Text bold size={12} color={appTheme.COLORS.SECONDARY} style={{ marginLeft: 10 }}>*/}
                        {/*        Modifier*/}
                        {/*    </Text>*/}
                        {/*</Button>*/}

                        {cardStatus()?.value === InvitationStatus.PENDING.value &&
                            <Button
                                onPress={() => setShowAssociateModal(true)}
                                color="white"
                                style={{ width: width * 0.85 }}
                            >
                                <Icon family={'AntDesign'} name={'link'} size={14} />
                                <Text bold size={12} color={appTheme.COLORS.PRIMARY} style={{ marginLeft: 10 }}>
                                    Valider l'achat
                                </Text>
                            </Button>
                        }

                        {cardStatus()?.value === CardStatus.NOT_COLLECTED.value &&
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
                                        number_payment: card?.data?.carte?.tontinier?.phone,
                                        object_id: id}}
                                    onSubmit={(values) => handlePayment(values)}
                                >
                                    {formikProps => (
                                        <>
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
                </Block>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        justifyContent: 'space-between',
        padding: 10,
    },
    gridItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        margin: 2,
    },
    gridItemMarked: {
        backgroundColor: appTheme.COLORS.PRIMARY,
        color: appTheme.COLORS.WHITE,
    },
});

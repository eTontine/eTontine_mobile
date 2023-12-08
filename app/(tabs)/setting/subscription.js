import {ActivityIndicator, Alert, Dimensions, Pressable, ScrollView, StyleSheet} from 'react-native'
import {Block, Text} from "galio-framework";
import {useAppSelector} from "../../../utils/hooks";
import {appTheme} from "../../../constants";
import {Button, Input, ModalSheet} from "../../../components";
import Header from "../../../components/Header";
import Stack from "expo-router/src/layouts/Stack";
import React, {useEffect, useState} from "react";
import {formatDateToString} from "../../../utils/date";
import {Formik} from "formik";
import {
    useGetSubscriptionsQuery,
    useGetMySubscriptionQuery,
    useSubscribeMutation
} from "../../../store/features/subscription/subscription.services";
import accountType from "../../../constants/accountType";
import {subscriptionStatus} from "../../../constants/subscriptions";
import {useGetMeQuery} from "../../../store/features/user/user.services";

const { width, height } = Dimensions.get('screen');

const SubscriptionType = ({name, active, onPress}) => {
    const style  = [styles.inactive, active && {borderColor: appTheme.COLORS.PRIMARY}]

    return (
        <Pressable style={style} onPress={onPress}>
            <Text style={{color: active ? appTheme.COLORS.PRIMARY : appTheme.COLORS.SECONDARY}}>{name}</Text>
        </Pressable>
    )
}

const SubscriptionTypeDetail = ({item}) => {
    return (
        <Block center style={{ marginTop: 20 }}>
            <Text size={25} color={appTheme.COLORS.BLACK} style={{ marginVertical: 20 }}> {item.name} </Text>
            <Block center style={{ marginVertical: 20 }}>
                <Text size={48} color={appTheme.COLORS.SECONDARY}>
                    {item.sale_price} XOF
                </Text>
                <Text size={16}> par mois </Text>
            </Block>
           <Block style={{ marginTop: 20 }}>
               <Block center row style={styles.row}>
                   <Block flex center>
                       <Text size={16} style={{ fontWeight: 600 }}>Durée:</Text>
                   </Block>
                   <Block flex center>
                       <Text size={16} >{item.duration_days}</Text>
                   </Block>
               </Block>
               <Block center row style={styles.row}>
                   <Block flex center>
                       <Text size={16} style={{ fontWeight: 600}}>Nombre de groupe:</Text>
                   </Block>
                   <Block flex center>
                       <Text size={16}>{item.interval_groupe_max == -1 ? 'illimité' : item.interval_groupe_max}</Text>
                   </Block>
               </Block>
               <Block center row style={styles.row}>
                   <Block flex center>
                       <Text size={16} style={{ fontWeight: 600 }}>Nombre d'utilisateur:</Text>
                   </Block>
                   <Block flex center>
                       <Text size={16} >{item.interval_user_max == -1 ? 'illimité' : item.interval_user_max}</Text>
                   </Block>
               </Block>
           </Block>
        </Block>
    );
}

const PaymentModal = ({showPayModal, onPress, cancelPay, isProcess}) => {
    return (
        <ModalSheet visible={showPayModal}>
            <Block center style={{ padding: 10 }}>
                <Formik
                    initialValues={{ phone: ''}}
                    onSubmit={(values) => onPress(values)}
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
                            <Block row >
                                <Button onPress={cancelPay} isProcess={false} color="white">
                                    <Text bold size={16} color={appTheme.COLORS.BLACK}>
                                        Annuler
                                    </Text>
                                </Button>
                                <Button onPress={formikProps.handleSubmit} isProcess={isProcess} loaderColor={'white'} color="secondary">
                                    <Text bold size={16} color={appTheme.COLORS.WHITE}>
                                        Payer
                                    </Text>
                                </Button>
                            </Block>
                        </>
                    )}

                </Formik>
            </Block>
        </ModalSheet>
    );
}

const SubscriptionScreen = () =>  {
    const [showSubModal, setShowSubModal] = useState(false)
    const [showPayModal, setShowPayModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const user = useAppSelector(state => state.user.currentUser)
    const [currentSub, setCurrentSub] = useState(0)

    const {isFetching} = useGetMySubscriptionQuery({},{skip: !user})
    const mySubscription = useAppSelector(state => state.subscription.mySubscription)

    useGetSubscriptionsQuery()
    const subscriptions = useAppSelector(state => state.subscription.subscriptions)

    const [subscribe] = useSubscribeMutation()

    useEffect(() => {
        console.log("mySubscription", mySubscription)
        console.log("isFetching", isFetching)
    }, [mySubscription, isFetching])

    const toggleDisplaySub = (index) => {
        setCurrentSub(index)
    }
    const toggleSubModal = () => {
        Alert.alert(
            'Nouveau Abonnement',
            'L\'activation d\'un nouvel abonnement annulera automatiquement votre abonnement actuel, et ce dernier ne sera plus valide.',
            [
                {text: "Annuler", onPress: () => {}, style: 'cancel'},
                {text: "Continuer", onPress: () => setShowSubModal(true)}
            ]

        )
    }
    const togglePayModal = () => {
        setShowPayModal(true)
    }

    const doSubscribe = async (values) => {
        setIsLoading(true)
        const data = {
            abonnement: subscriptions[currentSub]?.id,
            user_phone: values.phone
        }
        const res = await subscribe(data)

        if(res.ok) {
            setShowPayModal(false)
            setShowSubModal(false)
            setIsLoading(false)
            useGetMeQuery()
        } else {
            setShowPayModal(false)
            setShowSubModal(false)
            setIsLoading(false)
        }

    }

    return (
        <>
            <Stack.Screen options={{
                header:  () => (
                    <Header
                        back
                        title="Abonnement"
                    />
                ),
                cardStyle: { backgroundColor: "#F8F9FE" },
            }} />
            {isFetching && (
                <Block flex center middle>
                    <ActivityIndicator color={appTheme.COLORS.SECONDARY} size={"large"} />
                </Block>
            )}
            {!isFetching && (
                <Block flex center middle>
                    <Text size={26} style={{ fontWeight: 600 }}> {user?.name} </Text>
                    <Text  style={styles.accountType}> {user?.account_type} </Text>
                    <Text size={16} style={{ fontWeight: 600 }}> {user?.country?.phone_code} {user?.phone} </Text>
                    <Block card center style={{ backgroundColor: appTheme.COLORS.WHITE, margin: 5, padding: 15 }}>
                        <Text size={14} style={{ fontWeight: 600, marginVertical: 10 }}> Détails de l'abonnement en cours </Text>
                        <Block row style={styles.row}>
                            <Block flex>
                                <Text size={12} style={{ fontWeight: 600 }}>Type d'abonnement:</Text>
                            </Block>
                            <Block flex>
                                <Text size={12}> { mySubscription?.abonnement?.name || '--------' } </Text>
                            </Block>
                        </Block>
                        <Block row style={styles.row}>
                            <Block flex>
                                <Text size={12} style={{ fontWeight: 600 }}>Status:</Text>
                            </Block>
                            <Block flex>
                                <Text color={appTheme.COLORS[subscriptionStatus[mySubscription?.status_abonnement]?.color || '']} size={12}> { mySubscription?.status_abonnement ? subscriptionStatus[mySubscription?.status_abonnement].name : '--------' } </Text>
                            </Block>
                        </Block>
                        <Block row style={styles.row}>
                            <Block flex>
                                <Text size={12} style={{ fontWeight: 600 }}>Durée d'abonnement:</Text>
                            </Block>
                            <Block flex>
                                <Text size={12}>{ mySubscription?.abonnement?.duration_days || '--------' }</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.row}>
                            <Block flex>
                                <Text size={12} style={{ fontWeight: 600 }}>Date début:</Text>
                            </Block>
                            <Block flex>
                                <Text size={12}>{ mySubscription?.created_at ? formatDateToString(mySubscription?.created_at) : '--------' }</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.row}>
                            <Block flex>
                                <Text size={12} style={{ fontWeight: 600 }}>Date fin:</Text>
                            </Block>
                            <Block flex>
                                <Text size={12}>{ mySubscription?.expired_date ? formatDateToString(mySubscription?.expired_date) : '--------' }</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.row}>
                            <Block flex>
                                <Text size={12} style={{ fontWeight: 600 }}>Montant:</Text>
                            </Block>
                            <Block flex>
                                <Text size={12}>{ mySubscription?.sale_price ? mySubscription?.sale_price + ' XOF' : '--------' }</Text>
                            </Block>
                        </Block>
                    </Block>
                    <Block center >
                        <Button onPress={toggleSubModal} isProcess={false} color="secondary" style={styles.newSubscriptionBtn}>
                            <Text bold size={16} color={appTheme.COLORS.WHITE}>
                                Activer un abonnement
                            </Text>
                        </Button>
                    </Block>
                    <ModalSheet visible={showSubModal}  hide={() => setShowSubModal(false)}>
                        <Block style={{ height: height * 0.85, backgroundColor: appTheme.COLORS.WHITE, paddingVertical: 15, paddingHorizontal: 5 , borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                            <Block row center style={{ marginHorizontal: 14,  }} >
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {subscriptions.map((item, index) => <SubscriptionType key={index} name={item.name} active={currentSub === index} onPress={() => toggleDisplaySub(index)} />)}
                                </ScrollView>
                            </Block>
                            <Block flex middle>
                                <SubscriptionTypeDetail item={subscriptions[currentSub]} />
                                <Block center style={{ width: width * 0.8, marginVertical: 50 }}>
                                    <Button onPress={togglePayModal} isProcess={false} color="secondary" style={{ marginTop: 30}}>
                                        <Text bold size={16} color={appTheme.COLORS.WHITE}>
                                            Activer
                                        </Text>
                                    </Button>
                                </Block>
                            </Block>
                            <PaymentModal
                                showPayModal={showPayModal}
                                cancelPay={() => setShowPayModal(false)}
                                isProcess={isLoading}
                                onPress={(values) => doSubscribe(values)} />
                        </Block>
                    </ModalSheet>
                </Block>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    row: {
      width: width * 0.80,
      borderStyle: 'dashed',
      borderColor: appTheme.COLORS.BORDER_COLOR,
      borderBottomWidth: 2,
      paddingVertical: 10
    },
    username: {

    },
    accountType: {
        backgroundColor: appTheme.COLORS.PRIMARY,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: appTheme.COLORS.WHITE,
        borderRadius: 5,
        fontWeight: 600
    },
    newSubscriptionBtn: {
        width: width * 0.8,
        height: 55,
        borderRadius: 10
    },
    inactive: {
        width : width / 3,
        borderStyle: 'solid',
        borderColor: appTheme.COLORS.BORDER,
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10,
        marginHorizontal: 5
    }
})


export default SubscriptionScreen;
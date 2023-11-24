import React, {useEffect} from "react";
import {Dimensions, ScrollView, KeyboardAvoidingView} from "react-native";
import {Formik} from "formik";
import {Block, Text} from "galio-framework";
import {appTheme} from "../../../../../../constants";
import {Button, Input} from "../../../../../../components";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../../../../components/Header";
import {
    useCreateCardMutation,
    useGetTontinerCardDetailQuery,
    useUpdateCardMutation
} from "../../../../../../store/features/card/card.services";
import {useAppSelector} from "../../../../../../utils/hooks";
import {useLocalSearchParams, useRouter} from "expo-router";

const { width, height } = Dimensions.get('screen')

const CreateCardForm = ({ handleSubmit, isLoading, current, isEdit }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20 }}
        >
            <Formik
                initialValues={{
                    amount: current.amount,
                    name: current?.name,
                    description: current?.description,
                    number_day: current?.description,
                    gain: current?.gain,
                    tontinier: current?.tontinier,
                    sale_price: current?.sale_price,
                }}
                onSubmit={(values) => handleSubmit(values) }
            >
                {(formikProps) => (
                    <>
                        <Block safe flex middle>
                            <Block flex={0.25} middle style={{ /* Style de votre choix */ }}>
                                <Text color={appTheme.COLORS.BLACK} size={28} style={{ marginBottom: 10 }}>
                                    {isEdit ? 'Modification' : 'Créer une carte'}
                                </Text>
                            </Block>
                            <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'} enabled >
                                <Block flex center>
                                    <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                                        <Input
                                            shadowless={true}
                                            placeholder="Nom"
                                            label={'Nom'}
                                            onChangeText={formikProps.handleChange('name')}
                                            error={!!formikProps.errors.name}
                                            errorText={formikProps.errors.name}
                                            returnKeyType="next"
                                        />
                                    </Block>
                                    <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                                        <Input
                                            shadowless={true}
                                            placeholder="Description"
                                            label={'Description'}
                                            onChangeText={formikProps.handleChange('description')}
                                            error={!!formikProps.errors.description}
                                            errorText={formikProps.errors.description}
                                            returnKeyType="next"
                                            style={{ height: 80 }}
                                            multiline
                                            numberOfLines={5}
                                        />
                                    </Block>
                                    <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                                        <Input
                                            shadowless={true}
                                            placeholder="Montant"
                                            label={'Montant'}
                                            type="numeric"
                                            onChangeText={formikProps.handleChange('amount')}
                                            error={!!formikProps.errors.amount}
                                            errorText={formikProps.errors.amount}
                                            returnKeyType="next"
                                        />
                                    </Block>
                                    <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                                        <Input
                                            shadowless={true}
                                            placeholder="Nombre de jour"
                                            label={'Nombre de Jour'}
                                            type="numeric"
                                            onChangeText={formikProps.handleChange('number_day')}
                                            error={!!formikProps.errors.number_day}
                                            errorText={formikProps.errors.number_day}
                                            returnKeyType="next"
                                        />
                                    </Block>
                                    <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                                        <Input
                                            shadowless={true}
                                            placeholder="Gain"
                                            label={'Gain'}
                                            type="numeric"
                                            onChangeText={formikProps.handleChange('gain')}
                                            error={!!formikProps.errors.gain}
                                            errorText={formikProps.errors.gain}
                                            returnKeyType="next"
                                        />
                                    </Block>
                                    <Block width={width * 0.8} >
                                        <Input
                                            shadowless={true}
                                            placeholder="Coût carte"
                                            label={'Prix de la carte'}
                                            type="numeric"
                                            onChangeText={formikProps.handleChange('sale_price')}
                                            error={!!formikProps.errors.sale_price}
                                            errorText={formikProps.errors.sale_price}
                                            returnKeyType="next"
                                        />
                                    </Block>

                                </Block>
                            </KeyboardAvoidingView>
                        </Block>
                        <Block flex={0.35} middle>
                            <Button onPress={formikProps.handleSubmit} isProcess={isLoading} color="primary">
                                <Text bold size={16} color={appTheme.COLORS.SECONDARY}>
                                    Créer la carte
                                </Text>
                            </Button>
                        </Block>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
};

const CreateCard = () => {

    const router = useRouter()
    const user = useAppSelector(state => state.user.currentUser)
    const card = useAppSelector(state => state.card.currentCard)
    const [storeCard, {isLoading: storingCard}] = useCreateCardMutation()
    const [updateCard, {isLoading: updatingCard}] = useUpdateCardMutation()
    const { id } = useLocalSearchParams();

    useEffect(() => {
        console.log(user)
    }, [user])

    useGetTontinerCardDetailQuery({id}, {skip: !id})

    const handleSubmit = async (values) => {
        const data = {...values, tontinier: user?.id}
        try {
            if(id) {
                const res = await updateCard(data)
                router.replace('/tontine')
            } else {
                const res = await storeCard(data)
                router.replace('/tontine')
            }

        } catch (e) {
        }

    }

    return (
        <>
            <Stack.Screen options={{
                header:  ({ navigation, scene }) => (
                    <Header
                        back
                        title={id ? "Modifier carte" : "Nouvelle Carte"}
                    />
                ),
                cardStyle: { backgroundColor: "#F8F9FE" },
            }} />
            <Block flex center style={{width: width}}>
                <CreateCardForm
                    handleSubmit={(values) => handleSubmit(values)}
                    isLoading={storingCard || updatingCard}
                    current={card}
                    isEdit={!!id} />
            </Block>
        </>
    );
}

export default CreateCard
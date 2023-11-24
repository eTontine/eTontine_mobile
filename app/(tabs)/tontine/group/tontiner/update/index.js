import React, {useEffect} from "react";
import {Dimensions, ScrollView, KeyboardAvoidingView, ActivityIndicator} from "react-native";
import {Formik} from "formik";
import {Block, Text} from "galio-framework";
import {appTheme} from "../../../../../../constants";
import {Button, Input, Select} from "../../../../../../components";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../../../../components/Header";
import {
    useCreateGroupMutation, useGetRulesQuery,
    useGetTontinerGroupDetailQuery,
    useUpdateGroupMutation
} from "../../../../../../store/features/group/group.services";
import {useAppSelector} from "../../../../../../utils/hooks";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Picker} from "@react-native-picker/picker";

const { width, height } = Dimensions.get('screen')

const CreateGroupForm = ({ handleSubmit, isLoading, current, rules, isEdit }) => {
    const periods = ['DAY', 'WEEK', 'MONTH']
    const hours = [];

    for (let i = 0; i < 24; i++) {
        const formattedHour = ("0" + i).slice(-2);
        hours.push(`${formattedHour}:00`);
    }

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    console.log(hours)
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
                    gain: current?.gain,
                    tontinier: current?.tontinier,
                    sale_price: current?.sale_price,
                    contribution_period: current?.contribution_period,
                    time_contribution: current?.time_contribution,
                    day_contribution: current?.day_contribution,
                    rule_answers: current?.rule_answers,
                }}
                onSubmit={(values) => handleSubmit(values) }
            >
                {(formikProps) => (
                    <>
                        <Block safe flex middle>
                            <Block flex={0.25} middle style={{ /* Style de votre choix */ }}>
                                <Text color={appTheme.COLORS.BLACK} size={28} style={{ marginBottom: 10 }}>
                                    {isEdit ? 'Modifier le groupe' : 'Créer un groupe'}
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
                                    <Block width={width * 0.8} >
                                        <Select
                                            selected={formikProps.values.contribution_period}
                                            onChange={formikProps.handleChange('contribution_period')}
                                            label={"Selectionner la période de contributio"}
                                        >
                                            {periods.map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            ))}
                                        </Select>
                                    </Block>
                                    <Block width={width * 0.8} >
                                        <Select
                                            selected={formikProps.values.time_contribution}
                                            onChange={formikProps.handleChange('time_contribution')}
                                            label={"Selectionner l'heure de contribution"}
                                        >
                                            {hours.map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            ))}
                                        </Select>
                                    </Block>
                                    <Block width={width * 0.8} >
                                        <Select
                                            selected={formikProps.values.day_contribution}
                                            onChange={formikProps.handleChange('day_contribution')}
                                            label={"Selectionner les jours de contribution"}
                                        >
                                            {days.map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            ))}
                                        </Select>
                                    </Block>
                                    {rules.map((rule, index) => (
                                        <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                                            <Input
                                                shadowless={true}
                                                placeholder={rule.title}
                                                label={rule.title}
                                                type="numeric"
                                                onChangeText={(value) => {
                                                    const existingIndex = (formikProps.values.rule_answers || []).findIndex(
                                                        (item) => item.rule_id === rule.id
                                                    );

                                                    if (existingIndex !== -1) {
                                                        formikProps.setFieldValue('rule_answers', [
                                                            ...formikProps.values.rule_answers.slice(0, existingIndex),
                                                            { ...formikProps.values.rule_answers[existingIndex], value: parseInt(value) },
                                                            ...formikProps.values.rule_answers.slice(existingIndex + 1)
                                                        ]);
                                                    } else {
                                                        formikProps.setFieldValue('rule_answers', [
                                                            ...(formikProps.values.rule_answers || []),
                                                            { rule_id: rule.id, value: parseInt(value) }
                                                        ]);
                                                    }
                                                }}
                                                error={!!formikProps.errors.rule_answers && formikProps.errors.rule_answers[index]}
                                                errorText={formikProps.errors.rule_answers && formikProps.errors.rule_answers[index]}
                                                returnKeyType="next"
                                            />
                                        </Block>
                                    ))}
                                </Block>
                                <Block center style={{ marginTop: 50 }}>
                                    <Button onPress={formikProps.handleSubmit} isProcess={isLoading} color="primary">
                                        <Text bold size={16} color={appTheme.COLORS.SECONDARY}>
                                            Créer la groupe
                                        </Text>
                                    </Button>
                                </Block>
                            </KeyboardAvoidingView>
                        </Block>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
};

const CreateGroup = () => {

    const router = useRouter()
    const user = useAppSelector(state => state.user.currentUser)
    const group = useAppSelector(state => state.group.currentGroup)
    const rules = useAppSelector(state => state.group.rules)
    const [storeGroup, {isLoading: storingGroup}] = useCreateGroupMutation()
    const [updateGroup, {isLoading: updatingGroup}] = useUpdateGroupMutation()
    const { id } = useLocalSearchParams();

    useEffect(() => {
        console.log(user)
    }, [user])

    const {isFetching} = useGetRulesQuery()

    useGetTontinerGroupDetailQuery({id}, {skip: !id})

    const handleSubmit = async (values) => {
        const data = {...values, tontinier: user?.id}
        try {
            if(id) {
                const res = await updateGroup(data)
                router.replace('/tontine')
            } else {
                const res = await storeGroup(data)
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
                        title={id ? "Modifier groupe" : "Nouveau groupe"}
                    />
                ),
                groupStyle: { backgroundColor: "#F8F9FE" },
            }} />
            <Block flex center style={{width: width}}>
                {isFetching &&
                    <Block flex center middle>
                        <ActivityIndicator color={appTheme.COLORS.SECONDARY} size={"large"} />
                    </Block>
                }
                {!isFetching &&
                    <CreateGroupForm
                        handleSubmit={(values) => handleSubmit(values)}
                        isLoading={storingGroup || updatingGroup}
                        current={group}
                        rules={rules}
                        isEdit={!!id} />
                }

            </Block>
        </>
    );
}

export default CreateGroup
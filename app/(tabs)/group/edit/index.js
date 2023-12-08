import React, {useEffect} from "react";
import {Dimensions, ScrollView, KeyboardAvoidingView, ActivityIndicator} from "react-native";
import {Formik} from "formik";
import {Block, Text} from "galio-framework";
import {appTheme} from "../../../../constants";
import {Button, Input, Select} from "../../../../components";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../../components/Header";
import {
    useCreateGroupMutation, useGetRulesQuery,
    useGetTontinerGroupDetailQuery,
    useUpdateGroupMutation
} from "../../../../store/features/group/group.services";
import {useAppSelector} from "../../../../utils/hooks";
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
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20 }}
        >
            <Formik
                initialValues={{
                    amount: current?.groupe?.amount,
                    name: current?.groupe?.name,
                    descriptions: current?.groupe?.descriptions,
                    gain: current?.groupe?.gain,
                    tontinier: '',
                    contribution_period: current?.groupe?.contribution_period,
                    time_contribution: current?.groupe?.time_contribution,
                    day_contribution: current?.groupe?.day_contribution,
                    rule_answers: current?.rules,
                }}
                onSubmit={(values) => handleSubmit(values) }
            >
                {(formikProps) => (
                    <>
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'} enabled >
                            <Block flex center>
                                <Block width={width * 0.9} style={{ marginBottom: 10 }}>
                                    <Input
                                        shadowless={true}
                                        label={'Nom'}
                                        onChangeText={formikProps.handleChange('name')}
                                        value={formikProps.values.name}
                                        error={!!formikProps.errors.name}
                                        errorText={formikProps.errors.name}
                                        returnKeyType="next"
                                    />
                                </Block>
                                <Block width={width * 0.9} style={{ marginBottom: 10 }}>
                                    <Input
                                        shadowless={true}
                                        label={'Description'}
                                        value={formikProps.values.descriptions}
                                        onChangeText={formikProps.handleChange('descriptions')}
                                        error={!!formikProps.errors.descriptions}
                                        errorText={formikProps.errors.descriptions}
                                        returnKeyType="next"
                                        style={{ height: 80 }}
                                        multiline
                                        numberOfLines={5}
                                    />
                                </Block>
                                <Block width={width * 0.9} style={{ marginBottom: 10 }}>
                                    <Input
                                        shadowless={true}
                                        label={'Gain'}
                                        type="numeric"
                                        value={formikProps.values.gain}
                                        onChangeText={formikProps.handleChange('gain')}
                                        error={!!formikProps.errors.gain}
                                        errorText={formikProps.errors.gain}
                                        returnKeyType="next"
                                    />
                                </Block>
                                <Block width={width * 0.9} style={{ marginBottom: 10 }}>
                                    <Input
                                        shadowless={true}
                                        label={'Montant'}
                                        type="numeric"
                                        value={formikProps.values.amount}
                                        onChangeText={formikProps.handleChange('amount')}
                                        error={!!formikProps.errors.amount}
                                        errorText={formikProps.errors.amount}
                                        returnKeyType="next"
                                    />
                                </Block>
                                <Block width={width * 0.9} >
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
                                <Block width={width * 0.9} >
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
                                <Block width={width * 0.9} >
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
                                    <Block width={width * 0.9} style={{ marginBottom: 10 }}>
                                        <Input
                                            shadowless={true}
                                            label={rule.title}
                                            type="numeric"
                                            value={formikProps.values.rule_answers[index]?.value}
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
                            <Block center style={{ marginTop: 40,  }}>
                                <Button onPress={formikProps.handleSubmit}
                                        isProcess={isLoading}
                                        color="primary"
                                        style={{width: width * 0.9}}>
                                    <Text bold size={16} color={appTheme.COLORS.SECONDARY}>
                                        {"Enregistrer"}
                                    </Text>
                                </Button>
                            </Block>
                        </KeyboardAvoidingView>
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
        const data = {...values, tontinier: user?.id, id: id || ''}
        try {
            if(id) {
                const res = await updateGroup(data)
                console.log("res", res)
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
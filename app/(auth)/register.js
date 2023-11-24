import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Pressable,
    StatusBar,
    StyleSheet
} from "react-native";
import {Link, useRouter} from "expo-router";
import {Block, Checkbox, Text} from "galio-framework";
import {appImages, appTheme} from "../../constants";
import {Button, Icon, Input, Select} from "../../components";
import {Formik} from "formik";
import {useRegisterMutation} from "../../store/features/auth/auth.services";
import {Picker} from "@react-native-picker/picker";
import {useGetCountryQuery} from "../../store/features/core/core.services";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {setMessage} from "../../store/features/alert/alert.slice";

const { width, height } = Dimensions.get("screen");


const RegisterScreen = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [country, setCountry] = useState()
    const [acceptPolicy, setAcceptPolicy] = useState(false)
    const dispatch = useAppDispatch()

    useGetCountryQuery();
    const countries = useAppSelector(state => state.core.countries)
    const [register] = useRegisterMutation();

    const redirect = () => {
        router.push('/login')
    }

    const handleSubmit = async (values) => {
        if (!acceptPolicy) {
            return dispatch(setMessage({type: 'error', message: 'L\'utilisation de notre application nécessite que vous acceptiez nos politiques de confidentialité.'}))
        }
        if(!country) {
            return dispatch(setMessage({type: 'error', message: 'Il faut sélectionner un pays'}))
        }
        setIsLoading(true)
        register({...values, country})
            .then(res => {
                setIsLoading(false)
                console.log("handleSubmit", res)
                router.push('/login')
            })
            .catch(err => {
                console.error("handleSubmit register", err)
                setIsLoading(false)
            })
    };

    const toggleCountry = (value) => {
      setCountry(value)
    }

    const togglePolicy = (value) => {
        console.log("togglePolicy",value)
        setAcceptPolicy(value)
    }

    return (
        <Block flex middle>
            <StatusBar hidden />
            <ImageBackground
                source={appImages.LoginBg}
                style={{ width, height, zIndex: 1 }}
            >
                <Formik
                    initialValues={{ phone: '', code:'+229'}}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    {formikProps => (
                        <>
                            <Block safe flex middle>
                                <Block flex={0.35} middle>
                                    <Text style={{ marginBottom: 15, color: "#FFF", fontSize: 28 }}>
                                        Inscription
                                    </Text>
                                </Block>
                                <Block style={styles.registerContainer}>
                                    <Block flex center>
                                        <KeyboardAvoidingView
                                            style={{ flex: 1, justifyContent: 'center' }}
                                            behavior="padding"
                                            enabled
                                        >
                                            <Block>
                                                <Select
                                                    selected={country}
                                                    onChange={toggleCountry}
                                                    label={"Selectionner votre pays"}
                                                >
                                                    {countries.map((item, index) => (
                                                        <Picker.Item key={index} label={item.name} value={item.id} />
                                                    ))}
                                                </Select>
                                            </Block>
                                            <Block width={width * 0.8} >
                                                <Input
                                                    shadowless={true}
                                                    placeholder="Numéro de téléphone"
                                                    label={'Télephone'}
                                                    type="phone-pad"
                                                    onChangeText={formikProps.handleChange('phone')}
                                                    error={!!formikProps.errors.phone}
                                                    errorText={formikProps.errors.phone}
                                                    returnKeyType="next"
                                                />
                                            </Block>
                                            <Block width={width * 0.8} >
                                                <Input
                                                    shadowless={true}
                                                    password
                                                    placeholder="Code"
                                                    label={'Code'}
                                                    viewPass
                                                    onChangeText={formikProps.handleChange('code')}
                                                    error={!!formikProps.errors.code}
                                                    errorText={formikProps.errors.code}
                                                    type="numeric"
                                                    returnKeyType="done"
                                                />
                                            </Block>
                                            <Block row width={width * 0.75}>
                                                <Checkbox
                                                    checkboxStyle={{
                                                        borderWidth: 1,
                                                        borderRadius: 50,
                                                    }}
                                                    onChange={togglePolicy}
                                                    color={appTheme.COLORS.PRIMARY}
                                                    label="J’accepte la "
                                                />
                                                <Text style={{ color: appTheme.COLORS.PRIMARY, fontSize: 14 }}> politique de confidentialité </Text>
                                            </Block>

                                        </KeyboardAvoidingView>
                                    </Block>
                                </Block>
                            </Block>
                            <Block flex={0.30} middle>
                                <Button onPress={formikProps.handleSubmit} isProcess={isLoading} color="primary" style={styles.createButton}>
                                    <Text bold size={16} color={appTheme.COLORS.SECONDARY}>
                                        S'inscrire
                                    </Text>
                                </Button>
                                <Text style={{ marginVertical: 15, opacity: 0.6 }}>
                                    <Text color={"white"}>Vous avez déja un compte? </Text>
                                    <Link href={"login"} style={{ marginLeft: 5 }}>
                                        <Text bold size={16} center color={appTheme.COLORS.PRIMARY}>
                                            Connectez-vous
                                        </Text>
                                    </Link>
                                </Text>
                            </Block>
                        </>
                    )}

                </Formik>
            </ImageBackground>
        </Block>
    );
};


const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.50,
        backgroundColor: appTheme.COLORS.WHITE,
        borderRadius: 6,
        shadowColor: appTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden"
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.9,
        height: 55,
        borderRadius: 10
    }
});

export default RegisterScreen;
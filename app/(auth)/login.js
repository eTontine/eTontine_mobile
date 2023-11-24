import React, {useState} from 'react';
import {Dimensions, KeyboardAvoidingView, StatusBar, StyleSheet, ImageBackground} from "react-native";
import {Link, useRouter} from "expo-router";
import { Block, Text, theme } from "galio-framework";
import { Input, Icon, Button } from '../../components'
import {appImages, appTheme} from '../../constants'
import {useLoginMutation} from "../../store/features/auth/auth.services";
import {Formik} from "formik";
import {validate} from "../../validations/login";


const { width, height } = Dimensions.get("screen");

const LoginScreen = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [login] = useLoginMutation();

    const handleSubmit = async (values) => {
        setIsLoading(true)
        let phone = values.phone.replace(values.phone_code,"")
        let res = await login({...values, phone: phone})

        if(res.ok) {
            setIsLoading(false)
            router.replace('/tontine')
        } else {
            setIsLoading(false)
        }
    };

    return (
        <Block flex middle>
            <StatusBar hidden />
            <ImageBackground
                source={appImages.LoginBg}
                style={{ width, height, zIndex: 1 }}
            >
                <Formik
                    initialValues={{ code:'', phone: '', phone_code:'+229'}}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    {formikProps => (
                        <>
                            <Block safe flex middle>
                                <Block flex={0.25} middle style={styles.socialConnect}>
                                    <Text color="#fff" size={28} style={{ marginBottom: 15 }}>
                                        Connexion
                                    </Text>
                                </Block>
                                <Block style={styles.loginContainer}>
                                    <Block flex center>
                                        <KeyboardAvoidingView
                                            style={{ flex: 1, justifyContent: 'center' }}
                                            behavior="padding"
                                            enabled
                                        >
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
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
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Input
                                                    shadowless={true}
                                                    password
                                                    viewPass
                                                    placeholder="Code"
                                                    label={'Entrez votre code'}
                                                    onChangeText={formikProps.handleChange('code')}
                                                    error={!!formikProps.errors.code}
                                                    errorText={formikProps.errors.code}
                                                    type={"numeric"}
                                                    returnKeyType="done"
                                                />
                                            </Block>
                                            <Block width={width * 0.8}>
                                                <Text center italic muted> En utilisant cette application, vous acceptez nos <Text color={appTheme.COLORS.PRIMARY} style={{ textDecorationLine: 'underline' }}>conditions générales</Text>.</Text>
                                            </Block>
                                        </KeyboardAvoidingView>
                                    </Block>
                                </Block>
                            </Block>
                            <Block flex={0.35} middle>
                                <Button onPress={formikProps.handleSubmit} isProcess={isLoading} color="primary" style={styles.createButton}>
                                    <Text bold size={16} color={appTheme.COLORS.SECONDARY}>
                                        Se connecter
                                    </Text>
                                </Button>
                                <Text style={{ marginVertical: 20, opacity: 0.6 }}>
                                    <Text color={"white"}>Vous n’avez pas de compte? </Text>
                                    <Link href={"register"} style={{ marginLeft: 5 }}>
                                        <Text bold size={16} center color={appTheme.COLORS.PRIMARY}>
                                            Inscrivez-vous
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
    loginContainer: {
        width: width * 0.9,
        height: height * 0.40,
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

export default LoginScreen;
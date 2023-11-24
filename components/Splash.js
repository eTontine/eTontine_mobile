import React, { useEffect } from 'react';
import {Text, View, Image, ActivityIndicator, StyleSheet, ImageBackground, Dimensions} from 'react-native';
import { useRootNavigationState, useRouter } from 'expo-router';
import { appTheme, appImages } from '../constants'
import { Block, theme } from "galio-framework";
import {useAppSelector} from "../utils/hooks";

const { height, width } = Dimensions.get("screen");

export const Splash = () => {
    const navigation = useRouter()
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if(accessToken) {
    //             console.log("Splash screen accessToken", accessToken)
    //             navigation.replace("/tontine/");
    //         } else {
    //             navigation.replace('/login/');
    //         }
    //
    //     }, 10000);
    //
    //     return () => clearTimeout(timer);
    // }, [navigation]);

    return (
        <Block flex style={styles.container}>
            <ImageBackground
                source={appImages.LoginBg}
                style={{ height, width, zIndex: 1 }}
            >
                <Block flex middle>
                    <Image source={appImages.LogoOnboarding} style={styles.logo} />
                    {/*<ActivityIndicator size={"large"} color={appTheme.COLORS.SECONDARY}/>*/}
                </Block>
            </ImageBackground>
        </Block>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.BLACK
    },
    logo: {
        width: 80,
        height: 80,
        zIndex: 2,
        marginBottom: height / 4
    }
});
import React from 'react'
import {Block, Text} from "galio-framework";
import {appImages, appTheme} from "../../../constants";
import {Image} from "react-native";
import Header from "../../../components/Header";
import Stack from "expo-router/src/layouts/Stack";


const AboutScreen = () => {
    return (
        <>
            <Stack.Screen options={{
                header:  () => (
                    <Header
                        back
                        title="A Propos"
                    />
                ),
                cardStyle: { backgroundColor: "#F8F9FE" },
            }} />
            <Block flex center middle>
                <Block  center style={{ marginVertical: 'auto' }}>
                    <Image source={appImages.LogoOnboarding} style={{width: 80, height: 80}} />
                    <Text color={appTheme.COLORS.SECONDARY} bold size={16}> eTontine </Text>
                    <Block shadow
                           shadowColor
                           style={{
                               backgroundColor: appTheme.COLORS.WHITE,
                               padding: 15,
                               margin: 15,
                               borderRadius: 15
                           }}>
                        <Text color={appTheme.COLORS.MUTED}>
                            eTontine révolutionne la gestion des tontines avec une application mobile offrant une expérience transparente, sécurisée et efficace pour les tontiniers. Grâce aux transactions électroniques, le processus est simplifié, améliorant considérablement l'expérience des membres. L'application permet la création et l'invitation à des groupes de tontine, facilitant la gestion des cotisations et des retraits, tout en offrant un historique détaillé des opérations. En éliminant les risques d'erreurs, de pertes de données et de problèmes de sécurité, eTontine favorise un environnement harmonieux et fiable pour ses utilisateurs.
                        </Text>
                    </Block>
                </Block>
            </Block>
        </>
    );
}

export default AboutScreen;
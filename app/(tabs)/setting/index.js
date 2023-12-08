import {Block, Text} from "galio-framework";
import {Dimensions, Pressable, StyleSheet} from "react-native";
import {Button, Icon} from "../../../components";
import {appTheme} from "../../../constants";
import {useRouter} from "expo-router";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../components/Header";
import {useLogoutMutation} from "../../../store/features/auth/auth.services";
import {useState} from "react";
import {useAppDispatch} from "../../../utils/hooks";
import {logout} from "../../../store/features/auth/auth.slice";

const { width } = Dimensions.get('screen');

const Row = ({family, icon, text, onPress}) => {
    return (
        <Pressable onPress={onPress}  style={styles.rowContainer}>
            <Block style={styles.rowLeftIcon}>
                <Icon family={family} name={icon} size={20} color={appTheme.COLORS.ICON} style={{borderRadius:8}}/>
            </Block>
            <Block flex={1} style={{ marginLeft: 5 }}>
                <Text size={14} style={{color: appTheme.COLORS.BLACK}}>{text}</Text>
            </Block>
            <Block>
                <Icon family="MaterialIcons" name="keyboard-arrow-right" size={20} color={appTheme.COLORS.BLACK}/>
            </Block>
        </Pressable>
    )
}

const SettingScreen = () => {

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()

    const [logout] = useLogoutMutation()

    const signOut = () => {
        setIsLoading(true)
        try {
            dispatch(logout());
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
    }

    const handleRowPress = (route) => {
        router.push(route)
    }

    return (
        <Block flex>
            <Stack.Screen options={{
                header: () => <Header title="Paramètre" />
            }} />
            <Block flex style={{ paddingHorizontal: 15 }}>
                {/*<Row onPress={() => handleRowPress('/setting/profile')} text="Profil" family="Ionicons" icon={"person"}/>*/}
                {/*<Row onPress={() => handleRowPress('/setting/password')} text="Modifier mot de passe" family={"Entypo"} icon={"lock"}/>*/}
                <Row onPress={() => handleRowPress('/setting/subscription')} text="Abonnement" family={"MaterialIcons"} icon={"subscriptions"}/>
                <Row onPress={() => handleRowPress('/setting/about')} text="A Propos" family={"Entypo"} icon={"info"}/>
                <Block center style={{ marginTop: 'auto' }} >
                    <Button onPress={signOut}
                            isProcess={isLoading}
                            color="secondary"
                            loaderColor={appTheme.COLORS.WHITE}
                            style={styles.signOutBtn} >
                        <Text bold size={16} color={appTheme.COLORS.WHITE}>
                            Déconnexion
                        </Text>
                    </Button>
                </Block>
            </Block>


        </Block>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 10,
        backgroundColor: appTheme.COLORS.WHITE,
        borderWidth:0.8,
        borderColor: appTheme.COLORS.MUTED
    },
    rowLeftIcon: {
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        padding: 5,
        backgroundColor: appTheme.COLORS.MUTED
    },
    rowRightIcon: {

    },
    signOutBtn: {
        width: width * 0.9,
        height: 55,
        borderRadius: 10
    }
})

export default SettingScreen;
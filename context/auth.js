import React, { useEffect, useState } from "react";
import {router, useNavigation, useRootNavigationState, useRouter, useSegments} from "expo-router";
import { useAppDispatch, useAppSelector } from "../utils/hooks.js";
import {Block, Text, Toast} from "galio-framework";
import {clearMessage} from "../store/features/alert/alert.slice";
import {appTheme} from "../constants";
import {Icon} from "../components";
import {refreshToken} from "../store/features/auth/auth.services";
import {setCredentials} from "../store/features/auth/auth.slice";
import {useGetMeQuery} from "../store/features/user/user.services";
import {Splash} from "../components/Splash";



const AuthContext = React.createContext(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

function useProtectedRoute(loading) {
    const segments = useSegments();
    const router = useRouter();

    const rootNavigationState = useRootNavigationState();
    const navigation = useNavigation();

    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";
        const inAppGroup = segments[0] === "(tabs)";


        if(!rootNavigationState?.key) return;

        if (!inAuthGroup && !accessToken) {
            router.replace("/login");
        } else if (accessToken && !inAppGroup) {
            router.replace("/tontine");
            // const pushAction = navigation.navigate({
            //     routeName: "/tontine/",
            //     key: `tontine-${Date.now()}`,
            // });
            //
            // return () => pushAction.cancel();
        }
    }, [accessToken, segments, rootNavigationState?.key, router, navigation]);

}

export function AuthProvider(props) {

    const [showToast, setShowToast] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const type = useAppSelector((state) => state.alert.type);
    const message = useAppSelector((state) => state.alert.message);
    const dispatch = useAppDispatch()
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useGetMeQuery({}, {skip: !accessToken})

    const toastIcon = {
        info: {
            family: "AntDesign",
            name: "info",
            color: appTheme.COLORS.INFO
        },
        success: {
            family: "AntDesign",
            name: "like2",
            color: appTheme.COLORS.SUCCESS
        },
        error: {
            family: "AntDesign",
            name: "dislike2",
            color: appTheme.COLORS.ERROR
        }
    }

    useEffect(() => {

        refreshToken()
            .then(credentials => {
                setIsLoading(false)
                dispatch(setCredentials({access: credentials.accessToken, refresh: credentials.refreshToken}))
            }).catch(err => {
            setIsLoading(false)
        })

    }, []);

    useEffect(() => {
        const toggleToast = () => {
            if (type !== "") {
                setShowToast(true);
                const timer = setTimeout(() => {
                    dispatch(clearMessage())
                    setShowToast(false);
                }, 5000);
                return () => clearTimeout(timer);
            }
        }

        toggleToast()
    },[type,message])

    useProtectedRoute();

    return (
        <AuthContext.Provider
            value={null}
        >
            <>
                {props.children}
                { type && type !== '' &&
                    <Toast
                        style={{ marginHorizontal: 10, borderRadius: 10, backgroundColor: toastIcon[type].color }}
                        isShow={showToast}
                        color="error"
                        positionIndicator="top"
                        positionOffset={20}
                    >
                        <Block row center >
                            {type && type !== "" &&
                                <Icon family={toastIcon[type].family} name={toastIcon[type].name} size={12} color={appTheme.COLORS.WHITE} />
                            }
                            <Text size={12} color={appTheme.COLORS.WHITE} style={{ marginLeft: 5 }}>{message}</Text>
                        </Block>
                    </Toast>
                }
            </>
        </AuthContext.Provider>
    );
}

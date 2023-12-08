import { configureStore } from '@reduxjs/toolkit'

import authReducer from "./features/auth/auth.slice";
import userReducer from "./features/user/user.slice";
import alertReducer from "./features/alert/alert.slice";
import coreReducer from "./features/core/core.slice";
import subscriptionReducer from "./features/subscription/subscription.slice";
import cardReducer from "./features/card/card.slice";
import groupReducer from "./features/group/group.slice";
import historicReducer from "./features/historic/historic.slice";
import requestReducer from "./features/request/request.slice";

import {authApi} from "./features/auth/auth.services";
import { userApi } from "./features/user/user.services"
import {coreApi} from "./features/core/core.services";
import {subscriptionApi} from "./features/subscription/subscription.services";
import {cardApi} from "./features/card/card.services";
import {groupApi} from "./features/group/group.services";
import {historicApi} from "./features/historic/historic.services";
import {requestApi} from "./features/request/request.services";


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [coreApi.reducerPath]: coreApi.reducer,
        [subscriptionApi.reducerPath]: subscriptionApi.reducer,
        [cardApi.reducerPath]: cardApi.reducer,
        [groupApi.reducerPath]: groupApi.reducer,
        [historicApi.reducerPath]: historicApi.reducer,
        [requestApi.reducerPath]: requestApi.reducer,


        auth: authReducer,
        user: userReducer,
        alert: alertReducer,
        core: coreReducer,
        subscription: subscriptionReducer,
        card: cardReducer,
        group: groupReducer,
        historic: historicReducer,
        request: requestReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat([
            authApi.middleware,
            userApi.middleware,
            coreApi.middleware,
            subscriptionApi.middleware,
            cardApi.middleware,
            groupApi.middleware,
            historicApi.middleware,
            requestApi.middleware,
        ])
})

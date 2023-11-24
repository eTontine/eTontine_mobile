import { configureStore } from '@reduxjs/toolkit'

import authReducer from "./features/auth/auth.slice";
import userReducer from "./features/user/user.slice";
import alertReducer from "./features/alert/alert.slice";
import coreReducer from "./features/core/core.slice";
import subscriptionReducer from "./features/subscription/subscription.slice";
import cardReducer from "./features/card/card.slice";
import groupReducer from "./features/group/group.slice";

import {authApi} from "./features/auth/auth.services";
import { userApi } from "./features/user/user.services"
import {coreApi} from "./features/core/core.services";
import {subscriptionApi} from "./features/subscription/subscription.services";
import {cardApi} from "./features/card/card.services";
import {groupApi} from "./features/group/group.services";


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [coreApi.reducerPath]: coreApi.reducer,
        [subscriptionApi.reducerPath]: subscriptionApi.reducer,
        [cardApi.reducerPath]: cardApi.reducer,
        [groupApi.reducerPath]: groupApi.reducer,


        auth: authReducer,
        user: userReducer,
        alert: alertReducer,
        core: coreReducer,
        subscription: subscriptionReducer,
        card: cardReducer,
        group: groupReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat([
            authApi.middleware,
            userApi.middleware,
            coreApi.middleware,
            subscriptionApi.middleware,
            cardApi.middleware,
            groupApi.middleware,
        ])
})

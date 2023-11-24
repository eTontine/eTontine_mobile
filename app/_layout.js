import React from 'react';
import {Provider} from "react-redux";
import { Slot } from "expo-router";
import {AuthProvider} from "../context/auth";
import {store} from "../store";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function Root() {

    return (
        <>
            <Provider store={store}>
                <>
                    <AuthProvider>
                        <Slot />
                    </AuthProvider>
                </>
            </Provider>
        </>
    );
}

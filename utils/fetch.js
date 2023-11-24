import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { logout } from '../store/features/auth/auth.slice';
import { Mutex } from 'async-mutex';

export const apiUrl = "http://etontine.mayimava.site/api/"

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
        headers.set("Accept", `application/json`);

       const token = getState().auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        } 
        
        return headers;
    }
})

export const baseQueryWithInterceptor = async (args, api, extraOptions) => {

    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery(
                    { credentials: 'include', url: 'token/refresh' },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    console.log("refreshResult")
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    console.log("logout")
                    // api.dispatch(logout());
                }
            }finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result

}




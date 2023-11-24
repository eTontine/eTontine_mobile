import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
    }
}

export const getItem = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {

    }
}

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
    }
}

export const localStorage = {
    setItem,
    getItem,
    removeItem,
};



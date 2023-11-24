import { Stack } from "expo-router";
import { KeyboardAvoidingView, ScrollView,TouchableWithoutFeedback, Keyboard } from "react-native";

const Layout = () => {
    return (
        <KeyboardAvoidingView style={{flex:1,}}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
                <TouchableWithoutFeedback style={{flex:1}} onPress={Keyboard.dismiss}>
                    <Stack screenOptions={{headerShown: false}}/>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );

};
export default Layout;
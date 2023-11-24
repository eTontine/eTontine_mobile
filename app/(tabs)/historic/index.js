import {Dimensions, ScrollView, StyleSheet} from "react-native";
import {Block, Text, theme} from "galio-framework";
import {appTheme} from "../../../constants";

import transactions from "../../../constants/transactions";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../components/Header";
import {DateInput} from "../../../components/DateComponent";

const { width } = Dimensions.get('screen');

const InText = ({ name }) => {
    return (
        <Block flex row>
            <Text> Reçu de </Text>
            <Text style={{ fontWeight: "700" }}> {name}  </Text>
        </Block>
    );

}

const OutText = ({ name }) => {
    return (
        <Block flex row>
            <Text> Envoyé a </Text>
            <Text style={{ fontWeight: "700" }}> {name}  </Text>
        </Block>
    );

}

const DateSelector = () => {
    return (
       <DateInput />
    );
}

const Transaction = ({ item}) => {
    const style = item.status && item.status == "OUT" ? styles.out : styles.in
    const amount = item.status && item.status == "OUT" ? "-"+item.amount : "+"+item.amount
    return (
        <Block flex row center space="between" style={styles.card}>
            <Block flex>
                {item.status == "IN" && <InText name={item.name} /> }
                {item.status == "OUT" && <OutText name={item.name} /> }
                <Text color={appTheme.COLORS.MUTED}> {item.date} </Text>
            </Block>
            <Text style={[style]}> { amount } </Text>
        </Block>
    );
}

const HistoricScreen = () => {
    return (
        <Block flex>
            <Stack.Screen options={{
                header: () => <Header title="Historique" />
            }} />
            <Block flex={0.25} style={{ backgroundColor: appTheme.COLORS.SECONDARY, borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
                <Block card flex style={{ borderRadius: 20, backgroundColor: "#fff", marginHorizontal: 30, marginVertical: 10 }}>
                    <Block row space="between" style={{ padding: 15 }}>
                        <Block flex middle center >
                            <DateInput label={"De"} date={new Date()} />
                        </Block>
                        <Block flex middle center style={{ borderStartWidth: 1.5, borderStartColor: appTheme.COLORS.SECONDARY }}>
                            <DateInput label={"A"} date={new Date()} />
                        </Block>
                    </Block>
                </Block>
            </Block>
           <Block flex style={{ marginTop: 10 }}>
               <ScrollView
                   showsVerticalScrollIndicator={false}
               >
                   <Block flex>
                       { transactions.map((transaction, index) => <Transaction key={index} item={transaction} /> ) }
                   </Block>
               </ScrollView>
           </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        minHeight: 70,
        backgroundColor: appTheme.COLORS.WHITE,
        padding: 5,
        marginHorizontal: 10,
        marginVertical: 5
    },
    in: {
        color: appTheme.COLORS.SUCCESS
    },
    out: {
        color: appTheme.COLORS.ERROR
    }
})

export default HistoricScreen;
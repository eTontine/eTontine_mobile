import {ActivityIndicator, Dimensions, ScrollView, StyleSheet} from "react-native";
import {Block, Text, theme} from "galio-framework";
import {appTheme} from "../../../constants";

import transactions from "../../../constants/transactions";
import Stack from "expo-router/src/layouts/Stack";
import Header from "../../../components/Header";
import {DateInput} from "../../../components/DateComponent";
import {useAppSelector} from "../../../utils/hooks";
import {useGetHistoricsQuery} from "../../../store/features/historic/historic.services";
import {useEffect, useState} from "react";
import {formatDateYYYYMMDD} from "../../../utils/date";

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

const Transaction = ({item, userPhone}) => {
    const type = item.receiver_phone && item.receiver_phone == userPhone ? 'in' : 'out'
    const style = item.receiver_phone && item.receiver_phone == userPhone ? styles.in : styles.out
    return (
        <Block card style={{ elevation: 1, margin: 5, padding: 10 }}>
            <Block row flex space={"between"}>
                <Block>
                    <Text bold size={9}> {item?.payment_date} </Text>
                    <Text bold size={9}> {item?.type_de_tontine} ({item?.status}) </Text>
                </Block>
                <Text style={style}> {type == 'in' ? '+' : '-'} {item.amount} </Text>
            </Block>
            <Block style={{ borderStartWidth: 2, borderStartColor: appTheme.COLORS.BORDER, marginStart: 5, marginVertical: 5 }}>
                <Block row flex space={"between"}>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> Txn Id: </Text>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> {item?.id} </Text>
                </Block>
                <Block row flex space={"between"}>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> Type de transaction:  </Text>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> {item?.type_transaction} </Text>
                </Block>
                <Block row flex space={"between"}>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> De: </Text>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> {item?.sender_phone} </Text>
                </Block>
                <Block row flex space={"between"}>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> A: </Text>
                    <Text color={appTheme.COLORS.MUTED} bold size={9}> {item?.receiver_phone} </Text>
                </Block>
            </Block>
        </Block>
    );
}

const HistoricScreen = () => {
    const user = useAppSelector((state) => state.user.currentUser);
    const [startDate, setStartDate] = useState(formatDateYYYYMMDD(new Date('2023-01-01')))
    const [endDate, setEndDate] = useState(formatDateYYYYMMDD(new Date()))
    const {isFetching:loading, data: transactionsHistory} = useGetHistoricsQuery({userId: user?.id, start: startDate, end: endDate}, {skip: !user})

    return (
        <Block flex>
            <Stack.Screen options={{
                header: () => <Header title="Historique" />
            }} />
            <Block flex={0.25} style={{ backgroundColor: appTheme.COLORS.SECONDARY, borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
                <Block card flex style={{ borderRadius: 20, backgroundColor: "#fff", marginHorizontal: 30, marginVertical: 10 }}>
                    <Block row space="between" style={{ padding: 15 }}>
                        <Block flex middle center >
                            <DateInput label={"De"} date={new Date('2023-01-01')} onSelect={setStartDate} />
                        </Block>
                        <Block flex middle center style={{ borderStartWidth: 1.5, borderStartColor: appTheme.COLORS.SECONDARY }}>
                            <DateInput label={"A"} date={new Date()} onSelect={setEndDate} />
                        </Block>
                    </Block>
                </Block>
            </Block>
            {loading && <ActivityIndicator color={appTheme.COLORS.SECONDARY} />}
            {!loading &&
                <Block flex style={{ marginTop: 10 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Block flex>
                            { transactionsHistory && transactionsHistory.length && transactionsHistory.map((transaction, index) => <Transaction key={index} item={transaction} userPhone={user?.phone} /> ) }
                        </Block>
                    </ScrollView>
                </Block>
            }
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
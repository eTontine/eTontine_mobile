import { useLocalSearchParams } from 'expo-router';
import {Text} from "galio-framework";


export default function GroupPage() {
    const { id } = useLocalSearchParams();

    return <Text>Tontine groupe: {id}</Text>
}

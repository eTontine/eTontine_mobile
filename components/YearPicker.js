import { Picker } from '@react-native-picker/picker';
import {appTheme} from "../constants";
import {Block, Text} from "galio-framework";
import {Dimensions} from "react-native";

const { height, width } = Dimensions.get('window');

const YearPicker = ({ selectedYear, onChange }) => {
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, index) => 1900 + index);

  return (
      <Block row middle center style={{ marginHorizontal: 5 }}>
          <Text center size={14} style={{ fontWeight: '700', width: width/2 }}> Année: </Text>
          <Block style={{  width: width/2 }}>
              <Picker
                  selectedValue={selectedYear}
                  mode={"dropdown"}
                  onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue)
                      console.log('Année sélectionnée :', itemValue);
                  }}
              >
                  {years.map((year) => (
                      <Picker.Item key={year} label={year.toString()} value={year} />
                  ))}
              </Picker>
          </Block>
      </Block>

  );
}

export default YearPicker;
import React, {useState} from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import {appTheme} from "../constants";
import {useRouter} from "expo-router";
import Button from "./Button";
import { GroupStatus} from "../constants/status";


const JTontinerGroupCard = ({ onPressAdd, onPressStart, item, style, onPress }) => {

    const router = useRouter()

    const navigateTo = () => {
        router.push({ pathname: '/group/show/[id]', params: { id: item.id, name: item.name } })
    }
    const cardContainer = [styles.card, styles.shadow, style]

  return (
      <TouchableWithoutFeedback onPress={onPress}>
          <Block flex space={"between"} style={cardContainer}>
              <Block flex row space={"between"}>
                  <Block>
                      <Text  size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.name}</Text>
                  </Block>
                  <Block right>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                          Taxe: <Text> {item?.gain} </Text>
                      </Text>
                  </Block>
              </Block>
              <Block flex row center>
                  <Block>
                      <Text
                          size={12}
                          bold style={{ marginVertical: 10, marginHorizontal: 5 }}
                      >
                          { GroupStatus[item?.status]?.name}
                      </Text>
                  </Block>
              </Block>
              <Block flex row space={"between"}>
                  <Block>
                      <Text  size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                          {item?.amount}
                      </Text>
                  </Block>
                  <Block right>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                          {item?.day_contribution}{item?.time_contribution}{item?.contribution_period}
                      </Text>
                  </Block>
              </Block>
              <Block row center>
                  { item?.status == 'INSCRIPTION' &&
                      <Button
                          small
                          onPress={onPressAdd}
                          color="success"
                          style={{ paddingHorizontal: 5, paddingVertical: 7 }}
                      >
                          <Text bold size={10} color={appTheme.COLORS.WHITE}>
                              Ajouter
                          </Text>
                      </Button>
                  }
                  { item?.status == 'INSCRIPTION' &&
                      <Button
                          small
                          onPress={onPressStart}
                          color="primary"
                          style={{ paddingHorizontal: 5, paddingVertical: 7 }}
                      >
                          <Text bold size={10} color={appTheme.COLORS.WHITE}>
                              Démarrer
                          </Text>
                      </Button>
                  }
                  <Button
                      small
                      onPress={() => navigateTo()}
                      color="secondary"
                      style={{ paddingHorizontal: 5, paddingVertical: 7 }}
                  >
                      <Text bold size={10} color={appTheme.COLORS.WHITE}>
                          Voir
                      </Text>
                  </Button>

              </Block>
          </Block>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 5,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        marginBottom: 2,
    },
    cardTitle: {
        flex: 1,
        flexWrap: 'wrap',
    },
    imageContainer: {
        borderRadius: 3,
        elevation: 1,
        overflow: 'hidden',
    },
    image: {
        // borderRadius: 3,
    },
    horizontalStyles: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    verticalStyles: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
    },
});


export default JTontinerGroupCard;
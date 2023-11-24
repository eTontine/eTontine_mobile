import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import {appTheme} from "../constants";
import {useRouter} from "expo-router";
import Icon from "./Icon";
import {Button} from "./index";

const JCard = ({ onPress, item, style, ctaColor }) => {

    const cardContainer = [styles.card, styles.shadow, style];
  return (
      <TouchableWithoutFeedback onPress={onPress}>
          <Block flex space={"between"} style={cardContainer}>
              <Block flex row space={"between"}>
                  <Block>
                      <Text color={appTheme.COLORS.WHITE} size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.name}</Text>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.amount}</Text>
                  </Block>
                  <Block right>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.gain}</Text>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.number_day}</Text>
                  </Block>
              </Block>
              <Block center>
                  <Button
                      small
                      onPress={onPress}
                      color="white"
                      style={{ paddingHorizontal: 5, paddingVertical: 7 }}
                  >
                      <Text bold size={10} color={appTheme.COLORS.SECONDARY}>
                          Vendre({item?.sale_price})
                      </Text>
                  </Button>
              </Block>
          </Block>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.COLORS.TWITTER,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        margin: 5
    },
    cardTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6
    },
    cardDescription: {
        padding: theme.SIZES.BASE / 2
    },
    imageContainer: {
        borderRadius: 3,
        elevation: 1,
        overflow: 'hidden',
    },
    image: {
        // borderRadius: 3,
    },
    horizontalImage: {
        height: 122,
        width: 'auto',
    },
    horizontalStyles: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    verticalStyles: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    fullImage: {
        height: 215
    },
    shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
    },
});


export default JCard;
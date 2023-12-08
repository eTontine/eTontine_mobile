import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import {appTheme} from "../constants";
import {CardStatus, InvitationStatus} from "../constants/status";

const JAssociateCard = ({ onPress, item, style }) => {

    const cardStatus = () => {
        const invitationStatus = item?.invitation_status
        const tranStatus = item?.transaction_status
        const status = item?.status
        if(invitationStatus === InvitationStatus.PENDING.value) {
            return InvitationStatus.PENDING
        }else if (invitationStatus === InvitationStatus.ACCEPTED.value && status === CardStatus.NOT_COLLECTED.value) {
            return CardStatus.NOT_COLLECTED
        } else {
            return CardStatus.NOT_COLLECTED
        }
    }

    const cardContainer = [styles.card, styles.shadow, style];
  return (
      <TouchableWithoutFeedback onPress={onPress}>
          <Block flex space={"between"} style={cardContainer}>
              <Block flex row space={"between"}>
                  <Block>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.carte?.name}</Text>
                  </Block>
                  <Block right>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                         Taxe: <Text> {item?.carte?.gain} </Text>
                      </Text>
                  </Block>
              </Block>
              <Block flex row center>
                  <Block>
                      <Text
                          size={12}
                          bold style={{ marginVertical: 10, marginHorizontal: 5, color: appTheme.COLORS[cardStatus()?.color] }}
                      >
                          {cardStatus()?.name}
                      </Text>
                  </Block>
              </Block>
              <Block flex row space={"between"}>
                  <Block>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>
                          {item?.carte?.amount}<Text>/Tour</Text>
                      </Text>
                  </Block>
                  <Block right>
                      <Text size={12} bold style={{ marginVertical: 10, marginHorizontal: 5 }}>{item?.carte?.number_day}</Text>
                  </Block>
              </Block>
          </Block>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: appTheme.COLORS.WHITE,
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
        elevation: 1,
    },
});


export default JAssociateCard;
import React from "react";
import {ActivityIndicator, StyleSheet} from "react-native";
import  PropTypes from 'prop-types'
import {Block, Button} from "galio-framework";
import {appTheme} from "../constants";


const JButton = ({ small, shadowless, children, color, style,onPress, isProcess = false,loaderColor, ...props }) => {

  const colorStyle = color && appTheme.COLORS[color.toUpperCase()];

  const buttonStyles = [
    small && styles.smallButton,
    color && { backgroundColor: colorStyle },
    !shadowless && styles.shadow,
    {...style}
  ];
  return (
      <Button
          style={buttonStyles}
          shadowless
          textStyle={{ fontSize: 12, fontWeight: '700' }}
          onPress={onPress}
          {...props}
      >
        <Block row middle center>
          {isProcess && <ActivityIndicator size={"large"} color={loaderColor || appTheme.COLORS.SECONDARY} style={{ marginRight: 5 }}/> }
          {children}
        </Block>
      </Button>
  );
}

JButton.prototype = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'error', 'success', 'warning'])
  ])
}


const styles = StyleSheet.create({
  smallButton: {
    width: 85,
    height: 28
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default JButton;
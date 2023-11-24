import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import {Block, Input, Text} from "galio-framework";

import Icon from './Icon';
import { appTheme } from "../constants";
import {Picker} from "@react-native-picker/picker";

const JSelect = ({ label, placeholder, iconName, iconFamily, shadowless, success, error, selected, onChange, ...props }) => {



        const selectStyles = [
            styles.input,
            !shadowless && styles.shadow,
            success && styles.success,
            error && styles.error,
            {...props?.style}
        ];

        return (
           <>
               {label && <Text color={appTheme.COLORS.MUTED} style={{ marginBottom: 5 }}> { label } </Text>}
               <Block row middle
                   style={selectStyles}>
                   {iconName && iconFamily &&
                       <Block>
                           <Icon
                               size={14}
                               color={appTheme.COLORS.ICON}
                               name={iconName}
                               family={iconFamily}
                               style={{ paddingHorizontal: 0, marginRight: 12 }}
                           />
                       </Block>
                   }
                   <Block flex>
                       <Picker
                           placeholder={placeholder}
                           placeholderTextColor={appTheme.COLORS.MUTED}
                           selectedValue={selected}
                           color={appTheme.COLORS.HEADER}
                           mode={"dropdown"}
                           onValueChange={(itemValue, itemIndex) => {
                               onChange(itemValue)
                           }}
                       >
                           {props.children}
                       </Picker>
                   </Block>
               </Block>
           </>
        );
}

JSelect.defaultProps = {
    label: '',
    shadowless: false,
    success: false,
    error: false
};

JSelect.propTypes = {
    label: PropTypes.string,
    shadowless: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.bool
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 6,
        borderColor: appTheme.COLORS.BORDER,
        height: 50,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    success: {
        borderColor: appTheme.COLORS.INPUT_SUCCESS,
    },
    error: {
        borderColor: appTheme.COLORS.INPUT_ERROR,
    },
    shadow: {
        shadowColor: appTheme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.05,
        elevation: 2,
    }
});

export default JSelect;
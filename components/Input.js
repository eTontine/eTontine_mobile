import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import {Input, Text} from "galio-framework";

import Icon from './Icon';
import { appTheme } from "../constants";

const JInput = ({ label, placeholder, iconName, iconFamily, shadowless, success, error, password, viewPass, type, ...props }) => {



        const inputStyles = [
            styles.input,
            !shadowless && styles.shadow,
            success && styles.success,
            error && styles.error,
            {...props?.style}
        ];

        return (
           <>
               {label && <Text color={appTheme.COLORS.MUTED}> { label } </Text>}
               <Input
                   placeholder={placeholder}
                   placeholderTextColor={appTheme.COLORS.MUTED}
                   style={inputStyles}
                   color={appTheme.COLORS.HEADER}
                   password={password || false}
                   viewPass={viewPass || false}
                   type={type || 'default'}
                   iconContent={
                       <Icon
                           size={14}
                           color={appTheme.COLORS.ICON}
                           name={iconName}
                           family={iconFamily}
                           style={{ paddingHorizontal: 0, marginRight: 12 }}
                       />
                   }
                   {...props}
               />
           </>
        );
}

JInput.defaultProps = {
    label: '',
    shadowless: false,
    success: false,
    error: false
};

JInput.propTypes = {
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
        margin: 0,
        padding: 0
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

export default JInput;
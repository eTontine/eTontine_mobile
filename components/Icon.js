import React, {useEffect, useState} from 'react';
import * as Font from 'expo-font';
import { Icon } from 'galio-framework';

const AppExtra = require('../assets/font/argon.ttf');


const IconExtra = ({ name, family, ...rest }) =>  {

    const [fontLoaded, setFontLoaded] = useState(false)

    useEffect( () => {
        async function loadFont () {
            await Font.loadAsync({ AppExtra: AppExtra });
            setFontLoaded( true);
            return true;
        }
        loadFont()

    }, [])

    if (name && family && fontLoaded) {
        return <Icon name={name} family={family} {...rest} />;
    }
    return null;
}

export default IconExtra


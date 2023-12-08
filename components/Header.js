import {TouchableOpacity, StyleSheet, Platform, Dimensions, ScrollView, Pressable} from 'react-native';
import {Button, Block, NavBar, Text, theme, Input} from "galio-framework";

import Icon from "./Icon";
import Tabs from "./Tabs";

import {appTheme} from "../constants";
import React, {useState} from "react";
import {ModalSheet} from "./Modal";
import {DatePicker} from "./DatePicker";
import YearSelector from "react-native-calendar-picker/CalendarPicker/YearSelector";
import YearPicker from "./YearPicker";
import {useRouter} from "expo-router";

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const BellButton = ({isWhite, style, navigation}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
        <Icon
            family="ArgonExtra"
            size={16}
            name="bell"
            color={appTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
        <Block middle style={styles.notify} />
    </TouchableOpacity>
);

const BasketButton = ({isWhite, style, navigation}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
        <Icon
            family="ArgonExtra"
            size={16}
            name="basket"
            color={appTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
    </TouchableOpacity>
);

const ProfileButton = ({isWhite, style, onPress}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={() => console.log("Profile button presse")}>
        <Icon
            family="MaterialIcons"
            size={16}
            name="swap-vert"
            color={appTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
    </TouchableOpacity>
);

const SettingButton = ({isWhite, style, onPress}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Icon
            family="MaterialIcons"
            size={16}
            name="swap-vert"
            color={appTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
    </TouchableOpacity>
);

const NotificationButton = ({isWhite, style, onPress}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={() => console.log("Notification button presse")}>
        <Icon
            family="Ionicons"
            size={16}
            name="notifications"
            color={appTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
    </TouchableOpacity>
);

const FilterButton = ({isWhite, style, onPress}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Icon
            family="AntDesign"
            size={16}
            name="filter"
            color={appTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
    </TouchableOpacity>
);

const SearchButton = ({isWhite, style, navigation}) => (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
        <Icon
            size={16}
            family="AntDesign"
            name="search"
            color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
    </TouchableOpacity>
);

const ReadyToUseDate = ({name, active, onPress}) => {
    const style  = styles.inactive

    return (
        <Pressable style={style} onPress={onPress}>
            <Text style={{color: active ? appTheme.COLORS.WHITE : appTheme.COLORS.SECONDARY}}>{name}</Text>
        </Pressable>
    )
}

const Header = ({ white, title, transparent, navigation, back, bgColor, iconColor, titleColor,  tabs, tabIndex, search, searchText, setSearchText, handleSearch, filterOptions, filter, setFilter, options, props }) => {

    const router = useRouter()
    const noShadow = [""].includes(title);
    const headerStyles = [
        !noShadow ? styles.shadow : null,
        transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
        styles.navbar,
        bgColor && { backgroundColor: bgColor }
    ];

    const [showFilter, setShowFilter] = useState(false)

    const toggleFilterModal = () => {
        setShowFilter(!showFilter)
    }

    const handleDateChange = (date,label) => {
        console.log("handleDateChange", date, label)
    }

    const renderSearch = () => {
        return (
            <Block style={{  marginHorizontal: 16, width: width - 50 }}>
                <Input
                    right
                    color="black"
                    placeholder="Rechercher ..."
                    placeholderTextColor={'#8898AA'}
                    onSubmitEditing={handleSearch}
                    onChangeText={setSearchText}
                    search={searchText}
                    iconContent={
                        <Icon
                            size={14}
                            color={appTheme.COLORS.ICON}
                            name="search"
                            family="Ionicons"
                            style={{ paddingHorizontal: 0, marginLeft: 12 }}
                        />
                    }
                />
            </Block>
        );
    }

    const renderRight = () => {

        if (title === 'Title') {
            return [
                <BellButton key='chat-title' navigation={navigation} isWhite={white} />,
                <BasketButton key='basket-title' navigation={navigation} isWhite={white} />
            ]
        }

        switch (title) {

            case 'E-Tontine':
                return ([
                    // <FilterButton key='filter-tontine' onPress={toggleFilterModal} isWhite={white} />,
                    <SettingButton key={'setting-tontine'} onPress={() => router.push('/tontine/request')} isWhite={white} />,
                    <NotificationButton key='notification-Tontine' navigation={navigation} isWhite={white} />,
                ]);
            default:
                break;
        }
    }

    const renderHeader = () => {
        if (search || tabs || options) {
            return (
                <Block center>
                    {search ? renderSearch() : null}
                    {options ? renderOptions() : null}
                    {tabs ? renderTabs() : null}
                </Block>
            );
        }
    }

    const [ startDate, endDate ] = ["12-01-2023", "12-12-2023"]

    const filterModal = () => {
        return (
            <ModalSheet visible={showFilter} hide={() => setShowFilter(false)}>
                <Block style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
                    <Text color={appTheme.COLORS.SECONDARY}  size={18}> Filtre </Text>

                    <YearPicker
                        selectedYear={new Date().getFullYear()}
                        onChange={(item) => console.log("Date changer", item)}
                    />

                    <Block row center style={{ marginHorizontal: 14,  }} >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {filterOptions?.map((item, index) => (
                                <ReadyToUseDate key={index} name={item.name}  />
                            ))}
                        </ScrollView>
                    </Block>

                    <Block row right style={{ justifyContent: "flex-end", marginTop: 10 }}>
                        <Button
                            style={{
                                height: 35,
                                width: width / 4,
                                backgroundColor: appTheme.COLORS.MUTED
                            }}
                        >
                            <Text
                                color={appTheme.COLORS.WHITE}
                                size={12}
                                style={{ textTransform: 'capitalize'}}> Fermer  </Text>
                        </Button>
                        <Button
                            style={{
                                height: 35,
                                width: width / 4,
                                backgroundColor: appTheme.COLORS.SECONDARY
                            }}
                        >
                            <Text color={appTheme.COLORS.WHITE} size={12} style={{ textTransform: 'capitalize'}}> Aplliquer  </Text>
                        </Button>
                    </Block>
                </Block>
            </ModalSheet>
        );
    }

    return (
        <Block style={headerStyles}>
            <NavBar
                back={false}
                title={title}
                style={navbarStyles}
                transparent={transparent}
                right={renderRight()}
                rightStyle={{ alignItems: 'flex-end' }}
                left={ tabs || back &&
                    <Icon
                        name={back ? 'arrow-back' : "menu"} family="Ionicons"
                        size={20} onPress={() => router.back()}
                        color={iconColor || (white ? appTheme.COLORS.WHITE : appTheme.COLORS.ICON)}
                        style={{ marginTop: 2 }}
                    />

                }
                leftStyle={{ paddingVertical: 12, flex: tabs || back ? 0.2 : 0 }}
                titleStyle={[
                    styles.title,
                    { color: appTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
                    titleColor && { color: titleColor }
                ]}
                {...props}
            />
            {renderHeader()}
            {filterModal()}
        </Block>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 12,
        position: 'relative',
    },
    title: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: "uppercase"
    },
    navbar: {
        paddingVertical: 0,
        paddingBottom: theme.SIZES.BASE * 1.5,
        paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
        zIndex: 5,
    },
    shadow: {
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3,
    },
    notify: {
        backgroundColor: appTheme.COLORS.LABEL,
        borderRadius: 4,
        height: theme.SIZES.BASE / 2,
        width: theme.SIZES.BASE / 2,
        position: 'absolute',
        top: 9,
        right: 12,
    },
    header: {
        backgroundColor: theme.COLORS.WHITE,
    },
    divider: {
        borderRightWidth: 0.3,
        borderRightColor: theme.COLORS.ICON,
    },
    search: {
        height: 48,
        width: width - 50,
        marginHorizontal: 16,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: appTheme.COLORS.BORDER
    },
    options: {
        marginBottom: 24,
        marginTop: 10,
        elevation: 4,
    },
    tab: {
        backgroundColor: theme.COLORS.TRANSPARENT,
        width: width * 0.35,
        borderRadius: 0,
        borderWidth: 0,
        height: 24,
        elevation: 0,
    },
    tabTitle: {
        lineHeight: 19,
        fontWeight: '400',
        color: appTheme.COLORS.HEADER
    },
    inactive:{
        backgroundColor: appTheme.COLORS.WHITE,
        color:appTheme.COLORS.SECONDARY,
        borderRadius:10,
        padding:10,
        borderWidth:1,
        borderColor:appTheme.COLORS.SECONDARY,
        marginHorizontal:3,
        width:150
    }
});


export default Header;
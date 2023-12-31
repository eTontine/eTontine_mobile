import React from 'react';
import { Tabs } from "expo-router";
import {Dimensions, Image, Pressable, Text, View} from "react-native";
import { Icon } from '../../components'
import { appTheme } from '../../constants'

const { width } = Dimensions.get('screen')

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View
          style={{
              borderTopLeftRadius:10,
              borderTopRightRadius:10,
              flexDirection: 'row',
              justifyContent:"space-between",
              margin:0,
              backgroundColor: appTheme.COLORS.SECONDARY,
              alignSelf: 'center',
              position: 'relative',
              elevation:12,
              bottom: 0
    }}>
          {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                  options.tabBarLabel !== undefined
                      ? options.tabBarLabel
                      : options.title !== undefined
                          ? options.title
                          : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                  const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate({ name: route.name, merge: true });
                  }
              };

              const onLongPress = () => {
                  navigation.emit({
                      type: 'tabLongPress',
                      target: route.key,
                  });
              };


              if(route.name == "tontine"){
                    return <Pressable key="ticket" 
                      style={{
                          position:"absolute",
                          left: '50%',
                          marginLeft: -28,
                          bottom:1,
                          justifyContent: "flex-end",
                          alignItems:"center",
                          alignSelf: "center",
                          padding: 6,
                          borderRadius:100,
                          marginHorizontal:6,
                          zIndex:10,
                          backgroundColor: isFocused ? appTheme.COLORS.PRIMARY : appTheme.COLORS.WHITE,
                      }}
                      onPress={onPress} onLongPress={onLongPress}>
                      <View 
                        style={{elevation:3,
                          borderRadius: 56,
                          width:55,height:55,
                          padding:10,alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isFocused ? appTheme.COLORS.SECONDARY : appTheme.COLORS.SECONDARY
                          }}>
                          {
                              isFocused
                              ?
                              <Image style={{ width: 40, height: 40}} source={require('../../assets/images/piggy-bank-active.png')} />
                              :
                              <Image style={{ width: 40, height: 40}} source={require('../../assets/images/piggy-bank.png')} />
                          }
                      </View>
                    </Pressable>
              }

              return (
                  <Pressable
                      key={route.name}
                      accessibilityRole="button"
                      accessibilityState={isFocused ? { selected: true } : {}}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      testID={options.tabBarTestID}
                      onPress={onPress}
                      onLongPress={onLongPress}
                      style={{
                          flex: 1,
                          justifyContent: 'center',
                          paddingVertical: 7,
                          alignItems:"center",
                          alignSelf: "center",
                          backgroundColor: 'transparent',
                          paddingRight: route.name == "card" ? width * 0.10 : 0,
                          paddingLeft: route.name == "group" ? width * 0.10 : 0
                      }}
                  >

                      <View
                            style={{
                                flexDirection: "column",
                                alignContent: "center",
                                justifyContent: "center",
                                alignSelf: "center",
                                backgroundColor: 'transparent',
                                aspectRatio: 3/2,
                                borderRadius: 5,
                            }}
                      >
                          <Icon
                              family={options.family}
                              name={options.icon}
                              style={{
                                  textAlign: "center",
                                  alignSelf:"center",
                                  justifyContent:"center",
                                  alignItems:"center"}}
                              color={isFocused ? appTheme.COLORS.PRIMARY : appTheme.COLORS.WHITE} size={30} />
                          <Text style={{ color: appTheme.COLORS.WHITE, fontSize: 8, textAlign: "center" }}> {options.title} </Text>
                      </View>
                  </Pressable>
              );
          })}
      </View>
     
  );
}

export default function AppLayout() {

  return (
    <Tabs   
      initialRouteName="tontine"
      screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: { backgroundColor: 'rgb(242, 242, 242)' },

      }}
      tabBarHideOnKeyboard={true}
      tabBar={props => <MyTabBar {...props} />}>
      <Tabs.Screen
        name="historic"
        options={{
            title: "Transactions",
            family: "AntDesign",
            icon: "swap",
        }}
      />
        <Tabs.Screen
            name="card"
            options={{
                title: "Cartes",
                family: "Entypo",
                icon: "v-card",
            }}
        />
      <Tabs.Screen
        name="tontine"
        options={{
            title: "Tontine",
            family: "MaterialCommunityIcons",
            icon: "pig",
        }}
      />
        <Tabs.Screen
            name="group"
            options={{
                title: "Groupes",
                family: "FontAwesome",
                icon: "group",
            }}
        />
      <Tabs.Screen
        name="setting"
        options={{
            title: "Paramètres",
            family: "AntDesign",
            icon: "setting",
        }}
      />
    </Tabs>
  );
}
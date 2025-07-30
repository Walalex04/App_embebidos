import React, {useState} from "react";
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { ScreenName } from "./root";


//types
type IconName = keyof typeof ICONS


type type_icon = {
    icon_name: IconName;
    activeScreen: ScreenName,
    setActiveScreen: (screen: ScreenName) => void;
};

type Nav_props = {
    activeScreen: ScreenName,
    setActiveScreen: (screen: ScreenName) => void;
}

type Screen = typeof Screen[keyof typeof Screen];


//Object props

const style_nav = StyleSheet.create({
    container_root:{
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#232935',
        flex: 0.07,
        //borderTopRightRadius: 20,
    },
    container_icons:{
        flex: 1,
        padding: 15,
        alignItems: 'center',

        //search how paint the margin for to do a sepate
    },
    img:{
        width:30,
        height:30,
        
    }
});




const ICONS = {
    home: require("../icons/home_2-invert.png"),
    schedule: require("../icons/calendar-invert.png"),
    config: require("../icons/setting-invert.png")
};

const Screen = {
    home: "home",
    schedule: "schedule",
    config: "setting"
} as const;



const Icons = ({icon_name, activeScreen, setActiveScreen}: type_icon)=> {
    
    return(
        <TouchableOpacity 
            style={style_nav.container_icons}
            onPress={()=>setActiveScreen(Screen[icon_name])}
        >
            <Image style={style_nav.img} source={ICONS[icon_name]}/>
        </TouchableOpacity>
    );
}




const Nav = ({activeScreen, setActiveScreen}: Nav_props)=>{

    return(
        <View style={style_nav.container_root}>

            <Icons icon_name={"home"} 
                activeScreen={activeScreen} 
                setActiveScreen={setActiveScreen}/>

            <Icons icon_name={"schedule"} 
            activeScreen={activeScreen} 
                setActiveScreen={setActiveScreen}/>

            <Icons icon_name={"config"} 
            activeScreen={activeScreen} 
                setActiveScreen={setActiveScreen}/>
        </View>
    );
}


export default Nav;
import React, {useState} from "react";
import {Text, View, StyleSheet} from 'react-native';

//My elements
import Nav from './botnav';
import Home from "./home";
import Schedule from "./schedule";
import Setting from "./setting";

const style_root = StyleSheet.create({
    root:{
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
});


//types

export type ScreenName = "home" | "schedule" | "setting";


const Root = ()=>{
    const [activeScreen, setActiveScreen] = useState<ScreenName>("home");
   
    //this contain the ip 100.121
    const [ip, setIp] = useState<string>("192.168.0.12");

    return(
        <View style={style_root.root}>
            {activeScreen === "home" && <Home ip={ip}/>}
            {activeScreen === "schedule" && <Schedule ip={ip}/>}
            {activeScreen === "setting" && <Setting setIp={setIp} ip={ip}/>}
            <Nav
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
            ></Nav>
        </View>
    );
}


export default Root;

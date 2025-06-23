import React, {useState} from "react";
import {Text, View, StyleSheet, Image} from 'react-native';
//Object props


type type_icon = {
    type: String; //Represent the file's name 
}


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

const Icons = (prop_icon: type_icon)=> {

    return(
        <View style={style_nav.container_icons}>
            <Image style={style_nav.img} source={require("../icons/home_2.png")}/>
        </View>
    );
}


const Nav = ()=>{
    return(
        <View style={style_nav.container_root}>
            <Icons type={"home"}/>
            <Icons type={"Schedule"}/>
             <Icons type={"CONifg"}/>
        </View>
    );
}


export default Nav;
import React, {useState} from "react";
import {Text, View, StyleSheet} from 'react-native';

//My elements
import Nav from './botnav';
import Home from "./home";

const style_root = StyleSheet.create({
    root:{
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
});


const Root = ()=>{
    return(
        <View style={style_root.root}>
            <Home></Home>
            <Nav></Nav>
        </View>
    );
}


export default Root;
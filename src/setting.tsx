import React, {useState} from "react";
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import LinearGradient from "react-native-linear-gradient";



const style_home = StyleSheet.create({
    container_root: {
        flex: 9,
        padding: 20,
        backgroundColor: '#131925',//'#080c32',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingTop: 30,
    },


});

const Setting = ()=>{
    return(
        
            <ScrollView style={style_home.container_root}>
                <Text>Desde Setting</Text>
            </ScrollView>
        
    );
}


export default Setting;
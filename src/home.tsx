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

    //WIDGETS
    cointainer_widgets: {
        flexDirection: 'column'
    },

    widget_st:{
        padding: 30,
        backgroundColor: "#FF6F61",
        borderRadius: 30,
        marginTop: 25,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    text_style:{
        color: "#000",
        textAlign: "left",
        flex: 1,
        fontSize: 35,
        fontStyle: 'italic'
    },
    container_image:{
        flex: 1
    },

    icond_widget:{
        width: 60,
        height: 60
    },

    // SCHEDULE

    container_schedule: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: "#232935",
        padding: 20,
        marginTop: 25,
        
    },

    container_columns: {
        flexDirection: "row",
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "#404757",
        paddingBottom: 10,
        marginTop: 20
    }
});


//The wiget will show the sensor's informatizon
const Widget = () => {
    return(
        <View style={style_home.widget_st}>
            <View style={style_home.container_image}>
                <Image style={style_home.icond_widget} source={require('../icons/temp.png')} />
            </View>
            
            <Text style={style_home.text_style}>35 C</Text>
        </View>
    );
}

const Schedule = ()=>{
    return(
        <View style={{
            marginBottom: 40
        }}>
            <Text style={{
                marginTop: 20,
                textAlign: 'center',
                fontSize: 20,
                color: "#e1e1e1",
                borderBottomWidth: 1,
                paddingBottom: 15,
                borderBottomColor: "#e1e1e1",
                fontWeight: 'bold'
                
            }}>Daily Schedule</Text>
            <View style={style_home.container_schedule}>
                <View style={style_home.container_columns}>
                    <Text style={
                        {color: "#FFF", flex: 0.1, fontSize: 15, paddingRight: 30}
                        }>Time</Text>
                    <Text style={{color: "#FFF", flex: 1 ,fontSize: 15}}>Activities</Text>
                </View>

                <View style={style_home.container_columns}>
                    <Text style={{color: "#FFF",flex: 0.1, fontSize: 15, paddingRight: 30}}>09:00</Text>
                    <Text style={{color: "#FFF", flex: 1 ,fontSize: 15}}>Study Electronic</Text>
                </View>

                <View style={style_home.container_columns}>
                    <Text style={{color: "#FFF", flex: 0.1, fontSize: 15, paddingRight: 30}}>13:00</Text>
                    <Text style={{color: "#FFF",flex: 1,fontSize: 15}}>Study Electronic</Text>
                </View>


                <View style={style_home.container_columns}>
                    <Text style={{color: "#FFF", flex: 0.1, fontSize: 15, paddingRight: 30}}>13:00</Text>
                    <Text style={{color: "#FFF",flex: 1,fontSize: 15}}>Study Electronic</Text>
                </View>

               <View style={style_home.container_columns}>
                    <Text style={{color: "#FFF", flex: 0.1, fontSize: 15, paddingRight: 30}}>13:00</Text>
                    <Text style={{color: "#FFF",flex: 1,fontSize: 15}}>Study Electronic</Text>
                </View>


                <View style={style_home.container_columns}>
                    <Text style={{color: "#FFF", flex: 0.1, fontSize: 15, paddingRight: 30}}>13:00</Text>
                    <Text style={{color: "#FFF",flex: 1,fontSize: 15}}>Study Electronic</Text>
                </View>
                
            </View>
        </View>
        
    );
};

const Home = ()=>{
    return(
        
            <ScrollView style={style_home.container_root}>
                <View style={style_home.cointainer_widgets}>
                    
                    <Widget></Widget>
                    <Widget></Widget>
                    <Widget></Widget>
                    
                </View>
                <Schedule></Schedule>

            </ScrollView>
        
    );
}


export default Home;
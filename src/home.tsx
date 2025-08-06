import React, {useEffect, useState} from "react";
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

type props_widget = {
    type_icon: keyof typeof ICONS_WIDGET
}

const ICONS_WIDGET = {
    TEMPERATURE: require("../icons/temperature.png"),
    HUMIDITY: require("../icons/humidity.png"),
    CO2: require("../icons/carbon-dioxide.png")
} as const;

//The wiget will show the sensor's informatizon
const Widget = ({type_icon}: props_widget) => {
    const [value, setValue] = useState("0");
    console.log("en el wisget")
    useEffect(()=>{
        console.log("enviando el request");
        const fetchData = async ()=> {
            try{
                const response = await fetch("http://192.168.0.10");
                const data = await response.json();
                console.log(data);
                //setValue(data.oxigen) if type_icon === 'TEMPERATURE'
                if(type_icon === 'TEMPERATURE'){
                    setValue(data.Temperatura + " C");
                }else if(type_icon === 'HUMIDITY'){
                    setValue(data.Humedad + " % ");
                }else if(type_icon === 'CO2'){
                    setValue(data.CO2 + "ppm");
                }
            }catch(err){
                console.log(err);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 180000);

        return ()=> clearInterval(intervalId);
    }, [type_icon]);

    return(
        <View style={style_home.widget_st}>
            <View style={style_home.container_image}>
                <Image style={style_home.icond_widget} source={ICONS_WIDGET[type_icon]} />
            </View>
            
            <Text style={style_home.text_style}>{value}</Text>
        </View>
    );
}


type Tarea = {
    datos: {
        date: string;
        filename: string;
        rgb: string;
        time: string;
        tipoTarea: string;
    };
};

type ScheduleItem = {
  time: string;
  activity: string;
};

const Schedule = ()=>{

    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        fetch('http://192.168.0.10/task') // ← Reemplaza con tu URL real
            .then(response => response.json())
             .then((data: { [key: string]: Tarea }) => {
                // Transformamos el objeto en un array
                console.log(data);
                    const transformed = Object.values(data).map(entry => {
                        return {
                            time: entry.datos.time,
                            activity: entry.datos.tipoTarea
                            };
                        });
     

                setScheduleData(transformed);
            })
            .catch(error => console.error('Error fetching schedule:', error));
    }, []);

/*
    {scheduleData.map((item, index) => (
                    <View key={index} style={style_home.container_columns}>
                        <Text style={{ color: "#FFF", flex: 0.2, fontSize: 15, paddingRight: 30 }}>{item.time}</Text>
                        <Text style={{ color: "#FFF", flex: 1, fontSize: 15 }}>{item.activity}</Text>
                    </View>
                ))}
*/

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
                {scheduleData.map((item, index) => (
                    <View key={index} style={style_home.container_columns}>
                        <Text style={{ color: "#FFF", flex: 0.2, fontSize: 15, paddingRight: 30 }}>{item.time}</Text>
                        <Text style={{ color: "#FFF", flex: 1, fontSize: 15 }}>{item.activity}</Text>
                    </View>
                ))}
                
            </View>
        </View>
        
    );
};

const Home = ()=>{
    return(
        
            <ScrollView style={style_home.container_root}>
                <View style={style_home.cointainer_widgets}>
                    
                    <Widget type_icon="TEMPERATURE"></Widget>
                    <Widget type_icon="HUMIDITY"></Widget>
                    <Widget type_icon="CO2"></Widget>
                    
                </View>
                <Schedule></Schedule>

            </ScrollView>
        
    );
}


export default Home;
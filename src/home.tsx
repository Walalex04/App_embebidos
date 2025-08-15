import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, ScrollView, Image, Pressable, Dimensions} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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
        padding: 30, backgroundColor: "#FF6F61",
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
    },
    container_data:{
        backgroundColor: "#232935",
        borderRadius: 10,
        marginTop:25,
        padding: 20,
        margin: 10,
        alignItems: "center"
    },
    title_data:{
        color: "#FFF",
        textAlign: "center",
        fontSize: 20
    }
});

type props_widget = {
    type_icon: keyof typeof ICONS_WIDGET,
    stateTemperature: boolean,
    setStateTemperature: (param: boolean) => void,
    stateHumidity: boolean,
    setStateHumidity: (param: boolean) => void,
    statePpm: boolean,
    setStatePpm: (param: boolean) => void,
    ip: string,
    data:string
}

const ICONS_WIDGET = {
    TEMPERATURE: require("../icons/temperature.png"),
    HUMIDITY: require("../icons/humidity.png"),
    CO2: require("../icons/carbon-dioxide.png")
} as const;

//The wiget will show the sensor's informatizon
const Widget = ({type_icon, data,ip,stateTemperature, setStateTemperature, stateHumidity, setStateHumidity,statePpm, setStatePpm}: props_widget) => {

    const handleClick = ()=>{
        console.log("changing the show");
        if(type_icon === "TEMPERATURE"){
            setStateTemperature(!stateTemperature);
        }else if(type_icon === "HUMIDITY"){
            setStateHumidity(!stateHumidity);
        }else if(type_icon === "CO2"){
            setStatePpm(!statePpm);
        }

    }
    return(
        <Pressable onPress={handleClick}>
            <View style={style_home.widget_st}>
                <View style={style_home.container_image}>
                    <Image style={style_home.icond_widget} source={ICONS_WIDGET[type_icon]} />
                </View>
            
                <Text style={style_home.text_style}>{data}</Text>
            </View>
        </Pressable>
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

type props_schedule = {
    ip: string
};
const Schedule = ({ip}: props_schedule)=>{

    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        let isMounted = true;
        fetch('http://' + ip +'/task') // ← Reemplaza con tu URL real
            .then(response => response.json())
             .then((data: { [key: string]: Tarea }) => {
                // Transformamos el objeto en un array
                console.log(data);
                if(data != null){
                    const transformed = Object.values(data).map(entry => {
                        return {
                            time: entry.datos.time,
                            activity: entry.datos.tipoTarea
                            };
                        });
                if(isMounted){
                    setScheduleData(transformed);
                    
                }
                }
            })
            .catch(error => console.error('Error fetching schedule:', error));
        return ()=>{isMounted = false;} 
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


type props_data_visuaize = {
    title: string,
    data: number[]
}

 const WidgetDataView = ({title, data}:props_data_visuaize)=>{

    return(
            <View style={style_home.container_data}>
                    <Text style={style_home.title_data}>{title}</Text>
                    <View> 
                        <LineChart 
                            data={{
                                labels: [],
                                datasets:[{data: data}]
                            }}
                            width={Dimensions.get("window").width - 102}
                            height={220}
                            yAxisSuffix="*"
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#232935",
                                backgroundGradientTo: "#232935",
                                color: ()=>`white`,
                                decimalPlaces:2,
                                propsForBackgroundLines:{
                                    stroke: "transparent"
                                }
                            }}
                            bezier
                            withHorizontalLabels = {true}
                            withVerticalLabels = {false}
                            
                            style={{
                                paddingRight:60,

                                paddingLeft: 20,
                            
                            }}
                        />                       
                    </View>
            </View>
    );
}

type props_home = {
    ip: string
};

interface DatosSensor {
  humedad: number | string;
  ppm: number | string;
  temperatura: number | string;
}

interface RegistroFirebase {
  datos: DatosSensor;
}

interface FirebaseResponse {
  [timestamp: string]: RegistroFirebase;
}

const Home = ({ip}:props_home)=>{
    //this states allowed showed the data in the time
    const [stateTemperature, setStateTemperature] = useState<boolean>(false);
    const [stateHumidity, setStateHumidity] = useState<boolean>(false);
    const [statePpm, setStatePpm] = useState<boolean>(false);
    const [dataHumedad, setDataHumedad] = useState<number[]>([0]);
    const [dataTemperatura, setDataTemperatura] = useState<number[]>([0]);
    const [dataPpm, setDataPpm] = useState<number[]>([0]);

    const [temp, setTemp] = useState<string>("0");
    const [hume, setHume] = useState<string>("0");
    const [ppm, setPpm] = useState<string>("0");
    useEffect(()=>{
        let isMounted = true;
        console.log("enviando el request");
        const fetchData = async ()=> {
            console.log("en el intervalo");
            try{
                const response = await fetch("http://"+ip);
                const data = await response.json();
                console.log(data);
                //setValue(data.oxigen) if type_icon === 'TEMPERATURE'
                if(isMounted){
                    setTemp(data.Temperatura + " C");
                    setHume(data.Humedad + " % ");
                    setPpm(data.CO2 + "ppm");
                }

            }catch(err){
                console.log(err);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 180000);
        

         fetch("http://" + ip + "/sensors")
        .then(response => {
            if(!response.ok){
                console.log("error en la obtencion de los datos");
                throw new Error("http error");
            }
            return response.json()
        }).then((data : FirebaseResponse) => {
            console.log(data);
            const nuevosTimestamps = Object.keys(data);
            const nuevasHumedades = nuevosTimestamps.map(ts => Number(data[ts].datos.humedad ?? 0));
            const nuevosPpm = nuevosTimestamps.map(ts => Number(data[ts].datos.ppm ?? 0));
            const nuevasTemperaturas = nuevosTimestamps.map(ts => Number(data[ts].datos.temperatura ?? 0));

        // Sobrescribimos los arrays
        if(isMounted){

            setDataHumedad(nuevasHumedades);
            setDataPpm(nuevosPpm);
            setDataTemperatura(nuevasTemperaturas);
        }
        })


        return ()=>{ 
            isMounted = false;
            clearInterval(intervalId);}

    }, []);
    

    return(
        
            <ScrollView style={style_home.container_root}>
                <View style={style_home.cointainer_widgets}>
                    
                    <Widget type_icon="TEMPERATURE"
                        setStatePpm={setStatePpm}
                        setStateHumidity={setStateHumidity}
                        setStateTemperature={setStateTemperature}
                        stateHumidity={stateHumidity}
                        statePpm={statePpm}
                        stateTemperature={stateTemperature}
                        ip={ip}
                        data={temp}
                    ></Widget>
                    {stateTemperature && <WidgetDataView data={dataTemperatura} title="Temperatura"></WidgetDataView>}
                    <Widget type_icon="HUMIDITY"
                        setStatePpm={setStatePpm}
                        setStateHumidity={setStateHumidity}
                        setStateTemperature={setStateTemperature}
                        stateHumidity={stateHumidity}
                        ip={ip}
                        statePpm={statePpm}
                        stateTemperature={stateTemperature}
                        data={hume}
                    ></Widget>
                    {stateHumidity && <WidgetDataView data={dataHumedad} title="Humedad"></WidgetDataView>}

                    <Widget type_icon="CO2"
                        setStatePpm={setStatePpm}
                        setStateHumidity={setStateHumidity}
                        setStateTemperature={setStateTemperature}
                        stateHumidity={stateHumidity}
                        statePpm={statePpm}
                        stateTemperature={stateTemperature}
                        ip={ip}
                        data={ppm}
                    ></Widget>
                    {statePpm && <WidgetDataView data={dataPpm} title="CO2"></WidgetDataView>}

                </View>
                <Schedule ip={ip}></Schedule>

            </ScrollView>
        
    );
}


export default Home;

import React, {useState} from "react";
import {Text, View, StyleSheet, ScrollView, Image, Button, TextInput} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { Picker } from "@react-native-picker/picker";



const style_setting = StyleSheet.create({
    container_root: {
        flex: 9,
        padding: 20,
        backgroundColor: '#131925',//'#080c32',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingTop: 30,
    },

    text_tile:{
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        color: "#e1e1e1",
        borderBottomWidth: 1,
        paddingBottom: 15,
        borderBottomColor: "#e1e1e1",
        fontWeight: 'bold'
                
    },
    container_status_conected:{
        backgroundColor: "green",
        marginTop: 20
    },
    container_status_disconected: {
        backgroundColor: "red",
        marginTop: 20
    },
    text_status:{
        color: "#e1e1e1",
        paddingTop: 15,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 15,
        fontSize: 20,
        textAlign: "center"
    },
    container_horizontal: {
        flexDirection: "row",
        alignContent: "center"
    },
    labels:{
        color: '#fff', // texto claro para temas oscuros
        marginBottom: 10,
        fontSize: 18,
        marginTop: 20
    },
    input_text: {
        backgroundColor: '#E1E1E1',
        color: '#111', // texto oscuro para contraste
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        fontSize: 16,
    },

});


const Rango = Array.from({ length: 256 }, (_, i) => i); // [0,1,2,...,255]

const RGPicker = ()=>{
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  return (
    <View style={styles.container}>
        <View style={style_setting.container_horizontal}>
            <View>
                <Text style={style_setting.labels}>Rojo: {red}</Text>
                    <Picker
                        selectedValue={red}
                        onValueChange={(itemValue) => setRed(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#e1e1e1"
                    >
                        {Rango.map((num) => (
                        <Picker.Item key={num} label={`${num}`} value={num} />
                        ))}
                    </Picker>

                </View>
                <View>
                    <Text style={style_setting.labels}>Verde: {green}</Text>
                    <Picker
                        selectedValue={green}
                        onValueChange={(itemValue) => setGreen(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#e1e1e1"
                    >
                        {Rango.map((num) => (
                        <Picker.Item key={num} label={`${num}`} value={num} />
                        ))}
                    </Picker>

                </View>
            </View>
            <View style={style_setting.container_horizontal}>
                <View>
                <Text style={style_setting.labels}>Azul: {blue}</Text>
                <Picker
                    selectedValue={blue}
                    onValueChange={(itemValue) => setBlue(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#e1e1e1"
                >
                    {Rango.map((num) => (
                    <Picker.Item key={num} label={`${num}`} value={num} />
                    ))}
                </Picker>
            </View>
        
        <View>
            <View
                style={{
                marginTop: 10,
                width: 100,
                height: 100,
                backgroundColor: `rgb(${red},${green},${blue})`,
                borderWidth: 1,
                borderColor: '#000',
                }}
            />
        </View>

        
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  label: { fontSize: 16, marginVertical: 8 },
  picker: { height: 50, width: 180, color: "#e1e1e1"},
});


const Status = ()=>{
    //Verify if this app is conected with the esp32

    return(
        <View style={style_setting.container_status_conected}>
            <Text style={style_setting.text_status}> You device is connected</Text>

        </View>
        
    )
}

const FormConnected = ()=>{
    return(
        <View>
            <View>
                <Text style={style_setting.labels}>Input the SSID:</Text>
                <TextInput 
                    style={style_setting.input_text}
                    placeholder="SSID"
                    keyboardType="default"
                />
            </View>
            <View>
                <Text style={style_setting.labels}>Input the password:</Text>
                <TextInput 
                    style={style_setting.input_text}
                    placeholder="PASSWORD"
                    keyboardType="visible-password"
                    
                />
            </View>
        </View>

    );
}

const Setting = ()=>{
    return(
        
            <ScrollView style={style_setting.container_root}>
                <Text style={style_setting.text_tile}>Config</Text>
                <Status />
                <RGPicker />

                <FormConnected/>

                <View style={{marginTop:20}}>
                    <Button title="Update Setting"/>
                </View>
                
            </ScrollView>
        
    );
}


export default Setting;
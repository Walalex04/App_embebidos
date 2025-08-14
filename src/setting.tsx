import React, {useState, useEffect} from "react";
import {Text, View, StyleSheet, ScrollView, Image, Button, TextInput, Alert} from 'react-native';
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

type props_rgbp = {
    ip: string
};
const RGPicker = ({ip} :props_rgbp)=>{
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const sendRGBConfig = async () => {
      setLoading(true);
     try {
        const formData = new FormData();
        formData.append("red", red);
        formData.append("green", green);
        formData.append("blue", blue);

        console.log(formData);

        const response = await fetch("http://"+ip+"/rgb", {
        method: "POST",
        headers: {
          // NO pongas Content-Type, fetch lo asigna automáticamente para multipart/form-data
        },
        body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        Alert.alert("Éxito", "Configuracion enviado correctamente");
        } catch (error : unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("Error desconocido", error);
            }
        } finally {
            setLoading(false);
        }
    };

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
        <View style={{
            marginTop: 20
        }}>
        <Button title={loading ? "Enviando..." : "Actualizar RGB"} onPress={sendRGBConfig} disabled={loading} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  label: { fontSize: 16, marginVertical: 8 },
  picker: { height: 50, width: 180, color: "#e1e1e1"},
});

type props_status = {
    ip: string,
    setIp: (param: string) => void
};
const Status = ({ip, setIp}:props_status)=>{
    //Verify if this app is conected with the esp32
        //making the comunication
    let nip = ip;
    const [isConnect, setIsConnect] = useState<boolean>(false);
    
    useEffect(() => {
        setInterval(() => {
            fetch("http://" + ip + "/ip")
                .then(response => {
                    if(response.ok){
                        setIsConnect(true);
                    }
                })
        }, 200)
        
    }, [ip, setIsConnect]);


    return(
        
        <View style={isConnect ? style_setting.container_status_conected : style_setting.container_status_disconected}>
            <Text style={style_setting.text_status}> Tu dispositivo esta {isConnect ? "conectado" : "desconectado"}</Text>
        </View>
        
        
    )
}
interface FormConnectedProps {
  ssid: string;
  setSsid: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}
const FormConnected: React.FC<FormConnectedProps> = ({ ssid, setSsid, password, setPassword }) => {
  return (
        <View>
            <View>
                <Text style={style_setting.labels}>Input the SSID:</Text>
                <TextInput 
                    style={style_setting.input_text}
                    placeholder="SSID"
                    keyboardType="default"
                    value={ssid}
                    onChangeText={setSsid}
                    autoCapitalize="none"
                />
            </View>
            <View>
                <Text style={style_setting.labels}>Input the password:</Text>
                <TextInput 
                    style={style_setting.input_text}
                    placeholder="PASSWORD"
                    keyboardType="visible-password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    
                />

            </View>
        </View>

    );
}


type props_settings = {
    ip: string,
    setIp: (param: string) => void
};

const Setting = ({ip, setIp}: props_settings)=>{
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const sendWifiConfig = async () => {
    if (!ssid.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor ingresa SSID y contraseña");
      return;
    }

    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("ssid", ssid);
        formData.append("password", password);
        console.log(formData);

        const response = await fetch("http://192.168.4.1/wifi", {
        method: "POST",
        headers: {
          // NO pongas Content-Type, fetch lo asigna automáticamente para multipart/form-data
        },
        body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        Alert.alert("Éxito", "Configuración WiFi enviada correctamente");
        
        const result = await response.json();
        setIp(result.ip);
        
    } catch (error : unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("Error desconocido", error);
            }
        } finally {
            setLoading(false);
        }
    };
    return(
        
            <ScrollView style={style_setting.container_root}>
                <Text style={style_setting.text_tile}>Config</Text>
                <Status ip={ip} setIp={setIp}/>
                <RGPicker ip={ip} />

                <FormConnected ssid={ssid} setSsid={setSsid} password={password} setPassword={setPassword}/>

                <View style={{marginTop:20}}>
                    <Button title={loading ? "Enviando..." : "Update Setting"} onPress={sendWifiConfig} disabled={loading} />
                </View>
                
            </ScrollView>
        
    );
}


export default Setting;

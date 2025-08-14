import React, {useState, useRef, useEffect} from "react";
import {Text, View, StyleSheet, PermissionsAndroid,NativeModules ,Platform, ScrollView, TextInput, Button, Alert} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { decode } from 'base64-arraybuffer';
import RNFS from 'react-native-fs';


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxviwfoyyskhnxqznlly.supabase.co';
const supabaseKey = 'sb_secret_IIAHf07ZZpidZGlVS_ZW1w_sIUKHlBD';
export const supabase = createClient(supabaseUrl, supabaseKey);

const {MyAudioModule} = NativeModules;


const style_schedule = StyleSheet.create({  
    container_root: {
        flex: 9,
        padding: 20,
        backgroundColor: '#131925',//'#080c32',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingTop: 30,
    },

    text_title: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        color: "#e1e1e1",
        borderBottomWidth: 1,
        paddingBottom: 15,
        borderBottomColor: "#e1e1e1",
        fontWeight: 'bold'
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

    container_horizontal: {
        flexDirection: "row",
        alignContent: "center"
    }
});

const uploadAudioToSupabase = async (localFilePath: string, fileName: string) => {
  try {
    // Leer archivo local en base64
    const base64File = await RNFS.readFile(localFilePath, 'base64');

    // Subir a Supabase storage como un Blob (buffer)
    const { data, error } = await supabase.storage
      .from('appembebidos')  // tu bucket
      .upload(fileName, Buffer.from(base64File, 'base64'), {
        contentType: 'application/octet-stream', // o 'audio/raw' si quieres
        upsert: true,
      });

    if (error) {
      throw error;
    }

    console.log('Archivo subido:', data);
    return data; // info del archivo subido
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return null;
  }
};


const Rango = Array.from({ length: 256 }, (_, i) => i); // [0,1,2,...,255]

const RGPicker = ({ onChangeRgb }: { onChangeRgb: (rgb: string) => void })=>{
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  useEffect(() => {
    onChangeRgb(`${red}-${green}-${blue}`);
  }, [red, green, blue, onChangeRgb]);

  return (
    <View style={styles.container}>
        <View style={style_schedule.container_horizontal}>
            <View>
                <Text style={style_schedule.labels}>Rojo: {red}</Text>
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
                    <Text style={style_schedule.labels}>Verde: {green}</Text>
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
            <View style={style_schedule.container_horizontal}>
                <View>
                <Text style={style_schedule.labels}>Azul: {blue}</Text>
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


//recorder 

// Simula tu módulo nativo para grabar audio


const AudioRecorder = ({
  setAudioFileName,
}: {
  setAudioFileName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permiso para grabar audio',
          message: 'La app necesita permiso para usar el micrófono',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar',
          buttonNeutral: 'Preguntar después',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS
  };

  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      Alert.alert('Permisos', 'No se concedieron permisos para usar el micrófono');
      return;
    }
    try {
      const path = await MyAudioModule.startRecording();
      setAudioPath(path);
      setRecording(true);
      setAudioFileName(""); // limpio el archivo previo
    } catch {
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopRecording = async () => {
    try {
      await MyAudioModule.stopRecording();
      setRecording(false);
      Alert.alert('Grabación', 'Grabación terminada');
      if (!audioPath) {
        Alert.alert("Error", "No se encontró el archivo grabado");
        return;
      }

      setUploading(true);
      const fileName = `audio_${Date.now()}.raw`;
      const result = await uploadAudioToSupabase(audioPath, fileName);
      if (result) {
        Alert.alert("Éxito", "Audio procesado correctamente");
        setAudioFileName(fileName); // Guardo el nombre para usarlo luego
      } else {
        Alert.alert("Error", "No se pudo subir el audio");
      }

    } catch {
      Alert.alert('Error', 'No se pudo detener la grabación');
    }
  };

  const playRecording = async () => {
    if (!audioPath) {
      Alert.alert('Audio', 'No hay grabación para reproducir');
      return;
    }
    try {
      await MyAudioModule.playRecording(audioPath);
    } catch {
      Alert.alert('Error', 'No se pudo reproducir la grabación');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>Estado: {recording ? 'Grabando...' : 'Detenido'}</Text>
      <Button
        title={recording ? 'Detener grabación' : 'Iniciar grabación'}
        onPress={recording ? stopRecording : startRecording}
      />
      <View style={{ height: 10 }} />
      <Button title="Reproducir grabación" onPress={playRecording} />
    </View>
  );
};

type props_form = {
    ip:string
};
const Form = ({ip}: props_form)=>{
  const [audioFileName, setAudioFileName] = useState("");
    const [date, setDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const [inputTask, setInputTask] = useState("");
    const [typeTask, setTypeTask] = useState("");
    const [loading, setLoading] = useState(false);

      // RGB picker state as "R-G-B"
    const [rgb, setRgb] = useState("0-0-0");

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
        setShow(false);
        return;
        }
        if (!selectedDate) return;

        const now = new Date();

        if (mode === 'date') {
        if (selectedDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
            Alert.alert('Error', 'No puedes seleccionar una fecha pasada');
            return;
        }
        setDate(selectedDate);
        setShow(false);
        } else if (mode === 'time') {
        if (
            date.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0) &&
            (selectedDate.getHours() < now.getHours() ||
            (selectedDate.getHours() === now.getHours() && selectedDate.getMinutes() < now.getMinutes()))
        ) {
            Alert.alert('Error', 'No puedes seleccionar una hora pasada');
            // NO cerrar el picker para que el usuario elija otra hora
            return;
        }
        // Hora válida, actualizar y cerrar picker
        const newDate = new Date(date);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        setDate(newDate);
        setShow(false);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setMode(currentMode);
        setShow(true);
    };

    const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const dateStr = `${day}-${month}-${year}`;
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const timeStr = `${hours}:${minutes}`;

  const handleSubmit = async () => {
    if (!audioFileName) {
      Alert.alert("Error", "Debe grabar y subir un archivo antes de registrar la tarea.");
      return;
    }
    if (!inputTask.trim() || !typeTask.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", typeTask);
      formData.append("date", `"${dateStr}"`); // tal como el formato que quieres
      formData.append("time", `"${timeStr}"`);
      formData.append("nameFile", audioFileName);
      formData.append("rgb", `"${rgb}"`);

      console.log(formData);

      const response = await fetch("http://" + ip + "/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      Alert.alert("Éxito", "Tarea registrada correctamente");
      // Opcional: limpiar inputs
      setInputTask("");
      setTypeTask("");
      setAudioFileName("");
      setRgb("0-0-0");
    } catch (error) {
      Alert.alert("Error");
    } finally {
      setLoading(false);
    }
  };



    const handleRgbChange = (newRgb: string) => {
      setRgb(newRgb);
    };
    

    return(
        <View>
            <View>
                <Text style={style_schedule.labels}>Input task:</Text>
                <TextInput 
                    style={style_schedule.input_text}
                    placeholder="Input the task"
                    keyboardType="default"
                    onChangeText={setInputTask}
                    value={inputTask}
                />
            </View>
            <View>
                <Text style={style_schedule.labels}>Type task:</Text>
                <TextInput 
                    style={style_schedule.input_text}
                    placeholder="Input the type task"
                    keyboardType="default"
                    value={typeTask}
                    onChangeText={setTypeTask}
                />
            </View>
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#fff', marginBottom: 8 }}>
                    Fecha y hora seleccionada:
                </Text>
                <Text style={{ color: '#fff', marginBottom: 20 }}>
                    {date.toLocaleString()}
                </Text>

                <Button title="Seleccionar Fecha" onPress={() => showMode('date')} />
                <View style={{ height: 10 }} />
                <Button title="Seleccionar Hora" onPress={() => showMode('time')} />

                {show && (
                    <DateTimePicker
                    value={tempDate}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minimumDate={mode === 'date' ? new Date() : undefined} // solo para date
                />
                )}
            </View>
            <View>
                <RGPicker  onChangeRgb={handleRgbChange}/>
            </View>

            <View>
                <AudioRecorder setAudioFileName={setAudioFileName}/>
            </View>

            <View  >
                <Button title={loading ? "Registrando..." : "Registrar tarea"} onPress={handleSubmit} disabled={loading} />
            </View>
        </View>
    );
}

type props_Schedule = {
    ip: string
}
const Schedule = ({ip}: props_Schedule)=>{
  
    return(
        
            <ScrollView style={style_schedule.container_root}
              contentContainerStyle={{ flexGrow: 1 ,  paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            >
                <Text style={style_schedule.text_title}>Add Schedule</Text>
                <Form ip={ip} />
                
            </ScrollView>
        
    );
}


export default Schedule;

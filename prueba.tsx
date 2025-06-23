
/*
import React, {useState} from "react";
import {Text, View, StyleSheet, Button} from 'react-native';


//Creating one Stylesheet
const styles = StyleSheet.create({
    center:{
        alignItems: 'center'
    }
});


//Creating the object props
type GreattingProps = {
    name: String;
};

const Greating = (props: GreattingProps) => {
    return(
        <View style={styles.center}>
            <Text>Hello {props.name}</Text>
        </View>
    );
};

//Now we use the states

const HelloWorldApp = () => {

    const [count, setCount] = useState(0);
    

    return(
        <View 
            style={[styles.center, {top:50}]}>
            <Text style={styles.center}> 
                you clicked {count} times
            </Text>

            <Button 
                onPress={() => {setCount(count + 1)}}
                title="Clicked me!"
            />
            
        </View>
    );
};

export default HelloWorldApp;

*/
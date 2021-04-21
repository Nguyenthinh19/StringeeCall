import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, Platform, StyleSheet, View, TextInput } from 'react-native';
import { StringeeClient, StringeeCall, StringeeVideoView, StringeeRemoteVideoView } from 'stringee-react-native';
import { useSafeArea } from 'react-native-safe-area-context';

const LoginScreen = props => {
    const [userId, setUserId] = useState('')
    const user1 =
        'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg4NzIiLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwODcyLCJ1c2VySWQiOiJ1c2VyMSJ9.xMbLGMyD0WCY88dhUL5PIpw1Pb-gfOq82tdrkHYn9Hw';
    const user2 =
        'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg3NTciLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwNzU3LCJ1c2VySWQiOiJ1c2VyMiJ9.zHfhHehnvcrQhekuoow0lhyiy6hIf7xQSP8J3Nf7zzk';
    const onPressLogin = () => {
        if (userId == 'user1') {
            props.navigation.navigate("Home", { token: user1 })
        } else if (userId == 'user2') {
            props.navigation.navigate("Home", { token: user2 })
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                React Native wrapper for Stringee mobile SDK!
            </Text>

            {/* <Text style={styles.info}>Logged in as: {this.state.myUserId}</Text> */}

            <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                autoCapitalize="none"
                value={userId}
                placeholder="Make a call to userId"
                onChangeText={text => setUserId(text)}
            />

            <View style={styles.buttonView}>
                {/* <TouchableOpacity
            style={styles.button}
        //  onPress={this._onVoiceCallButtonPress}
        >
            <Text style={styles.text}>Voice Call</Text>
        </TouchableOpacity> */}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { onPressLogin() }}
                >
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
            </View>

            {/* <StringeeClient ref="client" eventHandlers={this.clientEventHandlers} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        fontWeight: "bold"
    },
    info: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        fontWeight: "bold",
        color: "red"
    },

    text: {
        textAlign: "center",
        color: "#F5FCFF",
        marginBottom: 5,
        fontWeight: "bold",
        fontSize: 15
    },

    input: {
        height: 35,
        width: 280,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 20,
        textAlign: "center",
        backgroundColor: "#ECECEC"
    },

    button: {
        width: 120,
        height: 40,
        marginTop: 40,
        paddingTop: 10,
        // paddingBottom: ,
        backgroundColor: "#1E6738",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fff"
    },

    buttonView: {
        width: 280,
        height: 80,
        flexDirection: "row",
        justifyContent: "center"
    }
});

export default LoginScreen;
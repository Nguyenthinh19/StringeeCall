import React, { Component, useState, useEffect, useRef, createRef } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Keyboard,
    AsyncStorage
} from "react-native";
import { StringeeClient } from "stringee-react-native";
import messaging from '@react-native-firebase/messaging';


const user1 =
    'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MjY0OTE0MDEiLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjI5MDgzNDAxLCJ1c2VySWQiOiJwaHVvbmdnIn0.f2EjtnPnDBojWttTHLAVLV8OF-Mcx60TIUfUg82Pnj0';
const user2 = "eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS0xIb2NCdDl6Qk5qc1pLeThZaUVkSzRsU3NBZjhCSHpyLTE1OTAwNTEzNzQiLCJpc3MiOiJTS0xIb2NCdDl6Qk5qc1pLeThZaUVkSzRsU3NBZjhCSHpyIiwiZXhwIjoxNTkyNjQzMzc0LCJ1c2VySWQiOiJ1c2VyMiJ9.I2WHHUZ9LqnV31vLzRM3-hrNsce6Ax3AzsMvQhwIW_E";

const iOS = Platform.OS === "ios" ? true : false;
// const token = messaging().getToken;

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myUserId: "",
            callToUserId: "",
            hasConnected: false,
            token: this.props.route.params.token
        };

        this.clientEventHandlers = {
            onConnect: this._clientDidConnect,
            onDisConnect: this._clientDidDisConnect,
            onFailWithError: this._clientDidFailWithError,
            onRequestAccessToken: this._clientRequestAccessToken,
            onIncomingCall: this._callIncomingCall
        };
    }

    componentWillMount() { }

    async componentDidMount() {

        await this.refs.client.connect(this.state.token);

        // await messaging().onTokenRefresh(token => {
        //     this.refs.client.registerPush(
        //         token,
        //         true,
        //         true,
        //         (result, code, desc) => {
        //             console.log('refreshRegisterPush', result, code, desc)
        //         },
        //     );
        // });
    }

    // Connection
    _clientDidConnect = ({ userId }) => {
        console.log("_clientDidConnect - " + userId);
        this.setState({
            myUserId: userId,
            hasConnected: true
        });
        if (!iOS) {
            messaging().getToken().then((token) => {
                console.log('token', token)
                this.refs.client.registerPush(
                    token,
                    true,
                    true,
                    (result, code, desc) => {
                        console.log('registerPush', result, code, desc)
                    },
                );
            });
            messaging().onTokenRefresh(token => {
                this.refs.client.registerPush(
                    token,
                    true,
                    true,
                    (result, code, desc) => { },
                );
            });
        }
    };

    _clientDidDisConnect = () => {
        console.log("_clientDidDisConnect");
        this.setState({
            myUserId: "",
            hasConnected: false
        });
    };

    _clientDidFailWithError = () => {
        console.log("_clientDidFailWithError");
    };

    _clientRequestAccessToken = () => {
        console.log("_clientRequestAccessToken");
        // Token để kết nối tới Stringee server đã hết bạn. Bạn cần lấy token mới và gọi connect lại ở đây
        // this.refs.client.connect("NEW_TOKEN");
    };

    // Call events
    _callIncomingCall = ({
        callId,
        from,
        to,
        fromAlias,
        toAlias,
        callType,
        isVideoCall,
        customDataFromYourServer
    }) => {
        console.log(
            "IncomingCallId-" +
            callId +
            " from-" +
            from +
            " to-" +
            to +
            " fromAlias-" +
            fromAlias +
            " toAlias-" +
            toAlias +
            " isVideoCall-" +
            isVideoCall +
            "callType-" +
            callType +
            "customDataFromYourServer-" +
            customDataFromYourServer
        );

        this.props.navigation.navigate("Call", {
            callId: callId,
            from: from,
            to: to,
            isOutgoingCall: false,
            isVideoCall: isVideoCall
        });
    };

    // Action
    _onVoiceCallButtonPress = () => {
        console.log("_onVoiceCallButtonPress");
        Keyboard.dismiss();
        if (this.state.callToUserId != "" && this.state.hasConnected) {
            this.props.navigation.navigate("Call", {
                from: this.state.myUserId,
                to: this.state.callToUserId,
                isOutgoingCall: true,
                isVideoCall: false
            });
        }
    };

    _onVideoCallButtonPress = () => {
        Keyboard.dismiss();
        console.log("_onVideoCallButtonPress");
        if (this.state.callToUserId != "" && this.state.hasConnected) {
            this.props.navigation.navigate("Call", {
                from: this.state.myUserId,
                to: this.state.callToUserId,
                isOutgoingCall: true,
                isVideoCall: true
            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    React Native wrapper for Stringee mobile SDK!
                </Text>

                <Text style={styles.info}>Logged in as: {this.state.myUserId}</Text>

                <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    autoCapitalize="none"
                    value={this.state.callToUserId}
                    placeholder="Make a call to userId"
                    onChangeText={text => this.setState({ callToUserId: text })}
                />

                <View style={styles.buttonView}>
                    {/* <TouchableOpacity
                        style={styles.button}
                        onPress={this._onVoiceCallButtonPress}
                    >
                        <Text style={styles.text}>Voice Call</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this._onVideoCallButtonPress}
                    >
                        <Text style={styles.text}>Video Call</Text>
                    </TouchableOpacity>
                </View>

                <StringeeClient ref="client" eventHandlers={this.clientEventHandlers} />
            </View>
        );
    }
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

// const HomeScreen = props => {
//     //    const client = useRef(null);
//     const client = createRef();
//     const [myUserId, setMyUserId] = useState('')
//     const [callToUserId, setCallToUserId] = useState('')
//     const [hasConnected, setHasConnected] = useState(false)
//     const [token, setToken] = useState(props.route.params.token)
//     useEffect(() => {
//         client.current.connect(user1);
//         console.log("tesst", client.current)
//     });
//     const clientEventHandlers = {
//         onConnect: _clientDidConnect,
//         onDisConnect: _clientDidDisConnect,
//         onFailWithError: _clientDidFailWithError,
//         onRequestAccessToken: _clientRequestAccessToken,
//         onIncomingCall: _callIncomingCall
//     };

//     // constructor(props) {
//     //     super(props);

//     //     this.state = {
//     //         myUserId: "",
//     //         callToUserId: "",
//     //         hasConnected: false,
//     //         token: this.props.route.params.token
//     //     };

//     //     this.clientEventHandlers = {
//     //         onConnect: this._clientDidConnect,
//     //         onDisConnect: this._clientDidDisConnect,
//     //         onFailWithError: this._clientDidFailWithError,
//     //         onRequestAccessToken: this._clientRequestAccessToken,
//     //         onIncomingCall: this._callIncomingCall
//     //     };
//     // }

//     // componentWillMount() { }

//     // async componentDidMount() {
//     //     await this.refs.client.connect(this.state.token);
//     // }

//     // Connection
//     const _clientDidConnect = ({ userId }) => {
//         console.log("_clientDidConnect - " + userId);
//         setMyUserId(userId);
//         setHasConnected(true);
//         // this.setState({
//         //     myUserId: userId,
//         //     hasConnected: true
//         // });

//         // if (!iOS) {
//         //   AsyncStorage.getItem("isPushTokenRegistered").then(value => {
//         //     if (value !== "true") {
//         //       FCM.getFCMToken().then(token => {
//         //         this.refs.client.registerPush(
//         //           token,
//         //           true,
//         //           true,
//         //           (result, code, desc) => {
//         //             if (result) {
//         //               AsyncStorage.multiSet([
//         //                 ["isPushTokenRegistered", "true"],
//         //                 ["token", token]
//         //               ]);
//         //             }
//         //           }
//         //         );
//         //       });
//         //     }
//         //   });

//         //   FCM.on(FCMEvent.RefreshToken, token => {
//         //     this.refs.client.registerPush(
//         //       token,
//         //       true,
//         //       true,
//         //       (result, code, desc) => {}
//         //     );
//         //   });
//         // }
//     };

//     const _clientDidDisConnect = () => {
//         console.log("_clientDidDisConnect");
//         setMyUserId("");
//         setHasConnected(false);
//         // this.setState({
//         //     myUserId: "",
//         //     hasConnected: false
//         // });
//     };

//     const _clientDidFailWithError = () => {
//         console.log("_clientDidFailWithError");
//     };

//     const _clientRequestAccessToken = () => {
//         console.log("_clientRequestAccessToken");
//         // Token để kết nối tới Stringee server đã hết bạn. Bạn cần lấy token mới và gọi connect lại ở đây
//         // this.refs.client.connect("NEW_TOKEN");
//     };

//     // Call events
//     const _callIncomingCall = ({
//         callId,
//         from,
//         to,
//         fromAlias,
//         toAlias,
//         callType,
//         isVideoCall,
//         customDataFromYourServer
//     }) => {
//         console.log(
//             "IncomingCallId-" +
//             callId +
//             " from-" +
//             from +
//             " to-" +
//             to +
//             " fromAlias-" +
//             fromAlias +
//             " toAlias-" +
//             toAlias +
//             " isVideoCall-" +
//             isVideoCall +
//             "callType-" +
//             callType +
//             "customDataFromYourServer-" +
//             customDataFromYourServer
//         );

//         props.navigation.navigate("Call", {
//             callId: callId,
//             from: from,
//             to: to,
//             isOutgoingCall: false,
//             isVideoCall: isVideoCall
//         });
//     };

//     // Action
//     const _onVoiceCallButtonPress = () => {
//         console.log("_onVoiceCallButtonPress");
//         Keyboard.dismiss();
//         if (callToUserId != "" && hasConnected) {
//             props.navigation.navigate("Call", {
//                 from: this.state.myUserId,
//                 to: this.state.callToUserId,
//                 isOutgoingCall: true,
//                 isVideoCall: false
//             });
//         }
//     };

//     const _onVideoCallButtonPress = () => {
//         Keyboard.dismiss();
//         console.log("_onVideoCallButtonPress");
//         if (callToUserId != "" && hasConnected) {
//             props.navigation.navigate("Call", {
//                 from: myUserId,
//                 to: callToUserId,
//                 isOutgoingCall: true,
//                 isVideoCall: true
//             });
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <StringeeClient ref={client} eventHandlers={clientEventHandlers} />
//             <Text style={styles.welcome}>
//                 React Native wrapper for Stringee mobile SDK!
//             </Text>

//             {/* <Text style={styles.info}>Logged in as: {myUserId}</Text> */}

//             <TextInput
//                 underlineColorAndroid="transparent"
//                 style={styles.input}
//                 autoCapitalize="none"
//                 value={callToUserId}
//                 placeholder="Make a call to userId"
//                 onChangeText={text => setCallToUserId(text)}
//             />

//             <View style={styles.buttonView}>
//                 {/* <TouchableOpacity
//                         style={styles.button}
//                         onPress={this._onVoiceCallButtonPress}
//                     >
//                         <Text style={styles.text}>Voice Call</Text>
//                     </TouchableOpacity> */}

//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={_onVideoCallButtonPress}
//                 >
//                     <Text style={styles.text}>Video Call</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* <StringeeClient ref={client} eventHandlers={clientEventHandlers} /> */}
//         </View>
//     );
// }
//export default HomeScreen;
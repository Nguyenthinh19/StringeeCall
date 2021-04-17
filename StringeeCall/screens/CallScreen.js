import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, Platform, StyleSheet, TextInput } from 'react-native';
import { StringeeClient, StringeeCall, StringeeVideoView, StringeeRemoteVideoView } from 'stringee-react-native';

const CallScreen = props => {
    //  alert(JSON.stringify(props.route.params.token))
    const client = useRef(null);
    const stringeeCall = useRef(null);
    const [myUserId, setMyUserId] = useState('');
    const [callToUserId, setCallToUserId] = useState('');
    const [hasReceivedLocalStream, setHasReceivedLocalStream] = useState(false);
    const [hasReceivedRemoteStream, setHasReceivedRemoteStream] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [callId, setCallId] = useState('')
    const [token, setToken] = useState(props.route.params.token)
    const user1 =
        'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg4NzIiLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwODcyLCJ1c2VySWQiOiJ1c2VyMSJ9.xMbLGMyD0WCY88dhUL5PIpw1Pb-gfOq82tdrkHYn9Hw';
    const user2 =
        'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg3NTciLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwNzU3LCJ1c2VySWQiOiJ1c2VyMiJ9.zHfhHehnvcrQhekuoow0lhyiy6hIf7xQSP8J3Nf7zzk';

    useEffect(() => {
        client.current.connect(token);
    }, token);

    // The client connects to Stringee server
    const _clientDidConnect = ({ userId }) => {
        console.log('_clientDidConnect - ' + userId);
        setMyUserId(userId);
        // alert(JSON.stringify(userId));
    };

    // The client disconnects from Stringee server
    const _clientDidDisConnect = () => {
        console.log('_clientDidDisConnect');
    };

    // The client fails to connects to Stringee server
    const _clientDidFailWithError = () => {
        console.log('_clientDidFailWithError');
    };

    const _callIncomingCall = ({ callId, from, to, fromAlias, toAlias, callType, isVideoCall }) => {
        stringeeCall.current.initAnswer(callId, (status, code, message) => {
            console.log(message);
            if (status) {
                setIsCalling(true);
            } else {
                // Fail
            }
        });

        console.log("IncomingCallId-" + callId + ' from-' + from + ' to-' + to + ' fromAlias-' + fromAlias + ' toAlias-' + toAlias + ' isVideoCall-' + isVideoCall + 'callType-' + callType);
    }

    const answerCall = () => {
        stringeeCall.current.answer(callId, (status, code, message) => {
            console.log(message);
            if (status) {
                // setHasReceivedRemoteStream(true);
                // Sucess
            } else {
                // Fail
            }
        });
    };

    // Access token is expired. A new access token is required to connect to Stringee server
    const _clientRequestAccessToken = () => {
        console.log('_clientRequestAccessToken');
        // this.refs.client.connect('NEW_YOUR_ACCESS_TOKEN');
    };

    const _callDidChangeSignalingState = ({ callId, code, reason, sipCode, sipReason }) => {
        console.log('callId-' + callId + 'code-' + code + ' reason-' + reason + ' sipCode-' + sipCode + ' sipReason-' + sipReason);
    }

    // Invoked when the call media state changes
    const _callDidChangeMediaState = ({ callId, code, description }) => {
        console.log('callId-' + callId + 'code-' + code + ' description-' + description);
    }

    // Invoked when the local stream is available    
    const _callDidReceiveLocalStream = ({ callId }) => {
        console.log('_callDidReceiveLocalStream ' + callId);
        setHasReceivedLocalStream(true)

    }
    // Invoked when the remote stream is available
    const _callDidReceiveRemoteStream = ({ callId }) => {
        console.log('_callDidReceiveRemoteStream ' + callId);
        setHasReceivedRemoteStream(true)
        setCallId(callId)
    }

    // Invoked when receives a DMTF
    const _didReceiveDtmfDigit = ({ callId, dtmf }) => {
        console.log('_didReceiveDtmfDigit ' + callId + "***" + dtmf);
    }

    // Invoked when receives info from other clients
    const _didReceiveCallInfo = ({ callId, data }) => {
        console.log('_didReceiveCallInfo ' + callId + "***" + data);
    }

    // Invoked when the call is handled on another device
    const _didHandleOnAnotherDevice = ({ callId, code, description }) => {
        console.log('_didHandleOnAnotherDevice ' + callId + "***" + code + "***" + description);
    }

    const clientEventHandlers = {
        onConnect: _clientDidConnect,
        onDisConnect: _clientDidDisConnect,
        onFailWithError: _clientDidFailWithError,
        onRequestAccessToken: _clientRequestAccessToken,
        onIncomingCall: _callIncomingCall,
    };
    const callEventHandlers = {
        onChangeSignalingState: _callDidChangeSignalingState,
        onChangeMediaState: _callDidChangeMediaState,
        onReceiveLocalStream: _callDidReceiveLocalStream,
        onReceiveRemoteStream: _callDidReceiveRemoteStream,
        onReceiveDtmfDigit: _didReceiveDtmfDigit,
        onReceiveCallInfo: _didReceiveCallInfo,
        onHandleOnAnotherDevice: _didHandleOnAnotherDevice
    }

    const myObj = {
        from: myUserId, // caller
        to: callToUserId, // callee
        isVideoCall: true, // Must be true
        videoResolution: 'NORMAL' // Set video resolution: 'NORMAL', 'HD'
    };

    const parameters = JSON.stringify(myObj)

    return (
        <SafeAreaView style={styles.container}  >
            <StringeeClient ref={client} eventHandlers={clientEventHandlers} />
            <Text style={styles.info}>Logged in as: {myUserId}</Text>
            <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                autoCapitalize="none"
                value={callToUserId}
                placeholder="Make a call to userId"
                onChangeText={text => setCallToUserId(text)}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => {

                    stringeeCall.current.makeCall(parameters, (status, code, message, callId) => {
                        setCallId(callId)

                        console.log('status-' + status + ' code-' + code + ' message-' + message + 'callId-' + callId);
                        if (status) {
                            // Sucess
                        } else {
                            // Fail
                        }
                    })
                    stringeeCall.current.initAnswer(callId, (status, code, message) => {
                        console.log(message);
                    });
                }
                } >
                <Text style={styles.text}>Call</Text>
            </TouchableOpacity>
            {hasReceivedLocalStream && callId != '' &&
                <StringeeVideoView
                    style={{ backgroundColor: 'black', width: 200, height: 200 }}
                    callId={callId}
                    streamId=''
                    local={true}
                    overlay={true}
                />}
            {hasReceivedRemoteStream && <StringeeVideoView
                style={{ backgroundColor: 'black', width: 200, height: 200 }}
                callId={callId}
                streamId=''
                local={false}
            />}
            {isCalling && (
                <TouchableOpacity
                    onPress={() => {
                        answerCall();
                    }}>
                    <Text>awser</Text>
                </TouchableOpacity>
            )}
            <StringeeCall
                ref={stringeeCall}
                eventHandlers={callEventHandlers}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: "center",
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

export default CallScreen;
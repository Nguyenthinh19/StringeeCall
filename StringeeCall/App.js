/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, Platform } from 'react-native';
import { StringeeClient, StringeeCall, StringeeVideoView, StringeeRemoteVideoView } from 'stringee-react-native';

const App = () => {
  const client = useRef(null);
  const stringeeCall = useRef(null);
  const [myUserId, setMyUserId] = useState('');
  const [hasReceivedLocalStream, setHasReceivedLocalStream] = useState(false);
  const [hasReceivedRemoteStream, setHasReceivedRemoteStream] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState('')
  const user1 =
    'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg4NzIiLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwODcyLCJ1c2VySWQiOiJ1c2VyMSJ9.xMbLGMyD0WCY88dhUL5PIpw1Pb-gfOq82tdrkHYn9Hw';
  const user2 =
    'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg3NTciLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwNzU3LCJ1c2VySWQiOiJ1c2VyMiJ9.zHfhHehnvcrQhekuoow0lhyiy6hIf7xQSP8J3Nf7zzk';

  useEffect(() => {
    if (Platform.OS === "ios") {
      client.current.connect(user2);
    } else {
      client.current.connect(user1);
    }
    //client.current.connect(user1);
    // stringeeCall.current.connect(user1);
  }, []);

  // The client connects to Stringee server
  const _clientDidConnect = ({ userId }) => {
    console.log('_clientDidConnect - ' + userId);
    setMyUserId(userId);
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
    from: 'user1', // caller
    to: 'user2', // callee
    isVideoCall: true, // Must be true
    videoResolution: 'NORMAL' // Set video resolution: 'NORMAL', 'HD'
  };

  const parameters = JSON.stringify(myObj)

  return (
    <SafeAreaView style={{ alignSelf: 'center' }}  >
      <StringeeClient ref={client} eventHandlers={clientEventHandlers} />
      <TouchableOpacity
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
        <Text>Call</Text>
      </TouchableOpacity>
      {hasReceivedLocalStream && callId != '' &&
        <StringeeVideoView
          style={{ backgroundColor: 'black', width: 100, height: 100 }}
          callId={callId}
          streamId=''
          local={true}
          overlay={true}
        />}
      {hasReceivedRemoteStream && <StringeeVideoView
        style={{ backgroundColor: 'black', width: 100, height: 100 }}
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

export default App;
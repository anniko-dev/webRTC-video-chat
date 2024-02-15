import React, { createContext, useState, useRef, useEffect, ReactNode, FC } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { a, b } from 'vite/dist/node/types.d-jgA8ss1A';

const socketContext = createContext();

const socket = io(`https://localhost:8080`);

type ContextProviderType = {
  children: ReactNode;
};

type CallType = {
  from: any;
  name: string;
  signal: any;
  isCalling: boolean;
};

const ContextProvider: FC<ContextProviderType> = ({ children }) => {
  const [stream, setStream] = useState<null | MediaStream>(null);
  const [profile, setProfile] = useState('');
  const [call, setCall] = useState<CallType | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const [name, setName] = useState('');

  const myVideoStream = useRef();
  const userVideoStream = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);

      // @ts-ignore
      myVideoStream.current.srcObject = currentStream;
    });

    socket.on('me', (id) => {
      setProfile(id);
    });

    socket.on('calluser', (data: CallType) => {
      setCall({ ...data, isCalling: true });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answercall', {
        signal: data,
        to: call?.from,
      });
    });

    peer.on('stream', (currentStream) => {
      userVideoStream.current.srcObject = currentStream;
    });

    peer.signal(call?.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (data: any) => {
      socket.emit('calluser', {
        userToCall: id,
        signalData: data,
        from: profile,
        name,
      });
    });

    peer.on('stream', (currentStream) => {
      userVideoStream.current.srcObject = currentStream;
    });

    socket.on('callaccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current = null;
  };
};

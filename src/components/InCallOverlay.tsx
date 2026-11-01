import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Telecom, CallEvent } from '../..//modules/handleit-telecom';

export default function InCallOverlay() {
  const [call, setCall] = useState<CallEvent | null>(null);

  useEffect(() => {
    const sub = Telecom.onCallChanged((e) => setCall(e.state === 7 ? null : e));
    return () => sub.remove();
  }, []);

  if (!call) return null;
  const ringing = call.state === 2;

  return (
    <ThemedView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 96,
      }}
    >
      <ThemedView style={{ alignItems: 'center', backgroundColor: '#000' }}>
        <ThemedText style={{ fontSize: 14, fontWeight: '800', color: '#fff', opacity: 0.6 }}>
          {ringing ? 'INCOMING CALL' : call.state === 4 ? 'ON CALL' : 'CALLING'}
        </ThemedText>
        <ThemedText style={{ fontSize: 34, fontWeight: '900', color: '#fff', marginTop: 12 }}>
          {call.number || 'Unknown'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ flexDirection: 'row', gap: 48, backgroundColor: '#000' }}>
        <Pressable
          onPress={() => Telecom.hangup()}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            borderWidth: 2,
            borderColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="call-end" size={32} color="#fff" />
        </Pressable>
        {ringing && (
          <Pressable
            onPress={() => Telecom.answer()}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="call" size={32} color="#000" />
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

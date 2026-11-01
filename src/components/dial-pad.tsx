import React, { useEffect, useState } from 'react';
import { Linking, PermissionsAndroid, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

type Sim = {
  displayName: string;
  carrierName: string;
  simSlotIndex: number;
  subscriptionId: number;
};

type Props = {
  onDial?: (number: string, sim?: Sim) => void;
};

const keys = [
  ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
  ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
  ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
  ['*', ''], ['0', '+'], ['#', ''],
];

export default function DialPad({ onDial }: Props) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState('');
  const [sims, setSims] = useState<Sim[]>([]);
  const [selectedSim, setSelectedSim] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    (async () => {
      try {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        ]);
        const granted = Object.values(result).every((r) => r === PermissionsAndroid.RESULTS.GRANTED);
        if (!granted) return;
        const cards = await SimCardsManagerModule.getSimCards();
        setSims(cards);
      } catch {
        setSims([]);
      }
    })();
  }, []);

  const press = (d: string) => setNumber((n) => n + d);

  const dial = () => {
    if (!number) return;
    const sim = sims[selectedSim];
    if (onDial) {
      onDial(number, sim);
    } else {
      Linking.openURL(`tel:${encodeURIComponent(number)}`);
    }
  };

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: insets.bottom + 20,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 8,
        }}
      >
        <Ionicons name="keypad" size={28} color="#000" />
      </Pressable>
    );
  }

  return (
    <ThemedView
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 16,
        paddingBottom: insets.bottom + 12,
        paddingHorizontal: 20,
        elevation: 16,
      }}
    >
      <ThemedView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 56,
          backgroundColor: '#000',
        }}
      >
        <ThemedText
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 36,
            fontWeight: '900',
            color: '#fff',
            letterSpacing: 1,
          }}
        >
          {number || ' '}
        </ThemedText>
      </ThemedView>

      {sims.length > 0 && (
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginVertical: 8,
            backgroundColor: '#000',
          }}
        >
          {sims.map((sim, i) => {
            const active = selectedSim === i;
            return (
              <Pressable
                key={sim.subscriptionId}
                onPress={() => setSelectedSim(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: '#fff',
                  backgroundColor: active ? '#fff' : '#000',
                }}
              >
                <MaterialIcons name="sim-card" size={16} color={active ? '#000' : '#fff'} />
                <ThemedText
                  style={{
                    marginLeft: 6,
                    fontSize: 13,
                    fontWeight: '800',
                    color: active ? '#000' : '#fff',
                  }}
                >
                  {`SIM ${sim.simSlotIndex + 1} · ${sim.carrierName || sim.displayName}`}
                </ThemedText>
              </Pressable>
            );
          })}
        </ThemedView>
      )}

      <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#000', marginTop: 4 }}>
        {keys.map(([d, letters]) => (
          <ThemedView
            key={d}
            style={{ width: '33.33%', alignItems: 'center', paddingVertical: 6, backgroundColor: '#000' }}
          >
            <Pressable
              onPress={() => press(d)}
              onLongPress={() => d === '0' && press('+')}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
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
              <ThemedText style={{ fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 32 }}>
                {d}
              </ThemedText>
              <ThemedText style={{ fontSize: 9, fontWeight: '700', color: '#fff', opacity: 0.7, letterSpacing: 1 }}>
                {letters || ' '}
              </ThemedText>
            </Pressable>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
          backgroundColor: '#000',
        }}
      >
        <Pressable
          onPress={() => setOpen(false)}
          hitSlop={12}
          style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-down" size={32} color="#fff" />
        </Pressable>

        <Pressable
          onPress={dial}
          style={{
            width: 132,
            height: 68,
            borderRadius: 34,
            backgroundColor: number ? '#fff' : '#000',
            borderWidth: 2,
            borderColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="call" size={30} color={number ? '#000' : '#fff'} />
        </Pressable>

        <Pressable
          onPress={() => setNumber((n) => n.slice(0, -1))}
          onLongPress={() => setNumber('')}
          hitSlop={12}
          style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="backspace-outline" size={32} color="#fff" />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

import { useState } from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const sims = [
  { id: 'sim1', slot: 1, carrier: 'JIO', number: '+91 98•••• 43210' },
  { id: 'sim2', slot: 2, carrier: 'Airtel', number: '+91 88•••• 55667' },
];

export default function CallHandlingScreen() {
  const [selected, setSelected] = useState('sim1');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setEnabled((e) => !e);
      setLoading(false);
    }, 900);
  };

  const active = sims.find((s) => s.id === selected);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 12 }}>
        <ThemedView
          style={{
            flex: 1,
            borderRadius: 28,
            padding: 22,
          }}
        >
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ThemedText style={{ fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>
              HandleIt Login
            </ThemedText>
            <ThemedView
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 14,
                backgroundColor: enabled ? '#fff' : '#141414',
              }}
            >
              <ThemedView
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginRight: 6,
                  backgroundColor: enabled ? '#000' : '#6b6f75',
                }}
              />
              <ThemedText style={{ fontSize: 11, fontWeight: '800', color: enabled ? '#000' : '#9aa0a6' }}>
                {enabled ? 'ACTIVE' : 'OFF'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginTop: 28, marginBottom: 12 }}>
            Select the SIM
          </ThemedText>

          <ThemedView style={{
            flexDirection: 'row', gap: 12,
          }}>
            {sims.map((sim) => {
              const isSelected = selected === sim.id;
              return (
                <Pressable
                  key={sim.id}
                  disabled={enabled || loading}
                  onPress={() => setSelected(sim.id)}
                  style={{
                    flex: 1,
                    height: 104,
                    borderRadius: 20,
                    padding: 12,
                    backgroundColor: '#141414',
                    borderWidth: 2,
                    borderColor: isSelected ? '#fff' : '#141414',
                    opacity: enabled && !isSelected ? 0.4 : 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <ThemedView
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#141414',
                    }}
                  >
                    <ThemedView
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 2,
                        borderColor: isSelected ? '#fff' : '#6b6f75',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#141414',
                      }}
                    >
                      {isSelected && (
                        <ThemedView style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} />
                      )}
                    </ThemedView>
                    <ThemedText style={{ fontSize: 11, fontWeight: '800', color: '#9aa0a6' }}>
                      SIM {sim.slot}
                    </ThemedText>
                  </ThemedView>

                  <ThemedView
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      backgroundColor: '#141414',
                    }}
                  >
                    <MaterialIcons name="sim-card" size={34} color="#fff" />
                    <ThemedView style={{ alignItems: 'flex-end', backgroundColor: '#141414' }}>
                      <ThemedText style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>
                        {sim.carrier}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 10, fontWeight: '600', color: '#9aa0a6' }}>
                        {sim.number}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </Pressable>
              );
            })}
          </ThemedView>

          {enabled && (
            <ThemedView
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 18,
                backgroundColor: '#363a40',
                flexDirection: 'row',
              }}
            >
              <MaterialIcons name="verified-user" size={22} color="#fff" style={{ marginRight: 12, marginTop: 2 }} />
              <ThemedView style={{ flex: 1, backgroundColor: '#363a40' }}>
                <ThemedText style={{ fontSize: 15, fontWeight: '900', color: '#fff' }}>
                  Call handling enabled
                </ThemedText>
                <ThemedText style={{ fontSize: 13, fontWeight: '600', color: '#d0d3d7', marginTop: 6, lineHeight: 18 }}>
                  Unknown number calls on {active?.carrier} will now be forwarded to our service.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          <Pressable
            onPress={toggle}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            style={{
              marginTop: 18,
              height: 54,
              borderRadius: 16,
              backgroundColor: enabled ? '#141414' : '#fff',
              borderWidth: 2,
              borderColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            {loading ? (
              <ActivityIndicator color={enabled ? '#fff' : '#000'} />
            ) : (
              <>
                <MaterialIcons
                  name={enabled ? 'phone-disabled' : 'phone-in-talk'}
                  size={20}
                  color={enabled ? '#fff' : '#000'}
                  style={{ marginRight: 8 }}
                />
                <ThemedText style={{ fontSize: 16, fontWeight: '900', color: enabled ? '#fff' : '#000' }}>
                  {enabled ? 'Disable Call Handling' : 'Enable Call Handling'}
                </ThemedText>
              </>
            )}
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

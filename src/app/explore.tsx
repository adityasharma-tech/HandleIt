import { useEffect, useState } from 'react';
import { Pressable, ActivityIndicator, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { PermissionsAndroid } from 'react-native';
import { Telecom, Sim } from '../../modules/handleit-telecom';

const toast = (msg: string) => ToastAndroid.show(msg, ToastAndroid.LONG);


const ussdReason = (e: any) => {
  const msg = String(e?.message ?? e);
  if (msg.includes('-2')) return 'USSD service unavailable on this SIM';
  if (msg.includes('-1')) return 'Carrier rejected the code';
  return msg;
};

export default function CallHandlingScreen() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const TWILIO_NUMBER = '9389227172';

  const codesFor = (carrier: string) => {
    const c = carrier.toLowerCase();
    if (c.includes('jio')) {
      return { enable: `*401*${TWILIO_NUMBER}`, disable: '*406#' };
    }
    return { enable: `**67*+91${TWILIO_NUMBER}`, disable: '##67#' };
  };

  const waitForDefaultDialer = async () => {
    for (let i = 0; i < 40; i++) {
      if (Telecom.isDefaultDialer()) return true;
      await new Promise((r) => setTimeout(r, 500));
    }
    return false;
  };

  const [sims, setSims] = useState<Sim[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const r = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
      ]);
      if (Object.values(r).every((v) => v === 'granted')) {
        const list = Telecom.getSims();
        setSims(list);
        if (list[0]) setSelected(list[0].subscriptionId);
      }
    })();
  }, []);

  const active = sims.find((s) => s.subscriptionId === selected);
  const toggle = async () => {
    if (loading) return;
    if (!active) {
      toast('No SIM selected or SIM permissions not granted');
      return;
    }
    setLoading(true);
    let step = 'start';
    try {
      const codes = codesFor(active.carrier);
      if (!enabled) {
        step = 'role';
        if (!Telecom.isDefaultDialer()) {
          toast('Choose HandleIt as your default phone app');
          Telecom.requestDialerRole();
          if (!(await waitForDefaultDialer())) {
            toast('Default phone app not set. Enable it and try again');
            return;
          }
        }
        step = 'forwarding';
        Telecom.placeCall(codes.enable, active.subscriptionId);
        Telecom.setHandlingEnabled(true);
        setEnabled(true);
        toast(`Sent ${codes.enable}. Check the carrier message`);
      } else {
        step = 'forwarding';
        Telecom.placeCall(codes.disable, active.subscriptionId);
        Telecom.setHandlingEnabled(false);
        setEnabled(false);
        toast(`Sent ${codes.disable}. Check the carrier message`);
      }
    } catch (e: any) {
      toast(`Failed at ${step}: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };


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
              const isSelected = selected === sim.subscriptionId;
              return (
                <Pressable
                  key={sim.subscriptionId}
                  disabled={enabled || loading}
                  onPress={() => setSelected(sim.subscriptionId)}
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

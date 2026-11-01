import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { FlatList, Linking, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DialPad from '@/components/dial-pad';

const calls = [
  { id: '1', name: 'Mom', number: '+91 98765 43210', type: 'incoming', date: 'Today, 8:42 PM' },
  { id: '2', name: 'Rohan Sharma', number: '+91 99110 22334', type: 'missed', date: 'Today, 6:10 PM' },
  { id: '3', name: '', number: '+91 120 4567890', type: 'outgoing', date: 'Yesterday, 4:25 PM' },
  { id: '4', name: 'Priya', number: '+91 88001 55667', type: 'outgoing', date: 'Oct 30, 11:02 AM' },
];

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: Spacing.four,
          alignItems: 'center',
          gap: Spacing.three,
          maxWidth: MaxContentWidth,
          backgroundColor: '#000',
        }}
      >
        <ThemedView
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: '#000',
            paddingTop: 8,
            paddingBottom: 4,
          }}
        >
          <ThemedText style={{ fontWeight: '900', fontSize: 32, color: '#fff', letterSpacing: -1 }}>
            HandleIt
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ width: '100%', height: 2, backgroundColor: '#fff' }} />

        <FlatList
          style={{ width: '100%' }}
          data={calls}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <ThemedView style={{ height: 1, backgroundColor: '#fff', opacity: 0.2, marginLeft: 74 }} />
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => Linking.openURL(`tel:${item.number.replace(/\s/g, '')}`)}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: '#000',
              }}
            >
              <ThemedView
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: item.name ? '#fff' : '#000',
                  borderWidth: 2,
                  borderColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.name ? (
                  <ThemedText style={{ color: '#000', fontSize: 22, fontWeight: '900' }}>
                    {item.name[0].toUpperCase()}
                  </ThemedText>
                ) : (
                  <Ionicons name="person" size={24} color="#fff" />
                )}
              </ThemedView>

              <ThemedView style={{ flex: 1, marginLeft: 14, marginRight: 8, backgroundColor: '#000' }}>
                <ThemedText
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    fontWeight: '800',
                    color: '#fff',
                    textDecorationLine: item.type === 'missed' ? 'underline' : 'none',
                  }}
                >
                  {item.name || item.number}
                </ThemedText>
                {item.name ? (
                  <ThemedText numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', color: '#fff', marginTop: 2 }}>
                    {item.number}
                  </ThemedText>
                ) : null}
                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, backgroundColor: '#000' }}>
                  {item.type === 'incoming' && <MaterialIcons name="call-received" size={16} color="#fff" />}
                  {item.type === 'outgoing' && <MaterialIcons name="call-made" size={16} color="#fff" />}
                  {item.type === 'missed' && <MaterialIcons name="call-missed" size={16} color="#fff" />}
                  <ThemedText
                    numberOfLines={1}
                    style={{ fontSize: 12, fontWeight: '700', color: '#fff', opacity: 0.7, marginLeft: 4, flexShrink: 1 }}
                  >
                    {item.date}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <Pressable
                hitSlop={12}
                onPress={() => Linking.openURL(`tel:${item.number.replace(/\s/g, '')}`)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="call" size={20} color="#fff" />
              </Pressable>
            </Pressable>
          )}
        />
        <DialPad/>
      </SafeAreaView>
    </ThemedView>
  );
}

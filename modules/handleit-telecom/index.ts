import { requireNativeModule } from 'expo';

export type Sim = { subscriptionId: number; slot: number; carrier: string; number: string };
export type CallEvent = { number: string; state: number };

const Native = requireNativeModule('HandleItTelecom');

export const Telecom = {
  isDefaultDialer: (): boolean => Native.isDefaultDialer(),
  requestDialerRole: (): boolean => Native.requestDialerRole(),
  getSims: (): Sim[] => Native.getSims(),
  setHandlingEnabled: (v: boolean) => Native.setHandlingEnabled(v),
  placeCall: (number: string, subscriptionId: number) => Native.placeCall(number, subscriptionId),
  answer: () => Native.answer(),
  hangup: () => Native.hangup(),
  sendUssd: (code: string, subscriptionId: number): Promise<string> => Native.sendUssd(code, subscriptionId),
  onCallChanged: (cb: (e: CallEvent) => void) => Native.addListener('onCallChanged', cb),
};

import { NativeEventEmitter, NativeModule } from 'react-native';

// Create a dummy native module since we're only using it for JS-to-JS events
const dummyNativeModule: NativeModule = {
  addListener: () => {},
  removeListeners: () => {},
};

const eventEmitter = new NativeEventEmitter(dummyNativeModule);

export const SESSION_UPDATED = 'SESSION_UPDATED';

export const emitSessionUpdated = () => {
  eventEmitter.emit(SESSION_UPDATED);
};

export const onSessionUpdated = (listener: () => void) => {
  const subscription = eventEmitter.addListener(SESSION_UPDATED, listener);
  return () => {
    subscription.remove();
  };
}; 
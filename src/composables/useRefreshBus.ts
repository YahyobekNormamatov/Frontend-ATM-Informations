import { onBeforeUnmount } from 'vue';


const target = new EventTarget();
const EVENT = 'turon:refresh';

export function triggerRefresh(): void {
  target.dispatchEvent(new Event(EVENT));
}


export function onRefresh(handler: () => void | Promise<void>): void {
  const listener = () => {
    void handler();
  };
  target.addEventListener(EVENT, listener);
  onBeforeUnmount(() => target.removeEventListener(EVENT, listener));
}

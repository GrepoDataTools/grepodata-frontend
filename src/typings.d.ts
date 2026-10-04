/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module 'just-detect-adblock' {
  export function detectAnyAdblocker(): Promise<boolean>;
  export function detectDomAdblocker(): Promise<boolean>;
  export function detectBraveShields(): Promise<boolean>;
  export function detectOperaAdblocker(): Promise<boolean>;
  export function isDetected(): boolean;
}

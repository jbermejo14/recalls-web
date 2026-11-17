'use client';

interface ConsentGoogleFc {
  callbackQueue?: Array<() => void>;
  showRevocationMessage?: () => void;
}

declare global {
  interface Window {
    googlefc?: ConsentGoogleFc;
  }
}

/** Reabre el mensaje de consentimiento de Google para retirar o cambiar la elección. */
function consentShowRevocation(): void {
  window.googlefc ??= {};
  window.googlefc.callbackQueue ??= [];
  window.googlefc.callbackQueue.push(() => window.googlefc?.showRevocationMessage?.());
}

/** Botón del pie que reabre el mensaje de consentimiento. `label` va en el idioma de la compilación. */
export default function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" className="footer-link-button" onClick={consentShowRevocation}>
      {label}
    </button>
  );
}

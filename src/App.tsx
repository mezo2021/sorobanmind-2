// src/App.tsx

import { useEffect, useState } from "react";
import { useT } from "./i18n/useTranslation";
import { SorobanEngineDebug } from "./components/SorobanEngineDebug";

export default function App() {
  const [ready, setReady] = useState(false);
  const { t, dir, lang } = useT();

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  if (!ready) {
    return (
      <div
        dir={dir}
        className="flex min-h-screen items-center justify-center"
      >
        <p className="text-2xl text-amber-400">{t("app.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" dir={dir}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-black text-amber-400">
          🧮 {t("app.title")}
        </h1>
        <p className="mt-2 text-sm text-purple-200">
          {t("app.phase", { n: 1 })}
        </p>
      </header>

      <SorobanEngineDebug />
    </div>
  );
}
// src/components/SorobanEngineDebug.tsx

import { useState } from "react";
import { useT } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n";
import type { RodState } from "../curriculum/types";
import {
  SorobanEngine,
  classifyAdd,
  classifySub,
  describeStep,
} from "../engine/sorobanEngine";
import {
  emptySoroban,
  rodValue,
  sorobanValue,
  writeNumber,
} from "../engine/sorobanMoves";

export function SorobanEngineDebug() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(6);
  const [op, setOp] = useState<"add" | "sub">("add");
  const { t, lang } = useT();

  /**
   * دالة ترجمة متوافقة مع describeStep.
   */
  const tr = (key: string, params: Record<string, string | number>) =>
    t(key as TranslationKey, params);

  const result = (() => {
    try {
      const engine = SorobanEngine.create(5);
      engine.load(a);
      if (op === "add") engine.add(b);
      else engine.subtract(b);

      return {
        value: engine.value(),
        steps: engine.getSteps(),
        rules:
          op === "add" ? classifyAdd(a, b) : classifySub(a, b),
        state: engine.getState(),
        error: null as string | null,
      };
    } catch (error) {
      return {
        value: 0,
        steps: [],
        rules: [],
        state: emptySoroban(5),
        error:
          error instanceof Error ? error.message : "unknown error",
      };
    }
  })();

  const renderRod = (rod: RodState, index: number) => {
    const value = rodValue(rod);
    return (
      <div
        key={index}
        className="flex flex-col items-center gap-1 rounded-lg bg-purple-900/40 p-2"
      >
        <div
          className={`h-3 w-8 rounded-full ${
            rod.upper === 1 ? "bg-amber-400" : "bg-purple-700/30"
          }`}
        />
        <div className="my-1 h-px w-10 bg-amber-500/40" />
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-3 w-8 rounded-full ${
              i < rod.lower ? "bg-amber-400" : "bg-purple-700/30"
            }`}
          />
        ))}
        <span className="mt-1 text-xs text-amber-300">{value}</span>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-amber-500/30 bg-purple-950/40 p-4">
        <h2 className="mb-4 text-center text-lg font-bold text-amber-400">
          🧪 {t("debug.title")}
        </h2>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-20 rounded-lg bg-purple-900/60 px-3 py-2 text-center text-white"
            min={0}
            max={99}
          />
          <select
            value={op}
            onChange={(e) => setOp(e.target.value as "add" | "sub")}
            className="rounded-lg bg-purple-900/60 px-3 py-2 text-white"
          >
            <option value="add">+</option>
            <option value="sub">−</option>
          </select>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-20 rounded-lg bg-purple-900/60 px-3 py-2 text-center text-white"
            min={0}
            max={99}
          />
          <span className="text-2xl font-bold text-amber-400">
            = {result.value}
          </span>
        </div>

        {result.error ? (
          <p className="rounded-lg bg-red-900/50 p-3 text-center text-red-200">
            ⚠️ {t("debug.error")}: {result.error}
          </p>
        ) : (
          <>
            <div className="mb-4 flex justify-center gap-2">
              {result.state.map(renderRod)}
            </div>

            <div className="mb-3">
              <h3 className="mb-2 text-sm font-bold text-amber-300">
                {t("debug.rules")}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.rules.map((rule) => (
                  <span
                    key={rule}
                    className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-200"
                  >
                    {t(`movement.${rule}` as TranslationKey)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-amber-300">
                {t("debug.steps", { count: result.steps.length })}:
              </h3>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg bg-purple-950/60 p-2">
                {result.steps.map((step, i) => (
                  <p key={i} className="text-xs text-purple-100">
                    {i + 1}. {describeStep(step, tr)}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-purple-500/30 bg-purple-950/40 p-4">
        <h3 className="mb-3 text-sm font-bold text-amber-300">
          🔬 {t("debug.quickTests")}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <TestRow
            label="writeNumber(3, 7)"
            value={JSON.stringify(writeNumber(3, 7))}
          />
          <TestRow
            label="sorobanValue(742)"
            value={sorobanValue(writeNumber(3, 742))}
          />
          <TestRow
            label="classifyAdd(4,2)"
            value={classifyAdd(4, 2).join(", ")}
          />
          <TestRow
            label="classifyAdd(7,6)"
            value={classifyAdd(7, 6).join(", ")}
          />
          <TestRow
            label="classifySub(9,3)"
            value={classifySub(9, 3).join(", ")}
          />
          <TestRow
            label="classifySub(32,17)"
            value={classifySub(32, 17).join(", ")}
          />
        </div>
      </div>

      <p className="text-center text-xs text-purple-400">
        {lang === "ar"
          ? "اللغة الحالية: العربية"
          : "Current language: English"}
      </p>
    </div>
  );
}

function TestRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg bg-purple-900/40 p-2">
      <p className="text-purple-300">{label}</p>
      <p className="font-mono text-amber-200">{String(value)}</p>
    </div>
  );
}
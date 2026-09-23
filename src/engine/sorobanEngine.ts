// src/engine/sorobanEngine.ts

import type {
  MovementType,
  SorobanState,
  SolveStep,
} from "../curriculum/types";
import {
  addDigitToRod,
  emptySoroban,
  rodValue,
  sorobanValue,
  subDigitFromRod,
  writeNumber,
} from "./sorobanMoves";

/**
 * محرك السوروبان — يمثل الحساب الفعلي للخرزات.
 * يستخدم لتوليد مسائل صحيحة تربوياً.
 */
export class SorobanEngine {
  private state: SorobanState;
  private readonly columns: number;
  private readonly steps: SolveStep[] = [];

  private constructor(columns: number) {
    this.columns = columns;
    this.state = emptySoroban(columns);
  }

  /**
   * إنشاء محرك جديد بعدد أعمدة محدد.
   */
  public static create(columns: number = 5): SorobanEngine {
    return new SorobanEngine(columns);
  }

  /**
   * تحميل قيمة ابتدائية.
   */
  public load(value: number): this {
    this.state = writeNumber(this.columns, value);
    return this;
  }

  /**
   * إضافة قيمة إلى الحالة الحالية.
   */
  public add(value: number): this {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError("add expects non-negative integer");
    }

    const digits = value
      .toString()
      .padStart(this.columns, "0")
      .split("")
      .map(Number);

    let carry = 0;

    for (let i = this.columns - 1; i >= 0; i -= 1) {
      const digit = digits[i] + carry;
      carry = 0;

      const result = addDigitToRod(this.state[i], digit);
      const before = this.state[i];

      this.state[i] = result.newRod;

      result.rules.forEach((rule) => {
        this.steps.push({
          rod: i,
          action: this.actionFromRule(rule, digit),
          count: digit,
          rule,
          descriptionKey: "rod.step",
          descriptionParams: {
            rod: i + 1,
            rule: `movement.${rule}`,
            action: digit > 0 ? `+${digit}` : `${digit}`,
            before: rodValue(before),
          },
        });
      });

      if (result.carry) {
        carry = 1;
      }
    }

    return this;
  }

  /**
   * طرح قيمة من الحالة الحالية.
   */
  public subtract(value: number): this {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError("subtract expects non-negative integer");
    }

    const digits = value
      .toString()
      .padStart(this.columns, "0")
      .split("")
      .map(Number);

    let borrow = 0;

    for (let i = this.columns - 1; i >= 0; i -= 1) {
      const digit = digits[i] + borrow;
      borrow = 0;

      const result = subDigitFromRod(this.state[i], digit);
      const before = this.state[i];

      this.state[i] = result.newRod;

      result.rules.forEach((rule) => {
        this.steps.push({
          rod: i,
          action: this.actionFromRule(rule, -digit),
          count: digit,
          rule,
          descriptionKey: "rod.step",
          descriptionParams: {
            rod: i + 1,
            rule: `movement.${rule}`,
            action: `-${digit}`,
            before: rodValue(before),
          },
        });
      });

      if (result.borrow) {
        borrow = 1;
      }
    }

    return this;
  }

  /**
   * الحصول على القيمة الحالية.
   */
  public value(): number {
    return sorobanValue(this.state);
  }

  /**
   * الحصول على الحالة الحالية.
   */
  public getState(): SorobanState {
    return this.state.map((r) => ({ ...r }));
  }

  /**
   * الحصول على كل الخطوات المسجلة.
   */
  public getSteps(): SolveStep[] {
    return this.steps.map((s) => ({ ...s }));
  }

  /**
   * تصفير المحرك.
   */
  public reset(): this {
    this.state = emptySoroban(this.columns);
    this.steps.length = 0;
    return this;
  }

  /**
   * استنساخ المحرك.
   */
  public clone(): SorobanEngine {
    const copy = new SorobanEngine(this.columns);
    copy.state = this.state.map((r) => ({ ...r }));
    copy.steps.push(...this.steps.map((s) => ({ ...s })));
    return copy;
  }

  /**
   * تحويل نوع الحركة إلى action مناسب.
   */
  private actionFromRule(
    rule: MovementType,
    delta: number,
  ): SolveStep["action"] {
    if (rule === "carry") return "carry";
    if (rule === "borrow") return "borrow";
    if (delta > 0) return "add-lower";
    if (delta < 0) return "sub-lower";
    return "read";
  }
}

/**
 * دالة مساعدة: تصنيف عملية جمع حسب قواعد السوروبان.
 */
export function classifyAdd(
  a: number,
  b: number,
  columns: number = 5,
): MovementType[] {
  const engine = SorobanEngine.create(columns);
  engine.load(a);
  engine.add(b);
  const steps = engine.getSteps();
  return Array.from(new Set(steps.map((s) => s.rule)));
}

/**
 * دالة مساعدة: تصنيف عملية طرح حسب قواعد السوروبان.
 */
export function classifySub(
  a: number,
  b: number,
  columns: number = 5,
): MovementType[] {
  const engine = SorobanEngine.create(columns);
  engine.load(a);
  engine.subtract(b);
  const steps = engine.getSteps();
  return Array.from(new Set(steps.map((s) => s.rule)));
}

/**
 * وصف خطوة واحدة نصياً باستخدام دالة ترجمة.
 */
export function describeStep(
  step: SolveStep,
  translateFn: (
    key: string,
    params: Record<string, string | number>,
  ) => string,
): string {
  const ruleText = translateFn(
    step.descriptionParams.rule as string,
    {},
  );

  return translateFn(step.descriptionKey, {
    rod: step.descriptionParams.rod,
    rule: ruleText,
    action: step.descriptionParams.action,
    before: step.descriptionParams.before,
  });
}
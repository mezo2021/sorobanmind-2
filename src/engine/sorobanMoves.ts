// src/engine/sorobanMoves.ts

import type {
  MovementType,
  RodState,
  SorobanState,
} from "../curriculum/types";

/**
 * إنشاء عمود فارغ (القيمة = 0).
 */
export function emptyRod(): RodState {
  return { upper: 0, lower: 0 };
}

/**
 * إنشاء سوروبان فارغ بعدد أعمدة محدد.
 */
export function emptySoroban(columns: number): SorobanState {
  if (!Number.isInteger(columns) || columns < 1) {
    throw new RangeError(
      `columns must be a positive integer, received: ${columns}`,
    );
  }
  return Array.from({ length: columns }, emptyRod);
}

/**
 * حساب قيمة عمود واحد.
 * العلو = 5، كل خرزة سفلية = 1.
 */
export function rodValue(rod: RodState): number {
  return rod.upper * 5 + rod.lower;
}

/**
 * حساب القيمة الكلية للسوروبان.
 * أقصى يمين = خانة الآحاد (نقطة الآحاد).
 * كل عمود نحو اليسار يمثّل منزلة أكبر (×10).
 */
export function sorobanValue(state: SorobanState): number {
  let total = 0;
  for (let i = 0; i < state.length; i += 1) {
    total = total * 10 + rodValue(state[i]);
  }
  return total;
}

/**
 * كتابة رقم على السوروبان باستخدام طريقة السوروبان الياباني.
 */
export function writeNumber(
  columns: number,
  value: number,
): SorobanState {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(
      `value must be a non-negative integer, received: ${value}`,
    );
  }

  const maxValue = 10 ** columns - 1;
  if (value > maxValue) {
    throw new RangeError(
      `value ${value} exceeds capacity of ${columns} columns (max ${maxValue})`,
    );
  }

  const state = emptySoroban(columns);
  const digits = value
    .toString()
    .padStart(columns, "0")
    .split("")
    .map(Number);

  for (let i = 0; i < columns; i += 1) {
    const digit = digits[i];
    if (digit >= 5) {
      state[i] = { upper: 1, lower: (digit - 5) as 0 | 1 | 2 | 3 | 4 };
    } else {
      state[i] = { upper: 0, lower: digit as 0 | 1 | 2 | 3 | 4 };
    }
  }

  return state;
}

/**
 * قراءة العمود من الرقم الفردي.
 */
function digitToRod(digit: number): RodState {
  if (digit < 0 || digit > 9 || !Number.isInteger(digit)) {
    throw new RangeError(`digit must be 0-9, received: ${digit}`);
  }
  if (digit >= 5) {
    return { upper: 1, lower: (digit - 5) as 0 | 1 | 2 | 3 | 4 };
  }
  return { upper: 0, lower: digit as 0 | 1 | 2 | 3 | 4 };
}

/**
 * إضافة رقم مفرد إلى عمود وفق قواعد السوروبان.
 */
export interface AddResult {
  newRod: RodState;
  rules: MovementType[];
  carry: boolean;
}

export function addDigitToRod(
  rod: RodState,
  digit: number,
): AddResult {
  const current = rodValue(rod);
  const target = current + digit;

  if (target < 10) {
    return {
      newRod: digitToRod(target),
      rules: classifyMovement(current, digit),
      carry: false,
    };
  }

  return {
    newRod: digitToRod(target - 10),
    rules: ["carry", ...classifyMovement(current, digit)],
    carry: true,
  };
}

/**
 * طرح رقم مفرد من عمود وفق قواعد السوروبان.
 */
export interface SubResult {
  newRod: RodState;
  rules: MovementType[];
  borrow: boolean;
}

export function subDigitFromRod(
  rod: RodState,
  digit: number,
): SubResult {
  const current = rodValue(rod);

  if (current >= digit) {
    return {
      newRod: digitToRod(current - digit),
      rules: classifyMovement(current, -digit),
      borrow: false,
    };
  }

  return {
    newRod: digitToRod(current + 10 - digit),
    rules: ["borrow", ...classifyMovement(current, -digit)],
    borrow: true,
  };
}

/**
 * تصنيف الحركة الحسابية وفق قواعد السوروبان الياباني.
 */
export function classifyMovement(
  current: number,
  delta: number,
): MovementType[] {
  const rules: MovementType[] = [];

  if (delta === 0) return ["direct"];

  if (delta > 0) {
    if (current < 5 && current + delta <= 4) {
      rules.push("direct");
    } else if (current >= 5 && delta <= 4 - (current - 5)) {
      rules.push("direct");
    } else if (
      current < 5 &&
      current + delta >= 5 &&
      current + delta <= 9
    ) {
      rules.push("five-friend-add");
    } else {
      rules.push("ten-friend-add");
    }
  } else {
    const abs = Math.abs(delta);
    if (current - abs >= 0) {
      const currentLower = current % 5;
      const currentUpper = current >= 5 ? 1 : 0;

      if (abs <= currentLower) {
        rules.push("direct");
      } else if (currentUpper === 1 && abs <= current) {
        rules.push("five-friend-sub");
      } else {
        rules.push("ten-friend-sub");
      }
    } else {
      rules.push("ten-friend-sub");
    }
  }

  return rules;
}

/**
 * تطبيق خطوة إضافة على حالة سوروبان كاملة.
 */
export function applyAdd(
  state: SorobanState,
  value: number,
): {
  newState: SorobanState;
  steps: Array<{ rod: number; rule: MovementType }>;
} {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`value must be a non-negative integer`);
  }

  const columns = state.length;
  const newState: SorobanState = state.map((r) => ({ ...r }));
  const steps: Array<{ rod: number; rule: MovementType }> = [];

  const digits = value
    .toString()
    .padStart(columns, "0")
    .split("")
    .map(Number);

  let carry = 0;

  for (let i = columns - 1; i >= 0; i -= 1) {
    const digit = digits[i] + carry;
    carry = 0;

    const result = addDigitToRod(newState[i], digit);
    newState[i] = result.newRod;

    result.rules.forEach((rule) => {
      steps.push({ rod: i, rule });
    });

    if (result.carry) {
      carry = 1;
    }
  }

  return { newState, steps };
}
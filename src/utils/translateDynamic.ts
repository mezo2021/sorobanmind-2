type DynamicText = Record<string, any>;

export function translateDynamic(
  item: DynamicText | null | undefined,
  lang: string,
  field: string
): string {
  if (!item) return "";

  const ar = item[`${field}Ar`] ?? item[`${field}AR`];
  const en = item[`${field}En`] ?? item[`${field}EN`];

  const value = lang === "en"
    ? en ?? ar
    : ar ?? en;

  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}
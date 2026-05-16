function tryParseModelJSON(content) {
  if (!content) return { ok: false };
  const raw = content.trim();
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {}
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    try {
      return { ok: true, value: JSON.parse(match[1]) };
    } catch {}
  }
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first !== -1 && last !== -1) {
    try {
      return { ok: true, value: JSON.parse(raw.slice(first, last + 1)) };
    } catch {}
  }
  return { ok: false, error: "Invalid JSON" };
}

export default tryParseModelJSON
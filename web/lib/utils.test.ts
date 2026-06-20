import { describe, it, expect } from "vitest";
import { formatDate, getInitials, getAvatarColor } from "./utils";

describe("getInitials", () => {
  it("returns first letters of each word, max 2", () => {
    expect(getInitials("Google Brasil")).toBe("GB");
  });

  it("returns single letter for one-word company", () => {
    expect(getInitials("Google")).toBe("G");
  });

  it("uses first 2 words only for 3+ word companies", () => {
    expect(getInitials("Banco do Brasil")).toBe("BD");
  });
});

describe("getAvatarColor", () => {
  it("returns an object with bg and text classes", () => {
    const color = getAvatarColor("Google");
    expect(color.bg).toMatch(/^bg-/);
    expect(color.text).toMatch(/^text-/);
  });

  it("is deterministic — same company always gets same color", () => {
    expect(getAvatarColor("Amazon")).toEqual(getAvatarColor("Amazon"));
  });

  it("different companies can get different colors", () => {
    const colors = new Set(
      ["Amazon", "Google", "Microsoft", "Apple", "Meta", "Netflix", "Spotify"]
        .map(getAvatarColor)
        .map((c) => c.bg)
    );
    expect(colors.size).toBeGreaterThan(1);
  });
});

describe("formatDate", () => {
  it("returns a non-empty string for a valid ISO date", () => {
    const result = formatDate("2024-01-15T10:00:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("2024");
  });
});

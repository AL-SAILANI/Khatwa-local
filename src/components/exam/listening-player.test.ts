import { describe, expect, it } from "vitest";
import { parseTranscript } from "./listening-player";

describe("parseTranscript", () => {
  it("splits speaker labels from spoken text", () => {
    expect(parseTranscript("Agent: Good morning.\nCaller: Hello, I'd like a table.")).toEqual([
      { speaker: "Agent", text: "Good morning." },
      { speaker: "Caller", text: "Hello, I'd like a table." },
    ]);
  });

  it("keeps unlabelled lines as a single anonymous speaker", () => {
    expect(parseTranscript("Welcome everyone.\n\nPlease sit down.")).toEqual([
      { speaker: "", text: "Welcome everyone." },
      { speaker: "", text: "Please sit down." },
    ]);
  });
});

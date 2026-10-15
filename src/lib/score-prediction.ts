import { SKILLS, type SkillSection } from "@/data/skills";
import type { MasteryMap } from "@/lib/skill-mastery";

/** Official STEP section weights. */
const SECTION_WEIGHT: Partial<Record<SkillSection, number>> = {
  reading: 0.4,
  grammar: 0.3,
  listening: 0.2,
  writingAnalysis: 0.1,
};

const PRIOR = 0.5;
/** Below this much weighted evidence the estimate is shown as a rough guess. */
const LOW_EVIDENCE = 30;

export interface ScorePrediction {
  /** 0 to 100, uncalibrated: roughly the share of exam points the learner would earn. */
  score: number;
  confidence: "low" | "ok";
  bySection: Partial<Record<SkillSection, number>>;
}

/**
 * Rough predicted score: for each exam section, the exam-frequency-weighted
 * mean mastery of its skills (unknown skills count as 0.5), combined with the
 * official section weights. Strategy skills have no questions and are ignored.
 * This is a heuristic, not a calibrated model; it should be validated against
 * real exam results before it is presented as a prediction.
 */
export function predictScore(mastery: MasteryMap): ScorePrediction {
  const bySection: Partial<Record<SkillSection, number>> = {};
  let total = 0;
  let evidence = 0;

  for (const [section, weight] of Object.entries(SECTION_WEIGHT) as [
    SkillSection,
    number,
  ][]) {
    let weightedMastery = 0;
    let weights = 0;
    for (const skill of SKILLS) {
      if (skill.section !== section || skill.domain === "strategy") continue;
      const entry = mastery.get(skill.id);
      weightedMastery += skill.frequency * (entry?.mastery ?? PRIOR);
      weights += skill.frequency;
      evidence += entry?.evidence ?? 0;
    }
    const sectionMastery = weights === 0 ? PRIOR : weightedMastery / weights;
    bySection[section] = Math.round(sectionMastery * 100);
    total += weight * sectionMastery;
  }

  return {
    score: Math.round(total * 100),
    confidence: evidence < LOW_EVIDENCE ? "low" : "ok",
    bySection,
  };
}

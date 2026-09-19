"use client";

import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getAllVocabWords, getReviewStatesForUser } from "@/lib/firestore/vocabulary";
import { getActiveStudyPlan } from "@/lib/firestore/study-plans";
import {
  buildVocabCurriculum,
  DEFAULT_PLAN_DAYS,
  planDayIndex,
  wordsPerDay,
  type VocabCurriculum,
} from "@/lib/vocab-curriculum";
import type { VocabWord } from "@/types/vocabulary";

export interface SessionCard {
  word: VocabWord;
  /** True when this word has never been reviewed before (brand new). */
  isNew: boolean;
}

function shuffle<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = tmp;
  }
  return arr;
}

/** Interleave two lists (e.g. new + due words) so the session mixes familiar
 * and novel items — interleaved practice beats blocked practice for retention
 * (Rohrer & Taylor, 2007; Dunlosky et al., 2013). */
function interleave(a: VocabWord[], b: VocabWord[]): VocabWord[] {
  const result: VocabWord[] = [];
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    const fromA = a[i];
    const fromB = b[i];
    if (fromA !== undefined) result.push(fromA);
    if (fromB !== undefined) result.push(fromB);
  }
  return result;
}

export interface VocabQueueState {
  isLoading: boolean;
  cards: SessionCard[];
  newCount: number;
  dueCount: number;
  curriculum: VocabCurriculum | null;
  /** 0-based index of the current plan day. */
  dayIndex: number;
  totalDays: number;
  perDay: number;
}

/**
 * Plan-driven daily review queue. The number of brand-new words each day is
 * derived from the student's chosen study-plan duration, and the order the
 * new words appear in follows the vocabulary curriculum — progressive
 * difficulty, sections interleaved, anchored to the lesson the student would
 * take that same day. Overdue words (already inside the retention curve) are
 * given priority so a gap doesn't melt the student's SM-2 progress.
 */
export function useVocabQueue(): VocabQueueState {
  const { user } = useUserProfile();
  const [state, setState] = useState<VocabQueueState>({
    isLoading: true,
    cards: [],
    newCount: 0,
    dueCount: 0,
    curriculum: null,
    dayIndex: 0,
    totalDays: DEFAULT_PLAN_DAYS,
    perDay: 10,
  });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    Promise.all([getAllVocabWords(), getReviewStatesForUser(user.uid), getActiveStudyPlan(user.uid)]).then(
      ([allWords, states, plan]) => {
        if (cancelled) return;

        const stateByWordId = new Map(states.map((s) => [s.wordId, s]));
        const curriculum = buildVocabCurriculum(allWords);
        const totalDays = plan?.durationDays ?? DEFAULT_PLAN_DAYS;
        const perDay = wordsPerDay(curriculum.totalWords, totalDays);
        const todayIndex = planDayIndex(
          plan?.startedAt ?? user.metadata?.creationTime ?? new Date().toISOString(),
          Date.now(),
          totalDays,
        );

        // Words inside the retention curve that are due right now — priority.
        const due = allWords.filter((w) => {
          const s = stateByWordId.get(w.id);
          return s && new Date(s.dueAt).getTime() <= Date.now();
        });
        const dueTake = shuffle(due).slice(0, perDay);

        // Brand-new words up to the current plan day, earliest first (catch-up
        // misses), capped at the daily quota.
        const horizon = curriculum.entries.slice(0, (todayIndex + 1) * perDay);
        const unseen = horizon.filter((e) => !stateByWordId.has(e.word.id));
        const newTake = unseen.slice(0, perDay).map((e) => e.word);

        const session = interleave(dueTake, newTake);

        setState({
          isLoading: false,
          cards: session.map((word) => ({ word, isNew: !stateByWordId.has(word.id) })),
          newCount: newTake.length,
          dueCount: dueTake.length,
          curriculum,
          dayIndex: todayIndex,
          totalDays,
          perDay,
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [user]);

  return state;
}
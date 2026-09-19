export type AvatarCategory = "female" | "male";

export interface AvatarOption {
  id: string;
  name: string;
  src: string;
  category: AvatarCategory;
}

const FEMALE: Array<[string, string]> = [
  ["avatar", "Avatar"],
  ["girl", "Girl"],
  ["girl-2", "Girl 2"],
  ["woman-4", "Woman 4"],
  ["woman-5", "Woman 5"],
  ["woman-6", "Woman 6"],
  ["woman-7", "Woman 7"],
  ["woman-8", "Woman 8"],
  ["woman-10", "Woman 10"],
  ["woman-11", "Woman 11"],
];

const MALE: Array<[string, string]> = [
  ["boy-3", "Boy 3"],
  ["boy-4", "Boy 4"],
  ["gamer", "Gamer"],
  ["hacker", "Hacker"],
  ["man-2", "Man 2"],
  ["man-3", "Man 3"],
  ["man-4", "Man 4"],
  ["man-5", "Man 5"],
  ["man-6", "Man 6"],
  ["people", "People"],
  ["worker", "Worker"],
];

function build(category: AvatarCategory, files: Array<[string, string]>): AvatarOption[] {
  return files.map(([id, name]) => ({
    id,
    name,
    src: `/avatars/${category}/${id}.png`,
    category,
  }));
}

export const FEMALE_AVATARS: readonly AvatarOption[] = build("female", FEMALE);
export const MALE_AVATARS: readonly AvatarOption[] = build("male", MALE);

export const AVATARS: readonly AvatarOption[] = [...FEMALE_AVATARS, ...MALE_AVATARS];

export const DEFAULT_AVATAR = "avatar";

export const AVATARS_BY_ID: Readonly<Record<string, AvatarOption>> = Object.fromEntries(
  AVATARS.map((option) => [option.id, option]),
);

export function avatarIdFromStored(value: string | null | undefined): string | null {
  if (!value) return null;
  return value in AVATARS_BY_ID ? value : null;
}
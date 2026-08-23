export type OnboardingProfile = {
  displayName: string | null | undefined;
  profession: string | null | undefined;
  aiLevel: string | null | undefined;
  aiTool: string | null | undefined;
  contactMethod: string | null | undefined;
};

export type OnboardingViewer = {
  isAdmin: boolean;
  isPending?: boolean;
  completed: boolean;
};

export function shouldRequireOnboarding({ isAdmin, completed }: OnboardingViewer): boolean {
  return !isAdmin && completed !== true;
}

export function isProfileComplete(p: OnboardingProfile): boolean {
  return !!(p.displayName && p.profession && p.aiLevel && p.aiTool && p.contactMethod);
}

export function resolveFieldValue(selectValue: string, custom: string): string {
  return selectValue !== "otro" ? selectValue : custom.trim();
}

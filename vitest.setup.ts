import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "ar",
}));

// Mock next-intl/server
vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/ar/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock i18n/navigation
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/ar/dashboard",
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => {
    const a = document.createElement("a");
    a.href = href;
    a.appendChild(document.createTextNode(String(children)));
    return a;
  },
}));

// Mock firebase
vi.mock("@/lib/firebase/client", () => ({
  db: {},
  auth: {},
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const icons = [
    "AlertTriangle",
    "RefreshCw",
    "Home",
    "Flag",
    "ChevronRight",
    "ChevronLeft",
    "Sparkles",
    "ArrowLeft",
    "Clock",
    "ListChecks",
    "TrendingUp",
    "GraduationCap",
    "CalendarRange",
    "Flame",
    "Volume2",
    "Users",
    "BookOpenCheck",
    "Heart",
    "BadgeCheck",
    "LineChart",
    "Feather",
    "ClipboardCheck",
    "Route",
    "FileText",
    "BarChart3",
    "BookMarked",
    "GoogleIcon",
    "KeyRound",
    "Globe",
    "Headphones",
    "Moon",
    "Sun",
    "Check",
  ];
  const mockIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (className) svg.className = className;
    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined) svg.setAttribute(key, String(value));
    });
    svg.setAttribute("data-testid", "icon");
    return svg;
  };
  return icons.reduce((acc, name) => {
    acc[name] = mockIcon;
    return acc;
  }, {} as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>);
});

// Mock motion
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
      const div = document.createElement("div");
      Object.entries(props).forEach(([key, value]) => {
        if (value !== undefined) div.setAttribute(key, String(value));
      });
      div.appendChild(document.createTextNode(String(children)));
      return div;
    },
  },
  useMotionValue: vi.fn(),
  useSpring: vi.fn(),
}));

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
    watch: vi.fn(),
    setValue: vi.fn(),
    reset: vi.fn(),
  }),
  zodResolver: vi.fn(),
}));

// Mock hooks
vi.mock("@/hooks/use-auth-user", () => ({
  useAuthUser: () => ({ user: null, isLoading: false }),
}));

vi.mock("@/hooks/use-user-profile", () => ({
  useUserProfile: () => ({ user: null, profile: null, isLoading: false }),
}));

vi.mock("@/hooks/use-exam-timer", () => ({
  useExamTimer: () => ({
    label: "10:00",
    isRunningLow: false,
  }),
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});
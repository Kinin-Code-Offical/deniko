import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import type { Dictionary } from "@/types/i18n";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock dictionary
const mockDictionary = {
  common: {
    app_name: "Deniko",
  },
  home: {
    login: "Login",
    get_started: "Get Started",
    home: "Home",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  dashboard: {
    nav: {
      dashboard: "Dashboard",
    },
  },
  legal: {
    nav: {
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
  },
  navbar: {
    menu_open: "Open menu",
    menu: "Menu",
    theme: "Theme",
    language: "Language",
    legal: "Legal",
    terms: "Terms",
    privacy: "Privacy",
    mobile_menu_title: "Mobile Menu",
    mobile_menu_desc: "Mobile Menu Desc",
    toggle_theme: "Toggle Theme",
  },
} as unknown as Dictionary;

describe("Navigation Components", () => {
  describe("Navbar", () => {
    it("contains link to Home", () => {
      render(<Navbar lang="en" dictionary={mockDictionary} />);

      // The logo usually links to home
      const homeLinks = screen.getAllByRole("link", { name: /eniko/i }); // Logo text
      expect(homeLinks.length).toBeGreaterThan(0);
      expect(homeLinks[0]).toHaveAttribute("href", "/en");
    });
  });

  describe("Footer", () => {
    it("contains critical links (Home, Dashboard, Terms, Privacy)", () => {
      render(<Footer lang="en" dictionary={mockDictionary} />);

      // Home
      const homeLink = screen.getByRole("link", { name: /Home/i });
      expect(homeLink).toHaveAttribute("href", "/en");

      // Dashboard
      const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
      expect(dashboardLink).toHaveAttribute("href", "/en/dashboard");

      // Terms
      const termsLink = screen.getByRole("link", { name: /Terms of Service/i });
      expect(termsLink).toHaveAttribute("href", "/en/legal/terms");

      // Privacy
      const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });
      expect(privacyLink).toHaveAttribute("href", "/en/legal/privacy");
    });
  });
});

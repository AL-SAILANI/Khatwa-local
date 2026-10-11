import { AuthApiError } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { FlowAuthError } from "@/lib/supabase/auth-error";
import { getAuthErrorMessage } from "./error-messages";

describe("getAuthErrorMessage (Supabase)", () => {
  it("maps wrong credentials to the same copy as Firebase", () => {
    const error = new AuthApiError("Invalid login credentials", 400, "invalid_credentials");
    expect(getAuthErrorMessage(error)).toBe("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
  });

  it("maps duplicate email and weak password", () => {
    expect(getAuthErrorMessage(new AuthApiError("x", 422, "user_already_exists"))).toBe(
      "هذا البريد الإلكتروني مستخدم بالفعل.",
    );
    expect(getAuthErrorMessage(new AuthApiError("x", 422, "weak_password"))).toBe("كلمة المرور ضعيفة جدًا.");
  });

  it("maps the email-confirmation flow error", () => {
    expect(getAuthErrorMessage(new FlowAuthError("email_confirmation_required"))).toContain("رابط تأكيد");
  });

  it("falls back to the generic message for unknown codes", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(getAuthErrorMessage(new AuthApiError("x", 500, "something_new"))).toBe("حدث خطأ غير متوقع. حاول مرة أخرى.");
    spy.mockRestore();
  });
});

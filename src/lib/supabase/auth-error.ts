/** Auth failure raised by our own flow code (not by Supabase), keyed by `code`. */
export class FlowAuthError extends Error {
  constructor(public readonly code: string, message = code) {
    super(message);
    this.name = "FlowAuthError";
  }
}

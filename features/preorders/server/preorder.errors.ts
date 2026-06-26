export class PreorderNotFoundError extends Error {
  constructor() {
    super("Preorder not found.");
    this.name = "PreorderNotFoundError";
  }
}

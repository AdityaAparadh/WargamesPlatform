class ProcessError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
  ) {
    super(message);
    this.name = "ProcessError";
  }
}

export default ProcessError;

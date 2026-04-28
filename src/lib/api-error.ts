export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const maybeResponse = "response" in error ? error.response : undefined;

    if (maybeResponse && typeof maybeResponse === "object") {
      const maybeData =
        "data" in maybeResponse ? maybeResponse.data : undefined;

      if (
        maybeData &&
        typeof maybeData === "object" &&
        "message" in maybeData &&
        typeof maybeData.message === "string"
      ) {
        return maybeData.message;
      }
    }

    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return fallback;
}

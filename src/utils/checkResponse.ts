function getErrorMessage(parsed: unknown): string | undefined {
    if (typeof parsed === "string") {
        const trimmed = parsed.trim();
        return trimmed ? trimmed : undefined;
    }

    if (parsed && typeof parsed === "object") {
        const payload = parsed as Record<string, unknown>;
        const detail = [payload.message, payload.error].find(
            (value): value is string => typeof value === "string" && value.trim().length > 0,
        );
        return detail?.trim() || undefined;
    }

    return undefined;
}

export async function checkResponse<T>(res: Response): Promise<T> {
    const raw = await res.text();
    let parsed: unknown = raw;

    if (raw) {
        try {
            parsed = JSON.parse(raw);
        } catch {
        }
    }

    if (!res.ok) {
        const message =
            getErrorMessage(parsed) || raw.trim() || res.statusText || "Unknown error";

        throw new Error(`${res.status} ${message}`.trim());
    }

    if (!raw) {
        return undefined as T;
    }

    return parsed as T;
}

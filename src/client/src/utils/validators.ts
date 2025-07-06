export const required = (value: any): boolean | string =>
    !!value || value === 0 || "This is a required field";

export const mail = (value: string): boolean | string =>
    !value ||
    /^[a-zA-Z0-9!+\-_.]+(?:\.[a-zA-Z0-9!+\-_]+)*@(?:[a-zA-Z0-9\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\-]+\.)+[a-zA-Z0-9]{2,}$/.test(
        value
    ) ||
    "No valid e-mail address. Permitted characters before the @ are [a-zA-Z], [0-9] + - . and _!.";

export const password = (value: string): boolean | string =>
    !value ||
    /^(?=.*[A-Z])(?=.*[\x21-\x40\x5B\x5D-\x60\x7B\x7E])[\x21-\x5B\x5D-\x7E]{8,}$/.test(value) ||
    "The password must contain at least eight characters, a capital letter and a number or a special character.";

export const int = (value: number): boolean | string =>
    !value || Number.isInteger(value) || "Input is not an integer";

export const phone = (value: string): boolean | string =>
    !value ||
    /^\+?[0-9]{7,15}$/.test(value) ||
    "No valid phone number. Only digits and an optional leading + are allowed.";

export const countryCode = (value: string): boolean | string =>
    !value ||
    /^[A-Z]{2,3}$/.test(value) ||
    "Invalid country code. Use 2–3 uppercase letters (e.g., CH, DE, USA).";

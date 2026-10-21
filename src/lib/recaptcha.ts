/** True when the secret key is set. Without it forms are accepted as before. */
export function recaptchaRequired(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

/** Asks Google whether the token from the "I'm not a robot" box is real. */
export async function verifyRecaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (error) {
    console.error("Could not reach Google reCAPTCHA.", error);
    return false;
  }
}

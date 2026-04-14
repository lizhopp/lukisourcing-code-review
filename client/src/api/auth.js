function parseResponseBody(responseText) {
  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

async function sendAuthRequest(path, formData, fallbackMessage) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseText = await response.text();
  const data = parseResponseBody(responseText);

  if (!response.ok) {
    throw new Error(typeof data === "string" ? data : fallbackMessage);
  }

  if (!data || typeof data !== "object" || !data.token || !data.user) {
    throw new Error("The server did not return a complete login session.");
  }

  return data;
}

export function registerUser(formData) {
  return sendAuthRequest("/api/users/register", formData, "Unable to create your account.");
}

export function loginUser(formData) {
  return sendAuthRequest("/api/users/login", formData, "Unable to log in.");
}

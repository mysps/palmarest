const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "PE", "CL", "VE", "EC",
  "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI",
  "CR", "PA", "UY",
]);

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    // Only set lang cookie on HTML page responses, not assets
    if (!response.headers.get("content-type")?.startsWith("text/html")) {
      return response;
    }

    const cookie = request.headers.get("cookie") || "";
    const hasLangCookie = /(?:^|;\s*)lang=/.test(cookie);

    if (!hasLangCookie) {
      const country = request.cf?.country;
      if (country && SPANISH_COUNTRIES.has(country)) {
        const newResponse = new Response(response.body, response);
        newResponse.headers.append(
          "Set-Cookie",
          "lang=es; Path=/; Max-Age=31536000; SameSite=Lax"
        );
        return newResponse;
      }
    }

    return response;
  },
};

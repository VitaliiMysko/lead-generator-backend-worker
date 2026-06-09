// src/index.js
var index_default = {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const { text, target } = await request.json();
        const apiKey = env.GOOGLE_TRANSLATE_API_KEY;
        const apiResponse = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, target }),
          }
        );
        const result = await apiResponse.json();
        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Translation failed" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const websiteUrl = url.searchParams.get("url");

    if (email) {
      const apiKey = env.EMAIL_API_KEY;
      const apiUrl = `https://api.emailable.com/v1/verify?email=${encodeURIComponent(email)}&api_key=${apiKey}`;
      try {
        const apiResponse = await fetch(apiUrl);
        const result = await apiResponse.json();
        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Verification failed" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    if (websiteUrl) {
      try {
        const response = await fetch(websiteUrl, {
          method: "GET",
          redirect: "follow",
        });
        return new Response(
          JSON.stringify({ status: response.status, ok: response.ok }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ status: 0, ok: false }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "No valid parameters provided" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  },
};

export { index_default as default };
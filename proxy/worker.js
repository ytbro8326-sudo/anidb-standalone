export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    const ref = url.searchParams.get("ref") ?? "https://anidb.app/";

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing ?url= param" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    let targetUrl;
    try { targetUrl = new URL(target); } catch {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!targetUrl.hostname.endsWith("anidb.app")) {
      return new Response(JSON.stringify({ error: "Only anidb.app requests allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const reqHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      "Accept": request.headers.get("accept") || "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": ref,
    };

    const xReqWith = request.headers.get("x-requested-with");
    if (xReqWith) {
      reqHeaders["X-Requested-With"] = xReqWith;
    }

    const res = await fetch(target, { headers: reqHeaders }).catch(() => null);

    if (!res) {
      return new Response(JSON.stringify({ error: "Fetch failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const body = await res.arrayBuffer();
    const resHeaders = new Headers();
    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Content-Type", res.headers.get("Content-Type") ?? "text/plain");

    return new Response(body, { status: res.status, headers: resHeaders });
  },
};

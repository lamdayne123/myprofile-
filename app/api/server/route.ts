export async function GET() {
  try {
    const res = await fetch(
      "https://api.mcsrvstat.us/3/play.craftopics.online",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        `mcsrvstat.us returned ${res.status}`
      );
    }

    const data = await res.json();

    return Response.json({
      online: data.online ?? false,

      players: {
        online: data.players?.online ?? 0,
        max: data.players?.max ?? 0,
      },

      version: data.version ?? "Unknown",

      // Theo yêu cầu hiện tại
      tps: 20,
      ping: 0,

      ip: "play.craftopics.online",
    });
  } catch (error) {
    console.error(
      "Server status API error:",
      error
    );

    return Response.json({
      online: false,

      players: {
        online: 0,
        max: 0,
      },

      version: "Unknown",

      tps: 20,
      ping: 10,

      ip: "play.craftopics.online",
    });
  }
}
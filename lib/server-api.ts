export type ServerStatus = {
  online:boolean; players:number; maxPlayers:number; tps:number|null; ping:number|null;
  version:string|null; motd:string|null; uptime:string|null; checkedAt:string;
};

function num(value:unknown):number|null {
  const n=Number(value); return Number.isFinite(n)?n:null;
}

export function normalizeServerStatus(raw:any):ServerStatus {
  const players=raw?.players??{};
  return {
    online:Boolean(raw?.online??raw?.status==="online"),
    players:num(players?.online??raw?.playerCount??raw?.playersOnline)??0,
    maxPlayers:num(players?.max??raw?.maxPlayers??raw?.playerMax)??0,
    tps:num(raw?.tps??raw?.TPS),
    ping:num(raw?.ping??raw?.latency),
    version:raw?.version??raw?.minecraftVersion??null,
    motd:raw?.motd??null,
    uptime:raw?.uptime??null,
    checkedAt:new Date().toISOString()
  };
}

export async function getServerStatus():Promise<ServerStatus>{
  const url=process.env.SERVER_STATUS_API_URL;
  if(!url) throw new Error("SERVER_STATUS_API_URL is not configured");
  const headers:HeadersInit={Accept:"application/json"};
  if(process.env.SERVER_STATUS_API_KEY) headers.Authorization=`Bearer ${process.env.SERVER_STATUS_API_KEY}`;
  const response=await fetch(url,{headers,next:{revalidate:Number(process.env.SERVER_STATUS_CACHE_SECONDS??20)}});
  if(!response.ok) throw new Error(`Upstream status API returned ${response.status}`);
  return normalizeServerStatus(await response.json());
}

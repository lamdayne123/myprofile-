export interface Song {
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

export const playlist: Song[] = [
  { title: "夜に駆ける", artist: "YOASOBI", duration: "4:21", cover: "/images/music/yoasobi.jpg" },
  { title: "花に亡霊", artist: "ヨルシカ", duration: "4:01", cover: "/images/music/yorushika.jpg" },
  { title: "アイドル", artist: "YOASOBI", duration: "3:33", cover: "/images/music/idol.jpg" },
  { title: "光へ", artist: "Aimer", duration: "4:50", cover: "/images/music/aimer.jpg" }
];

export interface Song {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

export const playlist: Song[] = [
  {
    title: "夜に駆ける",
    artist: "YOASOBI",
    cover: "/images/music/yoasobi.jpg",
    src: "/music/yoru-ni-kakeru.mp3",
  },
  {
    title: "花に亡霊",
    artist: "ヨルシカ",
    cover: "/images/music/yorushika.jpg",
    src: "/music/hana-ni-bourei.mp3",
  },
  {
    title: "アイドル",
    artist: "YOASOBI",
    cover: "/images/music/idol.jpg",
    src: "/music/idol.mp3",
  },
  {
    title: "光へ",
    artist: "Aimer",
    cover: "/images/music/aimer.jpg",
    src: "/music/hikari-e.mp3",
  },
];
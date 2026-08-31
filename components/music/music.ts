export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  src: string;
};

export const DEFAULT_PLAYLIST: Song[] = [
  {
    id: "yoru-ni-kakeru",
    title: "夜に駆ける",
    artist: "YOASOBI",
    duration: "4:21",
    cover: "/images/music/yoasobi.jpg",
    src: "/music/yoru-ni-kakeru.mp3",
  },
  {
    id: "hana-ni-bourei",
    title: "花に亡霊",
    artist: "ヨルシカ",
    duration: "4:01",
    cover: "/images/music/yorushika.jpg",
    src: "/music/hana-ni-bourei.mp3",
  },
  {
    id: "idol",
    title: "アイドル",
    artist: "YOASOBI",
    duration: "3:33",
    cover: "/images/music/idol.jpg",
    src: "/music/idol.mp3",
  },
  {
    id: "hikari-e",
    title: "光へ",
    artist: "Aimer",
    duration: "4:50",
    cover: "/images/music/aimer.jpg",
    src: "/music/hikari-e.mp3",
  },
];

export function validAudioUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

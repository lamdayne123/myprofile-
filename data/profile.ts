export interface ProfileData {
  name: string;
  avatar: string;
  greetingJp: string;
  titleJp: string;
  tagline: string;
  quoteJp: string;
  quoteVi: string;
  status: string;
  location: string;
  age: string;
  role: string;
  aboutJp: string;
  hobbies: string[];
}

export const profileData: ProfileData = {
  name: "Trương Chí Lâm",
  avatar: "/images/avatar.jpg",
  greetingJp: "こんにちは、私は",
  titleJp: "ただの人間です。",
  tagline: "Just another human being.",
  quoteJp: "小さな一歩でも、進んでいればそれでいい。",
  quoteVi: "Dù chỉ là một bước nhỏ, miễn tiến lên là được.",
  status: "Online",
  location: "Vietnam",
  age: "100 tuổi",
  role: "Developer / Student",
  aboutJp:
    "プログラミングと音楽が好きです。サーバーを構築したり、Discord Botを作ったりするのが趣味です。",
  hobbies: [
    "コードを書くこと",
    "音楽を聴くこと",
    "アニメを見ること",
    "ゲーム (Minecraft)"
  ]
};

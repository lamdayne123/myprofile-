export interface Project {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  image: string;
}

export const projectsData: Project[] = [
  {
    id: "craftopia",
    name: "Craftopia Survival",
    desc: "Máy chủ Minecraft của tôi.",
    tags: ["Minecraft", "Survival", "Chill"],
    image: "/images/projects/craftopia.jpg"
  },
  {
    id: "discord-bot",
    name: "Discord Bot",
    desc: "Bot Discord có AI, và nhiều source minigame.",
    tags: ["Node.js", "Discord", "AI"],
    image: "/images/projects/discord.jpg"
  },
  {
    id: "card-battle",
    name: "Card Minigame",
    desc: "Hệ thống game thẻ bài lấy cảm hứng từ anime.",
    tags: ["JavaScript", "Vue.js", "DB"],
    image: "/images/projects/cardgame.jpg"
  }
];

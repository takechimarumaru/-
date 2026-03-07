import { Question, CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  { id: "body", label: "BODY" },
  { id: "mind", label: "MIND" },
  { id: "habit", label: "HABIT" },
  { id: "relation", label: "RELATION" },
  { id: "work", label: "WORK" },
  { id: "environment", label: "ENVIRONMENT" },
];

export const categoryTaglines: Record<string, string> = {
  body: "あなたは、自分の身体を知っていますか",
  mind: "あなたの心は、今どこにありますか",
  habit: "繰り返しが、あなたを作っている",
  relation: "あなたの周りに、誰がいますか",
  work: "あなたの時間は、誰のものですか",
  environment: "あなたを取り巻くものは、何ですか",
};

export const questions: Question[] = [
  // BODY
  { id: 1, category: "body", text: "週に3回以上、意識的に身体を動かしている", dir: 1, weight: 1.5, type: "scale" },
  { id: 2, category: "body", text: "自分の体力に自信がある", dir: 1, weight: 1.0, type: "scale" },
  { id: 3, category: "body", text: "健康診断の結果を毎年確認している", dir: 1, weight: 1.1, type: "scale" },
  { id: 4, category: "body", text: "慢性的な痛みや不調を抱えている", dir: -1, weight: 1.3, type: "scale" },
  { id: 5, category: "body", text: "食事の栄養バランスを意識している", dir: 1, weight: 1.2, type: "scale" },
  { id: 6, category: "body", text: "BMIが標準範囲を大きく外れている", dir: -1, weight: 1.4, type: "scale" },

  // MIND
  { id: 7, category: "mind", text: "自分のことがわりと好きだ", dir: 1, weight: 1.3, type: "scale" },
  { id: 8, category: "mind", text: "将来に対して漠然とした不安がある", dir: -1, weight: 1.1, type: "scale" },
  { id: 9, category: "mind", text: "感情を誰かに話せる相手がいる", dir: 1, weight: 1.4, type: "scale" },
  { id: 10, category: "mind", text: "ストレスを感じると身体に症状が出る", dir: -1, weight: 1.2, type: "scale" },
  { id: 11, category: "mind", text: "日常の中に「没頭できる時間」がある", dir: 1, weight: 1.0, type: "scale" },
  { id: 12, category: "mind", text: "理由のない憂鬱を感じることがある", dir: -1, weight: 1.3, type: "scale" },

  // HABIT
  { id: 13, category: "habit", text: "タバコを吸っている（電子タバコ含む）", dir: -1, weight: 2.0, type: "scale" },
  { id: 14, category: "habit", text: "お酒を週に4日以上飲んでいる", dir: -1, weight: 1.4, type: "scale" },
  { id: 15, category: "habit", text: "平均何時間寝ていますか？", dir: 1, weight: 1.5, type: "sleep" },
  { id: 16, category: "habit", text: "スマートフォンの使用時間が1日5時間を超えている", dir: -1, weight: 0.8, type: "scale" },
  { id: 17, category: "habit", text: "甘いものや加工食品を頻繁に食べている", dir: -1, weight: 1.2, type: "scale" },
  { id: 18, category: "habit", text: "水を1日1.5リットル以上飲んでいる", dir: 1, weight: 0.9, type: "scale" },

  // RELATION
  { id: 19, category: "relation", text: "信頼できる友人が3人以上いる", dir: 1, weight: 1.5, type: "scale" },
  { id: 20, category: "relation", text: "家族との関係に満足している", dir: 1, weight: 1.3, type: "scale" },
  { id: 21, category: "relation", text: "孤独を感じることが多い", dir: -1, weight: 1.6, type: "scale" },
  { id: 22, category: "relation", text: "困ったときに頼れる人がいる", dir: 1, weight: 1.4, type: "scale" },
  { id: 23, category: "relation", text: "地域やコミュニティに所属している", dir: 1, weight: 1.0, type: "scale" },
  { id: 24, category: "relation", text: "人間関係でストレスを感じやすい", dir: -1, weight: 1.1, type: "scale" },

  // WORK
  { id: 25, category: "work", text: "自分の仕事に意味を感じている", dir: 1, weight: 1.3, type: "scale" },
  { id: 26, category: "work", text: "週の労働時間が50時間を超えている", dir: -1, weight: 1.5, type: "scale" },
  { id: 27, category: "work", text: "職場の人間関係は良好だ", dir: 1, weight: 1.1, type: "scale" },
  { id: 28, category: "work", text: "仕事のことが頭から離れない日が多い", dir: -1, weight: 1.2, type: "scale" },
  { id: 29, category: "work", text: "自分の裁量で仕事の進め方を決められる", dir: 1, weight: 1.0, type: "scale" },
  { id: 30, category: "work", text: "通勤に1時間以上かかっている", dir: -1, weight: 0.9, type: "scale" },

  // ENVIRONMENT
  { id: 31, category: "environment", text: "家族に長寿の人が多い", dir: 1, weight: 1.6, type: "scale" },
  { id: 32, category: "environment", text: "経済的な不安がある", dir: -1, weight: 1.3, type: "scale" },
  { id: 33, category: "environment", text: "自然に触れる機会が定期的にある", dir: 1, weight: 0.9, type: "scale" },
  { id: 34, category: "environment", text: "生きがいや目標がある", dir: 1, weight: 1.5, type: "scale" },
  { id: 35, category: "environment", text: "空気の綺麗な場所に住んでいる", dir: 1, weight: 1.0, type: "scale" },
  { id: 36, category: "environment", text: "定期的に笑う機会がある", dir: 1, weight: 1.1, type: "scale" },
];

export const categoryAdvice: Record<string, string[]> = {
  body: [
    "週に数回の散歩から始めるだけでも、身体は応えてくれます。",
    "身体の声を聴く習慣が、未来の自分を守ります。",
  ],
  mind: [
    "感情を押し込めず、日記やメモに書き出すだけでも心が軽くなります。",
    "「何もしない時間」を意識的に作ることが、心の回復につながります。",
  ],
  habit: [
    "一つだけ、今日から変えられる小さな習慣を選んでみてください。",
    "完璧を目指さず、昨日より少しだけ良い選択を。",
  ],
  relation: [
    "誰かに「ありがとう」と伝えるだけで、つながりは深まります。",
    "孤独は恥ではありません。手を伸ばす勇気が、人生を変えます。",
  ],
  work: [
    "「休む」ことも、仕事の一部です。",
    "自分の時間を取り戻すことが、最も生産的な投資です。",
  ],
  environment: [
    "自然の中で深呼吸する時間を、週に一度だけでも。",
    "生きがいは大きな目標でなくていい。小さな楽しみの積み重ねです。",
  ],
};

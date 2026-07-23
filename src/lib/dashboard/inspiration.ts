export interface DailyInspiration {
  verse: {
    reference: string;
    text: string;
  };
  quote: {
    author: string;
    text: string;
  };
}

const bibleVerses = [
  {
    reference: "Proverbs 16:3",
    text: "Commit to the Lord whatever you do, and He will establish your plans.",
  },
  {
    reference: "Joshua 1:9",
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not want.",
  },
  {
    reference: "Matthew 6:33",
    text: "Seek first the kingdom of God and His righteousness, and all these things will be added to you.",
  },
  {
    reference: "Romans 8:28",
    text: "In all things God works for the good of those who love Him.",
  },
  {
    reference: "Isaiah 41:10",
    text: "Fear not, for I am with you; be not dismayed, for I am your God.",
  },
];

const motivationalQuotes = [
  {
    author: "Jim Rohn",
    text: "Discipline is the bridge between goals and accomplishment.",
  },
  {
    author: "Warren Buffett",
    text: "Someone is sitting in the shade today because someone planted a tree a long time ago.",
  },
  {
    author: "Peter Drucker",
    text: "What gets measured gets managed.",
  },
  {
    author: "Brian Tracy",
    text: "Successful people are simply those with successful habits.",
  },
  {
    author: "John Maxwell",
    text: "Small disciplines repeated with consistency lead to great achievements.",
  },
  {
    author: "Zig Ziglar",
    text: "Success occurs when opportunity meets preparation.",
  },
  {
    author: "Robin Sharma",
    text: "All change is hard at first, messy in the middle and gorgeous at the end.",
  },
  {
    author: "Les Brown",
    text: "You don't have to be great to get started, but you have to get started to be great.",
  },
];

export function getDailyInspiration(): DailyInspiration {
  const today = new Date();

  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  return {
    verse: bibleVerses[dayOfYear % bibleVerses.length],
    quote: motivationalQuotes[dayOfYear % motivationalQuotes.length],
  };
}

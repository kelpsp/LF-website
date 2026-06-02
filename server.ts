import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("club.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    join_date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS membership_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    year INTEGER,
    paid BOOLEAN DEFAULT 0,
    FOREIGN KEY(member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    lyrics_url TEXT,
    file_type TEXT,
    language TEXT DEFAULT 'Chinese',
    added_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    is_member_only BOOLEAN DEFAULT 0,
    fb_post_url TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    skills TEXT,
    message TEXT,
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add language column if it doesn't exist
try {
  db.exec("ALTER TABLE songs ADD COLUMN language TEXT DEFAULT 'Chinese'");
} catch (e) {
  // Column already exists
}

// Migration: Add is_member_only column to news if it doesn't exist
try {
  db.exec("ALTER TABLE news ADD COLUMN is_member_only BOOLEAN DEFAULT 0");
} catch (e) {
  // Column already exists
}

// Migration: Add fb_post_url column to news if it doesn't exist
try {
  db.exec("ALTER TABLE news ADD COLUMN fb_post_url TEXT");
} catch (e) {
  // Column already exists
}

// Seed songs if table is empty
const songCount = db.prepare("SELECT COUNT(*) as count FROM songs").get() as { count: number };
if (songCount.count === 0) {
  const initialSongs = [
    // Chinese
    { title: "當", artist: "動力火車", file_type: "PDF", language: "Chinese" },
    { title: "大火", artist: "李佳薇", file_type: "PDF", language: "Chinese" },
    { title: "分享愛", artist: "郭富城", file_type: "PDF", language: "Chinese" },
    { title: "三天三夜", artist: "張惠妹", file_type: "PDF", language: "Chinese" },
    { title: "一路上有你", artist: "張學友", file_type: "PDF", language: "Chinese" },
    { title: "三月裡的小雨", artist: "劉文正", file_type: "PDF", language: "Chinese" },
    { title: "千千萬萬個愛你", artist: "文章", file_type: "PDF", language: "Chinese" },
    { title: "可可托海的牧羊人", artist: "", file_type: "PDF", language: "Chinese" },
    { title: "我很醜可是我很溫柔", artist: "趙傳", file_type: "PDF", language: "Chinese" },
    { title: "你的眼睛背叛了你的心", artist: "鄭中基", file_type: "PDF", language: "Chinese" },
    { title: "Di Da Di", artist: "李玟", file_type: "PDF", language: "Chinese" },
    { title: "喜歡你", artist: "BEYOND", file_type: "PDF", language: "Chinese" },
    { title: "霧", artist: "劉家昌", file_type: "PDF", language: "Chinese" },
    { title: "小詩", artist: "余天", file_type: "PDF", language: "Chinese" },
    { title: "日不落", artist: "蔡依林", file_type: "PDF", language: "Chinese" },
    { title: "千言萬語", artist: "鄧麗君", file_type: "PDF", language: "Chinese" },
    { title: "天黑請閉眼", artist: "陳零九", file_type: "PDF", language: "Chinese" },
    { title: "可愛的玫瑰花", artist: "鳳飛飛", file_type: "PDF", language: "Chinese" },
    { title: "今天你要嫁給我", artist: "陶喆+蔡依林", file_type: "PDF", language: "Chinese" },
    { title: "小雨打在我的身上", artist: "劉文正", file_type: "PDF", language: "Chinese" },
    { title: "誰想輕輕偷走我的吻", artist: "張學友", file_type: "PDF", language: "Chinese" },
    { title: "我的心裡只有你沒有他", artist: "黃小琥", file_type: "PDF", language: "Chinese" },
    { title: "Honey", artist: "王心凌", file_type: "PDF", language: "Chinese" },
    { title: "愛情陷阱", artist: "譚詠麟", file_type: "PDF", language: "Chinese" },
    { title: "風", artist: "歐陽菲菲", file_type: "PDF", language: "Chinese" },
    { title: "天后", artist: "陳勢安", file_type: "PDF", language: "Chinese" },
    { title: "木棉道", artist: "王夢麟", file_type: "PDF", language: "Chinese" },
    { title: "匆匆那年", artist: "王菲", file_type: "PDF", language: "Chinese" },
    { title: "月兒像檸檬", artist: "楊小萍", file_type: "PDF", language: "Chinese" },
    { title: "失戀陣線聯盟", artist: "草蜢", file_type: "PDF", language: "Chinese" },
    { title: "天真活潑又美麗", artist: "甄妮", file_type: "PDF", language: "Chinese" },
    { title: "我不該看你的眼神", artist: "蘇芮+鍾鎮濤", file_type: "PDF", language: "Chinese" },
    { title: "明天你是否依然爱我", artist: "童安格", file_type: "PDF", language: "Chinese" },
    { title: "每次都想呼喊你的名字", artist: "李恕權", file_type: "PDF", language: "Chinese" },
    { title: "Linda", artist: "張學友", file_type: "PDF", language: "Chinese" },
    { title: "海闊天空", artist: "BEYOND", file_type: "PDF", language: "Chinese" },
    { title: "太陽", artist: "邱振哲", file_type: "PDF", language: "Chinese" },
    { title: "丟了你", artist: "井攏", file_type: "PDF", language: "Chinese" },
    { title: "回頭太難", artist: "張學友", file_type: "PDF", language: "Chinese" },
    { title: "再度重相逢", artist: "五佰", file_type: "PDF", language: "Chinese" },
    { title: "你是我的花朵", artist: "五佰", file_type: "PDF", language: "Chinese" },
    { title: "我是一隻小小鳥", artist: "趙傳", file_type: "PDF", language: "Chinese" },
    { title: "原來你什麼都不要", artist: "張惠妹", file_type: "PDF", language: "Chinese" },
    { title: "最熟悉的陌生人", artist: "蕭亞軒", file_type: "PDF", language: "Chinese" },
    { title: "你是我這輩子最想愛的呀", artist: "五堅情", file_type: "PDF", language: "Chinese" },
    { title: "Mojito", artist: "周杰倫", file_type: "PDF", language: "Chinese" },
    { title: "光輝歲月", artist: "BEYOND", file_type: "PDF", language: "Chinese" },
    { title: "王妃", artist: "蕭敬騰", file_type: "PDF", language: "Chinese" },
    { title: "紅蜻蜓", artist: "小虎隊", file_type: "PDF", language: "Chinese" },
    { title: "因為愛情", artist: "王菲+陳奕迅", file_type: "PDF", language: "Chinese" },
    { title: "如果雲知道", artist: "許茹芸", file_type: "PDF", language: "Chinese" },
    { title: "飛向你飛向我", artist: "金瑞瑤", file_type: "PDF", language: "Chinese" },
    { title: "姐姐妹妹站起來", artist: "陶晶瑩", file_type: "PDF", language: "Chinese" },
    { title: "愛情教會我們的事", artist: "周興哲", file_type: "PDF", language: "Chinese" },
    { title: "輸了你贏了世界又如何", artist: "優客李林", file_type: "PDF", language: "Chinese" },
    { title: "On Night In北京", artist: "信樂團", file_type: "PDF", language: "Chinese" },
    { title: "頭髮亂了", artist: "張學友", file_type: "PDF", language: "Chinese" },
    
    // English
    { title: "Abracadabra", artist: "Lady Gaga", file_type: "PDF", language: "English" },
    { title: "Baby one more time", artist: "Britney Spears", file_type: "PDF", language: "English" },
    { title: "Call me", artist: "Blondie", file_type: "PDF", language: "English" },
    { title: "Daddy's Home", artist: "Jermaine Jackson", file_type: "PDF", language: "English" },
    { title: "Easy Lover", artist: "Phil Collins & Philip Bailey", file_type: "PDF", language: "English" },
    { title: "Fairy Tale", artist: "Michael Learns to Rock", file_type: "PDF", language: "English" },
    { title: "Get the Party Started", artist: "P!nk", file_type: "PDF", language: "English" },
    { title: "Hands Up", artist: "Ottawan", file_type: "PDF", language: "English" },
    { title: "I'm Alive", artist: "Céline Dion", file_type: "PDF", language: "English" },
    { title: "Jambalaya", artist: "Carpenters", file_type: "PDF", language: "English" },
    { title: "Key Largo", artist: "Bertie Higgins", file_type: "PDF", language: "English" },
    { title: "La Isla Bonita", artist: "Madonna", file_type: "PDF", language: "English" },
    { title: "Maggie May", artist: "Rod Stewart", file_type: "PDF", language: "English" },
    { title: "Need You Now", artist: "Lady Antebellum", file_type: "PDF", language: "English" },
    { title: "Ob-La-Di Ob-La-Da", artist: "The Beatles", file_type: "PDF", language: "English" },
    { title: "Papa Don't Preach", artist: "Madonna", file_type: "PDF", language: "English" },
    { title: "QUANDO, QUANDO, QUANDO", artist: "Engelbert Humperdinck", file_type: "PDF", language: "English" },
    { title: "Rasputin", artist: "Boney M.", file_type: "PDF", language: "English" },
    { title: "Sacrifice", artist: "Elton John", file_type: "PDF", language: "English" },
    { title: "Take it easy", artist: "Eagles", file_type: "PDF", language: "English" },
    { title: "Una Paloma Blanca", artist: "George Baker Selection", file_type: "PDF", language: "English" },
    { title: "Venus", artist: "Shocking Blue", file_type: "PDF", language: "English" },
    { title: "Walk of Life", artist: "Dire Straits", file_type: "PDF", language: "English" },
    { title: "Year Of The Cat", artist: "Al Stewart", file_type: "PDF", language: "English" },
    { title: "Zombie", artist: "The Cranberries", file_type: "PDF", language: "English" },
    { title: "A Man Without Love", artist: "Engelbert Humperdinck", file_type: "PDF", language: "English" },
    { title: "Bad Bad Leroy Brown", artist: "Jim Croce", file_type: "PDF", language: "English" },
    { title: "Can you feel the love tonight", artist: "Elton John", file_type: "PDF", language: "English" },
    { title: "Dance Monkey", artist: "Tones and I", file_type: "PDF", language: "English" },
    { title: "El condor pasa", artist: "Simon & Garfunkel", file_type: "PDF", language: "English" },
    { title: "Faithfully", artist: "Journey", file_type: "PDF", language: "English" },
    { title: "Gimme Gimme Gimme", artist: "ABBA", file_type: "PDF", language: "English" },
    { title: "Handy Man", artist: "James Taylor", file_type: "PDF", language: "English" },
    { title: "I'd Love You To Want Me", artist: "Lobo", file_type: "PDF", language: "English" },
    { title: "Johnny B. Goode", artist: "Chuck Berry", file_type: "PDF", language: "English" },
    { title: "Killing me softly with his song", artist: "Roberta Flack", file_type: "PDF", language: "English" },
    { title: "La Paloma", artist: "Julio Iglesias", file_type: "PDF", language: "English" },
    { title: "Make it with you", artist: "Bread", file_type: "PDF", language: "English" },
    { title: "New Divide", artist: "Linkin Park", file_type: "PDF", language: "English" },
    { title: "Oh Carol", artist: "Neil Sedaka", file_type: "PDF", language: "English" },
    { title: "Part Time Lover", artist: "Stevie Wonder", file_type: "PDF", language: "English" },
    { title: "Quien Sera (Sway)", artist: "The Pussycat Dolls", file_type: "PDF", language: "English" },
    { title: "Rhythm Of The Rain", artist: "The Cascades", file_type: "PDF", language: "English" },
    { title: "Salt", artist: "Ava Max", file_type: "PDF", language: "English" },
    { title: "Yellow River", artist: "Christie", file_type: "PDF", language: "English" },
    
    // Taiwanese
    { title: "愛拚才會贏", artist: "葉啟田", file_type: "PDF", language: "Taiwanese" },
    { title: "浪子回頭", artist: "茄子蛋", file_type: "PDF", language: "Taiwanese" },
    { title: "家後", artist: "江蕙", file_type: "PDF", language: "Taiwanese" },
    
    // Cantonese
    { title: "海闊天空", artist: "Beyond", file_type: "PDF", language: "Cantonese" },
    { title: "光輝歲月", artist: "Beyond", file_type: "PDF", language: "Cantonese" },
    { title: "紅日", artist: "李克勤", file_type: "PDF", language: "Cantonese" },
    
    // Japanese
    { title: "First Love", artist: "宇多田光", file_type: "PDF", language: "Japanese" },
    { title: "Lemon", artist: "米津玄師", file_type: "PDF", language: "Japanese" },
    { title: "Dry Flower", artist: "Yuuri", file_type: "PDF", language: "Japanese" }
  ];

  const insertSong = db.prepare("INSERT INTO songs (title, artist, file_type, language) VALUES (?, ?, ?, ?)");
  const transaction = db.transaction((songs) => {
    for (const song of songs) {
      insertSong.run(song.title, song.artist, song.file_type, song.language);
    }
  });
  transaction(initialSongs);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/members", (req, res) => {
    const members = db.prepare(`
      SELECT m.*, 
      (SELECT json_group_array(json_object('year', year, 'paid', paid)) 
       FROM membership_payments WHERE member_id = m.id) as payments
      FROM members m
    `).all();
    res.json(members.map(m => ({ ...m, payments: JSON.parse(m.payments as string) })));
  });

  app.post("/api/members", (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const info = db.prepare("INSERT INTO members (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, password || '123456', role || 'member');
      res.json({ id: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/members/:id/payment", (req, res) => {
    const { year, paid } = req.body;
    const memberId = req.params.id;
    db.prepare("INSERT OR REPLACE INTO membership_payments (member_id, year, paid) VALUES (?, ?, ?)").run(memberId, year, paid ? 1 : 0);
    res.json({ success: true });
  });

  app.get("/api/songs", (req, res) => {
    const songs = db.prepare("SELECT * FROM songs ORDER BY added_at DESC").all();
    res.json(songs);
  });

  app.post("/api/songs", (req, res) => {
    const { title, artist, lyrics_url, file_type, language } = req.body;
    const info = db.prepare("INSERT INTO songs (title, artist, lyrics_url, file_type, language) VALUES (?, ?, ?, ?, ?)").run(title, artist, lyrics_url, file_type, language || 'Chinese');
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY date DESC").all();
    res.json(news);
  });

  app.post("/api/news", (req, res) => {
    const { title, content, image_url, is_member_only, fb_post_url } = req.body;
    const info = db.prepare("INSERT INTO news (title, content, image_url, is_member_only, fb_post_url) VALUES (?, ?, ?, ?, ?)").run(title, content, image_url, is_member_only ? 1 : 0, fb_post_url || "");
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/volunteers", (req, res) => {
    const { name, email, skills, message } = req.body;
    const info = db.prepare("INSERT INTO volunteers (name, email, skills, message) VALUES (?, ?, ?, ?)").run(name, email, skills, message);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

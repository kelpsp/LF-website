import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Music, 
  Users, 
  FileText, 
  Newspaper, 
  HeartHandshake, 
  Facebook, 
  Instagram, 
  Youtube, 
  LogOut, 
  Plus, 
  Search,
  ChevronRight,
  Menu,
  X,
  History,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Member {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive';
  join_date: string;
  payments: { year: number; paid: number }[];
}

interface Song {
  id: number;
  title: string;
  artist: string;
  lyrics_url: string;
  file_type: string;
  language: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  is_member_only?: number;
  fb_post_url?: string;
  date: string;
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: Member | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '首頁', path: '/' },
    { name: '曲譜庫', path: '/songs' },
    { name: '志工招募', path: '/volunteers' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: '管理後台', path: '/admin' });
  } else if (user) {
    navLinks.push({ name: '會員專區', path: '/member' });
  }

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="LF Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                  }}
                />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">LF 來福</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={16} />
                  登出
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
                >
                  登入
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button 
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-900/20"
                >
                  <LogOut size={18} />
                  登出
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-orange-500"
                >
                  登入
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">LF 來福 音樂社團</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            我們是一個熱愛音樂的社團，致力於推廣樂團文化，提供音樂愛好者一個交流與成長的平台。
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-4">快速連結</h3>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link to="/songs" className="hover:text-orange-500 transition-colors">曲譜庫</Link></li>
            <li><Link to="/volunteers" className="hover:text-orange-500 transition-colors">志工招募</Link></li>
            <li><a href="https://docs.google.com/spreadsheets/d/1JSz3tNiTVqRPhPp2wqQyekp2M3EszrCHnPHAzUCQOXQ/edit?gid=1229172701#gid=1229172701" target="_blank" className="hover:text-orange-500 transition-colors">來福總歌單 (GSheet)</a></li>
            <li><a href="https://drive.google.com/drive/folders/13UqVKRtN_SRUN_22G_Ss8_LKohiSCrB5" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">雲端歌詞庫 (GDrive)</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-4">關注我們</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=100064325400827" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/esg_band_tw/" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://www.youtube.com/@ESGlivebandmusic" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        &copy; {new Date().getFullYear()} LF 來福 音樂社團. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/news').then(res => res.json()).then(setNews);
  }, []);

  const publicNews = news.filter(item => !item.is_member_only);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/band/1920/1080?blur=2" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter"
          >
            LF <span className="text-orange-500">來福</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-zinc-400 mb-10 font-medium"
          >
            音樂、熱血、夢想。加入我們，一起創造屬於我們的旋律。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/volunteers" className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all hover:scale-105">
              加入志工
            </Link>
            <Link to="/songs" className="px-8 py-4 bg-zinc-800 text-white rounded-full font-bold text-lg hover:bg-zinc-700 transition-all hover:scale-105">
              瀏覽曲譜
            </Link>
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Newspaper className="text-orange-500" />
            最新消息
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publicNews.length > 0 ? publicNews.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group h-full flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image_url || `https://picsum.photos/seed/${item.id}/800/600`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {item.fb_post_url && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Facebook size={12} />
                    FB 貼文
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">
                  {new Date(item.date).toLocaleDateString('zh-TW')}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">{item.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {item.content}
                </p>
                
                <div className="mt-auto">
                  {item.fb_post_url ? (
                    <a 
                      href={item.fb_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
                    >
                      <Facebook size={16} className="text-blue-500" />
                      在 Facebook 閱讀貼文
                    </a>
                  ) : (
                    <div className="text-zinc-500 text-xs italic">社團官方消息</div>
                  )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-20 text-zinc-600">
              暫無消息
            </div>
          )}
        </div>
      </section>

      {/* Recruitment Section */}
      <section className="bg-orange-500/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HeartHandshake className="mx-auto text-orange-500 mb-6" size={48} />
          <h2 className="text-4xl font-black text-white mb-6">我們正在尋找你！</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            無論你是海報設計師、攝影師、主持人、直播技術員還是社群媒體達人，只要你熱愛音樂，這裡都有你的舞台。
          </p>
          <Link to="/volunteers" className="inline-block px-10 py-4 bg-orange-500 text-white rounded-full font-black text-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
            立即報名志工
          </Link>
        </div>
      </section>
    </div>
  );
};

const Songs = ({ user }: { user: Member | null }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('全部');

  useEffect(() => {
    fetch('/api/songs').then(res => res.json()).then(setSongs);
  }, []);

  const filteredSongs = songs.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                         s.artist.toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = languageFilter === '全部' || s.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

  const handleSearchLyrics = (song: Song) => {
    const query = `${song.title} ${song.artist} 歌詞 lyrics`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">曲譜庫</h1>
          <p className="text-zinc-500">搜尋並瀏覽我們收藏的歌曲與歌詞。</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text"
              placeholder="搜尋歌名或歌手..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['全部', 'Chinese', 'Taiwanese', 'Cantonese', 'Japanese', 'English'].map(lang => (
          <button
            key={lang}
            onClick={() => setLanguageFilter(lang)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
              languageFilter === lang 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
            )}
          >
            {lang === 'Chinese' ? '國語' : lang === 'Taiwanese' ? '台語' : lang === 'Cantonese' ? '粵語' : lang === 'Japanese' ? '日語' : lang === 'English' ? '英語' : '全部'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => (
          <div key={song.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-zinc-800 rounded-xl text-orange-500">
                <Music size={24} />
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-800 px-2 py-1 rounded">
                  {song.language === 'Chinese' ? '華語' : song.language === 'Other' ? '其他' : song.language}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-800 px-2 py-1 rounded">
                  {song.file_type}
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{song.title}</h3>
            <p className="text-zinc-500 text-sm mb-6">{song.artist}</p>
            
            <div className="mt-auto space-y-3">
              {song.lyrics_url ? (
                <a 
                  href={song.lyrics_url} 
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                >
                  <FileText size={18} />
                  查看歌詞 (Drive)
                </a>
              ) : (
                <button 
                  onClick={() => handleSearchLyrics(song)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-all border border-zinc-700"
                >
                  <Search size={18} />
                  搜尋歌詞 (Google)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredSongs.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          找不到符合條件的歌曲
        </div>
      )}
    </div>
  );
};

const Volunteers = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [] as string[],
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const skills = [
    '海報製作', 
    '活動攝影', 
    '活動主持', 
    '直播技術', 
    '社群經營', 
    '宣傳推廣', 
    '場域維護', 
    '其他'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        skills: formData.skills.join(', ')
      })
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">報名成功！</h1>
        <p className="text-zinc-500 mb-10">感謝你的熱情參與，我們會盡快與你聯繫。</p>
        <Link to="/" className="px-8 py-3 bg-orange-500 text-white rounded-full font-bold">回到首頁</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white mb-4">志工招募</h1>
      <p className="text-zinc-500 mb-12">加入 LF 來福，一起為音樂夢想努力。請填寫以下資訊，我們會主動聯繫你。</p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400">姓名</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400">電子郵件</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-400">感興趣的領域 (可多選)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  const newSkills = formData.skills.includes(skill)
                    ? formData.skills.filter(s => s !== skill)
                    : [...formData.skills, skill];
                  setFormData({...formData, skills: newSkills});
                }}
                className={cn(
                  "py-3 px-4 rounded-xl text-sm font-bold border transition-all",
                  formData.skills.includes(skill)
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-400">想對我們說的話</label>
          <textarea 
            rows={4}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-xl font-black text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
          提交報名
        </button>
      </form>
    </div>
  );
};

const Admin = ({ user }: { user: Member | null }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'songs' | 'news' | 'history'>('members');
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member', password: '' });
  const [newSong, setNewSong] = useState({ title: '', artist: '', lyrics_url: '', file_type: 'PDF', language: 'Chinese' });
  const [newNews, setNewNews] = useState({ title: '', content: '', image_url: '', is_member_only: false, fb_post_url: '' });

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const fetchMembers = () => fetch('/api/members').then(res => res.json()).then(setMembers);

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    });
    setNewMember({ name: '', email: '', role: 'member', password: '' });
    fetchMembers();
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSong)
    });
    setNewSong({ title: '', artist: '', lyrics_url: '', file_type: 'PDF', language: 'Chinese' });
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNews)
    });
    setNewNews({ title: '', content: '', image_url: '', is_member_only: false, fb_post_url: '' });
  };

  const togglePayment = async (memberId: number, year: number, currentPaid: boolean) => {
    await fetch(`/api/members/${memberId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, paid: !currentPaid })
    });
    fetchMembers();
  };

  if (user?.role !== 'admin') {
    return <div className="p-20 text-center text-white">無權訪問</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-orange-500 rounded-2xl text-white">
          <Users size={32} />
        </div>
        <h1 className="text-4xl font-black text-white">管理後台</h1>
      </div>

      <div className="flex gap-2 mb-8 bg-zinc-900 p-1 rounded-2xl w-fit">
        {[
          { id: 'members', name: '會員管理', icon: Users },
          { id: 'songs', name: '曲譜管理', icon: Music },
          { id: 'news', name: '消息發佈', icon: Newspaper },
          { id: 'history', name: '歷史數據', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-zinc-800 text-white shadow-lg" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'members' && (
        <div className="space-y-8">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-orange-500" />
              新增會員
            </h2>
            <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input 
                placeholder="姓名"
                required
                value={newMember.name}
                onChange={e => setNewMember({...newMember, name: e.target.value})}
                className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500 text-sm"
              />
              <input 
                placeholder="電子郵件"
                required
                type="email"
                value={newMember.email}
                onChange={e => setNewMember({...newMember, email: e.target.value})}
                className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500 text-sm"
              />
              <input 
                placeholder="登入密碼 (選填)"
                type="text"
                value={newMember.password}
                onChange={e => setNewMember({...newMember, password: e.target.value})}
                className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500 text-sm"
              />
              <select 
                value={newMember.role}
                onChange={e => setNewMember({...newMember, role: e.target.value as any})}
                className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white text-sm"
              >
                <option value="member">一般會員</option>
                <option value="admin">管理員</option>
              </select>
              <button className="bg-orange-500 text-white font-bold rounded-xl py-3 hover:bg-orange-600 transition-all text-sm">
                確認新增
              </button>
            </form>
          </div>

          <div className="flex justify-between items-center bg-zinc-900 p-4 px-6 rounded-2xl border border-zinc-800">
            <span className="text-sm font-bold text-zinc-400">系統會員清單</span>
            <div className="flex gap-2">
              <button
                onClick={() => setOnlyUnpaid(false)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  !onlyUnpaid 
                    ? "bg-orange-500 text-white" 
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                )}
              >
                顯示全部 ({members.length})
              </button>
              <button
                onClick={() => setOnlyUnpaid(true)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  onlyUnpaid 
                    ? "bg-red-500 text-white" 
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                )}
              >
                只顯示未繳會費 ({members.filter(m => {
                  const p = m.payments?.find(pay => pay.year === currentYear);
                  return !p || p.paid !== 1;
                }).length})
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">會員</th>
                  <th className="px-6 py-4">角色</th>
                  {years.map(y => <th key={y} className="px-6 py-4 text-center">{y} 會費</th>)}
                  <th className="px-6 py-4">預設密碼</th>
                  <th className="px-6 py-4">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {members
                  .filter(member => {
                    if (!onlyUnpaid) return true;
                    const payment = member.payments?.find(p => p.year === currentYear);
                    return !payment || payment.paid !== 1;
                  })
                  .map(member => (
                    <tr key={member.id} className="text-sm text-zinc-300 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{member.name}</div>
                        <div className="text-xs text-zinc-500">{member.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          member.role === 'admin' ? "bg-purple-500/10 text-purple-500" : "bg-zinc-800 text-zinc-500"
                        )}>
                          {member.role === 'admin' ? '管理員' : '會員'}
                        </span>
                      </td>
                      {years.map(y => {
                        const payment = member.payments?.find(p => p.year === y);
                        const isPaid = payment?.paid === 1;
                        return (
                          <td key={y} className="px-6 py-4 text-center">
                            <button 
                              onClick={() => togglePayment(member.id, y, isPaid)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                isPaid ? "text-orange-500 bg-orange-500/10" : "text-zinc-600 bg-zinc-800"
                              )}
                            >
                              {isPaid ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                        {member.password || '123456'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-orange-500">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                          正常
                        </span>
                      </td>
                    </tr>
                  ))}
                {members.filter(member => {
                  if (!onlyUnpaid) return true;
                  const payment = member.payments?.find(p => p.year === currentYear);
                  return !payment || payment.paid !== 1;
                }).length === 0 && (
                  <tr>
                    <td colSpan={5 + years.length} className="px-6 py-12 text-center text-zinc-600">
                      尚無符合篩選條件的會員資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'songs' && (
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-6">新增曲譜</h2>
          <form onSubmit={handleAddSong} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              placeholder="歌名"
              value={newSong.title}
              onChange={e => setNewSong({...newSong, title: e.target.value})}
              className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white"
            />
            <input 
              placeholder="歌手"
              value={newSong.artist}
              onChange={e => setNewSong({...newSong, artist: e.target.value})}
              className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white"
            />
            <input 
              placeholder="Google Drive 連結"
              value={newSong.lyrics_url}
              onChange={e => setNewSong({...newSong, lyrics_url: e.target.value})}
              className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white"
            />
            <select 
              value={newSong.file_type}
              onChange={e => setNewSong({...newSong, file_type: e.target.value})}
              className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white"
            >
              <option value="PDF">PDF</option>
              <option value="JPG">JPG</option>
              <option value="Word">Word</option>
            </select>
            <select 
              value={newSong.language}
              onChange={e => setNewSong({...newSong, language: e.target.value})}
              className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white"
            >
              <option value="Chinese">國語</option>
              <option value="Taiwanese">台語</option>
              <option value="Cantonese">粵語</option>
              <option value="Japanese">日語</option>
              <option value="English">英語</option>
            </select>
            <button className="md:col-span-2 bg-orange-500 text-white font-bold rounded-xl py-4 hover:bg-orange-600 transition-all">
              新增曲譜
            </button>
          </form>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-6">發佈消息</h2>
          <form onSubmit={handleAddNews} className="space-y-6">
            <input 
              placeholder="標題"
              value={newNews.title}
              onChange={e => setNewNews({...newNews, title: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500"
            />
            <textarea 
              placeholder="內容"
              rows={5}
              value={newNews.content}
              onChange={e => setNewNews({...newNews, content: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500"
            />
            <input 
              placeholder="圖片連結 (選填)"
              value={newNews.image_url}
              onChange={e => setNewNews({...newNews, image_url: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500"
            />
            <input 
              placeholder="Facebook 貼文連結 (選填 - 整合 FB 最新更新)"
              value={newNews.fb_post_url}
              onChange={e => setNewNews({...newNews, fb_post_url: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white hover:border-zinc-600 transition-colors focus:outline-none focus:border-orange-500"
            />
            
            <div className="flex items-center gap-3 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
              <input 
                type="checkbox"
                id="is_member_only"
                checked={newNews.is_member_only}
                onChange={e => setNewNews({...newNews, is_member_only: e.target.checked})}
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
              />
              <label htmlFor="is_member_only" className="text-sm font-bold text-zinc-300 cursor-pointer select-none">
                設為「會員專屬消息 / 通知」（僅登入會員可於會員專區看到此公告，包含早鳥連結與專屬活動）
              </label>
            </div>

            <button className="w-full bg-orange-500 text-white font-bold rounded-xl py-4 hover:bg-orange-600 transition-all">
              發佈消息
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-8">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <History size={24} className="text-orange-500" />
              歷史繳費紀錄彙整
            </h2>
            <p className="text-zinc-500 mb-8 border-b border-zinc-800 pb-4">
              此處顯示 {currentYear - 2} 年以前的所有舊資料。
            </p>
            
            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-800/50 text-zinc-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">會員姓名</th>
                    <th className="px-6 py-4">年份</th>
                    <th className="px-6 py-4">繳費狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {members.some(m => m.payments.some(p => p.year < currentYear - 2)) ? (
                    members.map(member => (
                      member.payments
                        .filter(p => p.year < currentYear - 2)
                        .map(p => (
                          <tr key={`${member.id}-${p.year}`} className="hover:bg-zinc-800/20">
                            <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                            <td className="px-6 py-4">{p.year} 年</td>
                            <td className="px-6 py-4">
                              <span className="text-orange-500/80">已存檔</span>
                            </td>
                          </tr>
                        ))
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-600">
                        目前尚無較早年份的歷史數據
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (user: Member) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login for demo
    const res = await fetch('/api/members');
    const members: Member[] = await res.json();
    const user = members.find(m => m.email.toLowerCase() === email.toLowerCase());
    
    if (user && (user.password === password || (!user.password && password === '123456'))) {
      onLogin(user);
      navigate(user.role === 'admin' ? '/admin' : '/member');
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900 p-10 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="LF Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
              }}
            />
          </div>
          <h1 className="text-3xl font-black text-white">歡迎回來</h1>
          <p className="text-zinc-500 mt-2">請登入您的會員帳號</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400">電子郵件</label>
            <input 
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400">密碼</label>
            <input 
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-xl font-black text-lg hover:bg-orange-600 transition-all">
            登入
          </button>
        </form>
        
        <div className="mt-8 text-center text-zinc-600 text-sm">
          還不是會員？請聯繫管理員建立帳號。
        </div>
      </div>
    </div>
  );
};

const MemberArea = ({ user }: { user: Member | null }) => {
  if (!user) return <div className="p-20 text-center text-white">請先登入</div>;

  const [memberNews, setMemberNews] = useState<NewsItem[]>([]);
  const currentYear = new Date().getFullYear();
  const checkingYears = [currentYear - 2, currentYear - 1, currentYear];

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setMemberNews(data.filter((item: NewsItem) => item.is_member_only === 1));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-orange-500 rounded-2xl text-white">
          <HeartHandshake size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white">會員專區</h1>
          <p className="text-zinc-500">歡迎回來，{user.name}！這裡是您的專屬空間。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Newspaper className="text-orange-500" />
              會員專屬通知
            </h2>
            <div className="space-y-4">
              {memberNews.length > 0 ? (
                memberNews.map((item) => (
                  <div key={item.id} className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                        專屬消息
                      </span>
                      <span className="text-zinc-500 text-xs">{new Date(item.date).toLocaleDateString('zh-TW')}</span>
                    </div>
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-zinc-400 text-sm whitespace-pre-wrap">{item.content}</p>
                    {item.fb_post_url && (
                      <a 
                        href={item.fb_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-bold"
                      >
                        <Facebook size={14} /> 點此連結查看 Facebook 原貼文
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">活動預告</span>
                      <span className="text-zinc-500 text-xs">{currentYear}-03-01</span>
                    </div>
                    <h3 className="text-white font-bold mb-1">春季音樂祭 - 會員優先報名</h3>
                    <p className="text-zinc-400 text-sm">會員可於 3/5 提前兩天領取早鳥優惠票，請留意您的電子郵件。</p>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">社團公告</span>
                      <span className="text-zinc-500 text-xs">{currentYear}-02-25</span>
                    </div>
                    <h3 className="text-white font-bold mb-1">二月份團練時間調整</h3>
                    <p className="text-zinc-400 text-sm">本週六團練因場地維護，改至下週三進行。</p>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Music className="text-orange-500" />
              推薦曲譜
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-xl flex items-center justify-center text-orange-500">
                  <Music size={20} />
                </div>
                <div>
                  <div className="text-white font-bold">海闊天空</div>
                  <div className="text-zinc-500 text-xs">Beyond</div>
                </div>
              </div>
              <div className="p-4 bg-zinc-800 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-xl flex items-center justify-center text-orange-500">
                  <Music size={20} />
                </div>
                <div>
                  <div className="text-white font-bold">愛人錯過</div>
                  <div className="text-zinc-500 text-xs">告五人</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6">會費狀態</h2>
            <div className="space-y-4">
              {checkingYears.map(year => {
                const isPaid = user.payments?.find(p => p.year === year)?.paid === 1;
                return (
                  <div key={year} className="flex items-center justify-between p-3 bg-zinc-800 rounded-xl">
                    <span className="text-zinc-400 font-bold">{year} 年度</span>
                    {isPaid ? (
                      <span className="text-orange-500 flex items-center gap-1 text-sm font-bold">
                        <CheckCircle2 size={16} /> 已繳費
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1 text-sm font-bold">
                        <XCircle size={16} /> 未繳費
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-orange-500 p-8 rounded-3xl text-white">
            <h2 className="text-xl font-black mb-4">專屬權益</h2>
            <ul className="space-y-3 text-sm font-medium opacity-90">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 活動第一手通知</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 早鳥報名連結</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 會員限定聚會</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 曲譜庫完整存取權</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<Member | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: Member) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-500">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs user={user} />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/admin" element={<Admin user={user} />} />
            <Route path="/member" element={<MemberArea user={user} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

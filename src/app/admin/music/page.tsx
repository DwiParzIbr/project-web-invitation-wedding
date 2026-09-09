'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { Music, ArrowLeft, Upload, CheckCircle, Play, Pause, Trash2, Disc, X, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { getAudioDurationFromFile } from '@/utils/nameUtils';

export default function AdminMusicPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [musicTracks, setMusicTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Acoustic');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Delete Modal State
  const [deletingTrack, setDeletingTrack] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Menjamin hanya 1 file audio yang dipilih (single file only)
    const file = files[0];
    setSelectedFile(file);
    if (file && !title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }
  };

  const handleResetSelectedFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('music-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleResetAll = () => {
    handleResetSelectedFile();
    setTitle('');
    setArtist('');
    setGenre('Acoustic');
  };

  // Fetch music tracks on load
  const loadMusicList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/music');
      if (res.ok) {
        const data = await res.json();
        setMusicTracks(data);
      }
    } catch (err) {
      console.error('Failed to load music list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMusicList();
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, []);

  const handlePlayPause = (track: any) => {
    if (playingId === track.id) {
      if (audioObj) {
        audioObj.pause();
      }
      setPlayingId(null);
    } else {
      if (audioObj) {
        audioObj.pause();
      }
      const newAudio = new Audio(track.audioUrl);
      newAudio.play().catch((err) => console.error('Audio play error:', err));
      newAudio.onended = () => setPlayingId(null);
      setAudioObj(newAudio);
      setPlayingId(track.id);
    }
  };

  const handleUploadMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = selectedFile;
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to /api/upload
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) throw new Error('Upload failed');

      const realDuration = await getAudioDurationFromFile(file);

      // 2. Create in DB /api/admin/music
      const dbRes = await fetch('/api/admin/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || file.name.replace(/\.[^/.]+$/, ''),
          artist: artist || 'Admin Collection',
          audioUrl: uploadData.url,
          duration: realDuration,
          genre,
          isRoyaltyFree: true,
        }),
      });

      if (dbRes.ok) {
        const newTrack = await dbRes.json();
        setMusicTracks([newTrack, ...musicTracks]);
        setUploadSuccess(true);
        setTitle('');
        setArtist('');
        setSelectedFile(null);
        const fileInput = document.getElementById('music-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteMusic = async () => {
    if (!deletingTrack) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/music?id=${deletingTrack.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMusicTracks(musicTracks.filter((m) => m.id !== deletingTrack.id));
        setDeletingTrack(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <AdminNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <ScrollReveal direction="down" duration={600}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link href="/admin" className="text-xs text-gold-500 flex items-center gap-1 hover:underline mb-2 font-bold">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Admin Dashboard
              </Link>
              <h1 className={`text-3xl font-bold font-playfair flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Music className="w-7 h-7 text-blue-400" />
                Music Library & Upload Manager ({musicTracks.length})
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Upload file audio MP3 baru ke database platform Weddora untuk dijadikan musik latar undangan client.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Upload Form Box */}
        <ScrollReveal direction="up" delay={150} duration={700}>
          <div className={`p-6 border rounded-3xl space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
          <h2 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Upload className="w-4 h-4 text-gold-500" /> Upload File MP3 Baru ke Database
          </h2>

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>File MP3 berhasil diupload dan disimpan secara permanen ke database!</span>
            </div>
          )}

          <form onSubmit={handleUploadMusic} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Judul Lagu</label>
              <input
                type="text"
                placeholder="misal: Beautiful in White"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Penyanyi / Artis</label>
              <input
                type="text"
                placeholder="misal: Westlife"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Genre Musik</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
              >
                <option value="Acoustic">Acoustic</option>
                <option value="Piano Solo">Piano Solo</option>
                <option value="Romantic Pop">Romantic Pop</option>
                <option value="Islamic Instrument">Islamic Instrument</option>
                <option value="Classical">Classical</option>
                <option value="Traditional Degung">Traditional Degung</option>
                <option value="Traditional Gamelan">Traditional Gamelan</option>
              </select>
            </div>

            <div className="sm:col-span-3 pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Pilih File Audio MP3
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  (Maks. 1 File Audio per Upload)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Hidden native input with single file constraint */}
                <input
                  type="file"
                  id="music-file-input"
                  accept="audio/mp3,audio/*"
                  multiple={false}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Custom Styled Choose File Button */}
                <label
                  htmlFor="music-file-input"
                  className={`px-5 py-3 rounded-2xl border-2 border-dashed font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0 select-none ${
                    selectedFile
                      ? 'bg-gold-500/15 border-gold-500 text-gold-600 dark:text-gold-400 shadow-sm'
                      : isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Music className="w-4 h-4 text-gold-500" />
                  <span>{selectedFile ? 'Ganti File Audio' : 'Pilih File MP3'}</span>
                </label>

                {/* Selected File Name / Placeholder Box with Delete/Reset button */}
                <div className={`flex-1 px-4 py-3 rounded-2xl border flex items-center justify-between min-w-0 transition-all ${
                  selectedFile
                    ? isLight
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedFile ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="truncate text-xs font-mono font-medium">
                      {selectedFile ? selectedFile.name : 'Belum ada file audio yang dipilih (.mp3)'}
                    </span>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[11px] font-mono font-bold opacity-75">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      {/* Tombol Hapus / Batal File Terpilih */}
                      <button
                        type="button"
                        onClick={handleResetSelectedFile}
                        className="px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Hapus / Batal pilih file ini"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Hapus File</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tombol Reset Semua Isian Formulir */}
                {(selectedFile || title || artist) && (
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className={`px-3.5 py-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 shrink-0 active:scale-95 ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                    }`}
                    title="Reset seluruh isian form"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                {/* Upload & Save Button */}
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 ${
                    isUploading || !selectedFile
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                      : 'bg-gold-500 hover:bg-gold-400 text-slate-950 hover:scale-105 shadow-gold-500/20'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Menyimpan...' : 'Simpan Lagu'}</span>
                </button>
              </div>

              {/* Single file guidance hint */}
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono flex items-center gap-1">
                <span>💡</span> Pengunggahan musik diproses satu per satu (single-file) untuk kalkulasi durasi audio yang presisi.
              </p>
            </div>
          </form>
        </div>
        </ScrollReveal>

        {/* Music List Table */}
        <ScrollReveal direction="up" delay={250} duration={800}>
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              <thead className={`uppercase font-semibold text-[10px] tracking-wider border-b ${
                isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Judul Lagu</th>
                  <th className="px-6 py-4">Artis</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Durasi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Memuat koleksi musik dari database...
                    </td>
                  </tr>
                ) : musicTracks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Belum ada lagu terdaftar di database.
                    </td>
                  </tr>
                ) : (
                  musicTracks.map((m) => (
                    <tr key={m.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handlePlayPause(m)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                            playingId === m.id
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                              : 'bg-gold-500/20 text-gold-500 border-gold-500/30 hover:bg-gold-500 hover:text-slate-950'
                          }`}
                          title={playingId === m.id ? 'Pause Preview' : 'Play Preview'}
                        >
                          {playingId === m.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                      </td>
                      <td className={`px-6 py-4 font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <Disc className="w-4 h-4 text-purple-400" />
                        <span>{m.title}</span>
                      </td>
                      <td className="px-6 py-4">{m.artist || '-'}</td>
                      <td className="px-6 py-4 font-semibold text-gold-500">{m.genre || 'Acoustic'}</td>
                      <td className="px-6 py-4 font-mono">{m.duration || '3:30'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeletingTrack(m)}
                          className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                          title="Hapus Lagu dari Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </ScrollReveal>
      </main>

      {/* Modern Animated Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTrack}
        onClose={() => setDeletingTrack(null)}
        onConfirm={confirmDeleteMusic}
        title="Hapus Lagu dari Database"
        itemName={deletingTrack?.title}
        description="Apakah Anda yakin ingin menghapus lagu ini? Lagu yang dihapus tidak akan dapat dipilih lagi sebagai musik latar."
        isLoading={isDeleting}
      />

      <AdminFooter />
    </div>
  );
}

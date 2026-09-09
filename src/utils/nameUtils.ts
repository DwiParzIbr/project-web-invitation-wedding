export const getCleanName = (fullName?: string): string => {
  if (!fullName) return '';
  return String(fullName).trim();
};

export const getInitialLetter = (fullName?: string, fallback: string = 'A'): string => {
  if (!fullName) return fallback;
  const clean = String(fullName)
    .replace(/^(dr\.|drg\.|h\.|hj\.|k\.h\.|ir\.|prof\.|r\.m\.|raden\s+mas|raden\s+ajeng|puti|sutan|i\s+gede|ni\s+luh)\s+/i, '')
    .replace(/,/g, '')
    .trim();
  const firstChar = clean.charAt(0).toUpperCase();
  return (firstChar >= 'A' && firstChar <= 'Z') ? firstChar : fallback;
};

export const formatDurationString = (totalSecs: number): string => {
  if (isNaN(totalSecs) || totalSecs <= 0 || !isFinite(totalSecs)) return '3:30';
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.floor(totalSecs % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const probeAudioDuration = (audioUrl: string): Promise<{ durationStr: string; totalSeconds: number }> => {
  return new Promise((resolve) => {
    if (!audioUrl) {
      resolve({ durationStr: '3:30', totalSeconds: 210 });
      return;
    }

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = audioUrl;

    let isResolved = false;

    const handleLoaded = () => {
      if (isResolved) return;
      const dur = audio.duration;
      if (dur && isFinite(dur) && dur > 0) {
        isResolved = true;
        const secs = Math.floor(dur);
        cleanup();
        resolve({ durationStr: formatDurationString(secs), totalSeconds: secs });
      }
    };

    const handleError = () => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      resolve({ durationStr: '3:30', totalSeconds: 210 });
    };

    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('durationchange', handleLoaded);
      audio.removeEventListener('canplaythrough', handleLoaded);
      audio.removeEventListener('error', handleError);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('durationchange', handleLoaded);
    audio.addEventListener('canplaythrough', handleLoaded);
    audio.addEventListener('error', handleError);

    // Timeout fallback after 2.5 seconds
    setTimeout(() => {
      if (!isResolved) {
        if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
          handleLoaded();
        } else {
          handleError();
        }
      }
    }, 2500);
  });
};

export const getAudioDurationFromFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    probeAudioDuration(objectUrl).then((info) => {
      URL.revokeObjectURL(objectUrl);
      resolve(info.durationStr);
    });
  });
};

export const getDurationInSeconds = (durationStr?: string): number => {
  if (!durationStr) return 210;
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return 210;
};

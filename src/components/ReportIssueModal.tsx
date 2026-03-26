'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Bug, Camera, ImagePlus, Film, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getApiUrl } from '@/lib/api-config';

interface Attachment {
  base64: string;
  type: string;
  name: string;
}

export function ReportIssueModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, isLoggedIn } = useAppStore();
  const [category, setCategory] = useState('bug');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const platform = typeof navigator !== 'undefined'
    ? /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iOS'
      : /Android/.test(navigator.userAgent) ? 'Android' : 'Web'
    : 'Unknown';
  const appVersion = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_VERSION
    ? process.env.NEXT_PUBLIC_APP_VERSION : '1.0.0';
  const userAgent = typeof navigator !== 'undefined'
    ? navigator.userAgent.slice(0, 120) : '';

  const processFile = (file: File): Promise<Attachment | null> => {
    if (file.size > 5 * 1024 * 1024) { setError('File too large (max 5MB)'); return Promise.resolve(null); }
    if (attachments.length >= 5) { setError('Max 5 attachments'); return Promise.resolve(null); }
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve({ base64: reader.result as string, type: file.type, name: file.name });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setError('');
    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (attachments.length + newAttachments.length >= 5) break;
      const a = await processFile(file);
      if (a) newAttachments.push(a);
    }
    if (newAttachments.length) setAttachments(prev => [...prev, ...newAttachments]);
  };

  const openCamera = async () => {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const photo = await Camera.getPicture({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 80,
      });
      if (photo && attachments.length < 5) {
        setAttachments(prev => [...prev, { base64: photo, type: 'image/jpeg', name: 'camera.jpg' }]);
      }
    } catch {
      cameraInputRef.current?.click();
    }
  };

  const handleSubmit = async () => {
    if (description.length < 10 || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/report-issue'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          category,
          attachments: attachments.map(a => a.base64),
          userEmail: isLoggedIn ? user.email : null,
          handle: isLoggedIn ? user.handle : null,
          deviceInfo: { platform, appVersion, userAgent },
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDescription('');
        setAttachments([]);
        onClose();
      }, 2000);
    } catch {
      setError('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Report an Issue</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Report Submitted!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Thanks for helping us improve</p>
          </div>
        ) : (
          <div className="px-5 pb-8 space-y-4">
            {/* Category */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="bug">🐛 Bug</option>
              <option value="crash">💥 Crash</option>
              <option value="suggestion">💡 Suggestion</option>
              <option value="other">❓ Other</option>
            </select>

            {/* Description */}
            <div>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue (min 10 characters)..."
                rows={4}
                className={inputClass + ' resize-none'}
                maxLength={2000}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/2000</p>
            </div>

            {/* Upload buttons */}
            <div className="flex gap-2">
              <button
                onClick={openCamera}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium active:scale-95 transition-transform"
              >
                <Camera className="w-4 h-4" /> Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium active:scale-95 transition-transform"
              >
                <ImagePlus className="w-4 h-4" /> Photos
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium active:scale-95 transition-transform"
              >
                <Film className="w-4 h-4" /> Video
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,video/mp4,video/quicktime" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFiles(e.target.files)} />

            {/* Thumbnails */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((a, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {a.type.startsWith('video') ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-6 h-6 text-gray-400" />
                      </div>
                    ) : (
                      <img src={a.base64} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-gray-400 self-center">{attachments.length}/5</p>
              </div>
            )}

            {/* Device info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p><span className="font-medium">Platform:</span> {platform}</p>
              <p><span className="font-medium">Version:</span> {appVersion}</p>
              <p><span className="font-medium">User:</span> {userAgent}</p>
              {isLoggedIn && user?.email && <p><span className="font-medium">Email:</span> {user.email}</p>}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={description.length < 10 || submitting}
              className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

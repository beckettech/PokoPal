'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getApiUrl } from '@/lib/api-config';
import { Shield, Radio, RefreshCw, BarChart3, Cloud, Gift, ChevronRight, X, Save, Bug, Trash2 } from 'lucide-react';

export function AdminToolbar() {
  const { isAdmin, godMode, user, setGodMode, setAdminConfig, adminConfig } = useAppStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<string | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastHours, setBroadcastHours] = useState('24');
  const [islandsJson, setIslandsJson] = useState('');
  const [giftsJson, setGiftsJson] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [reports, setReports] = useState<any[]>(null);

  if (!isAdmin || !godMode) return null;

  const authHeaders = { Authorization: `Bearer ${user.authToken}` };

  const loadIslands = async () => {
    const res = await fetch(getApiUrl("/api/admin/data/islands"), { headers: authHeaders });
    const data = await res.json();
    setIslandsJson(JSON.stringify(data, null, 2));
    setTab('islands');
  };

  const loadGifts = async () => {
    const res = await fetch(getApiUrl("/api/admin/data/gifts"), { headers: authHeaders });
    const data = await res.json();
    setGiftsJson(JSON.stringify(data, null, 2));
    setTab('gifts');
  };

  const loadStats = async () => {
    const res = await fetch(getApiUrl("/api/admin/stats"), { headers: authHeaders });
    setStats(await res.json());
    setTab('stats');
  };

  const saveBroadcast = async () => {
    setSaving(true);
    try {
      await fetch(getApiUrl("/api/admin/broadcast"), {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMsg || null, expiryHours: broadcastHours ? Number(broadcastHours) : null }),
      });
      setStatus('Broadcast saved!');
      setTimeout(() => setStatus(''), 2000);
    } catch { setStatus('Failed'); }
    setSaving(false);
  };

  const saveJson = async (type: 'islands' | 'gifts') => {
    const json = type === 'islands' ? islandsJson : giftsJson;
    try {
      JSON.parse(json);
    } catch {
      setStatus('Invalid JSON!');
      setTimeout(() => setStatus(''), 2000);
      return;
    }
    setSaving(true);
    try {
      const url = type === 'islands' ? '/api/admin/data/islands' : '/api/admin/data/gifts';
      await fetch(getApiUrl(url), {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: json,
      });
      setStatus(`${type} saved!`);
      setTimeout(() => setStatus(''), 2000);
    } catch { setStatus('Failed'); }
    setSaving(false);
  };

  const forceRefresh = async () => {
    const res = await fetch(getApiUrl("/api/admin/config"), {
      method: "PUT",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ dataVersion: (adminConfig.dataVersion || 0) + 1 }),
    });
    const data = await res.json();
    setAdminConfig(data);
    setStatus('Refresh triggered!');
    setTimeout(() => setStatus(''), 2000);
  };

  const loadReports = async () => {
    const res = await fetch(getApiUrl("/api/admin/reports"), { headers: authHeaders });
    setReports(await res.json());
    setTab('reports');
  };

  const deleteReport = async (id: string) => {
    await fetch(getApiUrl(`/api/admin/reports/${id}`), { method: 'DELETE', headers: authHeaders });
    setReports(prev => prev?.filter((r: any) => r.id !== id) || []);
  };

  const tabs = [
    { id: 'islands', icon: Cloud, label: 'Edit Cloud Islands', action: loadIslands },
    { id: 'gifts', icon: Gift, label: 'Edit Mystery Gifts', action: loadGifts },
    { id: 'broadcast', icon: Radio, label: 'Broadcast Message', action: () => setTab('broadcast') },
    { id: 'refresh', icon: RefreshCw, label: 'Force Refresh', action: forceRefresh },
    { id: 'stats', icon: BarChart3, label: 'View Stats', action: loadStats },
    { id: 'reports', icon: Bug, label: 'View Reports', action: loadReports },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
      >
        {open ? <X className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-36 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" /> Admin Panel
            </h3>
          </div>

          {!tab ? (
            <div className="p-2">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={t.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98] transition-all text-left"
                >
                  <t.icon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{t.label}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>
              ))}
              {status && <p className="text-xs text-center text-green-600 dark:text-green-400 mt-2">{status}</p>}
            </div>
          ) : tab === 'islands' ? (
            <div className="p-3">
              <button onClick={() => setTab(null)} className="text-xs text-purple-600 mb-2 font-medium">← Back</button>
              <textarea value={islandsJson} onChange={e => setIslandsJson(e.target.value)} className="w-full h-48 text-xs font-mono bg-gray-50 dark:bg-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={() => saveJson('islands')} disabled={saving} className="w-full mt-2 py-2 bg-purple-600 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1 active:scale-95">
                <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Islands'}
              </button>
            </div>
          ) : tab === 'gifts' ? (
            <div className="p-3">
              <button onClick={() => setTab(null)} className="text-xs text-purple-600 mb-2 font-medium">← Back</button>
              <textarea value={giftsJson} onChange={e => setGiftsJson(e.target.value)} className="w-full h-48 text-xs font-mono bg-gray-50 dark:bg-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={() => saveJson('gifts')} disabled={saving} className="w-full mt-2 py-2 bg-purple-600 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1 active:scale-95">
                <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Gifts'}
              </button>
            </div>
          ) : tab === 'broadcast' ? (
            <div className="p-3">
              <button onClick={() => setTab(null)} className="text-xs text-purple-600 mb-2 font-medium">← Back</button>
              <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} placeholder="Broadcast message..." className="w-full h-20 text-sm bg-gray-50 dark:bg-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Expires in:</span>
                <input type="number" value={broadcastHours} onChange={e => setBroadcastHours(e.target.value)} className="w-16 text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200" />
                <span className="text-xs text-gray-500">hours</span>
              </div>
              <button onClick={saveBroadcast} disabled={saving} className="w-full mt-2 py-2 bg-orange-500 text-white text-xs font-medium rounded-xl active:scale-95">
                {saving ? 'Saving...' : 'Send Broadcast'}
              </button>
            </div>
          ) : tab === 'stats' ? (
            <div className="p-3">
              <button onClick={() => setTab(null)} className="text-xs text-purple-600 mb-2 font-medium">← Back</button>
              {stats && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Users: <span className="text-purple-600">{stats.totalUsers}</span></p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Admins: <span className="text-purple-600">{stats.adminUsers}</span></p>
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {stats.users?.map((u: any, i: number) => (
                      <div key={i} className="text-xs text-gray-600 dark:text-gray-400 py-1 border-b border-gray-100 dark:border-gray-700">
                        {u.email} ({u.handle}){u.isAdmin ? ' ⭐' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : tab === 'reports' ? (
            <div className="p-3">
              <button onClick={() => setTab(null)} className="text-xs text-purple-600 mb-2 font-medium">← Back</button>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {!reports?.length ? (
                  <p className="text-xs text-gray-500 text-center py-4">No reports yet</p>
                ) : reports.map((r: any) => (
                  <div key={r.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-600 capitalize">{r.category}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">{new Date(r.timestamp).toLocaleDateString()}</span>
                        <button onClick={() => deleteReport(r.id)} className="w-5 h-5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center">
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2">{r.description}</p>
                    {(r.userEmail || r.handle) && (
                      <p className="text-[10px] text-gray-400">{r.userEmail || r.handle}</p>
                    )}
                    {r.attachments?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {r.attachments.slice(0, 3).map((a: string, i: number) => (
                          <img key={i} src={a} alt="" className="w-10 h-10 rounded object-cover" />
                        ))}
                        {r.attachments.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{r.attachments.length - 3}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

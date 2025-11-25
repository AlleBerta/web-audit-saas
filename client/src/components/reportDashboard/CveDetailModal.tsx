import { X, ExternalLink, AlertTriangle, Target, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CveList } from '@/types/scanResult.types';
import { getActiveFlags, getSeverityColor } from '@/lib/severityColorCve';

interface ModalProps {
  cve: CveList;
  onClose: () => void;
}

export function CveDetailModal({ cve, onClose }: ModalProps) {
  const activeFlags = getActiveFlags(cve.flags);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-slate-900">{cve.name}</h3>
              <Badge className={`${getSeverityColor(cve.base_score_v3)} px-3 py-1 text-sm`}>
                CVSS {cve.base_score_v3}
              </Badge>
              {cve.exploit_exist && (
                <Badge variant="destructive" className="animate-pulse">
                  Exploit Available
                </Badge>
              )}
            </div>
            <p className="text-slate-500 font-medium">{cve.title}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-lg border">
            <p>{cve.summary}</p>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Product</p>
                <p className="text-sm font-medium">{cve.product || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Published</p>
                <p className="text-sm font-medium">
                  {new Date(cve.publish_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Flags (Le mostriamo solo se ce ne sono di attive) */}
          {activeFlags.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Vulnerability Class
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeFlags.map((flag) => (
                  <span
                    key={flag}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition"
          >
            Close
          </button>

          {cve.link && (
            <a
              href={cve.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md flex items-center gap-2 transition"
            >
              NVD / Details <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

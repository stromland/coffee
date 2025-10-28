import React, { useState, useEffect } from 'react';
import type { BrewingSession } from '../types/coffee';
import { loadSessions, deleteSession } from '../utils/sessionStorage';
import { getBrewMethod } from '../utils/coffeeCalculations';
import { getPresetById } from '../utils/presetStorage';
import { getCustomPresetById } from '../utils/customRecipeStorage';

interface BrewingHistoryProps {
  onBrewAgain?: (session: BrewingSession) => void;
}

const BrewingHistory: React.FC<BrewingHistoryProps> = ({ onBrewAgain }) => {
  const [sessions, setSessions] = useState<BrewingSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const handleDelete = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      setSessions(loadSessions());
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBrewTime = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMethodName = (methodId: string): string => {
    const method = getBrewMethod(methodId);
    return method?.name || methodId;
  };

  const getPresetName = (presetId?: string): string | undefined => {
    if (!presetId) return undefined;
    const preset = getPresetById(presetId);
    return preset?.name;
  };

  const handleBrewAgain = (session: BrewingSession) => {
    // Check if the preset still exists
    if (session.brewingPreset) {
      const preset = session.brewingMethod === '4-6' 
        ? getPresetById(session.brewingPreset)
        : session.brewingMethod === 'custom-recipe'
        ? getCustomPresetById(session.brewingPreset)
        : undefined;
      
      if (!preset) {
        const confirmMessage = 'The preset used in this session no longer exists. Do you want to brew again without the preset?';
        if (!confirm(confirmMessage)) {
          return;
        }
      }
    }
    
    if (onBrewAgain) {
      onBrewAgain(session);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">Brewing History</h2>
        </div>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-caramel/30 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-caramel/70">No brewing sessions yet</p>
          <p className="text-caramel/50 text-sm mt-2">
            Save your first brewing session to start tracking your coffee journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-coffee rounded-full"></div>
        <h2 className="text-xl font-bold text-cream">Brewing History</h2>
        <span className="ml-auto text-sm text-caramel/70">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-olive-dark/40 rounded-lg overflow-hidden border border-caramel/10 hover:border-coffee/30 transition-all"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-cream text-base">{session.coffeeType}</h3>
                    {session.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < session.rating! ? 'text-coffee' : 'text-caramel/20'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-caramel/70 mb-3">{formatDate(session.timestamp)}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-caramel/60 text-xs">Method</span>
                      <p className="text-cream font-medium">
                        {getMethodName(session.brewingMethod)}
                        {session.brewingPreset && getPresetName(session.brewingPreset) && (
                          <span className="text-caramel/70 text-xs ml-1">({getPresetName(session.brewingPreset)})</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-caramel/60 text-xs">Coffee</span>
                      <p className="text-cream font-medium">{session.coffeeAmount}g</p>
                    </div>
                    <div>
                      <span className="text-caramel/60 text-xs">Water</span>
                      <p className="text-cream font-medium">{session.waterAmount}g</p>
                    </div>
                    {session.waterTemperature && (
                      <div>
                        <span className="text-caramel/60 text-xs">Temp</span>
                        <p className="text-cream font-medium">{session.waterTemperature}°C</p>
                      </div>
                    )}
                    {session.brewTime && (
                      <div>
                        <span className="text-caramel/60 text-xs">Time</span>
                        <p className="text-cream font-medium">{formatBrewTime(session.brewTime)}</p>
                      </div>
                    )}
                    {session.grindSize && (
                      <div>
                        <span className="text-caramel/60 text-xs">Grind</span>
                        <p className="text-cream font-medium">{session.grindSize}</p>
                      </div>
                    )}
                  </div>

                  {session.notes && expandedId === session.id && (
                    <div className="mt-3 p-3 bg-olive/20 rounded-lg">
                      <p className="text-xs text-caramel/60 mb-1">Tasting Notes</p>
                      <p className="text-sm text-cream whitespace-pre-wrap">{session.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {onBrewAgain && (
                    <button
                      onClick={() => handleBrewAgain(session)}
                      className="text-coffee hover:text-cream transition-colors"
                      aria-label="Brew again"
                      title="Brew again with these settings"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                  {session.notes && (
                    <button
                      onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                      className="text-caramel hover:text-cream transition-colors"
                      aria-label={expandedId === session.id ? 'Hide notes' : 'Show notes'}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedId === session.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-caramel/60 hover:text-red-400 transition-colors"
                    aria-label="Delete session"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrewingHistory;

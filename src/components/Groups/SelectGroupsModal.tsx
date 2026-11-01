import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Group } from '../../types/group';
import {
  Users,
  Link as LinkIcon,
  RefreshCw,
  Search,
  Check,
  CheckCircle2,
  X,
  ListPlus,
  Layers,
  ClipboardPaste,
  Copy,
  Globe,
} from 'lucide-react';
import { getDiscoveryProgress } from '../../services/facebook/discovery-manager';
import {
  getFacebookAccount,
  setGroups,
  getAllSavedGroups,
  getAvailableAccountsList,
  mergeAllAccountsIntoActiveList,
  getGroups,
  resetAllGroupSelections,
} from '../../services/storage/chrome-storage';
import { useToast } from '../common/Toast';
import { validateFacebookGroupUrl } from '../../utils/validators';
import { generateId, matchesGroupSearch } from '../../utils/helpers';
import { UpdateModal } from '../common/UpdateModal';
import {
  parseBulkGroupText,
  exportGroupsToJson,
  SAMPLE_10_GROUPS_TEXT,
  SAMPLE_20_GROUPS_TEXT,
} from '../../services/groups/bulk-group-importer';

export interface SelectGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  selectedGroupIds?: string[];
  onConfirm: (selectedGroups: Group[]) => void;
  onSaveGroups?: (updatedGroups: Group[]) => Promise<void>;
  onOpenGroupUrl?: (url: string) => void;
}

export const SelectGroupsModal: React.FC<SelectGroupsModalProps> = ({
  isOpen,
  onClose,
  groups,
  selectedGroupIds: initialSelectedIds = [],
  onConfirm,
  onSaveGroups,
}) => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'my-groups' | 'import-links'>('my-groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [customBatchCount, setCustomBatchCount] = useState<string>('10');
  const [selectedIdsOrder, setSelectedIdsOrder] = useState<string[]>([]);
  const [visibleLimit, setVisibleLimit] = useState<number>(60);
  const hasInitializedSelection = useRef(false);

  useEffect(() => {
    setVisibleLimit(60);
  }, [searchTerm]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [foundCount, setFoundCount] = useState<number>(0);
  const [importText, setImportText] = useState('');
  const [importCategory, setImportCategory] = useState('Imported');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Multi-account management
  const [availableAccounts, setAvailableAccounts] = useState<Array<{ key: string; name: string; count: number }>>([]);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('all');
  const [modalGroups, setModalGroups] = useState<Group[]>(groups);

  // Sync initial groups and accounts when modal opens or groups change
  useEffect(() => {
    if (isOpen) {
      getAvailableAccountsList().then(list => setAvailableAccounts(list));
      getAllSavedGroups().then(all => {
        if (all.length >= groups.length && all.length > 0) {
          setModalGroups(all);
        } else {
          setModalGroups(groups);
        }
      });
    }
  }, [isOpen, groups]);

  // Only initialize selection once when modal opens (never auto-select all groups!)
  useEffect(() => {
    if (isOpen && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true;
      // Only keep initialSelectedIds if it was an explicit small user selection (<= 100)
      if (initialSelectedIds && initialSelectedIds.length > 0 && initialSelectedIds.length <= 100) {
        setSelectedIdsOrder(initialSelectedIds);
      } else {
        setSelectedIdsOrder([]);
      }
    }
    if (!isOpen) {
      hasInitializedSelection.current = false;
    }
  }, [isOpen]);

  const handleAccountFilterChange = async (key: string) => {
    setSelectedAccountFilter(key);
    if (key === 'all') {
      const all = await getAllSavedGroups();
      setModalGroups(all.length >= groups.length ? all : groups);
    } else {
      const accG = await getGroups(key);
      setModalGroups(accG);
    }
  };

  const handleMergeAllAccounts = async () => {
    const res = await mergeAllAccountsIntoActiveList();
    if (onSaveGroups) {
      await onSaveGroups(res.totalGroups);
    }
    setModalGroups(res.totalGroups);
    setSelectedAccountFilter('all');
    toast.success(`🎉 Merged ${res.mergedCount} groups from all accounts!`);
  };

  // Load initial discovery progress & last synced time
  useEffect(() => {
    getDiscoveryProgress().then(dp => {
      if (dp.state === 'DISCOVERING') {
        setIsSyncing(true);
        setFoundCount(dp.foundCount);
      }
      if (dp.lastDiscoveredAt) {
        setLastSyncedAt(dp.lastDiscoveredAt);
      }
    });

    getFacebookAccount().then(acc => {
      if (acc?.lastSyncedAt) {
        setLastSyncedAt(acc.lastSyncedAt);
      }
    });

    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      const listener = (message: any) => {
        if (message?.type === 'GROUP_DISCOVERY_PROGRESS') {
          const payload = message.payload || {};
          setIsSyncing(true);
          setFoundCount(payload.foundCount || 0);
        } else if (message?.type === 'GROUP_BATCH_DISCOVERED') {
          const payload = message.payload || {};
          setFoundCount(payload.verifiedCount || 0);
        }
      };
      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    }
  }, []);

  if (!isOpen) return null;

  // Trigger Facebook Group Discovery
  const handleStartSync = () => {
    setIsSyncing(true);
    setFoundCount(0);

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'START_GROUP_DISCOVERY' }, (response: any) => {
        setIsSyncing(false);
        setLastSyncedAt(Date.now());
        if (chrome.runtime.lastError) {
          toast.error(`Sync error: ${chrome.runtime.lastError.message}`);
        } else if (response?.success) {
          const count = response.progress?.foundCount || response.progress?.groups?.length || 0;
          toast.success(`Successfully synced ${count} Facebook groups!`);
        } else if (response && !response.success) {
          toast.warning(response.error || 'Failed to sync Facebook groups. Please ensure Facebook is open.');
        }
      });
    } else {
      // Mock for development
      setTimeout(() => {
        setIsSyncing(false);
        setLastSyncedAt(Date.now());
        toast.info('Simulated sync complete in browser environment');
      }, 2500);
    }
  };

  const handleCancelSync = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'CANCEL_GROUP_DISCOVERY' });
    }
    setIsSyncing(false);
    toast.info('Sync cancelled');
  };

  // Toggle selection with order preservation
  const handleToggleSelect = (groupId: string) => {
    setSelectedIdsOrder(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredGroups.map(g => g.id);
    setSelectedIdsOrder(prev => {
      const set = new Set(prev);
      allFilteredIds.forEach(id => set.add(id));
      return Array.from(set);
    });
  };

  const handleClearAll = async () => {
    setSelectedIdsOrder([]);
    await resetAllGroupSelections();
    if (onSaveGroups) {
      const unselected = modalGroups.map(g => ({ ...g, selected: false }));
      await onSaveGroups(unselected);
    }
    toast.info('Cleared selection (0 selected)');
  };

  // Quick / custom select batch of groups from current filtered list
  const handleSelectBatch = (count: number, append: boolean = false) => {
    if (isNaN(count) || count <= 0) {
      toast.warning('Please enter a valid number of groups');
      return;
    }
    const num = Math.min(count, filteredGroups.length);
    if (num === 0) {
      toast.warning('No groups match current search');
      return;
    }
    const targetGroups = filteredGroups.slice(0, num);
    const ids = targetGroups.map(g => g.id);

    if (append) {
      setSelectedIdsOrder(prev => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedIdsOrder(ids);
    }
    toast.success(`Selected ${ids.length} groups`);
  };

  // Filter groups
  const filteredGroups = modalGroups.filter(g => matchesGroupSearch(g, searchTerm));

  const selectedCount = selectedIdsOrder.length;

  // Confirm selection
  const handleConfirm = async () => {
    const orderedGroups: Group[] = [];
    selectedIdsOrder.forEach(id => {
      const found = modalGroups.find(g => g.id === id);
      if (found) orderedGroups.push(found);
    });

    // Update 'selected' state in storage if save handler provided
    if (onSaveGroups) {
      const updated = modalGroups.map(g => ({
        ...g,
        selected: selectedIdsOrder.includes(g.id),
      }));
      await onSaveGroups(updated);
    }

    onConfirm(orderedGroups);
    onClose();
  };

  // Save current selection as a named preset
  const handleSaveAsList = async () => {
    if (selectedCount === 0) {
      toast.warning('Please select at least one group first.');
      return;
    }
    const name = window.prompt('Enter a name for this group list preset:', 'My Target Groups');
    if (!name || !name.trim()) return;

    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        const key = 'agp_saved_group_lists';
        chrome.storage.local.get([key], res => {
          const lists = res[key] || [];
          lists.push({
            id: generateId('list'),
            name: name.trim(),
            groupIds: selectedIdsOrder,
            createdAt: Date.now(),
          });
          chrome.storage.local.set({ [key]: lists }, () => {
            toast.success(`Saved list "${name.trim()}" with ${selectedCount} groups!`);
          });
        });
      } else {
        toast.success(`Saved list "${name.trim()}" with ${selectedCount} groups!`);
      }
    } catch {
      toast.success('List saved successfully');
    }
  };

  // Import links handler using robust bulk parser
  const handleImportLinks = async () => {
    if (!importText.trim()) {
      toast.warning('Please enter Facebook group links or JSON.');
      return;
    }

    const summary = parseBulkGroupText(importText, groups, importCategory, 'PUBLIC', true);
    if (summary.groupsToCreate.length === 0 && summary.groupsToUpdate.length === 0) {
      if (summary.duplicateItems.length > 0) {
        toast.info(`All ${summary.duplicateItems.length} group(s) already exist with identical details.`);
      } else {
        toast.warning('No valid Facebook groups or IDs could be found in the pasted text/JSON.');
      }
      return;
    }

    const updated = summary.mergedGroups;
    if (onSaveGroups) {
      await onSaveGroups(updated);
    } else {
      await setGroups(updated);
    }

    // Select all newly created and updated groups
    const affectedIds = [
      ...summary.groupsToCreate.map(g => g.id),
      ...summary.groupsToUpdate.map(g => g.id),
    ];
    setSelectedIdsOrder(prev => [...affectedIds, ...prev.filter(id => !affectedIds.includes(id))]);

    if (summary.groupsToCreate.length > 0 && summary.groupsToUpdate.length > 0) {
      toast.success(`✨ Added ${summary.groupsToCreate.length} new group(s) & updated ${summary.groupsToUpdate.length} existing!`);
    } else if (summary.groupsToCreate.length > 0) {
      toast.success(`✨ Imported and added ${summary.groupsToCreate.length} group(s)!`);
    } else {
      toast.success(`✨ Updated ${summary.groupsToUpdate.length} existing group(s) with new details!`);
    }

    setImportText('');
    setActiveTab('my-groups');
  };

  const formattedLastSynced = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fadeIn p-4">
      {/* Main Select Groups Card - matching reference screenshot layout */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Select Groups
            </h2>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-xs active:scale-95"
              title="GitHub Update & Extension Reload"
            >
              <RefreshCw size={10} className="text-indigo-500" />
              <span>Update</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4">
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'my-groups'
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users size={16} />
            <span>My Groups</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              {modalGroups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('import-links')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'import-links'
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ListPlus size={16} />
            <span>Bulk Add (10/20+)</span>
          </button>
        </div>

        {/* Tab 1: My Groups */}
        {activeTab === 'my-groups' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            
            {/* Joined Groups Stat Banner */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/90 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100/90 dark:border-blue-900/40 rounded-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                  <Users size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 truncate">
                    <span>{modalGroups.length} Facebook Groups Added</span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {formattedLastSynced ? `Last synced: ${formattedLastSynced}` : 'Ready for auto-posting'}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedCount > 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {selectedCount} Selected
                </span>
              </div>
            </div>

            {/* Multi-Account Selector Bar (When groups from other IDs exist) */}
            {availableAccounts.length > 1 && (
              <div className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs gap-2">
                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                  <Globe size={14} className="text-blue-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0">ID:</span>
                  <button
                    type="button"
                    onClick={() => handleAccountFilterChange('all')}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      selectedAccountFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    🌐 All Accounts ({modalGroups.length})
                  </button>
                  {availableAccounts.map(acc => (
                    <button
                      key={acc.key}
                      type="button"
                      onClick={() => handleAccountFilterChange(acc.key)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all truncate max-w-[140px] ${
                        selectedAccountFilter === acc.key
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                      title={acc.name}
                    >
                      👤 {acc.name} ({acc.count})
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleMergeAllAccounts}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm text-[11px] flex-shrink-0"
                  title="Merge groups from all IDs into a single list"
                >
                  <Layers size={12} />
                  <span>Merge All</span>
                </button>
              </div>
            )}

            {/* Sync from Facebook Blue Button */}
            <button
              onClick={isSyncing ? handleCancelSync : handleStartSync}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all ${
                isSyncing
                  ? 'bg-blue-600 hover:bg-blue-700 opacity-90'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync from Facebook'}</span>
            </button>

            {/* Syncing Progress Card */}
            {isSyncing && (
              <div className="space-y-2 animate-fadeIn">
                {/* Notice Box */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  A small Facebook window opened. Keep it visible and don't close it. We'll scroll your groups automatically and close the window when sync finishes.
                </div>

                {/* Progress Bar & Counter */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full animate-pulse w-full" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                    <span>Scanning groups... Found {foundCount} in this scan</span>
                    <span>Total Saved: {modalGroups.length}</span>
                  </div>
                </div>

                <div className="text-left">
                  <button
                    onClick={handleCancelSync}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:underline"
                  >
                    Cancel sync
                  </button>
                </div>
              </div>
            )}

            {/* Last Synced Meta (when not syncing) */}
            {!isSyncing && formattedLastSynced && (
              <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                Last synced: {formattedLastSynced}
              </div>
            )}

            {/* Empty state when 0 groups and not syncing */}
            {modalGroups.length === 0 && !isSyncing ? (
              <div className="py-12 px-4 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Users size={28} />
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No groups synced yet
                </div>
                <div className="text-xs text-slate-400">
                  Click "Sync from Facebook" to start
                </div>
              </div>
            ) : (
              <>
                {/* Search Bar with Clear Button */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search groups by name or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter info & One-Click Selection for Search Results */}
                {searchTerm.trim() && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs animate-fadeIn">
                    <span className="text-blue-700 dark:text-blue-300 font-medium truncate">
                      Found <strong>{filteredGroups.length}</strong> matching groups
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleSelectBatch(filteredGroups.length, false)}
                        className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px] transition-colors"
                        title="Select all matching groups"
                      >
                        Select All ({filteredGroups.length})
                      </button>
                      <button
                        onClick={() => handleSelectBatch(filteredGroups.length, true)}
                        className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded font-bold text-[11px] transition-colors"
                        title="Add matching groups to existing selection"
                      >
                        + Add All
                      </button>
                    </div>
                  </div>
                )}

                {/* Controls Row: Quick Batch & Custom Count Selection */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                      <button onClick={handleSelectAll} className="hover:underline font-bold" title="Select all groups">
                        All
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button onClick={() => handleSelectBatch(5)} className="hover:underline" title="Select first 5 groups">
                        5
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button onClick={() => handleSelectBatch(10)} className="hover:underline" title="Select first 10 groups">
                        10
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button onClick={() => handleSelectBatch(20)} className="hover:underline" title="Select first 20 groups">
                        20
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button onClick={() => handleSelectBatch(50)} className="hover:underline" title="Select first 50 groups">
                        50
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button onClick={handleClearAll} className="hover:underline text-rose-500 dark:text-rose-400 font-medium">
                        Clear
                      </button>
                    </div>

                    <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      Selected {selectedCount}/{filteredGroups.length !== modalGroups.length ? `${filteredGroups.length} (${modalGroups.length} total)` : modalGroups.length}
                    </span>
                  </div>

                  {/* Custom Number Selection Box */}
                  <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/50 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                      <span>Select any:</span>
                      <input
                        type="number"
                        min="1"
                        max={filteredGroups.length || 1}
                        value={customBatchCount}
                        onChange={e => setCustomBatchCount(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const count = parseInt(customBatchCount, 10);
                            if (!isNaN(count)) handleSelectBatch(count, false);
                          }
                        }}
                        placeholder="Qty"
                        className="w-16 px-2 py-0.5 text-center font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-400 text-[11px]">groups</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const count = parseInt(customBatchCount, 10);
                          if (!isNaN(count)) handleSelectBatch(count, false);
                          else toast.warning('Please enter a number');
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
                        title="Select first N groups from current list"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          const count = parseInt(customBatchCount, 10);
                          if (!isNaN(count)) handleSelectBatch(count, true);
                          else toast.warning('Please enter a number');
                        }}
                        className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-xs transition-colors"
                        title="Add first N groups to current selection"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection order becomes posting order note */}
                <div className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Selection order becomes posting order.
                </div>

                {/* Scrollable Groups List */}
                <div
                  onScroll={e => {
                    const el = e.currentTarget;
                    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
                      setVisibleLimit(prev => Math.min(prev + 60, filteredGroups.length));
                    }
                  }}
                  className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60"
                >
                  {filteredGroups.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No groups match "{searchTerm}"
                    </div>
                  ) : (
                    <>
                      {filteredGroups.slice(0, visibleLimit).map(group => {
                        const isSelected = selectedIdsOrder.includes(group.id);
                        const orderIndex = selectedIdsOrder.indexOf(group.id) + 1;

                        return (
                          <div
                            key={group.id}
                            onClick={() => handleToggleSelect(group.id)}
                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50/60 dark:bg-blue-950/30'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            {/* Checkbox */}
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>

                            {/* Group Image */}
                            {group.imageUrl ? (
                              <img
                                src={group.imageUrl}
                                alt={group.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100"
                                onError={e => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs flex-shrink-0">
                                {group.name ? group.name.charAt(0).toUpperCase() : 'G'}
                              </div>
                            )}

                            {/* Group Name & Order Badge */}
                            <div className="flex-1 min-w-0 flex items-center gap-1.5">
                              <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate" title={group.name}>
                                {group.name}
                              </div>
                              {group.verified && (
                                <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                              )}
                            </div>

                            {/* Order Index if selected */}
                            {isSelected && (
                              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                #{orderIndex}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {visibleLimit < filteredGroups.length && (
                        <div className="py-2 text-center text-[10px] text-slate-400 font-medium">
                          Showing {visibleLimit} of {filteredGroups.length} groups (scroll to load more)
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Bulk Add (10/20+) */}
        {activeTab === 'import-links' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {/* Presets Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setImportText(SAMPLE_10_GROUPS_TEXT)}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-all active:scale-95"
                >
                  +10 Groups
                </button>
                <button
                  type="button"
                  onClick={() => setImportText(SAMPLE_20_GROUPS_TEXT)}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 transition-all active:scale-95"
                >
                  +20 Groups
                </button>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text?.trim()) {
                      setImportText(prev => (prev.trim() ? prev + '\n' + text.trim() : text.trim()));
                      toast.success('Pasted from clipboard!');
                    }
                  } catch {
                    toast.error('Could not access clipboard');
                  }
                }}
                className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1"
              >
                <ClipboardPaste size={11} />
                <span>Paste</span>
              </button>

              {groups.length > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    const json = exportGroupsToJson(groups);
                    await navigator.clipboard.writeText(json);
                    toast.success(`Copied JSON of ${groups.length} groups!`);
                  }}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-all flex items-center gap-1 active:scale-95"
                  title="Copy current groups as JSON"
                >
                  <Copy size={11} />
                  <span>Copy JSON</span>
                </button>
              )}
            </div>

            <textarea
              rows={7}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste Facebook group links, or paste JSON code from another device:&#10;https://www.facebook.com/groups/dhakasell/&#10;or [ { &quot;name&quot;: &quot;...&quot;, &quot;url&quot;: &quot;...&quot; } ]"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
            />

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0">Category:</span>
              <input
                type="text"
                value={importCategory}
                onChange={e => setImportCategory(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleImportLinks}
              disabled={!importText.trim()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <ListPlus size={14} />
              <span>Bulk Import Groups</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={handleSaveAsList}
            className="flex-1 py-2.5 px-4 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors"
          >
            Save as List
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Confirm ({selectedCount})
          </button>
        </div>

      </div>

      {/* Extension Update Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};

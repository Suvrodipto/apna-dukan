import React, { useState, useEffect } from 'react';
import type { WorkerProfile, SalaryRecord, FestivalItem, WorkerNotification } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Gift, 
  Clock, 
  Bell, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkerManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'workers' | 'salary' | 'calendar' | 'bonus' | 'notifications'>('overview');
  
  // Database states
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [notifications, setNotifications] = useState<WorkerNotification[]>([]);

  // Search & Filter states
  const [searchWorker, setSearchWorker] = useState('');
  const [workerStatusFilter, setWorkerStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [salaryStatusFilter, setSalaryStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  // Modals
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showPaySalaryModal, setShowPaySalaryModal] = useState<SalaryRecord | null>(null);
  const [payMode, setPayMode] = useState<'Cash' | 'UPI' | 'Bank Transfer'>('UPI');
  const [editingWorker, setEditingWorker] = useState<WorkerProfile | null>(null);

  // New Worker Form
  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wAddress, setWAddress] = useState('');
  const [wRole, setWRole] = useState<'Cashier' | 'Store Helper' | 'Store Manager' | 'Delivery Executive' | 'Accountant'>('Cashier');
  const [wSalary, setWSalary] = useState('18000');

  useEffect(() => {
    loadData();
    return pouchStore.subscribe(loadData);
  }, []);

  const loadData = async () => {
    const w = await pouchStore.getWorkers();
    const s = await pouchStore.getSalaryRecords();
    const f = await pouchStore.getFestivals();
    const n = await pouchStore.getWorkerNotifications();

    setWorkers(w);
    setSalaryRecords(s);
    setFestivals(f);
    setNotifications(n);

    if (f.length > 0 && !selectedFestival) {
      setSelectedFestival(f[0]);
    }
  };

  // Metrics Calculation
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.status === 'Active').length;
  const totalMonthlySalaryExpense = workers.filter(w => w.status === 'Active').reduce((acc, w) => acc + w.monthlySalary, 0);
  const totalFestivalBonusesThisMonth = salaryRecords.reduce((acc, s) => acc + s.festivalBonus, 0);
  const pendingSalariesCount = salaryRecords.filter(s => s.paymentStatus === 'Pending').length;
  const pendingSalariesAmount = salaryRecords.filter(s => s.paymentStatus === 'Pending').reduce((acc, s) => acc + s.totalPayable, 0);

  // Filtered Workers
  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchWorker.toLowerCase()) || w.phone.includes(searchWorker) || w.workerId.toLowerCase().includes(searchWorker.toLowerCase());
    const matchesStatus = workerStatusFilter === 'All' || w.status === workerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Salary Records
  const filteredSalaryRecords = salaryRecords.filter(s => {
    const matchesMonth = s.month === selectedMonth && s.year === selectedYear;
    const matchesStatus = salaryStatusFilter === 'All' || s.paymentStatus === salaryStatusFilter;
    return matchesMonth && matchesStatus;
  });

  // Handle Add / Edit Worker
  const handleSaveWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName || !wPhone) return;

    const workerObj: WorkerProfile = {
      id: editingWorker ? editingWorker.id : `w-${Date.now()}`,
      workerId: editingWorker ? editingWorker.workerId : `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: wName,
      phone: wPhone,
      address: wAddress,
      designation: wRole,
      joiningDate: editingWorker ? editingWorker.joiningDate : new Date().toISOString().split('T')[0],
      monthlySalary: parseFloat(wSalary) || 15000,
      status: editingWorker ? editingWorker.status : 'Active',
      createdAt: editingWorker ? editingWorker.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    await pouchStore.saveWorker(workerObj);

    // Auto-generate salary record for new worker if active
    if (!editingWorker) {
      const newSalary: SalaryRecord = {
        id: `sal-${Date.now()}`,
        workerId: workerObj.id,
        workerName: workerObj.name,
        month: 'August',
        year: 2026,
        baseSalary: workerObj.monthlySalary,
        festivalBonus: Math.round(workerObj.monthlySalary * 0.1), // 10% bonus
        otherBonus: 0,
        deductions: 0,
        totalPayable: Math.round(workerObj.monthlySalary * 1.1),
        paymentStatus: 'Pending'
      };
      await pouchStore.saveSalaryRecord(newSalary);
    }

    setShowAddWorkerModal(false);
    setEditingWorker(null);
    setWName('');
    setWPhone('');
    setWAddress('');
  };

  const handleEditClick = (worker: WorkerProfile) => {
    setEditingWorker(worker);
    setWName(worker.name);
    setWPhone(worker.phone);
    setWAddress(worker.address);
    setWRole(worker.designation);
    setWSalary(worker.monthlySalary.toString());
    setShowAddWorkerModal(true);
  };

  const handleDeleteWorker = async (id: string) => {
    if (confirm('Are you sure you want to delete this worker profile?')) {
      await pouchStore.deleteWorker(id);
    }
  };

  const handleMarkPaidSubmit = async () => {
    if (!showPaySalaryModal) return;
    await pouchStore.markSalaryPaid(showPaySalaryModal.id, payMode);
    setShowPaySalaryModal(null);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const handleToggleBonusSetting = async (festival: FestivalItem) => {
    const updated: FestivalItem = {
      ...festival,
      bonusEnabled: !festival.bonusEnabled
    };
    await pouchStore.saveFestival(updated);
  };

  // Calendar Helpers
  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[calendarDate.getMonth()];
  const currentYearNum = calendarDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Worker Management & Festival Payroll
            <span className="px-2.5 py-0.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
              APNA DUKAN HR Pro
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Employee Directory, Automated Monthly Salary Payroll, Indian Festival Bonus Settings & Smart Reminders
          </p>
        </div>

        <button
          onClick={() => {
            setEditingWorker(null);
            setWName('');
            setWPhone('');
            setWAddress('');
            setShowAddWorkerModal(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD NEW WORKER</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#14141c] p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Total Workers</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{totalWorkers}</div>
        </div>

        <div className="bg-[#14141c] p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Active Staff</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">{activeWorkers}</div>
        </div>

        <div className="bg-[#14141c] p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Monthly Salary</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">₹{totalMonthlySalaryExpense.toLocaleString()}</div>
        </div>

        <div className="bg-[#14141c] p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Festival Bonus</span>
            <Gift className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-xl font-black text-yellow-400 font-mono">₹{totalFestivalBonusesThisMonth.toLocaleString()}</div>
        </div>

        <div className="bg-[#14141c] p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Pending Salary</span>
            <Clock className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400 font-mono">₹{pendingSalariesAmount.toLocaleString()}</div>
        </div>

        <div className="bg-[#14141c] p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Next Festival</span>
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-xs font-black text-amber-300 truncate">🪔 Raksha Bandhan</div>
          <div className="text-[9px] text-slate-500 font-mono">8 Days Away</div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Users },
          { id: 'workers', label: `Workers Directory (${totalWorkers})`, icon: UserCheck },
          { id: 'salary', label: `Salary & Payroll (${pendingSalariesCount} Pending)`, icon: DollarSign },
          { id: 'calendar', label: 'Festival Calendar 🪔', icon: CalendarIcon },
          { id: 'bonus', label: 'Bonus Settings 🎁', icon: Sliders },
          { id: 'notifications', label: `Festival Alerts (${notifications.length})`, icon: Bell }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                  : 'bg-[#14141c] border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB VIEW 1: DASHBOARD OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 bg-[#14141c] rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-sm flex items-center justify-between">
                <span>Recent Salary Transactions & Payroll Status</span>
                <span className="text-xs font-mono text-amber-400 font-bold">{selectedMonth} {selectedYear}</span>
              </h3>

              <div className="space-y-2">
                {salaryRecords.map(sal => (
                  <div key={sal.id} className="p-3 bg-[#0d0d12] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{sal.workerName}</span>
                        {sal.festivalBonus > 0 && (
                          <span className="px-1.5 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono">
                            +₹{sal.festivalBonus} Festival Bonus
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">Base Salary: ₹{sal.baseSalary} • Net Payable: ₹{sal.totalPayable}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <div className="text-sm font-black text-amber-400">₹{sal.totalPayable}</div>
                        <div className="text-[9px] text-slate-500">{sal.paymentDate || 'Due'}</div>
                      </div>

                      {sal.paymentStatus === 'Paid' ? (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-[10px] flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Paid ({sal.paymentMode})
                        </span>
                      ) : (
                        <button
                          onClick={() => setShowPaySalaryModal(sal)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-[10px] shadow"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-[#14141c] rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Upcoming Festival Alerts
              </h3>

              <div className="space-y-2">
                {festivals.slice(0, 3).map(fest => (
                  <div key={fest.id} className="p-3 bg-[#0d0d12] rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{fest.emoji} {fest.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">{fest.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{fest.description}</p>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-slate-500">Configured Bonus:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {fest.bonusType === 'Percentage' ? `${fest.bonusValue}% Salary` : `₹${fest.bonusValue}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 2: WORKERS DIRECTORY */}
      {activeSubTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14141c] p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search worker by name, mobile, or employee ID..."
                value={searchWorker}
                onChange={e => setSearchWorker(e.target.value)}
                className="w-full bg-[#0d0d12] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['All', 'Active', 'Inactive'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setWorkerStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    workerStatusFilter === st
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-[#0d0d12] border-slate-800 text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map(worker => (
              <div key={worker.id} className="p-4 bg-[#14141c] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#181824] text-slate-400 rounded border border-slate-700">
                      {worker.workerId}
                    </span>
                    <h3 className="font-extrabold text-white text-sm mt-1">{worker.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{worker.designation}</p>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                    worker.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {worker.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400 font-mono">
                  <div>Phone: <strong className="text-slate-200">{worker.phone}</strong></div>
                  <div>Address: <span className="text-slate-300">{worker.address}</span></div>
                  <div>Joined: <span className="text-slate-300">{worker.joiningDate}</span></div>
                  <div className="text-sm font-black text-amber-400 pt-1">Monthly Salary: ₹{worker.monthlySalary.toLocaleString()}</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleEditClick(worker)}
                    className="p-1.5 bg-[#181824] hover:bg-slate-800 text-amber-400 rounded-lg border border-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWorker(worker.id)}
                    className="p-1.5 bg-[#181824] hover:bg-rose-500/20 text-rose-400 rounded-lg border border-slate-700 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 3: SALARY & PAYROLL */}
      {activeSubTab === 'salary' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14141c] p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
              >
                {monthNames.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              {(['All', 'Paid', 'Pending'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSalaryStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    salaryStatusFilter === st
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-[#0d0d12] border-slate-800 text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto bg-[#14141c] rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0d0d12] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Worker Name</th>
                  <th className="p-3">Base Salary</th>
                  <th className="p-3">Festival Bonus</th>
                  <th className="p-3">Other Bonus</th>
                  <th className="p-3">Deductions</th>
                  <th className="p-3">Total Payable</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSalaryRecords.map(sal => (
                  <tr key={sal.id} className="hover:bg-[#181824] transition-colors">
                    <td className="p-3 font-bold text-white">{sal.workerName}</td>
                    <td className="p-3 font-mono">₹{sal.baseSalary}</td>
                    <td className="p-3 font-mono text-amber-400">+₹{sal.festivalBonus}</td>
                    <td className="p-3 font-mono text-emerald-400">+₹{sal.otherBonus}</td>
                    <td className="p-3 font-mono text-rose-400">-₹{sal.deductions}</td>
                    <td className="p-3 font-mono font-black text-amber-400 text-sm">₹{sal.totalPayable}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sal.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {sal.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {sal.paymentStatus === 'Pending' ? (
                        <button
                          onClick={() => setShowPaySalaryModal(sal)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[10px]"
                        >
                          Pay Salary
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Paid on {sal.paymentDate}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 4: FESTIVAL CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#14141c] p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                {currentMonthName} {currentYearNum}
              </h3>

              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1.5 rounded-lg bg-[#181822] text-slate-400 hover:text-white border border-slate-800">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="p-1.5 rounded-lg bg-[#181822] text-slate-400 hover:text-white border border-slate-800">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {festivals.map(fest => (
                <div
                  key={fest.id}
                  onClick={() => setSelectedFestival(fest)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedFestival?.id === fest.id
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg scale-[1.01]'
                      : 'bg-[#0d0d12] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{fest.emoji || '🪔'}</span>
                      {fest.name}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-[#181824] text-amber-300 rounded border border-slate-700">
                      {fest.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{fest.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#14141c] p-6 rounded-2xl border border-slate-800 space-y-4">
            {selectedFestival ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xl">
                    {selectedFestival.emoji || '🪔'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">{selectedFestival.name}</h3>
                    <p className="text-xs text-amber-400 font-mono">{selectedFestival.date}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#0d0d12] p-3 rounded-xl border border-slate-800">
                  {selectedFestival.description}
                </p>

                <div className="p-3 bg-[#0d0d12] rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bonus Configured:</span>
                    <span className="font-bold text-emerald-400">
                      {selectedFestival.bonusEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Bonus Calculation:</span>
                    <span className="font-bold text-amber-400">
                      {selectedFestival.bonusType === 'Percentage' ? `${selectedFestival.bonusValue}% of Salary` : `₹${selectedFestival.bonusValue} Fixed`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Eligible Workers:</span>
                    <span className="font-bold text-slate-200">All Active Staff</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleBonusSetting(selectedFestival)}
                  className={`w-full py-2.5 rounded-xl font-black text-xs border transition-all ${
                    selectedFestival.bonusEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-emerald-500 text-slate-950 border-emerald-400'
                  }`}
                >
                  {selectedFestival.bonusEnabled ? 'DISABLE BONUS FOR THIS FESTIVAL' : 'ENABLE FESTIVAL BONUS NOW'}
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-8">Select a festival from calendar to view details.</div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 5: BONUS SETTINGS */}
      {activeSubTab === 'bonus' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#14141c] rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              Configure Festival Bonus Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {festivals.map(fest => (
                <div key={fest.id} className="p-3.5 bg-[#0d0d12] rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{fest.emoji} {fest.name}</span>
                    <button
                      onClick={() => handleToggleBonusSetting(fest)}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                        fest.bonusEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {fest.bonusEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-slate-400">
                    <div>Type: <span className="text-slate-200">{fest.bonusType}</span></div>
                    <div>Value: <span className="text-amber-400 font-bold">{fest.bonusType === 'Percentage' ? `${fest.bonusValue}%` : `₹${fest.bonusValue}`}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 6: NOTIFICATIONS & ALERTS */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div key={notif.id} className="p-4 bg-[#14141c] rounded-2xl border border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <Bell className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{notif.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Scheduled Alert: {notif.scheduledDate}</span>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs">
                  Est. Payout: ₹{notif.estimatedBonusPayout.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Worker Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md bg-[#14141c] border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingWorker ? 'Edit Worker Profile' : 'Add New Worker'}</h3>
              <button onClick={() => setShowAddWorkerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorker} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={wName}
                  onChange={e => setWName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={wPhone}
                  onChange={e => setWPhone(e.target.value)}
                  placeholder="e.g. +91 98765 12345"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Job Designation</label>
                <select
                  value={wRole}
                  onChange={e => setWRole(e.target.value as any)}
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Store Helper">Store Helper</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Delivery Executive">Delivery Executive</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Monthly Salary (₹) *</label>
                <input
                  type="number"
                  required
                  value={wSalary}
                  onChange={e => setWSalary(e.target.value)}
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={wAddress}
                  onChange={e => setWAddress(e.target.value)}
                  placeholder="e.g. Main Mandi Road"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl"
                >
                  Save Worker Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {showPaySalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm bg-[#14141c] border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-xs text-center">
            <h3 className="font-extrabold text-white text-base">Pay Salary to {showPaySalaryModal.workerName}</h3>
            <p className="text-amber-400 font-mono text-lg font-black">Total Payable: ₹{showPaySalaryModal.totalPayable}</p>

            <div className="text-left space-y-2">
              <label className="text-slate-400 font-semibold block">Select Payment Mode</label>
              <select
                value={payMode}
                onChange={e => setPayMode(e.target.value as any)}
                className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="UPI">UPI / PhonePe / GPay</option>
                <option value="Cash">Cash Payment</option>
                <option value="Bank Transfer">Direct Bank Transfer</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleMarkPaidSubmit}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl"
              >
                Confirm Salary Payment
              </button>
              <button
                onClick={() => setShowPaySalaryModal(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

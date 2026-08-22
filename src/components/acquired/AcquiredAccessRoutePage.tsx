import React, { useState } from 'react';
import { AccessRouteEngine } from '../../acquired_modules/access-route';
import type { DeliveryPoint, UserRole } from '../../acquired_modules/access-route/types';
import { 
  Navigation, 
  MapPin, 
  ExternalLink, 
  Check, 
  X, 
  Zap,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcquiredAccessRoutePage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');

  const startHub: DeliveryPoint = {
    id: 'hub',
    name: '🏬 APNA DUKAN Kirana Hub (Central)',
    address: 'Plot 42, KIIT Square, Bhubaneswar',
    lat: 20.3506,
    lng: 85.8178,
    orderValue: 0,
    priority: 'HIGH'
  };

  const deliveryPoints: DeliveryPoint[] = [
    {
      id: 'pt-1',
      name: '🥛 Amul Dairy Depot (Supplier Restock)',
      address: 'Industrial Estate, Mancheswar',
      lat: 20.3200,
      lng: 85.8500,
      orderValue: 4800,
      priority: 'HIGH'
    },
    {
      id: 'pt-2',
      name: '👤 Ramesh Kumar (Udhaar Home Delivery)',
      address: 'Bhimpur, Unit 6',
      lat: 20.2700,
      lng: 85.8200,
      orderValue: 2450,
      priority: 'NORMAL'
    },
    {
      id: 'pt-3',
      name: '📦 Metro Wholesale Trading (Bulk Ration)',
      address: 'Patia Chhak, Infocity',
      lat: 20.3600,
      lng: 85.8100,
      orderValue: 12500,
      priority: 'HIGH'
    },
    {
      id: 'pt-4',
      name: '👤 Sunita Sharma (Festive Hamper Delivery)',
      address: 'Master Canteen Square',
      lat: 20.2600,
      lng: 85.8400,
      orderValue: 5850,
      priority: 'HIGH'
    }
  ];

  const engine = new AccessRouteEngine();
  const routeResult = engine.optimizeDeliveryRoute(startHub, deliveryPoints);
  const permissions = engine.getPermissionsForRole(selectedRole);

  const handleOptimizeRoute = () => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            Acquired Module: AccessRoute Engine
            <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono uppercase">
              M&A Acquired Asset
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Dijkstra / TSP Nearest-Neighbor Route Optimizer & Role-Based Access Control (RBAC) Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Prabh707/AccessRoute"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow cursor-pointer"
          >
            <span>Seller: Prabh707 / AccessRoute</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow">
            Deal Price: ₹4.20 Cr
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Delivery Route Optimizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-[#14141c] rounded-3xl border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                TSP Delivery Route & Fuel Optimizer
              </h3>
              <button
                onClick={handleOptimizeRoute}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 transition-all shadow cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Re-Optimize Route</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Route Distance</span>
                <strong className="text-white text-base font-black">{routeResult.totalDistanceKm} km</strong>
              </div>

              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Transit Time</span>
                <strong className="text-blue-400 text-base font-black">{routeResult.estimatedTimeMins} mins</strong>
              </div>

              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Fuel Cost Savings</span>
                <strong className="text-emerald-400 text-base font-black">₹{routeResult.fuelCostSavingsRs}</strong>
              </div>

              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Route Efficiency</span>
                <strong className="text-amber-400 text-base font-black">{routeResult.efficiencyScorePercent}%</strong>
              </div>
            </div>

            {/* SVG Visual Delivery Map */}
            <div className="p-4 bg-[#0d0d12] rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Interactive Delivery Map Visual (Bhubaneswar Hub Topology)</span>
                <span className="text-emerald-400 font-bold">4 Delivery Waypoints</span>
              </div>

              <div className="relative pt-2">
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 160">
                  {/* Route Polyline */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    points="60,80 160,30 280,120 380,40 460,110"
                  />

                  {/* Hub Node */}
                  <g transform="translate(60,80)">
                    <circle r="12" fill="#10b981" className="animate-ping" />
                    <circle r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="24" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">HUB</text>
                  </g>

                  {/* Waypoint 1 */}
                  <g transform="translate(160,30)">
                    <circle r="8" fill="#3b82f6" />
                    <text x="0" y="-12" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="bold">Pt 1 (Amul)</text>
                  </g>

                  {/* Waypoint 2 */}
                  <g transform="translate(280,120)">
                    <circle r="8" fill="#f59e0b" />
                    <text x="0" y="20" textAnchor="middle" fill="#fcd34d" fontSize="8" fontWeight="bold">Pt 2 (Ramesh)</text>
                  </g>

                  {/* Waypoint 3 */}
                  <g transform="translate(380,40)">
                    <circle r="8" fill="#3b82f6" />
                    <text x="0" y="-12" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="bold">Pt 3 (Metro)</text>
                  </g>

                  {/* Waypoint 4 */}
                  <g transform="translate(460,110)">
                    <circle r="8" fill="#ec4899" />
                    <text x="0" y="20" textAnchor="middle" fill="#fbcfe8" fontSize="8" fontWeight="bold">Pt 4 (Sunita)</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Waypoint Sequence Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase">Optimized Delivery Waypoint Sequence</h4>
              <div className="space-y-2">
                {routeResult.optimizedWaypoints.map((wpt, idx) => (
                  <div key={wpt.id} className="p-3 bg-[#0d0d12] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-black flex items-center justify-center text-xs">
                        {idx === 0 ? 'START' : idx}
                      </span>
                      <div>
                        <strong className="text-white font-bold block">{wpt.name}</strong>
                        <span className="text-[10px] text-slate-400">{wpt.address}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      {wpt.orderValue > 0 && <span className="text-amber-400 font-bold text-xs block">₹{wpt.orderValue.toLocaleString()}</span>}
                      <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                        wpt.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {wpt.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Role-Based Access Control (RBAC) Engine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-[#14141c] rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Role-Based Access Control (RBAC)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                AccessRoute Security
              </span>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-mono mb-2">Switch Active User Role:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['owner', 'cashier', 'supplier', 'delivery'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      selectedRole === role
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-[#0d0d12] hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase">
                Module Permission Matrix ({selectedRole.toUpperCase()})
              </h4>

              <div className="space-y-2">
                {permissions.map((perm, idx) => (
                  <div key={idx} className="p-3 bg-[#0d0d12] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{perm.moduleName}</span>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                        perm.canRead ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 text-rose-400 line-through'
                      }`}>
                        {perm.canRead ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />} Read
                      </span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                        perm.canWrite ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 text-rose-400 line-through'
                      }`}>
                        {perm.canWrite ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />} Write
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

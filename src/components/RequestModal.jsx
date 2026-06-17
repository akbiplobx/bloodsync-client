"use client";

import React from 'react';

const RequestModal = ({ isOpen, onClose, requestData, onApprove, onReject }) => {
  if (!isOpen) return null;

  
  const { userName, email, pickupDate, status } = requestData || {};
  
 
  const currentStatus = (status || 'pending').toLowerCase();
  
  
  const showActionButtons = currentStatus === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 m-4">
        
        {/* Title */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold ">
            Requests Modal
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-semibold">
            &times;
          </button>
        </div>

        {/* Body (User Name, Email, Pickup Date) */}
        <div className="py-6 space-y-5">
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Requested User</p>
            <p className="text-base font-extrabold ">{userName || 'N/A'}</p>
            <p className="text-sm ">{email || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Pickup Date</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{pickupDate || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Status</p>
            <span className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full mt-0.5 ${
              currentStatus === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
              currentStatus === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
            }`}>
              {currentStatus}
            </span>
          </div>
        </div>

        {/* Footer (Buttons) */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {showActionButtons ? (
            <>
              <button onClick={onReject} className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl transition-colors">
                Reject
              </button>
              <button onClick={onApprove} className="px-4 py-2 text-sm font-bold text-white text-red-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md">
                Approve
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 rounded-xl transition-colors">
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default RequestModal;
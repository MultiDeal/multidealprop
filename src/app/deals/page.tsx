{/* Modal Membership Settings */}
{showSettingsModal && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
      <button 
        onClick={() => setShowSettingsModal(false)}
        className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
      >
        ✕
      </button>
      
      <h3 className="text-xl font-black text-white mb-1">Subscription & Account</h3>
      <p className="text-xs text-slate-400 mb-6">
        Your institutional deal-flow membership status.
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Current Plan:</span>
          <strong className={isVip ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
            {isVip ? 'VIP Elite ($49/mo)' : 'Pro Starter ($29/mo)'}
          </strong>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Status:</span>
          <span className="text-emerald-400 font-bold">● Active (30-day recurring)</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Access Key:</span>
          <span className="text-slate-300 font-mono text-[11px]">Saved on this device</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Bouton pour envoyer/copier l'accès pour un autre téléphone ou ordi */}
        <Link
          href="/login"
          className="w-full text-center block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition border border-slate-700"
        >
          📱 Log in on Another Device
        </Link>

        {/* Support facturation */}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=deals@multidealprop.com&su=Subscription%20Billing%20Support"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center block bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs py-2.5 rounded-xl transition border border-slate-800"
        >
          Cancel Subscription / Contact Billing
        </a>
        
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/vip';
          }}
          className="w-full text-center block text-[11px] text-red-400/70 hover:text-red-400 pt-2 transition cursor-pointer"
        >
          Disconnect this device
        </button>
      </div>
    </div>
  </div>
)}

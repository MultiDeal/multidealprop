{/* MODAL POPUP DU GÉNÉRATEUR DE LOI SÉCURISÉ */}
      {showLoiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
                  Non-Binding Letter of Intent (LOI)
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Submit Purchase Offer</h3>
                <p className="text-xs text-slate-400">Target Asset: {deal.streetAddress}, {deal.cityStateZip}</p>
              </div>
              <button
                onClick={() => setShowLoiModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Buyer Entity / Full Name
                </label>
                <input
                  type="text"
                  value={loiBuyerName}
                  onChange={(e) => setLoiBuyerName(e.target.value)}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Proposed Purchase Price ($ USD)
                </label>
                <input
                  type="number"
                  value={loiOfferPrice}
                  onChange={(e) => setLoiOfferPrice(Number(e.target.value))}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Earnest Money Deposit ($ EMD)
                </label>
                <input
                  type="number"
                  value={loiEmd}
                  onChange={(e) => setLoiEmd(Number(e.target.value))}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Inspection Period (Days)
                </label>
                <input
                  type="number"
                  value={loiInspectionDays}
                  onChange={(e) => setLoiInspectionDays(Number(e.target.value))}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Aperçu du document LOI */}
            <div className="space-y-2">
              <label className="block text-[11px] text-slate-400 uppercase font-bold">
                Generated Legal Preview
              </label>
              <pre className="w-full bg-[#070b14] border border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">
                {generateLoiText()}
              </pre>
            </div>

            {/* AVERTISSEMENT LÉGAL ET PROTECTION (DISCLAIMER) */}
            <div className="bg-[#0b192e] border border-slate-800 p-3.5 rounded-xl text-[10px] text-slate-400 leading-relaxed space-y-1">
              <p>
                <strong className="text-slate-200">LEGAL DISCLAIMER:</strong> This Letter of Intent is a non-binding framework for negotiation purposes only. MultiDealProp is not a broker, attorney, or escrow agent. No binding purchase agreement is formed until full contract assignment and earnest money escrow verification.
              </p>
              <Link href="/terms" target="_blank" className="text-sky-400 hover:underline font-semibold block">
                View Full Terms of Service & Legal Disclaimers →
              </Link>
            </div>

            {/* Boutons d'Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadLoi}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl transition border border-slate-700 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                📥 Download Legal LOI (.txt)
              </button>

              <button
                onClick={handleEmailLoi}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-extrabold py-3.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                ✉️ Send LOI Directly to Wholesaler Desk
              </button>
            </div>

          </div>
        </div>
      )}

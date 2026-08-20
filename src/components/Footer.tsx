export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-slate-800 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-500">
          <div>
            <h4 className="font-bold text-slate-300 mb-2">MultiDealProp</h4>
            <p>Plateforme d'analyse et de recherche d'opportunités immobilières aux États-Unis. Nos outils de calcul sont fournis à titre indicatif pour aider à la prise de décision.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 mb-2">Contact</h4>
            <p>support@multidealprop.com</p>
          </div>
        </div>
        
        {/* Disclaimer Financier Important */}
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Financial Disclaimer</h4>
          <p className="text-[10px] text-slate-600 leading-relaxed italic">
            MultiDealProp is not a registered investment advisor, broker-dealer, or financial institution. 
            All investment information provided is for educational and informational purposes only. 
            Real estate investments involve significant risk, including loss of principal. 
            Past performance is not indicative of future results. You should consult with a licensed 
            real estate attorney, tax professional, or financial advisor before making any investment decisions. 
            We do not guarantee the accuracy or completeness of any data provided.
          </p>
        </div>

        <div className="text-center text-[10px] text-slate-600 pt-4 border-t border-slate-800">
          © {new Date().getFullYear()} MultiDealProp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

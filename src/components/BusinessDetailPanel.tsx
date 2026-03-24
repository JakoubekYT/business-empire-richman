import { motion, AnimatePresence } from "framer-motion";
import type { Business } from "../types/game";
import { TaxiPanel } from "./businesses/TaxiPanel";
import { StorePanel } from "./businesses/StorePanel";
import { ConstructionPanel } from "./businesses/ConstructionPanel";
import { DealershipPanel } from "./businesses/DealershipPanel";
import { ITCompanyPanel } from "./businesses/ITCompanyPanel";
import { BankPanel } from "./businesses/BankPanel";
import { FactoryPanel } from "./businesses/FactoryPanel";
import { ShippingPanel } from "./businesses/ShippingPanel";
import { FootballPanel } from "./businesses/FootballPanel";
import { OilGasPanel } from "./businesses/OilGasPanel";
import { ClothingPanel } from "./businesses/ClothingPanel";
import { SpacePanel } from "./businesses/SpacePanel";

interface Props {
  business: Business | null;
  onClose: () => void;
}

export function BusinessDetailPanel({ business, onClose }: Props) {
  if (!business) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pt-12 md:pt-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50 backdrop-blur-md z-10 shrink-0">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
              style={{ backgroundColor: business.color + "20", color: business.color }}
            >
              🏢
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white truncate">{business.name}</h2>
              <p className="text-slate-400 text-sm line-clamp-2 md:line-clamp-1">{business.description}</p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors shrink-0"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
            {business.type === "taxi" && <TaxiPanel business={business} />}
            {business.type === "store" && <StorePanel business={business} />}
            {business.type === "factory" && <FactoryPanel business={business} />}
            {business.type === "shipping" && <ShippingPanel business={business} />}
            {business.type === "construction" && <ConstructionPanel business={business} />}
            {business.type === "car_dealership" && <DealershipPanel business={business} />}
            {business.type === "it_company" && <ITCompanyPanel business={business} />}
            {business.type === "bank" && <BankPanel business={business} />}
            {business.type === "football" && <FootballPanel business={business} />}
            {business.type === "oil_gas" && <OilGasPanel business={business} />}
            {business.type === "clothing" && <ClothingPanel business={business} />}
            {business.type === "space" && <SpacePanel business={business} />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

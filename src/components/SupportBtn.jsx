import React, { useState } from "react";
import { BadgeHelp, Mail, AlertTriangle, Headset } from "lucide-react";
import ReportModal from "./Report/ReportModal";
import { useTranslation } from "react-i18next";

const SupportBtn = () => {

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleOpenReport = () => {
    setReportOpen(true);
    setOpen(false); // close the floating menu
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-[9999]">
        {/* Secondary buttons */}
        {open && (
          <>
            <button
              onClick={handleOpenReport}
              className="
                flex items-center gap-2 
                bg-blue-600 hover:bg-blue-700 
                text-white px-4 py-2 rounded-full 
                shadow-lg shadow-blue-500/30 border border-white/20
                transition-all duration-300 ease-in-out hover:scale-105
              "
            >
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">{t("reportProblem")}</span>
            </button>
          </>
        )}

        {/* Main floating button */}
        <button
          onClick={() => setOpen(!open)}
          className={`
            bg-blue-600 hover:bg-blue-700 text-white 
            p-4 rounded-full shadow-lg shadow-blue-500/30 
            border border-white/20 transition-all duration-300 
            ease-in-out hover:scale-110 focus:outline-none 
            focus:ring-4 focus:ring-blue-300
            ${open ? "rotate-45" : "rotate-0"}
          `}
          aria-label="Support"
        >
          <Headset size={28} strokeWidth={2.3} />
        </button>
      </div>

      {/* Global Report Modal */}
      {reportOpen && (
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          type="system" // ✅ New prop to identify report type
        />
      )}
    </>
  );
};

export default SupportBtn;

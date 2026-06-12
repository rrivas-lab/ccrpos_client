import React, { useState } from 'react';
import { 
  FileText, Users, GitBranch, ShieldCheck, CheckSquare, 
  Database, Server, LayoutDashboard, ChevronRight, ChevronDown, BookOpen 
} from 'lucide-react';

const Sections = [
  "Resumen", "Roles", "Solicitudes", "Aprobadores", "Aprobaciones", 
  "Estados", "Pickings", "Disponibilidad", "Distribución", "Transferencias",
  "Tracking", "Sincronización", "Checklist App", "Checklist Odoo", "Modelos", "Aceptación"
];

export default function AlmacenesGuide() {
  const [activeSection, setActiveSection] = useState(Sections[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Guía Interactiva de Implementación - Módulo Almacenes</h1>
        <p className="text-slate-500 mt-2">Documentación técnica para desarrolladores CCRPOS y Odoo 19.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <nav className="col-span-3">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            {Sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeSection === section ? 'bg-[#FF8200] text-white font-bold' : 'hover:bg-slate-100'}`}
              >
                {section}
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </nav>

        <main className="col-span-9">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <BookOpen className="text-[#FF8200]" />
               {activeSection}
             </h2>
             
             {/* Dynamic content rendering based on activeSection */}
             <div className="prose max-w-none text-slate-700">
                <p>Contenido para: {activeSection}. (Implementar componentes detallados aquí según la guía)</p>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

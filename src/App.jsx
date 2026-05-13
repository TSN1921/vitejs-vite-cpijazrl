import { useState } from "react";

// --- COMPONENTES DE INTERFACE ---
const Card = ({ children, borderLeft }) => (
  <div style={{
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "16px",
    borderLeft: borderLeft || "4px solid transparent",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}>
    {children}
  </div>
);

const FormGroup = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#666", marginLeft: "4px" }}>{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input {...props} style={{
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ced4da",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  }} />
);

const Badge = ({ children, color }) => (
  <span style={{
    background: color,
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase"
  }}>
    {children}
  </span>
);

// --- LÓGICA PRINCIPAL ---
export default function App() {
  const [notas, setNotas] = useState([]);
  const [form, setForm] = useState({ fornecedor: "", valor: "", vencimento: "" });

  const calcularPrazo = (vencimento) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataVenc = new Date(vencimento);
    const diff = dataVenc - hoje;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusInfo = (dias) => {
    if (dias < 0) return { label: "Vencida", color: "#e63946", border: "#e63946" };
    if (dias === 0) return { label: "Vence Hoje", color: "#f4a261", border: "#f4a261" };
    if (dias <= 10) return { label: "Urgente", color: "#e9c46a", border: "#e9c46a" };
    return { label: "Em dia", color: "#2a9d8f", border: "#2a9d8f" };
  };

  const adicionarNota = () => {
    if (!form.fornecedor || !form.valor || !form.vencimento) return;

    const dias = calcularPrazo(form.vencimento);
    const info = getStatusInfo(dias);

    const novaNota = {
      ...form,
      id: Date.now(),
      diasRestantes: dias,
      statusLabel: info.label,
      statusColor: info.color,
      aprovada: dias > 10 // Regra de negócio: aprova automático se for > 10 dias
    };

    setNotas([novaNota, ...notas]);
    setForm({ fornecedor: "", valor: "", vencimento: "" });
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#2d3436", marginBottom: "24px" }}>🚀 Lançamento de Notas</h2>

        {/* Formulário Profissional */}
        <section style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <FormGroup label="FORNECEDOR">
              <Input 
                placeholder="Ex: Google Brasil" 
                value={form.fornecedor} 
                onChange={e => setForm({...form, fornecedor: e.target.value})}
              />
            </FormGroup>
            <FormGroup label="VALOR (R$)">
              <Input 
                type="number" 
                placeholder="0,00" 
                value={form.valor}
                onChange={e => setForm({...form, valor: e.target.value})}
              />
            </FormGroup>
            <FormGroup label="DATA DE VENCIMENTO">
              <Input 
                type="date" 
                value={form.vencimento}
                onChange={e => setForm({...form, vencimento: e.target.value})}
              />
            </FormGroup>
          </div>
          <button 
            onClick={adicionarNota}
            style={{ width: "100%", padding: "14px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            Confirmar Lançamento
          </button>
        </section>

        {/* Lista de Notas */}
        <h3 style={{ color: "#636e72", fontSize: "14px", marginBottom: "16px" }}>LANÇAMENTOS RECENTES</h3>
        {notas.map(nota => (
          <Card key={nota.id} borderLeft={`6px solid ${nota.statusColor}`}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <strong style={{ fontSize: "18px", color: "#2d3436" }}>{nota.fornecedor}</strong>
                <Badge color={nota.statusColor}>{nota.statusLabel}</Badge>
              </div>
              <div style={{ color: "#636e72", fontSize: "14px" }}>
                <span>💰 <strong>R$ {Number(nota.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                <span style={{ marginLeft: "15px" }}>📅 Vencimento: {new Date(nota.vencimento).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#b2bec3" }}>Aprovação</p>
                <strong style={{ color: nota.aprovada ? "#2a9d8f" : "#f4a261" }}>
                   {nota.aprovada ? "SISTEMA (OK)" : "REQUER GESTOR"}
                </strong>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
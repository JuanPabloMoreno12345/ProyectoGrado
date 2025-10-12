/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, xml } from "@odoo/owl";

class Mi90DashboardAction extends Component {
  static template = xml/* xml */`
    <div class="mi90--wrap o-mi90-dashboard-action">
      <div class="eos-dashboard">
        <div class="topbar">
          <div class="filters">
            <span class="pill">FILTROS</span>
            <label>Equipo:</label>
            <select><option>Todos</option><option>Ventas</option><option>Producción</option></select>
          </div>
          <div class="right">
            <label>Intervalo:</label>
            <select><option>Semanal</option><option>Mensual</option></select>
            <label>Semanas:</label>
            <select><option>6 (predeterminado)</option><option>8</option></select>
            <button class="btn">Editar diseño</button>
          </div>
        </div>

        <div class="shell">
          <aside class="sidebar">
            <div class="sb-head">Partner Hub</div>
            <nav class="nav">
              <a href="/eos/dashboard" class="active"><span class="icon">🏠</span><span>Mi 90</span></a>
              <a href="/eos/scorecard"><span class="icon">📊</span><span>Scorecard</span></a>
              <a href="/eos/rocks"><span class="icon">🪨</span><span>Rocas</span></a>
              <a href="/eos/todos"><span class="icon">✅</span><span>To-Dos</span></a>
              <a href="/eos/issues"><span class="icon">⚠️</span><span>Problemas</span></a>
              <a href="/eos/meetings"><span class="icon">🗓️</span><span>Reuniones</span></a>
              <a href="/eos/headlines"><span class="icon">📰</span><span>Titulares</span></a>
              <a href="/eos/vto"><span class="icon">📄</span><span>V/TO®</span></a>
              <a href="/eos/accountability"><span class="icon">👥</span><span>Organigrama de Responsabilidades</span></a>
              <a href="/eos/oneonone"><span class="icon">👤</span><span>1-a-1</span></a>
              <a href="/eos/process"><span class="icon">🧩</span><span>Proceso</span></a>
              <a href="/eos/directory"><span class="icon">📇</span><span>Directorio</span></a>
              <a href="/eos/toolbox"><span class="icon">🧰</span><span>EOS Toolbox™</span></a>
            </nav>
            <div class="sb-foot">
              <nav class="nav">
                <a href="#"><span class="icon">➕</span><span>Invitar compañeros</span></a>
                <a href="#"><span class="icon">💬</span><span>Enviar comentarios</span></a>
                <a href="#"><span class="icon">❓</span><span>Aprendizaje y soporte</span></a>
              </nav>
            </div>
          </aside>
          
          <main class="main">
            <div class="h1">Mi 90</div>

            <section class="card">
              <h3>Scorecard</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th style="width:30%">Título</th><th>Meta</th><th>Promedio</th><th>Total</th>
                    <th>Mar 25 – Mar 31</th><th>Mar 18 – Mar 24</th><th>Mar 11 – Mar 17</th>
                    <th>Mar 04 – Mar 10</th><th>Feb 26 – Mar 03</th><th>Feb 19 – Feb 25</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="kpi-name"><span class="dot red"></span> Conversaciones significativas</td><td class="goal">≥ 25</td><td>16.2</td><td>97</td><td>1</td><td>17</td><td>23</td><td>22</td><td>12</td><td>22</td></tr>
                  <tr><td class="kpi-name"><span class="dot yellow"></span> Conversaciones VTH</td><td class="goal">≥ 1</td><td>1.5</td><td>9</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
                  <tr><td class="kpi-name"><span class="dot yellow"></span> 90 MM programadas</td><td class="goal">≥ 0.5</td><td>0.83</td><td>5</td><td>1</td><td>1</td><td>2</td><td>2</td><td>0</td><td>1</td></tr>
                  <tr><td class="kpi-name"><span class="dot green"></span> Nuevos clientes</td><td class="goal">≥ 0.25</td><td>0.8</td><td>4</td><td>2</td><td>0</td><td>0</td><td>2</td><td>0</td><td>0</td></tr>
                  <tr><td class="kpi-name"><span class="dot green"></span> 90 MM entregadas</td><td class="goal">≥ 0.5</td><td>1</td><td>5</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
                </tbody>
              </table>
            </section>

            <section class="grid three" style="margin-top:1rem">
              <div class="card">
                <h3>Tareas del equipo <span class="badge">3</span></h3>
                <div class="todo"><span>Problema 5</span><span class="badge today">Hoy</span></div>
                <div class="todo"><span>To‑Do #2</span><span class="badge today">Hoy</span></div>
                <div class="todo"><span>To‑Do #4</span><span class="badge today">Hoy</span></div>
              </div>
              <div class="card">
                <h3>Rocas y hitos</h3>
                <div class="todo"><span>✅ Asegurar 3 nuevos clientes</span><span class="badge ok">31 Mar</span></div>
                <div class="todo"><span>👍 Roca #2</span><span class="badge ok">31 Mar</span></div>
              </div>
              <div class="card">
                <h3>Estados de rocas</h3>
                <div class="pie-wrap">
                  <canvas id="rockPie" width="120" height="120"></canvas>
                  <div>
                    <div class="kpi">3</div>
                    <div class="pie-legend">Total</div>
                    <div style="margin-top:.5rem">
                      <div><span style="display:inline-block;width:10px;height:10px;background:#22c55e;border-radius:2px;margin-right:.35rem"></span>1 Completada · 33%</div>
                      <div><span style="display:inline-block;width:10px;height:10px;background:#3b82f6;border-radius:2px;margin-right:.35rem"></span>2 En curso · 67%</div>
                      <div><span style="display:inline-block;width:10px;height:10px;background:#ef4444;border-radius:2px;margin-right:.35rem"></span>0 Fuera de curso · 0%</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <div class="footer-hint">Prototipo estático para tesis · Distribución inspirada en la interfaz solicitada.</div>
          </main>
        </div>
      </div>
    </div>
  `;
}

registry.category("actions").add("mi90_eos.dashboard_action", Mi90DashboardAction);

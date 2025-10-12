/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, onMounted, useRef } from "@odoo/owl";

class Mi90DashboardAction extends Component {
  static template = "mi90_eos.Dashboard";

  setup() {
    this.rootRef = useRef("root");
    
    onMounted(() => {
      setTimeout(() => {
        this.setupNavigation();
      }, 100);
    });
  }

  setupNavigation() {
    const rootEl = this.rootRef.el || this.el;
    if (!rootEl) return;
    
    const navButtons = rootEl.querySelectorAll('.mi90--nav-btn');
    
    navButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover clase active de todos los botones
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        // Obtener la vista seleccionada
        const view = button.dataset.view;
        
        if (view === 'scorecard') {
          // Mostrar solo la card del scorecard expandida
          this.showScorecardView(rootEl);
        } else {
          // Mostrar vista Mi 90 normal
          this.showMi90View(rootEl);
        }
      });
    });
  }

  showScorecardView(rootEl) {
    const grid = rootEl.querySelector('.mi90--grid');
    if (grid) {
      grid.style.gridTemplateColumns = '1fr';
      
      // Ocultar otras cards
      const row = rootEl.querySelector('.mi90--row');
      if (row) {
        row.style.display = 'none';
      }
      
      // Expandir scorecard
      const scorecardCard = rootEl.querySelector('.mi90--scorecard');
      if (scorecardCard) {
        scorecardCard.style.gridColumn = '1';
      }
    }
  }

  showMi90View(rootEl) {
    const grid = rootEl.querySelector('.mi90--grid');
    if (grid) {
      grid.style.gridTemplateColumns = 'repeat(2,1fr)';
      
      // Mostrar todas las cards
      const row = rootEl.querySelector('.mi90--row');
      if (row) {
        row.style.display = 'grid';
      }
      
      // Restaurar scorecard
      const scorecardCard = rootEl.querySelector('.mi90--scorecard');
      if (scorecardCard) {
        scorecardCard.style.gridColumn = 'auto';
      }
    }
  }
}

registry.category("actions").add("mi90_eos.dashboard_action", Mi90DashboardAction);

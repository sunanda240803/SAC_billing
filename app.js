/* ==========================================================================
   SAC BILLING & ENTERPRISE OS - INTERACTIVE ENGINE (app.js)
   Brand Name: SAC Billing
   Modules: Live Charts, Projects, Inventory, Financial Reports Hub
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Nude Palette Sub-Theme Switcher
  const themePills = document.querySelectorAll('.theme-pill');
  themePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const theme = pill.dataset.theme;
      themePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (theme === 'warm-oat') {
        document.documentElement.removeAttribute('data-nude-theme');
        showToast('🎨 SAC Palette: Warm Oat & Champagne');
      } else {
        document.documentElement.setAttribute('data-nude-theme', theme);
        const name = theme === 'rose-silk' ? 'Pale Rose & Silk' : 'Soft Sage & Ivory';
        showToast(`🎨 SAC Palette: ${name}`);
      }
    });
  });

  // 3. SAC LIVE CHARTS INTERACTIVE TOGGLE
  const chartPills = document.querySelectorAll('.chart-pill');
  const chartTotalRev = document.getElementById('chartTotalRev');
  const chartTooltipVal = document.getElementById('chartTooltipVal');
  const chartPath = document.getElementById('chartPathSegment');

  const chartDataMap = {
    '7d': { total: '₹1,84,500', path: 'M 0 160 Q 100 120 200 90 T 400 40 T 600 70 T 800 20', tooltip: '₹42,800 today' },
    '30d': { total: '₹7,48,200', path: 'M 0 170 Q 120 140 240 80 T 480 110 T 720 30 T 800 15', tooltip: '₹1,84,500 peak week' },
    '1y': { total: '₹92,50,000', path: 'M 0 190 Q 150 160 300 100 T 550 50 T 750 20 T 800 5', tooltip: '₹8.4L monthly avg' }
  };

  chartPills.forEach(pill => {
    pill.addEventListener('click', () => {
      chartPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const period = pill.dataset.period;
      const data = chartDataMap[period];

      if (chartTotalRev && data) chartTotalRev.textContent = data.total;
      if (chartTooltipVal && data) chartTooltipVal.textContent = data.tooltip;
      if (chartPath && data) chartPath.setAttribute('d', data.path);

      showToast(`📈 Chart updated to ${period.toUpperCase()} SAC Analytics`);
    });
  });

  // 4. LIVE INVOICE BUILDER LOGIC
  const itemsContainer = document.getElementById('builderItemsContainer');
  const btnAddItem = document.getElementById('btnAddItemRow');
  const subtotalElem = document.getElementById('invSubtotal');
  const cgstElem = document.getElementById('invCgst');
  const sgstElem = document.getElementById('invSgst');
  const grandTotalElem = document.getElementById('invGrandTotal');
  const invoiceNumberInput = document.getElementById('invNumberInput');
  const buyerNameInput = document.getElementById('invBuyerNameInput');

  let itemCounter = 2;

  function calculateInvoiceTotals() {
    let subtotal = 0;
    let totalTax = 0;

    const rows = document.querySelectorAll('.inv-item-row');
    rows.forEach(row => {
      const qtyInput = row.querySelector('.qty-input');
      const rateInput = row.querySelector('.rate-input');
      const taxSelect = row.querySelector('.tax-select');
      const totalValSpan = row.querySelector('.row-total-val');

      const qty = parseFloat(qtyInput.value) || 0;
      const rate = parseFloat(rateInput.value) || 0;
      const taxPct = parseFloat(taxSelect.value) || 0;

      const lineNet = qty * rate;
      const lineTax = lineNet * (taxPct / 100);
      const lineTotal = lineNet + lineTax;

      subtotal += lineNet;
      totalTax += lineTax;

      totalValSpan.textContent = `₹${lineTotal.toFixed(2)}`;
    });

    const halfTax = totalTax / 2;
    if (subtotalElem) subtotalElem.textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (cgstElem) cgstElem.textContent = `₹${halfTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (sgstElem) sgstElem.textContent = `₹${halfTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const grandTotal = subtotal + totalTax;
    if (grandTotalElem) grandTotalElem.textContent = `₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      itemCounter++;
      const tr = document.createElement('tr');
      tr.className = 'inv-item-row';
      tr.innerHTML = `
        <td><input type="text" value="SAC Project Milestone #${itemCounter}" class="item-name-input" /></td>
        <td><input type="number" value="1" min="1" class="qty-input" /></td>
        <td><input type="number" value="2500" step="100" class="rate-input" /></td>
        <td>
          <select class="tax-select">
            <option value="18" selected>18%</option>
            <option value="12">12%</option>
            <option value="5">5%</option>
            <option value="0">0%</option>
          </select>
        </td>
        <td><span class="row-total-val">₹2,950.00</span></td>
        <td><button class="btn-remove-row" title="Remove row">✕</button></td>
      `;
      itemsContainer.appendChild(tr);
      attachRowEvents(tr);
      calculateInvoiceTotals();
      showToast(`✨ SAC Invoice Item #${itemCounter} added`);
    });
  }

  function attachRowEvents(row) {
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', calculateInvoiceTotals);
      input.addEventListener('change', calculateInvoiceTotals);
    });

    const removeBtn = row.querySelector('.btn-remove-row');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.inv-item-row');
        if (rows.length > 1) {
          row.remove();
          calculateInvoiceTotals();
          showToast('🗑️ Item row removed');
        } else {
          showToast('⚠️ At least one item row is required');
        }
      });
    }
  }

  document.querySelectorAll('.inv-item-row').forEach(row => attachRowEvents(row));

  // Mode Pills
  const modePills = document.querySelectorAll('.builder-mode-pills .mode-pill');
  modePills.forEach(pill => {
    pill.addEventListener('click', () => {
      modePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const mode = pill.textContent.trim();
      if (invoiceNumberInput) {
        if (mode.includes('B2B')) invoiceNumberInput.value = 'SAC-INV-2026-089';
        else if (mode.includes('Project')) invoiceNumberInput.value = 'SAC-PRJ-2026-042';
        else invoiceNumberInput.value = 'SAC-EXP-2026-015';
      }
      showToast(`📋 Switched format to SAC ${mode}`);
    });
  });

  // Action Buttons
  const btnPrintInvoice = document.getElementById('btnPrintInvoice');
  if (btnPrintInvoice) {
    btnPrintInvoice.addEventListener('click', () => window.print());
  }

  const badgeSendReminder = document.getElementById('badgeSendReminder');
  if (badgeSendReminder) {
    badgeSendReminder.addEventListener('click', () => {
      showToast('✈️ Payment reminder dispatched to client for $26.00 outstanding!');
    });
  }

  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
  if (btnSendWhatsapp) {
    btnSendWhatsapp.addEventListener('click', () => {
      const client = buyerNameInput ? buyerNameInput.value : 'Client';
      const total = grandTotalElem ? grandTotalElem.textContent : '₹0';
      const invNo = invoiceNumberInput ? invoiceNumberInput.value : 'SAC-INV-101';
      
      const message = `Hello ${client}! Your invoice ${invNo} for amount ${total} has been issued by SAC Billing. View & Pay online: https://sacbilling.com/pay/${invNo}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
      showToast(`📲 Opening SAC WhatsApp dispatch for ${client}`);
    });
  }

  // 5. SAC FINANCIAL REPORTS DOWNLOAD PREVIEW
  const reportBtns = document.querySelectorAll('.btn-download-chip');
  reportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reportName = btn.dataset.report || 'Financial Report';
      showToast(`📥 Downloading SAC ${reportName} (Excel / PDF)...`);
    });
  });

  // 6. REAL-TIME GST & PROFIT CALCULATOR
  const calcCostInput = document.getElementById('calcCost');
  const calcSellInput = document.getElementById('calcSell');
  const calcQtyInput = document.getElementById('calcQty');
  const calcModeBtns = document.querySelectorAll('.calc-mode-btn');
  const slabBtns = document.querySelectorAll('.slab-btn');

  let calcMode = 'exclusive';
  let selectedGstRate = 18;

  function runGstCalculation() {
    const cost = parseFloat(calcCostInput?.value) || 0;
    const sell = parseFloat(calcSellInput?.value) || 0;
    const qty = parseFloat(calcQtyInput?.value) || 1;

    let netAmount = 0;
    let gstAmount = 0;
    let grossTotal = 0;

    const totalSellValue = sell * qty;

    if (calcMode === 'exclusive') {
      netAmount = totalSellValue;
      gstAmount = netAmount * (selectedGstRate / 100);
      grossTotal = netAmount + gstAmount;
    } else {
      grossTotal = totalSellValue;
      netAmount = grossTotal / (1 + selectedGstRate / 100);
      gstAmount = grossTotal - netAmount;
    }

    const totalCostValue = cost * qty;
    const grossProfit = netAmount - totalCostValue;
    const profitMargin = netAmount > 0 ? (grossProfit / netAmount) * 100 : 0;

    const netEl = document.getElementById('resNetVal');
    const cgstEl = document.getElementById('resCgstVal');
    const sgstEl = document.getElementById('resSgstVal');
    const grossEl = document.getElementById('resGrossVal');
    const profitEl = document.getElementById('resProfitVal');
    const marginPctEl = document.getElementById('resMarginPct');
    const marginFillEl = document.getElementById('resMarginFill');

    if (netEl) netEl.textContent = `₹${netAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (cgstEl) cgstEl.textContent = `₹${(gstAmount / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (sgstEl) sgstEl.textContent = `₹${(gstAmount / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (grossEl) grossEl.textContent = `₹${grossTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (profitEl) profitEl.textContent = `₹${grossProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    
    if (marginPctEl) marginPctEl.textContent = `${profitMargin.toFixed(1)}%`;
    if (marginFillEl) {
      marginFillEl.style.width = `${Math.min(Math.max(profitMargin, 0), 100)}%`;
    }
  }

  calcModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcMode = btn.dataset.mode;
      runGstCalculation();
    });
  });

  slabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGstRate = parseFloat(btn.dataset.slab);
      runGstCalculation();
    });
  });

  [calcCostInput, calcSellInput, calcQtyInput].forEach(inp => {
    if (inp) inp.addEventListener('input', runGstCalculation);
  });

  runGstCalculation();

  // 7. FEATURE TABS
  const featureTabBtns = document.querySelectorAll('.features-tabs-nav .tab-btn');
  const featureTabPanels = document.querySelectorAll('.tab-content-panel');

  featureTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      featureTabBtns.forEach(b => b.classList.remove('active'));
      featureTabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // 8. PRICING SLIDERS
  const sliderInvoices = document.getElementById('sliderInvoices');
  const sliderUsers = document.getElementById('sliderUsers');
  const valInvoices = document.getElementById('valInvoices');
  const valUsers = document.getElementById('valUsers');

  const priceStarter = document.getElementById('priceStarter');
  const priceGrowth = document.getElementById('priceGrowth');
  const priceEnterprise = document.getElementById('priceEnterprise');

  const cycleBtns = document.querySelectorAll('.cycle-btn');
  let isYearly = true;

  function updatePricingCalculator() {
    const invoices = parseInt(sliderInvoices?.value || 500);
    const users = parseInt(sliderUsers?.value || 3);

    if (valInvoices) valInvoices.textContent = invoices.toLocaleString();
    if (valUsers) valUsers.textContent = users;

    const discountMultiplier = isYearly ? 0.8 : 1.0;

    const starterBase = Math.round(299 * discountMultiplier);
    const growthBase = Math.round((699 + Math.floor(invoices / 1000) * 150) * discountMultiplier);
    const enterpriseBase = Math.round((1499 + (users - 1) * 100) * discountMultiplier);

    if (priceStarter) priceStarter.textContent = `₹${starterBase}`;
    if (priceGrowth) priceGrowth.textContent = `₹${growthBase}`;
    if (priceEnterprise) priceEnterprise.textContent = `₹${enterpriseBase}`;
  }

  cycleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cycleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      isYearly = btn.dataset.cycle === 'yearly';
      updatePricingCalculator();
      showToast(isYearly ? '🎉 20% Annual SAC Discount Applied' : '📅 Monthly Billing Selected');
    });
  });

  if (sliderInvoices && sliderUsers) {
    sliderInvoices.addEventListener('input', updatePricingCalculator);
    sliderUsers.addEventListener('input', updatePricingCalculator);
    updatePricingCalculator();
  }

  // 9. FAQ SEARCH & ACCORDION
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }

  // 10. TRIAL / DEMO MODAL
  const modalOverlay = document.getElementById('demoModal');
  const openModalBtns = document.querySelectorAll('.btn-open-modal');
  const closeModalBtn = document.getElementById('closeModal');
  const wizardForm = document.getElementById('wizardForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🚀 SAC Billing Account Ready! Opening Workspace...');
      setTimeout(() => {
        if (modalOverlay) modalOverlay.classList.remove('active');
      }, 1500);
    });
  }

  // Toast Helper
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});

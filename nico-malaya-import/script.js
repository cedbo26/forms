(() => {
  const form = document.getElementById("wizardForm");
  const steps = Array.from(document.querySelectorAll(".step"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  const errorBox = document.getElementById("formErrors");
  const wizardCompletedStep = document.getElementById("wizardCompletedStep");

  const stepMeta = [
    { label: "BLOQUANTES" },
    { label: "IMPORTANTES" },
    { label: "À PRÉCISER" },
  ];

  let currentStep = 0;

  const conditionalBlocks = Array.from(document.querySelectorAll(".conditional"));

  const inputByName = (name) => Array.from(form.querySelectorAll(`[name="${name}"]`));

  const isCheckedValue = (name, value) => {
    const inputs = inputByName(name);
    if (!inputs.length) return false;
    if (value === "*") {
      return inputs.some((input) => input.checked);
    }
    if (inputs[0].type === "radio") {
      return inputs.some((input) => input.checked && input.value === value);
    }
    if (inputs[0].type === "checkbox") {
      return inputs.some((input) => input.checked && input.value === value);
    }
    return inputs[0].value === value;
  };

  const toggleConditionalBlocks = () => {
    conditionalBlocks.forEach((block) => {
      const condition = block.dataset.showWhen;
      if (!condition) return;
      const [name, value] = condition.split(":");
      const isVisible = isCheckedValue(name, value);
      block.hidden = !isVisible;
      const fields = block.querySelectorAll("input, select, textarea");
      fields.forEach((field) => {
        if (isVisible) {
          field.disabled = false;
        } else {
          field.disabled = true;
          field.value = "";
          if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false;
          }
        }
      });
    });
  };

  const setProgress = () => {
    const stepNumber = currentStep + 1;
    progressText.textContent = `Étape ${stepNumber}/3 — ${stepMeta[currentStep].label}`;
    progressFill.style.width = `${(stepNumber / 3) * 100}%`;
    wizardCompletedStep.value = String(stepNumber);
    prevBtn.disabled = currentStep === 0;
    nextBtn.hidden = currentStep === steps.length - 1;
    submitBtn.hidden = currentStep !== steps.length - 1;
  };

  const showStep = (index) => {
    steps.forEach((step, idx) => {
      step.hidden = idx !== index;
    });
    currentStep = index;
    toggleConditionalBlocks();
    setProgress();
    errorBox.textContent = "";
  };

  const clearCustomValidity = () => {
    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => field.setCustomValidity(""));
  };

  const groupChecked = (name) => inputByName(name).filter((input) => input.checked);

  const firstInvalidField = (fields) => fields.find((field) => !field.checkValidity());

  const validateStep = (step) => {
    clearCustomValidity();
    toggleConditionalBlocks();
    const errors = [];

    const swissBaseOther = document.getElementById("swiss_base_other");
    if (step.contains(swissBaseOther)) {
      if (isCheckedValue("swiss_base", "autre") && !swissBaseOther.value.trim()) {
        swissBaseOther.setCustomValidity("Merci de préciser la base suisse.");
        errors.push({ field: swissBaseOther, message: "Merci de préciser la base suisse." });
      }
    }

    const productFormatsOther = document.getElementById("product_formats_other");
    if (step.contains(productFormatsOther)) {
      if (isCheckedValue("product_formats[]", "autre") && !productFormatsOther.value.trim()) {
        productFormatsOther.setCustomValidity("Merci de préciser le format autre.");
        errors.push({ field: productFormatsOther, message: "Merci de préciser le format autre." });
      }
    }

    const desiredClaimsOther = document.getElementById("desired_claims_other");
    if (step.contains(desiredClaimsOther)) {
      if (isCheckedValue("desired_claims[]", "autre") && !desiredClaimsOther.value.trim()) {
        desiredClaimsOther.setCustomValidity("Merci de préciser l’allégation autre.");
        errors.push({ field: desiredClaimsOther, message: "Merci de préciser l’allégation autre." });
      }
    }

    const claimsProof = document.getElementById("claims_proof_text");
    if (step.contains(claimsProof)) {
      if (isCheckedValue("desired_claims[]", "*") && !claimsProof.value.trim()) {
        claimsProof.setCustomValidity("Merci de préciser les preuves pour les allégations.");
        errors.push({ field: claimsProof, message: "Merci de préciser les preuves pour les allégations." });
      }
    }

    const productFormats = groupChecked("product_formats[]");
    if (step.querySelector("[name=\"product_formats[]\"]") && productFormats.length === 0) {
      const first = inputByName("product_formats[]")[0];
      if (first) {
        first.setCustomValidity("Sélectionne au moins un format produit.");
        errors.push({ field: first, message: "Sélectionne au moins un format produit." });
      }
    }

    const supplierDocs = groupChecked("supplier_docs[]");
    if (step.querySelector("[name=\"supplier_docs[]\"]") && supplierDocs.length === 0) {
      const first = inputByName("supplier_docs[]")[0];
      if (first) {
        first.setCustomValidity("Sélectionne au moins un document fournisseur.");
        errors.push({ field: first, message: "Sélectionne au moins un document fournisseur." });
      }
    }

    const labelLanguages = groupChecked("label_languages[]");
    const hasFr = labelLanguages.some((input) => input.value === "fr");
    if (step.querySelector("[name=\"label_languages[]\"]") && (labelLanguages.length === 0 || !hasFr)) {
      const first = inputByName("label_languages[]")[0];
      if (first) {
        first.setCustomValidity("La langue FR est obligatoire.");
        errors.push({ field: first, message: "La langue FR est obligatoire." });
      }
    }

    const prospectFields = [
      document.getElementById("prospects_1"),
      document.getElementById("prospects_2"),
      document.getElementById("prospects_3"),
    ];
    if (step.contains(prospectFields[0])) {
      const hasProspect = prospectFields.some((field) => field.value.trim());
      if (!hasProspect) {
        prospectFields[0].setCustomValidity("Renseigne au moins un prospect.");
        errors.push({ field: prospectFields[0], message: "Renseigne au moins un prospect." });
      }
    }

    const fields = Array.from(step.querySelectorAll("input, select, textarea")).filter(
      (field) => !field.disabled
    );
    const invalidField = firstInvalidField(fields);
    if (invalidField) {
      errors.push({ field: invalidField, message: invalidField.validationMessage || "Champ invalide." });
    }

    if (errors.length > 0) {
      const firstError = errors[0];
      errorBox.textContent = firstError.message;
      firstError.field.focus();
      return false;
    }

    errorBox.textContent = "";
    return true;
  };

  const validateAllSteps = () => {
    for (let i = 0; i < steps.length; i += 1) {
      if (!validateStep(steps[i])) {
        showStep(i);
        return false;
      }
    }
    return true;
  };

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    const step = steps[currentStep];
    if (validateStep(step)) {
      showStep(currentStep + 1);
    }
  });

  form.addEventListener("change", () => {
    toggleConditionalBlocks();
  });

  form.addEventListener("submit", (event) => {
    if (!validateAllSteps()) {
      event.preventDefault();
    }
  });

  showStep(0);
})();

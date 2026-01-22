const productsList = document.getElementById("products-list");
const contactsList = document.getElementById("contacts-list");
const productTemplate = document.getElementById("product-template");
const contactTemplate = document.getElementById("contact-template");
const addProductBtn = document.getElementById("add-product");
const addContactBtn = document.getElementById("add-contact");
const form = document.querySelector("form");

const createBlock = (templateEl, index) => {
  const html = templateEl.innerHTML
    .replaceAll("__index__", index)
    .replaceAll("__number__", index + 1);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  return wrapper.firstElementChild;
};

const refreshRemoveButtons = (listEl, selector) => {
  const blocks = Array.from(listEl.children);
  blocks.forEach((block, idx) => {
    const btn = block.querySelector(selector);
    if (btn) {
      btn.style.display = idx === 0 ? "none" : "inline-flex";
    }
  });
};

const reindexBlocks = (listEl, type) => {
  const blocks = Array.from(listEl.children);
  blocks.forEach((block, idx) => {
    block.dataset.index = idx;
    const numberEl = block.querySelector(`.${type}-number`);
    if (numberEl) numberEl.textContent = idx + 1;
    block.querySelectorAll("input, select, textarea").forEach((field) => {
      field.name = field.name.replace(/\[(\d+)\]/, `[${idx}]`);
    });
  });
  refreshRemoveButtons(listEl, `.remove-${type}`);
};

const addProduct = () => {
  const index = productsList.children.length;
  const node = createBlock(productTemplate, index);
  productsList.appendChild(node);
  refreshRemoveButtons(productsList, ".remove-product");
};

const addContact = () => {
  const index = contactsList.children.length;
  const node = createBlock(contactTemplate, index);
  contactsList.appendChild(node);
  refreshRemoveButtons(contactsList, ".remove-contact");
};

productsList.addEventListener("click", (event) => {
  const btn = event.target.closest(".remove-product");
  if (!btn) return;
  const block = btn.closest(".product");
  if (block) {
    block.remove();
    reindexBlocks(productsList, "product");
  }
});

contactsList.addEventListener("click", (event) => {
  const btn = event.target.closest(".remove-contact");
  if (!btn) return;
  const block = btn.closest(".contact");
  if (block) {
    block.remove();
    reindexBlocks(contactsList, "contact");
  }
});

addProductBtn.addEventListener("click", addProduct);
addContactBtn.addEventListener("click", addContact);

form.addEventListener("submit", (event) => {
  if (productsList.children.length === 0) {
    event.preventDefault();
    alert("Ajoute au moins un produit avant d'envoyer.");
  }
});

addProduct();
addContact();

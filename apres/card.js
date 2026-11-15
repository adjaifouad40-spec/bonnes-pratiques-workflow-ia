/* =========================================================
   Composant réutilisable : Card(title, price, features)
   ---------------------------------------------------------
   Usage minimal :
     const card = Card("Basic Plan", 9.99, ["1 GB Storage"]);
     document.querySelector("#cards").append(card);

   Usage complet (4e paramètre = options) :
     Card("Pro Plan", 19.99, ["10 GB Storage"], {
       currency: "$", period: "/month",
       buttonText: "Start Trial", highlighted: true, badge: "Populaire",
       onSelect: (plan) => console.log(plan.title)
     });
   ========================================================= */

/**
 * Crée une carte de prix et renvoie l'élément <article>.
 * Le contenu est inséré avec textContent (jamais innerHTML) :
 * aucun risque d'injection de HTML si les données viennent d'ailleurs.
 *
 * @param {string}   title     Nom de l'offre
 * @param {number}   price     Prix (nombre)
 * @param {string[]} features  Liste des avantages
 * @param {object}   [options]
 * @returns {HTMLElement}
 */
function Card(title, price, features = [], options = {}) {
  // Garde-fous : on refuse les données invalides dès le départ
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("Card : le titre est obligatoire.");
  }
  if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
    throw new Error("Card : le prix doit être un nombre positif.");
  }
  if (!Array.isArray(features)) {
    features = [];
  }

  const {
    currency = "$",
    period = "/month",
    buttonText = "Start Trial",
    highlighted = false,
    badge = "",
    onSelect = defaultSelect,
  } = options;

  // <article> : une carte est un contenu autonome (sémantique)
  const card = document.createElement("article");
  card.className = "pricing-card";
  if (highlighted) card.classList.add("pricing-card--highlighted");

  if (badge) {
    card.append(createElement("p", "pricing-card__badge", badge));
  }

  // Bug 1 corrigé : le titre est un <h2> correctement fermé
  const heading = createElement("h2", "pricing-card__title", title);
  const headingId = `plan-${slugify(title)}`;
  heading.id = headingId;
  card.setAttribute("aria-labelledby", headingId);
  card.append(heading);

  // Prix : montant mis en valeur + période
  const priceEl = createElement("p", "pricing-card__price");
  priceEl.append(
    createElement("span", "pricing-card__amount", `${currency}${price.toFixed(2)}`),
    createElement("span", "pricing-card__period", ` ${period}`)
  );
  card.append(priceEl);

  // Liste des avantages
  const list = createElement("ul", "pricing-card__features");
  features.forEach((feature) => list.append(createElement("li", "", feature)));
  card.append(list);

  // Bug 5 corrigé : le bouton a un type et un gestionnaire de clic
  const button = createElement("button", "btn", buttonText);
  button.type = "button";
  button.setAttribute("aria-label", `${buttonText} – ${title}`);
  button.addEventListener("click", () => {
    onSelect({ title, price, features }, button);
  });
  card.append(button);

  return card;
}

/** Petit utilitaire : crée un élément avec une classe et un texte. */
function createElement(tag, className = "", text = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

/** "Basic Plan" → "basic-plan" (pour un id unique et lisible) */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Comportement par défaut du bouton : confirmation visuelle. */
function defaultSelect(plan, button) {
  button.textContent = "Essai activé ✓";
  button.disabled = true;
  console.log(`Offre choisie : ${plan.title} (${plan.price})`);
}

/**
 * Affiche plusieurs cartes d'un coup dans un conteneur.
 * @param {string|HTMLElement} container  sélecteur CSS ou élément
 * @param {Array<object>} plans  [{ title, price, features, ...options }]
 */
function renderCards(container, plans) {
  const target = typeof container === "string" ? document.querySelector(container) : container;
  if (!target) {
    console.warn("renderCards : conteneur introuvable.");
    return [];
  }
  const cards = plans.map(({ title, price, features, ...options }) =>
    Card(title, price, features, options)
  );
  target.append(...cards);
  return cards;
}

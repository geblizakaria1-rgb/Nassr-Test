// ---- Séances (modifie les dates ici) ----
const SESSIONS = [
  { id: "s1", label: "Samedi 15 novembre",   time: "10h00 – 12h00", cat: "8 à 12 ans",         taken: 21 },
  { id: "s2", label: "Dimanche 16 novembre", time: "10h00 – 12h00", cat: "13 à 21 ans",        taken: 27 },
  { id: "s3", label: "Samedi 22 novembre",   time: "15h00 – 17h00", cat: "Toutes catégories",  taken: 9 }
];
const CAP = 30; // places max par séance

const $ = id => document.getElementById(id);
const wrap = $("sessions");
const sel = $("date");

// Affiche les cartes de séances + la liste déroulante
function render() {
  wrap.innerHTML = "";
  sel.innerHTML = "";
  SESSIONS.forEach(s => {
    const left = CAP - s.taken;

    const d = document.createElement("div");
    d.className = "sess";
    d.innerHTML =
      `<b>${s.label}</b>
       <small>${s.time} · ${s.cat}</small>
       <div class="spots"><span style="width:${s.taken / CAP * 100}%"></span></div>
       <div class="left">${left > 0 ? left + " places restantes" : "Complet"}</div>`;
    wrap.appendChild(d);

    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = `${s.label} (${s.cat})` + (left <= 0 ? " – complet" : "");
    o.disabled = left <= 0;
    sel.appendChild(o);
  });
}
render();

// Affiche ou efface un message d'erreur sous un champ
function setErr(id, msg) {
  document.querySelector(`[data-for="${id}"]`).textContent = msg;
  return !msg;
}

// Vérifie tous les champs
function validate() {
  let ok = true;

  ["prenom", "nom", "parent"].forEach(id => {
    ok = setErr(id, $(id).value.trim().length < 2 ? "Ce champ est obligatoire." : "") && ok;
  });

  const tel = $("tel").value.replace(/[\s.-]/g, "");
  ok = setErr("tel",
    /^(\+212|0)[5-7]\d{8}$/.test(tel)
      ? ""
      : "Entre un numéro marocain valide, par exemple 06 12 34 56 78.") && ok;

  const dn = $("naiss").value;
  let msg = "";
  if (!dn) {
    msg = "Choisis la date de naissance.";
  } else {
    const age = (Date.now() - new Date(dn)) / 31557600000;
    if (age < 8 || age >= 22) msg = "Le test est ouvert aux joueurs de 8 à 21 ans.";
  }
  ok = setErr("naiss", msg) && ok;

  return ok;
}

// Envoi du formulaire
$("form").addEventListener("submit", e => {
  e.preventDefault();
  if (!validate()) return;

  const s = SESSIONS.find(x => x.id === sel.value);
  if (!s || s.taken >= CAP) return;
  s.taken++;

  const ref = "NSR-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  const pay = document.querySelector('input[name="pay"]:checked').value;

  $("okmsg").textContent =
    `${$("prenom").value.trim()} est inscrit(e) à la séance du ${s.label.toLowerCase()}, ${s.time}. ` +
    `Paiement : ${pay.toLowerCase()}, 100 DH.`;
  $("ref").textContent = ref;

  $("form").style.display = "none";
  $("ok").style.display = "block";
  $("ok").focus();
  render();

  // TODO : envoyer les données à ton serveur ici
  // (fetch vers ton API, Google Sheets, ou lien WhatsApp).
});
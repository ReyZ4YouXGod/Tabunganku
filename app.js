let transactions = JSON.parse(localStorage.getItem("rey_money")) || [];
let target = JSON.parse(localStorage.getItem("rey_target")) || null;

const el = (id) => document.getElementById(id);

function formatRupiah(num){
return new Intl.NumberFormat("id-ID",{
style:"currency",
currency:"IDR"
}).format(num);
}

function save(){
localStorage.setItem("rey_money", JSON.stringify(transactions));
}

function saveTarget(){
localStorage.setItem("rey_target", JSON.stringify(target));
}

function showToast(msg){
const toast = document.createElement("div");
toast.className = "toast";
toast.innerText = msg;
el("toast").appendChild(toast);

setTimeout(()=>toast.remove(),3000);
}

/* ADD TRANSACTION */
function addTransaction(e){
e.preventDefault();

const note = el("note").value;
const amount = parseFloat(el("amount").value);
const type = el("type").value;
const category = el("category").value;

if(!note || !amount){
showToast("Isi dulu yang bener");
return;
}

transactions.push({
id:Date.now(),
note,
amount,
type,
category,
date:new Date().toISOString()
});

save();
render();
showToast("Transaksi ditambahkan");

el("transactionForm").reset();
}

/* DELETE */
function deleteTransaction(id){
transactions = transactions.filter(t => t.id !== id);
save();
render();
showToast("Dihapus");
}

/* FILTER */
function getFiltered(){
const search = el("searchInput")?.value?.toLowerCase() || "";
const type = el("filterType")?.value || "all";
const category = el("filterCategory")?.value || "all";

return transactions.filter(t=>{
const matchSearch = t.note.toLowerCase().includes(search);
const matchType = type === "all" || t.type === type;
const matchCat = category === "all" || t.category === category;

return matchSearch && matchType && matchCat;
});
}

/* CALCULATE */
function calculate(){
let income = 0;
let expense = 0;

transactions.forEach(t=>{
if(t.type === "income") income += t.amount;
else expense += t.amount;
});

return {income, expense, balance:income-expense};
}

/* RENDER */
function render(){

const list = el("transactionList");
list.innerHTML = "";

const data = getFiltered();
const calc = calculate();

el("incomeTotal").innerText = formatRupiah(calc.income);
el("expenseTotal").innerText = formatRupiah(calc.expense);
el("balance").innerText = formatRupiah(calc.balance);

data.slice().reverse().forEach(t=>{

const div = document.createElement("div");
div.className = "transaction-item";

div.innerHTML = `
<div>
<strong>${t.note}</strong><br>
<small>${t.category}</small>
</div>

<div style="text-align:right">
<div class="${t.type}">
${t.type === "income" ? "+" : "-"}
${formatRupiah(t.amount)}
</div>

<button onclick="deleteTransaction(${t.id})">
Hapus
</button>
</div>
`;

list.appendChild(div);

});

/* stats */
el("statTransactions").innerText = transactions.length;
el("statIncome").innerText = formatRupiah(calc.income);
el("statExpense").innerText = formatRupiah(calc.expense);
el("statSaving").innerText = formatRupiah(calc.balance);

/* target */
updateTarget(calc.balance);
}

/* TARGET */
function updateTarget(balance){

if(!target){
el("targetTitle").innerText = "Belum Ada Target";
el("targetText").innerText = "0%";
el("progressFill").style.width = "0%";
return;
}

const percent = Math.min((balance / target.amount) * 100, 100);

el("targetTitle").innerText = target.name;
el("targetText").innerText = percent.toFixed(1) + "%";
el("progressFill").style.width = percent + "%";
}

/* TARGET SAVE */
function setTarget(){
const name = el("targetName").value;
const amount = parseFloat(el("targetAmount").value);

if(!name || !amount){
showToast("Isi target dulu");
return;
}

target = {name, amount};
saveTarget();
render();
showToast("Target disimpan");
}

/* EVENTS */
document.getElementById("transactionForm")
.addEventListener("submit", addTransaction);

document.getElementById("saveTarget")
.addEventListener("click", setTarget);

document.getElementById("searchInput")
.addEventListener("input", render);

document.getElementById("filterType")
.addEventListener("change", render);

document.getElementById("filterCategory")
.addEventListener("change", render);

/* INIT */
render();

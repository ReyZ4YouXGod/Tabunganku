let transactions = JSON.parse(localStorage.getItem("rey_money")) || [];
let target = JSON.parse(localStorage.getItem("rey_target")) || null;

let financeChart;
let balanceChart;

/* ======================
SAFE INIT (INI PENTING)
====================== */

window.addEventListener("DOMContentLoaded",()=>{

initTheme();
bindEvents();
render();

});

/* ======================
THEME
====================== */

const themes = ["dark","light","neon"];
let currentTheme = localStorage.getItem("theme") || "dark";

function initTheme(){
document.body.setAttribute("data-theme", currentTheme);

const btn = document.getElementById("themeToggle");
if(btn){
btn.onclick = ()=>{
let index = themes.indexOf(currentTheme);
index = (index + 1) % themes.length;

currentTheme = themes[index];

document.body.setAttribute("data-theme", currentTheme);
localStorage.setItem("theme", currentTheme);

toast("Theme: " + currentTheme);
};
}
}

/* ======================
UTIL
====================== */

function formatRupiah(num){
return new Intl.NumberFormat("id-ID",{
style:"currency",
currency:"IDR"
}).format(num || 0);
}

function save(){
localStorage.setItem("rey_money", JSON.stringify(transactions));
}

function saveTarget(){
localStorage.setItem("rey_target", JSON.stringify(target));
}

function toast(msg){

const box = document.getElementById("toast");
if(!box) return;

const t = document.createElement("div");
t.className = "toast";
t.innerText = msg;

box.appendChild(t);

setTimeout(()=>t.remove(),3000);
}

/* ======================
MODAL
====================== */

function openModal(){
const m = document.getElementById("modalOverlay");
if(m) m.classList.remove("hidden");
}

function closeModal(){
const m = document.getElementById("modalOverlay");
if(m) m.classList.add("hidden");
}

function deleteTarget(){
openModal();
}

/* ======================
EVENT BINDING AMAN
====================== */

function bindEvents(){

const form = document.getElementById("transactionForm");
if(form){
form.addEventListener("submit",(e)=>{
e.preventDefault();

const note = document.getElementById("note");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");

if(!note || !amount || !type || !category){
toast("Form tidak lengkap");
return;
}

const n = note.value.trim();
const a = parseFloat(amount.value);

if(!n || isNaN(a) || a <= 0){
toast("Isi data dengan benar");
return;
}

const now = new Date();

transactions.push({
id: Date.now(),
note: n,
amount: a,
type: type.value,
category: category.value,
date: now.toISOString(),
time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
fullDate: now.toLocaleDateString("id-ID", {
day: "2-digit",
month: "short",
year: "numeric"
})
});

save();
render();
toast("Transaksi ditambahkan");

form.reset();
});
}

/* modal buttons */
const cancel = document.getElementById("cancelModal");
if(cancel){
cancel.onclick = ()=>{
closeModal();
toast("Dibatalkan");
};
}

const confirm = document.getElementById("confirmModal");
if(confirm){
confirm.onclick = ()=>{
target = null;
localStorage.removeItem("rey_target");
saveTarget();
closeModal();
render();
toast("Target dihapus");
};
}

/* save target */
const saveBtn = document.getElementById("saveTarget");
if(saveBtn){
saveBtn.onclick = ()=>{

const name = document.getElementById("targetName");
const amount = document.getElementById("targetAmount");

if(!name || !amount){
toast("Input tidak lengkap");
return;
}

if(!name.value || !amount.value){
toast("Target belum lengkap");
return;
}

target = {
name:name.value,
amount:parseFloat(amount.value)
};

saveTarget();
render();
toast("Target disimpan");
};
}

/* filters */
const search = document.getElementById("searchInput");
const type = document.getElementById("filterType");
const cat = document.getElementById("filterCategory");

if(search) search.addEventListener("input",render);
if(type) type.addEventListener("change",render);
if(cat) cat.addEventListener("change",render);

}

/* ======================
DELETE TRANSAKSI
====================== */

function deleteTx(id){
transactions = transactions.filter(t=>t.id !== id);
save();
render();
}

/* ======================
FILTER
====================== */

function getFiltered(){

const search = document.getElementById("searchInput");
const q = search ? search.value.toLowerCase() : "";

const type = document.getElementById("filterType");
const category = document.getElementById("filterCategory");

return transactions.filter(t=>{

const matchSearch = t.note.toLowerCase().includes(q);
const matchType = !type || type.value === "all" || t.type === type.value;
const matchCat = !category || category.value === "all" || t.category === category.value;

return matchSearch && matchType && matchCat;
});
}

/* ======================
CALC
====================== */

function calc(){

let income=0, expense=0;

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount;
else expense+=t.amount;
});

return {
income,
expense,
balance:income-expense
};
}

/* ======================
RENDER
====================== */

function render(){

const data = getFiltered();
const c = calc();

/* top */
setText("incomeTotal",formatRupiah(c.income));
setText("expenseTotal",formatRupiah(c.expense));
setText("balance",formatRupiah(c.balance));

/* list */
const list = document.getElementById("transactionList");
if(list){
list.innerHTML = "";

data.slice().reverse().forEach(t=>{

const div = document.createElement("div");
div.className = "transaction-item";

div.innerHTML = `
<div>
<strong>${t.note}</strong><br>
<small>${t.category}</small><br>
<small style="opacity:0.6">
📅 ${t.fullDate} • ⏰ ${t.time}
</small>
</div>
`;

<div style="text-align:right">
<div class="${t.type}">
${t.type==="income" ? "+" : "-"}
${formatRupiah(t.amount)}
</div>

<button onclick="deleteTx(${t.id})">Hapus</button>
</div>
`;

list.appendChild(div);
});
}

/* stats */
setText("statTransactions",transactions.length);
setText("statIncome",formatRupiah(c.income));
setText("statExpense",formatRupiah(c.expense));
setText("statSaving",formatRupiah(c.balance));

/* target */
if(target){
let percent = Math.min((c.balance / target.amount) * 100,100);

setText("targetTitle",target.name);
setText("targetText",percent.toFixed(1)+"%");

const bar = document.getElementById("progressFill");
if(bar) bar.style.width = percent + "%";

}else{

setText("targetTitle","Belum Ada Target");
setText("targetText","0%");

const bar = document.getElementById("progressFill");
if(bar) bar.style.width = "0%";
}

buildCharts();
}

/* helper aman */
function setText(id,val){
const el = document.getElementById(id);
if(el) el.innerText = val;
}

/* ======================
CHART
====================== */

function buildCharts(){

if(transactions.length === 0) return;

let income=0, expense=0;

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount;
else expense+=t.amount;
});

if(financeChart) financeChart.destroy();

const c1 = document.getElementById("financeChart");
if(c1){
financeChart = new Chart(c1,{
type:"doughnut",
data:{
labels:["Pemasukan","Pengeluaran"],
datasets:[{
data:[income,expense],
backgroundColor:["#22c55e","#ef4444"]
}]
}
});
}

let balance=0;
let history=[];

transactions.forEach(t=>{
balance += t.type==="income" ? t.amount : -t.amount;
history.push(balance);
});

if(balanceChart) balanceChart.destroy();

const c2 = document.getElementById("balanceChart");
if(c2){
balanceChart = new Chart(c2,{
type:"line",
data:{
labels:transactions.map((_,i)=>i+1),
datasets:[{
label:"Saldo",
data:history,
borderColor:"#3b82f6",
fill:true
}]
}
});
}
}

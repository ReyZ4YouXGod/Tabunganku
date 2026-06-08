let transactions = JSON.parse(localStorage.getItem("rey_money")) || [];
let target = JSON.parse(localStorage.getItem("rey_target")) || null;

let financeChart;
let balanceChart;

/* ======================
UTIL
====================== */

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

function toast(msg){
const t = document.createElement("div");
t.className = "toast";
t.innerText = msg;
document.getElementById("toast").appendChild(t);

setTimeout(()=>t.remove(),3000);
}

/* ======================
ADD TRANSACTION
====================== */

document.getElementById("transactionForm").addEventListener("submit",(e)=>{
e.preventDefault();

const note = document.getElementById("note").value;
const amount = parseFloat(document.getElementById("amount").value);
const type = document.getElementById("type").value;
const category = document.getElementById("category").value;

if(!note || !amount){
toast("Isi data dulu");
return;
}

transactions.push({
id:Date.now(),
note,
amount,
type,
category,
date:new Date()
});

save();
render();
toast("Transaksi masuk");
e.target.reset();
});

function openModal(){
document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal(){
document.getElementById("modalOverlay").classList.add("hidden");
}

/* tombol hapus target */
function deleteTarget(){
openModal();
}

/* cancel */
document.getElementById("cancelModal").onclick = ()=>{
closeModal();
toast("Dibatalkan");
};

/* confirm hapus */
document.getElementById("confirmModal").onclick = ()=>{
target = null;
localStorage.removeItem("rey_target");
render();
closeModal();
toast("Target dihapus");
};

target = null;
localStorage.removeItem("rey_target");
render();
toast("Target dihapus");
}
/* ======================
DELETE
====================== */

function deleteTx(id){
transactions = transactions.filter(t=>t.id !== id);
save();
render();
}

/* ======================
FILTER + SEARCH
====================== */

function getFiltered(){

const search = document.getElementById("searchInput").value.toLowerCase();
const type = document.getElementById("filterType").value;
const category = document.getElementById("filterCategory").value;

return transactions.filter(t=>{

const matchSearch = t.note.toLowerCase().includes(search);
const matchType = type === "all" || t.type === type;
const matchCat = category === "all" || t.category === category;

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

return {income, expense, balance:income-expense};
}

/* ======================
TARGET
====================== */

document.getElementById("saveTarget").onclick=()=>{

const name = document.getElementById("targetName").value;
const amount = parseFloat(document.getElementById("targetAmount").value);

if(!name || !amount){
toast("Target belum lengkap");
return;
}

target = {name, amount};
saveTarget();
render();
toast("Target disimpan");
};

/* ======================
RENDER
====================== */

function render(){

const data = getFiltered();
const c = calc();

/* TOP */
document.getElementById("incomeTotal").innerText = formatRupiah(c.income);
document.getElementById("expenseTotal").innerText = formatRupiah(c.expense);
document.getElementById("balance").innerText = formatRupiah(c.balance);

/* LIST */
const list = document.getElementById("transactionList");
list.innerHTML = "";

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
${t.type==="income" ? "+" : "-"}
${formatRupiah(t.amount)}
</div>

<button onclick="deleteTx(${t.id})">Hapus</button>
</div>
`;

list.appendChild(div);

});

/* STATS */
document.getElementById("statTransactions").innerText = transactions.length;
document.getElementById("statIncome").innerText = formatRupiah(c.income);
document.getElementById("statExpense").innerText = formatRupiah(c.expense);
document.getElementById("statSaving").innerText = formatRupiah(c.balance);

/* TARGET */
if(target){
let percent = Math.min((c.balance / target.amount) * 100,100);

document.getElementById("targetTitle").innerText = target.name;
document.getElementById("targetText").innerText = percent.toFixed(1) + "%";
document.getElementById("progressFill").style.width = percent + "%";
}else{
document.getElementById("targetTitle").innerText = "Belum Ada Target";
document.getElementById("targetText").innerText = "0%";
document.getElementById("progressFill").style.width = "0%";
}

/* CHART */
buildCharts();
}

/* ======================
CHARTS
====================== */

function buildCharts(){

if(transactions.length === 0) return;

/* PIE */
let income=0, expense=0;

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount;
else expense+=t.amount;
});

if(financeChart) financeChart.destroy();

financeChart = new Chart(
document.getElementById("financeChart"),
{
type:"doughnut",
data:{
labels:["Pemasukan","Pengeluaran"],
datasets:[{
data:[income,expense],
backgroundColor:["#22c55e","#ef4444"]
}]
}
}
);

/* LINE */
let balance=0;
let history=[];

transactions.forEach(t=>{
balance += t.type==="income" ? t.amount : -t.amount;
history.push(balance);
});

if(balanceChart) balanceChart.destroy();

balanceChart = new Chart(
document.getElementById("balanceChart"),
{
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
}
);

}

/* ======================
FILTER EVENTS
====================== */

document.getElementById("searchInput").addEventListener("input",render);
document.getElementById("filterType").addEventListener("change",render);
document.getElementById("filterCategory").addEventListener("change",render);

/* INIT */
render();

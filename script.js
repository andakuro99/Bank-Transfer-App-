const defaultUsers = {
  alice: { password: "1234", balance: 1000, history: [] },
  bob: { password: "5678", balance: 1000, history: [] }
};
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}
let currentUser = null;
function getUsers() {
  return JSON.parse(localStorage.getItem("users"));
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function login() {
  const username = document.getElementById("loginUsername").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const users = getUsers();
  if (users[username] && users[username].password === password) {
    currentUser = username;
    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    updateDashboard();
  } else {
    document.getElementById("loginError").textContent = "Invalid credentials.";
  }
}
function signup() {
  const username = document.getElementById("signupUsername").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const users = getUsers();
  if (!username || !password) {
    document.getElementById("signupError").textContent = "All fields are required.";
    return;
  }
  if (users[username]) {
    document.getElementById("signupError").textContent = "Username already exists.";
    return;
  }
  users[username] = { password: password, balance: 500, history: [] };
  saveUsers(users);
  currentUser = username;
  document.getElementById("authPage").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  updateDashboard();
}
function toggleAuth(showSignup) {
  document.getElementById("loginForm").classList.toggle("hidden", showSignup);
  document.getElementById("signupForm").classList.toggle("hidden", !showSignup);
  document.getElementById("loginError").textContent = "";
  document.getElementById("signupError").textContent = "";
}
function updateDashboard() {
  const users = getUsers();
  const userData = users[currentUser];
  document.getElementById("userName").textContent = currentUser.toUpperCase();
  const balanceElement = document.getElementById("balance");
  let displayed = parseFloat(balanceElement.textContent) || 0;
  let actual = userData.balance;
  const animateBalance = setInterval(() => {
    if (Math.abs(displayed - actual) < 0.01) {
      balanceElement.textContent = actual.toFixed(2);
      clearInterval(animateBalance);
    } else {
      displayed += (actual - displayed) * 0.1;
      balanceElement.textContent = displayed.toFixed(2);
    }
  }, 30);
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = userData.history.map(item => `<li>${item}</li>`).join("");
}
function sendMoney() {
  const bank = document.getElementById("bankSelect").value;
  const account = document.getElementById("accountNumber").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const users = getUsers();
  if (!bank || !account || isNaN(amount) || amount <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }
  if (users[currentUser].balance < amount) {
    alert("Insufficient funds.");
    return;
  }
  users[currentUser].balance -= amount;
  const time = new Date().toLocaleString();
  const msg = `Sent $${amount} to ${account} at ${bank} on ${time}`;
  users[currentUser].history.unshift(msg);
  saveUsers(users);
  updateDashboard();
  document.getElementById("transferMsg").textContent = "Money sent successfully!";
  document.getElementById("creditAlert").classList.remove("hidden");
  document.getElementById("alertSound").play();
  document.getElementById("bankSelect").value = "";
  document.getElementById("accountNumber").value = "";
  document.getElementById("amount").value = "";
  setTimeout(() => {
    document.getElementById("creditAlert").classList.add("hidden");
    document.getElementById("transferMsg").textContent = "";
  }, 4000);
}
function logout() {
  currentUser = null;
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("authPage").classList.remove("hidden");
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("signupUsername").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("loginError").textContent = "";
  document.getElementById("signupError").textContent = "";
  document.getElementById("transferMsg").textContent = "";
}

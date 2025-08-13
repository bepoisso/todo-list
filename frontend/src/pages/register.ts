import { API_URL } from '../main';

const form = document.getElementById("registerForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
e.preventDefault();

const username = (document.getElementById("username") as HTMLInputElement).value;
const email = (document.getElementById("email") as HTMLInputElement).value;
const password = (document.getElementById("password") as HTMLInputElement).value;

try {
	const res = await fetch(`${API_URL}/register`, {
	method: "POST",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify({username, email, password})
	});

	if (res.ok) {
	alert("Account created, you can now login");
	window.location.href = "/login.html";
	} else {
	const errorData = await res.json();
	alert("Error creating account: " + (errorData.error || errorData.message || "Unknown error"));
	}
} catch (error) {
	console.error("Registration error:", error);
	alert("Failed to connect to the server. Please try again later.");
}
});

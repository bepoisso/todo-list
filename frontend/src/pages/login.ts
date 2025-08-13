import { API_URL } from '../main';

// Add form by id
const form = document.getElementById("logiForm") as HTMLFormElement;

// When submit is press get form
form.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Get form element
	const email	= (document.getElementById("email") as HTMLInputElement).value;
	const password = (document.getElementById("password") as HTMLInputElement).value;

	// Send request to backend
	const res = await fetch(`${API_URL}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password })
	});

	if (res.ok) {
		const data = await res.json();
		localStorage.setItem("token", data.token); // Store the IDtoken (JWT)
		window.location.href = "/task.html";	// Redirect to task.html
	} else {
		alert("Invalid credential");
	}
});

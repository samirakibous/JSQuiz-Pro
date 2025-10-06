import { closeQuestionModal,openAddQuestionModal } from "./modal.js";
export async function saveQuestion(event) {
    event.preventDefault();

    const id = document.getElementById("questionId").value;
    const thematique = document.getElementById("questionTheme").value;
    const questionText = document.getElementById("questionText").value;
    const options = [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value
    ];

    const correctAnswers = [];
    if (document.getElementById("correct1").checked) correctAnswers.push(options[0]);
    if (document.getElementById("correct2").checked) correctAnswers.push(options[1]);
    if (document.getElementById("correct3").checked) correctAnswers.push(options[2]);
    if (document.getElementById("correct4").checked) correctAnswers.push(options[3]);

    const data = { thematique, question: questionText, options, correctAnswers };

    try {
        const res = await fetch(id ? `/admin/questions/${id}` : "/admin/questions", {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            alert(id ? "Question modifiée avec succès !" : "Question ajoutée avec succès !");
            document.getElementById("questionForm").reset();
            closeQuestionModal();
            loadQuestions();
        } else {
            alert(result.message || "Erreur lors de l'opération.");
        }
    } catch (err) {
        console.error(err);
        alert("Erreur réseau !");
    }
}


export async function loadQuestions() {
    try {
        const res = await fetch("/admin/questions");
        const questions = await res.json();

        const listContainer = document.getElementById("questionsList");
        listContainer.innerHTML = "";

        questions.forEach((q) => {
            const div = document.createElement("div");
            div.classList.add("p-4", "bg-white", "rounded-lg", "shadow");

            div.innerHTML = `
                    <p><strong>ID :</strong> ${q.questionId}</p>
                    <p><strong>Thématique :</strong> ${q.thematique}</p>
                    <p><strong>Question :</strong> ${q.question}</p>
                    <div class="flex gap-2 mt-2">
                        <button class="edit-btn bg-yellow-400 text-white px-3 py-1 rounded" data-id="${q.questionId}">Modifier</button>
                        <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded" data-id="${q.questionId}">Supprimer</button>
                    </div>
                `;

            listContainer.appendChild(div);
        });
        attachQuestionListeners();
    } catch (err) {
        console.error(err);
    }
}
export async function editQuestion(id) {
    try {
        const res = await fetch(`/admin/questions`);
        const questions = await res.json();
        const question = questions.find((q) => q.questionId == id);

        if (!question) return alert("Question introuvable");

        document.getElementById("modalTitle").textContent =
            "Modifier la question";
        document.getElementById("questionId").value = question.questionId;
        document.getElementById("questionTheme").value = question.thematique;
        document.getElementById("questionText").value = question.question;

        const options = question.options;

        document.getElementById("option1").value = options[0] || "";
        document.getElementById("option2").value = options[1] || "";
        document.getElementById("option3").value = options[2] || "";
        document.getElementById("option4").value = options[3] || "";

        const correctAnswers = question.correctAnswers || "[]";

        document.getElementById("correct1").checked = correctAnswers.includes(
            options[0]
        );
        document.getElementById("correct2").checked = correctAnswers.includes(
            options[1]
        );
        document.getElementById("correct3").checked = correctAnswers.includes(
            options[2]
        );
        document.getElementById("correct4").checked = correctAnswers.includes(
            options[3]
        );

        openAddQuestionModal();
    } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement de la question.");
    }
}

export async function deleteQuestion(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette question ?")) return;

    try {
        const res = await fetch(`/admin/questions/${id}`, {
            method: "DELETE"
        });

        const result = await res.json();

        if (res.ok) {
            alert(result.message || "Question supprimée avec succès !");
            loadQuestions();
        } else {
            alert(result.message || "Erreur lors de la suppression.");
        }
    } catch (err) {
        console.error(err);
        alert("Erreur réseau !");
    }
}

export function attachQuestionListeners() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            editQuestion(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            deleteQuestion(id);
        });
    });
}
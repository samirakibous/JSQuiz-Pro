import { openAddQuestionModal, closeQuestionModal } from "./modal.js";
import { saveQuestion, loadQuestions, editQuestion, deleteQuestion } from "./crud.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("openQModal").addEventListener("click", openAddQuestionModal);

    document.querySelectorAll(".closeModalBtn").forEach(btn => {
        btn.addEventListener("click", closeQuestionModal);
    });

    loadQuestions();
});

document.addEventListener("DOMContentLoaded", () => {
    const questionForm = document.getElementById("questionForm");
    if (questionForm) {
        questionForm.addEventListener("submit", saveQuestion);
    }
});

// window.addEventListener("DOMContentLoaded", loadQuestions);


async function filterQuestions() {
    try {
        const themeFilter = document.getElementById("filterTheme").value.toLowerCase();
        const searchQuery = document.getElementById("searchQuestion").value.toLowerCase();

        const res = await fetch("/admin/questions");
        const questions = await res.json();

        const filtered = questions.filter(q => {
            const matchesTheme = q.thematique.toLowerCase().includes(themeFilter);
            const matchesSearch = q.question.toLowerCase().includes(searchQuery);
            return matchesTheme && matchesSearch;
        });

        const listContainer = document.getElementById("questionsList");
        listContainer.innerHTML = "";

        if (filtered.length === 0) {
            listContainer.innerHTML = `<p class="text-gray-500">Aucune question trouvée.</p>`;
            return;
        }

        filtered.forEach((q) => {
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

const scoreDetailsModal = document.getElementById("scoreDetailsModal");

function closeScoreDetailsModal() {
    scoreDetailsModal.classList.add("hidden");
    scoreDetailsModal.classList.remove("flex");
    document.getElementById("scoreDetailsContent").innerHTML = "";
}

document.querySelectorAll(".score-row").forEach(row => {
    row.addEventListener("click", async () => {
        const userId = row.dataset.userid;
        const thematique = row.dataset.thematique;
        const date = row.dataset.date;

        try {
            const res = await fetch(`/admin/scores/details?userId=${userId}&thematique=${thematique}&date=${date}`);
            const data = await res.json();

            if (data.length === 0) {
                document.getElementById("scoreDetailsContent").innerHTML = "<p>Aucune donnée disponible</p>";
            } else {
                let html = "<ul class='space-y-4'>";
                data.forEach(q => {
                    html += `
                        <li>
                            <strong>Question:</strong> ${q.question}<br>
                            <strong>Options:</strong> ${(q.options).join(", ")}<br>
                            <strong>Réponse(s) correcte(s):</strong> ${(q.correctAnswers).join(", ")}
                        </li>
                    `;
                });
                html += "</ul>";
                document.getElementById("scoreDetailsContent").innerHTML = html;
            }

            scoreDetailsModal.classList.remove("hidden");
            scoreDetailsModal.classList.add("flex");

        } catch (err) {
            console.error(err);
            alert("Erreur lors de la récupération des détails.");
        }
    });
});
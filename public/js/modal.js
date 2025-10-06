const questionModal = document.getElementById("questionModal");

export function openAddQuestionModal() {
    questionModal.classList.remove("hidden");
    questionModal.classList.add("flex");
}

export function closeQuestionModal() {
    questionModal.classList.add("hidden");
    questionModal.classList.remove("flex");
    document.getElementById("modalTitle").textContent = "Ajouter une Question";
    document.getElementById("questionForm").reset();
    document.getElementById("questionId").value = "";
}


questionModal.addEventListener("click", (e) => {
    if (e.target === questionModal) {
        closeQuestionModal();
    }
});

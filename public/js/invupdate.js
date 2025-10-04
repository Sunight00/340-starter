
const updateForm = document.querySelector(".updateForm")
const updateBtn = document.querySelector(".btn")


    updateForm.addEventListener("input", function () {
      updateBtn.removeAttribute("disabled")
    })
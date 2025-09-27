/*FOR ADDING CLASSIFICATION*/
const classificationForm = document.querySelector('.addClassification');
const classification_name = document.getElementById('classification_name');
const classificationMessage = document.getElementById('classification-message');


classificationForm.addEventListener('submit', (event) => {
  const value = classification_name.value;
  let errorMessage = "";

  if (value.includes(" ") && value.length < 4) {
    errorMessage = "Classification name must be at least 4 characters long and contain no spaces.";
  } else if (value.includes(" ")) {
    errorMessage = "Classification name cannot contain spaces.";
  } else if (value.length < 4) {
    errorMessage = "Classification name must be at least 4 characters long.";
  }

  if (errorMessage) {
    event.preventDefault();
    classificationMessage.style.color = 'red';
    classificationMessage.textContent = errorMessage;
  }
});

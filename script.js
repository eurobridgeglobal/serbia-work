const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwi_W6sWXQaaejovx-HGD9bdwE7q8jze7aRONDNqGtyXiK4PVgdcWDyj8Te9aP2tIKgpQ/exec';

const form = document.querySelector("#candidateForm");
const formStatus = document.querySelector("#formStatus");
const submitButton = form.querySelector('button[type="submit"]');
const successMessage = "Спасибо! Ваша заявка принята. Мы свяжемся с вами и уточним детали по оформлению.";

const requiredFields = [
  {
    id: "fullName",
    message: "Укажите ФИО.",
  },
  {
    id: "citizenship",
    message: "Укажите страну гражданства.",
  },
  {
    id: "contact",
    message: "Укажите телефон, WhatsApp или Telegram.",
  },
];

function showFieldError(input, message) {
  const row = input.closest(".form-row");
  const error = row.querySelector(".error-message");

  row.classList.add("has-error");
  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(input) {
  const row = input.closest(".form-row");
  const error = row.querySelector(".error-message");

  row.classList.remove("has-error");
  if (error) {
    error.textContent = "";
  }
}

function validateForm() {
  let isValid = true;

  requiredFields.forEach((field) => {
    const input = document.querySelector(`#${field.id}`);
    const value = input.value.trim();

    if (!value) {
      showFieldError(input, field.message);
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  return isValid;
}

requiredFields.forEach((field) => {
  const input = document.querySelector(`#${field.id}`);

  input.addEventListener("input", () => {
    if (input.value.trim()) {
      clearFieldError(input);
    }
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  formStatus.textContent = "";
  formStatus.classList.remove("is-error");

  if (!validateForm()) {
    formStatus.textContent = "Пожалуйста, заполните обязательные поля.";
    formStatus.classList.add("is-error");
    return;
  }

  const formData = new FormData(form);
  formData.append("source", "serbia-landing");

  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    form.reset();
    formStatus.textContent = successMessage;
  } catch (error) {
    formStatus.textContent = "Не удалось отправить заявку. Попробуйте еще раз.";
    formStatus.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Отправить заявку";
  }
});

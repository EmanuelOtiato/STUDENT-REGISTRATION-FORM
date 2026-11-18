(function () {
  "use strict";

  var form = document.getElementById("regForm");
  var confirmation = document.getElementById("confirmation");
  var cancelBtn = document.getElementById("cancelBtn");
  var againBtn = document.getElementById("againBtn");
  var STORAGE_KEY = "studentRegistrations";

  var inputs = {
    name: document.getElementById("fullName"),
    admission: document.getElementById("admission"),
    course: document.getElementById("course")
  };

  /* ---------- helpers ---------- */
  function getRegistered() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveRegistration(record) {
    try {
      var all = getRegistered();
      all.push(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) { /* storage unavailable: the form still works */ }
  }
  function setError(fieldId, errId, message) {
    var field = document.getElementById(fieldId);
    var err = document.getElementById(errId);
    err.textContent = message;
    field.classList.toggle("invalid", Boolean(message));
    var control = field.querySelector("input, select");
    if (control && control.type !== "radio") {
      if (message) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    }
    return !message;
  }

  /* ---------- validators (return true when valid) ---------- */
  function validateName() {
    var v = inputs.name.value.trim();
    var msg = "";
    if (!v) msg = "Enter the student's full name.";
    else if (v.length < 2) msg = "Name must be at least 2 characters.";
    else if (v.length > 60) msg = "Name must be 60 characters or fewer.";
    else if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(v)) msg = "Use letters, spaces, hyphens or apostrophes only.";
    return setError("field-name", "err-name", msg);
  }

  function validateAdmission() {
    var v = inputs.admission.value.trim().toUpperCase();
    var msg = "";
    if (!v) msg = "Enter the admission number.";
    else if (!/^[A-Z0-9][A-Z0-9\/-]{3,19}$/.test(v))
      msg = "Use 4 to 20 letters, numbers, slashes or hyphens, for example ADM/2026/014.";
    else if (getRegistered().some(function (r) { return r.admission === v; }))
      msg = "This admission number is already registered.";
    return setError("field-admission", "err-admission", msg);
  }

  function validateCourse() {
    var msg = inputs.course.value ? "" : "Select a course.";
    return setError("field-course", "err-course", msg);
  }

  function validateGender() {
    var chosen = form.querySelector('input[name="gender"]:checked');
    return setError("field-gender", "err-gender", chosen ? "" : "Select a gender.");
  }

  /* ---------- live feedback ---------- */
  inputs.name.addEventListener("blur", validateName);
  inputs.admission.addEventListener("blur", validateAdmission);
  inputs.course.addEventListener("change", validateCourse);
  form.querySelectorAll('input[name="gender"]').forEach(function (r) {
    r.addEventListener("change", validateGender);
  });
  // once a field shows an error, re-check as the person fixes it
  inputs.name.addEventListener("input", function () {
    if (document.getElementById("field-name").classList.contains("invalid")) validateName();
  });
  inputs.admission.addEventListener("input", function () {
    if (document.getElementById("field-admission").classList.contains("invalid")) validateAdmission();
  });

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var checks = [
      [validateName, inputs.name],
      [validateAdmission, inputs.admission],
      [validateCourse, inputs.course],
      [validateGender, form.querySelector('input[name="gender"]')]
    ];
    var firstInvalid = null;
    checks.forEach(function (c) {
      if (!c[0]() && !firstInvalid) firstInvalid = c[1];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var record = {
      name: inputs.name.value.trim(),
      admission: inputs.admission.value.trim().toUpperCase(),
      course: inputs.course.value,
      gender: form.querySelector('input[name="gender"]:checked').value
    };
    saveRegistration(record);

    document.getElementById("out-name").textContent = record.name;
    document.getElementById("out-admission").textContent = record.admission;
    document.getElementById("out-course").textContent = record.course;
    document.getElementById("out-gender").textContent = record.gender;

    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  /* ---------- cancel / reset ---------- */
  function isDirty() {
    return Boolean(inputs.name.value.trim() || inputs.admission.value.trim() ||
      inputs.course.value || form.querySelector('input[name="gender"]:checked'));
  }
  function resetForm() {
    form.reset();
    ["field-name", "field-admission", "field-course", "field-gender"].forEach(function (id) {
      var f = document.getElementById(id);
      f.classList.remove("invalid");
      f.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
    });
    document.querySelectorAll(".error").forEach(function (p) { p.textContent = ""; });
  }

  cancelBtn.addEventListener("click", function () {
    if (!isDirty() || window.confirm("Discard what you've entered and clear the form?")) {
      resetForm();
      inputs.name.focus();
    }
  });

  againBtn.addEventListener("click", function () {
    resetForm();
    confirmation.hidden = true;
    form.hidden = false;
    inputs.name.focus();
  });
})();

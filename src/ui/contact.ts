
/**
 * Contact for a Quote — the original form, visually complete but not connected to a
 * backend: fields validate, file slots show the chosen names, and submitting shows an
 * honest demo message instead of sending anything.
 */
export function initContact({ reducedMotion }: { reducedMotion: boolean }) {
  const section = document.getElementById('contact')!;
  const form = section.querySelector<HTMLFormElement>('.quote-form')!;
  const status = form.querySelector<HTMLElement>('.form-status')!;


  // file slots: show the chosen file name in place of "(optional)"
  form.querySelectorAll<HTMLInputElement>('.upload input').forEach((input) => {
    const slot = input.closest<HTMLElement>('.upload')!;
    const note = slot.querySelector<HTMLElement>('[data-file]')!;
    input.addEventListener('change', () => {
      const f = input.files?.[0];
      slot.classList.toggle('has-file', !!f);
      note.textContent = f ? f.name : '(optional)';
    });
  });

  function setError(input: HTMLInputElement, msg: string) {
    const field = input.closest<HTMLElement>('.field')!;
    let err = field.querySelector<HTMLElement>('.field-error');
    field.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', String(!!msg));
    if (!msg) return err?.remove();
    if (!err) {
      err = document.createElement('small');
      err.className = 'field-error';
      err.id = `${input.id}-error`;
      field.appendChild(err);
      input.setAttribute('aria-describedby', err.id);
    }
    err.textContent = msg;
  }

  function validate(input: HTMLInputElement) {
    if (input.validity.valueMissing) setError(input, 'Please fill in this field.');
    else if (input.validity.typeMismatch) setError(input, 'Please enter a valid email address.');
    else setError(input, '');
    return input.validity.valid;
  }

  const required = [...form.querySelectorAll<HTMLInputElement>('input[required]')];
  required.forEach((input) => input.addEventListener('blur', () => input.value && validate(input)));
  required.forEach((input) => input.addEventListener('input', () => input.closest('.is-invalid') && validate(input)));

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // demo: no backend, nothing leaves the page
    const bad = required.filter((input) => !validate(input));
    if (bad.length) {
      status.hidden = true;
      bad[0].focus();
      return;
    }
    status.hidden = false;
    status.innerHTML = '<span><b>Thank you.</b> This is a demo form, so nothing was sent. Once the form is connected, your request will go straight to the Prana Risk team.</span>';
    status.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  });




}

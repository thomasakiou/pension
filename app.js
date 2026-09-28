// Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwelxxKeYoyY0S4Es4MwM8V1n7RCSdZdxiFoW7DDrbInhsluz0AUFaTksXfFTA6vOcw/exec';

// PFA Codes Mapping
const PFA_LIST = [
    { name: "ACCESS ARM PENSION", code: "024" },
    { name: "CARDINALSTONE PENSIONS", code: "046" },
    { name: "CITIZENS PENSIONS", code: "050" },
    { name: "CRUSADER STERLING PENSIONS", code: "032" },
    { name: "FCMB PENSION", code: "030" },
    { name: "FIDELITY PENSION MANAGERS", code: "043" },
    { name: "GUARANTY TRUST PENSION", code: "040" },
    { name: "LEADWAY PENSURE PFA", code: "023" },
    { name: "NLPC PENSION FUND ADMINISTRATORS", code: "031" },
    { name: "NIGERIAN UNIVERSITY PENSION MANAGEMENT", code: "049" },
    { name: "NORRENBERGER", code: "036" },
    { name: "NPF PENSIONS", code: "047" },
    { name: "OAK PENSIONS", code: "034" },
    { name: "PARTHIAN PENSIONS LIMITED", code: "051" },
    { name: "PENSIONS ALLIANCE LIMITED", code: "025" },
    { name: "PREMIUM PENSION", code: "022" },
    { name: "STANBIC IBTC PENSION MANAGEMENTS", code: "021" },
    { name: "TANGERINE APT", code: "037" },
    { name: "TRUSTFUND PENSION", code: "028" },
    { name: "VERITAS GLANVILLS PENSIONS", code: "042" }
];

document.addEventListener('DOMContentLoaded', () => {
    const pfaSelect = document.getElementById('pfaCode');
    const form = document.getElementById('pensionForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('loadingSpinner');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Populate the dropdown
    // Note: The sheet expects ONLY the numbers (the code) as per user request.
    // So the value will be the code. The display text includes both to help the user.
    PFA_LIST.sort((a, b) => a.name.localeCompare(b.name)).forEach(pfa => {
        const option = document.createElement('option');
        option.value = pfa.code; // Send only the code
        option.textContent = `${pfa.name} - ${pfa.code}`;
        pfaSelect.appendChild(option);
    });

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Submitting...';
        spinner.classList.remove('class-hidden');

        // Gather Data using FormData
        const formData = new FormData(form);

        // Convert the form data to URL encoded string which Google Apps Script usually expects
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        // Programmatically append employer code
        data.append("employer code", "PU0000328008_N");

        try {
            // Using fetch to trigger Apps Script
            // mode: 'no-cors' is typically used for Google Apps Script Web Apps when not returning specific CORS headers.
            // But this means we can't reliably read the response body. If the form successfully submits, it won't throw.
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString()
            });

            // If it reaches here without network error, show success!
            showSuccess();
            form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was a problem submitting your data. Please check your internet connection and try again.');
        } finally {
            // Revert UI Loading state
            submitBtn.disabled = false;
            btnText.textContent = 'Submit Data';
            spinner.classList.add('class-hidden');
        }
    });

    function showSuccess() {
        successModal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.add('hidden');
        document.getElementById('employeeName').focus();
    });

    // Auto-calculate total contribution
    const contributionInputs = document.querySelectorAll('.contribution-input');
    const totalInput = document.getElementById('totalContribution');

    function calculateTotal() {
        let total = 0;
        contributionInputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            total += val;
        });
        totalInput.value = total > 0 ? total.toFixed(2) : '';
    }

    contributionInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
});

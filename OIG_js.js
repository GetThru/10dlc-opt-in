document.addEventListener('DOMContentLoaded', function () {
    const showTextButton = document.getElementById('showTextButton');
    const displayText = document.getElementById('displayText');
    const copyTextButtonBottom = document.getElementById('copyTextButtonBottom');
    const copyNotification = document.getElementById('copyNotification');
    const donationQuestionContainer = document.getElementById('donationQuestionContainer');
    const donationYes = document.getElementById('donationYes');
    const donationNo = document.getElementById('donationNo');

    // Function to format URLs properly
    function formatURL(url) {
        url = url.trim();
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        if (url.startsWith("www.")) {
            return "https://" + url;
        }
        return "https://www." + url;
    }

    // Error messages for each radio group
    function createErrorMessage(id, message) {
        let errorElement = document.getElementById(id);
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.id = id;
            errorElement.style.color = 'red';
            errorElement.style.display = 'none';
            errorElement.innerText = message;
        }
        return errorElement;
    }

    // Add error messages for each required radio question
    const useCaseError = createErrorMessage('useCaseError', 'Please select a use case.');
    document.getElementById('useCaseForm').appendChild(useCaseError);

    const donationError = createErrorMessage('donationError', 'Please answer this question.');
    donationQuestionContainer.appendChild(donationError);

    // Hide the donation question initially
    donationQuestionContainer.style.display = 'none';

    // Show donation-related question if "Political" is selected
    document.querySelectorAll('input[name="usecase"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'Political') {
                donationQuestionContainer.style.display = 'block';
            } else {
                donationQuestionContainer.style.display = 'none';
            }
            useCaseError.style.display = 'none'; // Hide error when selected
        });
    });

    showTextButton.addEventListener('click', function () {
        const organization = document.getElementById('organization').value.trim();
        let privacyPolicyLink = document.getElementById('pplink').value.trim();
        let termsConditionsLink = document.getElementById('tclink').value.trim();
        let formIsValid = true; // Flag to check if form is valid

        // Validate organization input
        if (!organization) {
            alert("Please enter your organization's name.");
            return;
        }

        // Validate use case selection
        const useCaseSelected = document.querySelector('input[name="usecase"]:checked');
        if (!useCaseSelected) {
            useCaseError.style.display = 'block';
            formIsValid = false;
        } else {
            useCaseError.style.display = 'none';
        }

        // Validate donation question if Political is selected
        if (donationQuestionContainer.style.display === 'block') {
            const donationSelected = document.querySelector('input[name="donation"]:checked');
            if (!donationSelected) {
                donationError.style.display = 'block';
                formIsValid = false;
            } else {
                donationError.style.display = 'none';
            }
        }

        // Validate privacy policy link
        if (!privacyPolicyLink) {
            alert("Please enter a link to your Privacy Policy.");
            return;
        }

        // Validate terms & conditions link
        if (!termsConditionsLink) {
            alert("Please enter a link to your Terms & Conditions.");
            return;
        }

        // Stop execution if any required field is missing
        if (!formIsValid) return;

        // Ensure the links are formatted correctly
        privacyPolicyLink = formatURL(privacyPolicyLink);
        termsConditionsLink = formatURL(termsConditionsLink);

        // Define the use case type
        let useCaseType = "informational";
        switch (useCaseSelected.value) {
            case "Political":
                useCaseType = donationYes.checked ? "political and/or donation-related" : "political";
                break;
            case "Charity":
                useCaseType = "donation-related";
                break;
            case "Customer Care":
                useCaseType = "customer support";
                break;
            case "Polling and Voting":
                useCaseType = "survey, polling, or voting-related (non-political)";
                break;
            case "Public Service Announcement":
                useCaseType = "public service announcement or informational";
                break;
            case "Higher Education":
                useCaseType = "higher education-related";
                break;
        }

        // Generate clickable links for Privacy Policy and Terms & Conditions
        const privacyPolicyText = `<a href="${privacyPolicyLink}" target="_blank" rel="noopener noreferrer">here</a>`;
        const termsConditionsText = `<a href="${termsConditionsLink}" target="_blank" rel="noopener noreferrer">here</a>`;

        // Generate the opt-in language
        const generatedText = 
            `By providing your phone number, you agree to receive ${useCaseType} text messages from ${organization}. 
            Message and data rates may apply. Message frequency varies. Reply HELP to request help or STOP to opt out of text messages. 
            Privacy Policy ${privacyPolicyText} and Terms & Conditions ${termsConditionsText}.`;

        displayText.innerHTML = `<p>${generatedText}</p>`;
        copyTextButtonBottom.style.display = 'block';
    });

    // Copy function
    function copyToClipboard(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            showCopyNotification();
        } catch (err) {
            alert('Unable to copy text');
        }

        selection.removeAllRanges();
    }

    function showCopyNotification() {
        copyNotification.style.display = 'block';
        setTimeout(() => {
            copyNotification.style.display = 'none';
        }, 3000);
    }

    copyTextButtonBottom.addEventListener('click', function () {
        copyToClipboard(displayText);
    });
});

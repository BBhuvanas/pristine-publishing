# 🏦 Autonomous Insurance Claims Processing Agent
 **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
## 📌 Project Overview

This project implements a **lightweight Autonomous Insurance Claims Processing Agent** that processes FNOL (First Notice of Loss) documents and automatically routes insurance claims based on predefined business rules.

The system is designed to:

* Extract key information from FNOL documents (PDF/TXT)
* Detect missing or inconsistent data
* Classify claims into appropriate workflows
* Provide a clear explanation for each routing decision

This solution is **rule-based, modular, and easy to extend**, making it suitable for real-world insurance automation scenarios.

---

## 🎯 Problem Statement

Build an agent that can:

* Extract required claim-related fields from FNOL documents
* Identify missing mandatory fields
* Classify and route claims using business rules
* Output results in a structured JSON format

---

## 📂 Supported Input Formats

* 📄 PDF files (`.pdf`)
* 📝 Text files (`.txt`)

The agent supports **batch processing** of **3–5 FNOL documents**, as required by the assignment.

---

## 📑 Extracted Fields

### Policy Information

* Policy Number
* Policyholder Name
* Effective Dates

### Incident Information

* Incident Date
* Incident Time
* Incident Location
* Incident Description

### Claim Information

* Claim Type
* Estimated Damage
* Initial Estimate

---

## ✅ Mandatory Field Validation

The agent checks for missing mandatory fields and flags the claim for **Manual Review** if any required information is absent.

---

## 🔁 Claim Routing Rules

| Condition                                              | Routing Decision    |
| ------------------------------------------------------ | ------------------- |
| Estimated damage < ₹25,000                             | Fast-track          |
| Any mandatory field missing                            | Manual Review       |
| Description contains “fraud”, “inconsistent”, “staged” | Investigation Flag  |
| Claim type = Injury                                    | Specialist Queue    |
| None of the above                                      | Standard Processing |

---
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🚀 Future Enhancements

* NLP-based negation handling (e.g., “no fraud”)
* Machine learning-based claim classification
* REST API interface
* Database integration for claim storage
* UI dashboard for claim review

---

## 👨‍💻 Author

BBHUVANA SRI


















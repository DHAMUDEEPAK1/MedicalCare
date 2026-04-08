## 4.5 Explanation of Key Functions
This section describes the modular functions that drive the MedicalCare system's core functionality. These modules ensure data flows smoothly from user interactions to the backend canister.

- **`verifyCredentials()`**: Validates user login by checking phone/email against stored hashed passwords in the ICP backend canister.
- **`addCredentials()`**: Registers new user credentials by storing phone number and hashed password securely.
- **`saveCallerUserProfile()`**: Persists user profile data including name, email, date of birth, blood type, allergies, and emergency contacts.
- **`getCallerUserProfile()`**: Retrieves the authenticated user's profile information from the canister.
- **`uploadMedicalFile()`**: Handles secure upload of medical documents (PDFs, images) with end-to-end encryption metadata.
- **`listMedicalFilesMetadata()`**: Returns metadata for all uploaded medical files without downloading the actual content.
- **`runMLPrediction()`**: Executes the health risk prediction ML model using user metrics (age, BMI, blood pressure, etc.) and returns risk assessment.
- **`getCallerMLPrediction()`**: Retrieves the most recent ML prediction result for the current user.
- **`getFeatureImportance()`**: Returns the weighted importance of health factors used in ML predictions.

### 4.5.1 Forms and Input
The Streamlit-style dashboard uses structured forms to parameterize the health tracking system:

- **User Authentication**: Sign-in with phone/email + password, OTP login, Google authentication, and guest mode.
- **Profile Management**: Forms for updating personal details, medical history, allergies, and emergency contacts.
- **Medical File Upload**: Drag-and-drop interface for PDFs, JPEGs, and PNGs with automatic encryption.
- **Health Metrics Input**: Manual entry for vitals (pulse, steps, water intake) or automated tracking integration.

### 4.5.2 Output (Results)
The system produces comprehensive health management outputs:

- **Health Dashboard**: Real-time vitals display (pulse, steps, water intake, diet suggestions).
- **ML Risk Assessment**: Personalized health risk analysis with confidence scores and risk levels.
- **Medication Tracking**: Daily progress bars, refill reminders, and AI-powered interaction warnings.
- **Encrypted Medical Records**: Secure document storage with end-to-end encryption status indicators.

---

## 4.6 Method of Implementation
This section provides the workflow for operating the MedicalCare system:

1. **Launch**: Start the frontend development server with `npm run dev`.
2. **Authenticate**: Choose login method (credentials, OTP, Google) or continue as guest.
3. **Navigate**: Access core screens via the bottom navigation: Home, Reports, Medications, Chat, Profile.
4. **Track**: Log daily health metrics on the dashboard.
5. **Upload**: Secure medical documents via the Reports section with encryption.
6. **Consult**: Interact with the AI assistant "Goku" for health insights.
7. **Manage**: Update profile, manage medications, and review ML predictions.

---

## 4.7 Coding (The Technical Stack)
The system uses a full-stack JavaScript/TypeScript architecture:

| Layer | Component | Key Technologies |
| :--- | :--- | :--- |
| **Frontend UI** | React Pages | React, TypeScript, Tailwind CSS, Lucide Icons |
| **State Management** | Auth & Data Hooks | TanStack Router, React Context |
| **Backend Integration** | ICP Canister Client | @icp-sdk/core, Candid TypeScript bindings |
| **Secure Storage** | Medical Files | ExternalBlob, end-to-end encryption |
| **ML Inference** | Health Predictions | Motoko backend with PyTorch ML models |
| **Authentication** | Multi-provider Auth | OTP, credentials, Google OAuth, Internet Identity |

**Technical Highlight**: The system leverages the **Internet Computer (ICP)** blockchain for secure, decentralized storage of medical records with end-to-end encryption, ensuring user data privacy while enabling serverless application deployment.
# 📌 KaviosPix AI Feature Enhancement Specification

---

## 🔹 1. Objective

Transform the current AI-powered planner feature into a **KaviosPix-related AI feature** that better matches the purpose and branding of the application.

The updated AI feature should:
- Feel dynamic and visually engaging
- Match the KaviosPix theme and UI
- Provide a modern and noticeable user experience
- Maintain all existing core functionality and APIs

---

## 🔹 2. Feature Transformation Requirements

### ✅ Replace Existing Planner Inputs

Currently, the AI planner uses:
- City
- Country
- Days

Replace these fields with **3 new KaviosPix-related inputs** that better suit the application's image/photo management concept.

### ✅ Suggested KaviosPix AI Inputs

Examples:
- Photo Style
- Album Theme
- Mood / Aesthetic
- Event Type
- Image Category
- Editing Style

You may choose the most suitable 3 fields based on the existing UI structure.

---

## 🔹 3. UI Enhancement Requirements

### 🎨 Design Improvements
Enhance the AI feature UI to make it:
- Modern
- Dynamic
- Visually noticeable
- More interactive
- Consistent with the KaviosPix branding

### ✨ UI Effects
Add:
- Smooth hover effects
- Transitions and animations
- Better spacing and alignment
- Modern cards/buttons/inputs
- Improved typography

### 📱 Responsive Design
Ensure the AI feature works properly on:
- Mobile
- Tablet
- Desktop

---

## 🔹 4. Technical Constraints (Strict)

### ✅ Logic Protection
- Existing functionality and logic must remain unchanged
- Do not break current application behavior
- Existing state management should remain intact unless absolutely necessary

### ✅ API Protection
- Do not modify any API URLs
- Do not change API structure unnecessarily

### ✅ File Scope Restriction

Work only inside these files:

#### **Server / Backend**
- `index.js`
- `routes/sdkRoutes.js`

#### **Client / Frontend**
- `pages/planner.tsx`

### ✅ Additional UI Files
- You may use additional components/files only for:
  - UI enhancement
  - Styling
  - Bootstrap/CSS improvements
- Do not move or rewrite core logic into other files

### ❌ Restricted
- Do not modify unrelated files
- Do not change unrelated logic
- Rest of the application must remain untouched

---

## 🔹 5. Existing Issue Fixes

### 🐞 Issue 1: AI Generates Plan After Every Refresh

#### Problem
Currently, the AI feature automatically generates a new plan whenever the page refreshes.

#### Expected Fix
- Prevent automatic regeneration on page refresh
- AI generation should only happen when the user explicitly submits/generates

---

### 🐞 Issue 2: No Proper Error Handling

#### Problem
If the AI fails to respond, the UI does not properly handle the failure.

#### Expected Fix
Show a user-friendly message such as:

> "Unable to generate response right now. Please try again after some time."

Also ensure:
- No application crash
- Proper loading/error state handling

---

## 🔹 6. Non-Functional Requirements

The updated AI feature should be:

- Fast
- Responsive
- Visually attractive
- Lightweight
- Smooth and interactive
- Consistent with KaviosPix branding

---

## 🔹 7. Testing Requirements

### ✅ Functional Testing
Verify:
- AI feature works correctly
- New fields generate expected AI output
- Existing functionality is not broken

### ✅ Refresh Testing
Verify:
- Refreshing the page does NOT auto-generate plans

### ✅ Error Handling Testing
Verify:
- Proper error message appears if AI fails

### ✅ Responsive Testing
Check UI on:
- Mobile
- Tablet
- Desktop

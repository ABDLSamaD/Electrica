# Plan to remove EXPOSE_PLAIN_DATA and fix plain data handling

## Overview

The backend currently supports returning `plainData` when the environment variable `EXPOSE_PLAIN_DATA` is set to `true`. This is used as a fallback for debugging or when frontend decryption fails.

This document explains how to remove this fallback and fix the data flow so the frontend uses the encrypted response only.

## Current behavior

- Backend encrypts sensitive responses using `encryptData`.
- Some controllers add `plainData` to the response when `process.env.EXPOSE_PLAIN_DATA === "true"`.
- Frontend checks for `plainData` and uses it if present.
- This can hide real decryption issues and create a less secure fallback path.

## Why remove `EXPOSE_PLAIN_DATA`

- It bypasses the intended encryption/decryption flow.
- It can cause inconsistent behavior between development and production.
- It may expose user data unintentionally if enabled in the wrong environment.
- Fixing the real decryption issue is safer and more reliable.

## Fix plan

1. Identify backend controllers that return `plainData`.
2. Remove the `plainData` conditional response code from those controllers.
3. Ensure the frontend always decrypts encrypted responses.
4. Add debugging logs or error handling to detect decryption failures instead of falling back to plain data.
5. Test the full user profile and dashboard flow after the change.

## Files to update

- `backend/src/controllers/userController.js`
  - Remove `plainData` from `getUserDetails` responses.
- `backend/src/controllers/userProject.js`
  - Remove `plainData` from project response handlers.
- `backend/src/controllers/adminController.js`
  - Remove `plainData` from admin and user list response handlers.
- `backend/src/controllers/stageControllers.js`
  - Remove `plainData` from project stage response handlers.

## Suggested backend cleanup

- Remove any `process.env.EXPOSE_PLAIN_DATA === "true"` checks across backend controllers.
- Keep responses consistent: return only `{ encryptedData: encryptedUserData, isFirstTime: ... }` or encrypted data payload.
- If debugging is needed, use temporary logs or a separate debug endpoint, not `plainData` in production responses.

## Suggested frontend update

- Ensure the frontend does not rely on `plainData`.
- Use `DecryptData` for all responses that contain `encryptedData`.
- Add clear error handling when decryption returns `null`.
- Optionally log the response payload if decryption fails, but do not render `plainData`.

## Testing steps

1. Build frontend with correct Vite env variables.
2. Log in to the app and verify user profile loads.
3. Open the network tab and confirm `user-info` response contains only `encryptedData`.
4. Verify that the frontend decrypts the response successfully.
5. Test project details and admin endpoints if applicable.

## Notes

- Keep the document simple and clear.
- Do not use emojis.
- This file should remain in the backend folder as guidance for removing `EXPOSE_PLAIN_DATA` support.

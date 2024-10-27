// Update session storage if permissions are revoked
export const updateSessionPermissions = (
  cameraState: string,
  micState: string
) => {
  if (cameraState !== "granted" || micState !== "granted") {
    sessionStorage.removeItem("audioPermissionGranted");
    sessionStorage.removeItem("videoPermissionGranted");
  }
};

// Check current permission status of camera and microphone
export const checkPermissions = async (
  setError: React.Dispatch<
    React.SetStateAction<{ isError: boolean; errorMsg: string }>
  >
) => {
  try {
    const [camera, microphone] = await Promise.all([
      navigator.permissions.query({ name: "camera" as PermissionName }),
      navigator.permissions.query({ name: "microphone" as PermissionName }),
    ]);

    updateSessionPermissions(camera.state, microphone.state);
  } catch (error: any) {
    setError({ isError: true, errorMsg: error.message });
  }
};

// handleUserPermission=> Manage user permission checks when activating the chat.
// If permission has already been granted, we skip prompting the user again by referring to the session data.
// For users who enable 'always allow,' we first verify if access is already granted.
// If access is granted, we directly call getMediaTracks() to proceed with media access.

// We use session storage to remember user permissions within the current session.
// Once a user grants permission, we avoid asking for access again during the active session,even if the page reloads.
// This is especially useful for components like UserPermission,where we don’t want the user to click “Allow” repeatedly on each re-render.
// By storing this permission in session storage, we ensure the state persists across reloads,
// unlike React state, which resets on page refresh.
export const handleUserPermission = async (
  isChatActive: boolean,
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>,
  getMediaTracks: () => Promise<void>,
  setError: React.Dispatch<
    React.SetStateAction<{ isError: boolean; errorMsg: string }>
  >
) => {
  try {
    const camera = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });
    const microphone = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });

    const hasAudioPermission =
      sessionStorage.getItem("audioPermissionGranted") === "true";
    const hasVideoPermission =
      sessionStorage.getItem("videoPermissionGranted") === "true";

    if (isChatActive) {
      if (microphone.state === "granted" && camera.state === "granted") {
        getMediaTracks();
      } else if (!hasAudioPermission || !hasVideoPermission) {
        setIsPopoverOpen(true);
      } else {
        getMediaTracks();
      }
    }
  } catch (error: any) {
    setError({ isError: true, errorMsg: error.message });
  }
};

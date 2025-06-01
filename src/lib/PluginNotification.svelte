<script lang="ts">

import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

async function notify() {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) { sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' }) }
}
</script>

<button on:click={notify}>Notification</button>
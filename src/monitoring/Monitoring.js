export function MonitoringAllowed(){
    return document.cookie.includes("APPLICATION_MONITORING=allowed");
}

export function MonitoringNotSet() {
    return !document.cookie.includes("APPLICATION_MONITORING=denied") &&
        !document.cookie.includes("APPLICATION_MONITORING=allowed");
}

export function ClearMonitoringCookies() {
    document.cookie = "APPLICATION_MONITORING=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
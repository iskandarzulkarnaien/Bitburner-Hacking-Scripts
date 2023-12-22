import { NS } from "@ns";

export function getNumExecutableThreads(ns: NS, host: string, malware: string, reservedRam=0) {
    return Math.trunc((ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reservedRam) / ns.getScriptRam(malware));
}

export function execMaxOn(ns: NS, host: string, malware: string, target?: string, reservedRam=0) {
    if (!target) target = host;

    ns.scp(malware, host);
    ns.exec(malware, host, getNumExecutableThreads(ns, host, malware, reservedRam), target)
}

export function getThresholdMoneyAmount(ns: NS, threshold: number) {
    return ns.getServerMoneyAvailable('home') / threshold
}

export function getMaxMoneyHost(ns: NS) {
    const host = String(ns.readPort(1))
    if (host == 'NULL PORT DATA') return 'n00dles';

    ns.writePort(1, host)
    return host
}

export function setMaxMoneyHost(ns: NS, host: string) {
    ns.writePort(1, host)
}

export function nth(n: number): string {
    return ["st","nd","rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"
}

export function applyPadding(str: string) {
    return `${getPadding()}${str}`
}

const defaultPadding = 4
export function getPadding(numSpaces = defaultPadding) {
    return " ".repeat(numSpaces) 
}

export function getRandomArrayElement<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)]
}


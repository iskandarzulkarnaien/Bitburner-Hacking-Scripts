import { NS } from "@ns";

const unvisited: string[] = ['home']
const visited = new Set<string>()
const unhackable = new Set<string>()

/** @param {NS} ns */
export async function main(ns: NS) {
    while (unvisited.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const host: string = unvisited.pop()!;
        ns.print(`Current host: ${host}`);

        scanAll(ns, host);

        const hasRootAccess = attemptRootAccess(ns, host);
        await attemptRunMoneyScript(ns, host, hasRootAccess)

        await ns.sleep(50);
    }

    const unhackableList = Array.from(unhackable)
    ns.print(`No more servers to hack. Unhackable servers: ${Array.from(unhackable).join('\n')}`)

    while (unhackableList.length > 0) {
        for (const host of unhackableList) {
            const hasRootAccess = attemptRootAccess(ns, host);
            
            await attemptRunMoneyScript(ns, host, hasRootAccess)
            await ns.sleep(50);
        }
    }
}

/** @param {NS} ns */
function scanAll(ns: NS, host: string) {
    ns.print(`Scanning: ${host}`)

    visited.add(host)

    const neighbors = ns.scan(host);
    for (const n_host of neighbors) {
        if (visited.has(n_host) || unhackable.has(n_host)) {
            continue;
        }
        unvisited.push(n_host);
    }
}

/** @param {NS} ns */
function attemptRootAccess(ns: NS, host: string) {
    ns.print(`Attempting Root Access on: ${host}`)
    if (ns.hasRootAccess(host)) {
        return true;
    }

    openAllPorts(ns, host);

    try {
        ns.nuke(host);
    } catch {
        unhackable.add(host);
        return false;
    }
    return true;
}

/** @param {NS} ns */
function openAllPorts(ns: NS, host: string) {
    ns.print(`Opening ports on ${host}`)

    if (ns.fileExists('BruteSSH.exe')) {
        ns.brutessh(host);
    }

    if (ns.fileExists('FTPCrack.exe')) {
        ns.ftpcrack(host);
    }

    if (ns.fileExists('relaySMTP.exe')) {
        ns.relaysmtp(host);

    }

    if (ns.fileExists('HTTPWorm.exe')) {
        ns.httpworm(host);
    }

    if (ns.fileExists('SQLInject.exe')) {
        ns.sqlinject(host);
    }
}

async function attemptRunMoneyScript(ns: NS, host: string, hasRootAccess: boolean) {
    if (hasRootAccess && host != 'home') {
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host)) {
            await runMoneyScript(ns, host);
        }
    }
}

/** @param {NS} ns */
async function runMoneyScript(ns: NS, host: string) {
    ns.print(`Running moneyScript on: ${host}`);

    const script = 'moneyScript.js';

    await ns.scp(script, host);

    const maxRam = ns.getServerMaxRam(host);
    const usedRam = ns.getServerUsedRam(host);
    const scriptRam = ns.getScriptRam(script);

    const numThreads = Math.trunc((maxRam - usedRam) / scriptRam);

    if (numThreads > 0) {
        const highestMoneyHost = 'phantasy';

        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(highestMoneyHost)) {
            ns.exec(script, host, numThreads, highestMoneyHost);
        } else {
            ns.exec(script, host, numThreads, host);
        }
    }
}
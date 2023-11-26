import { NS } from "@ns";

const unvisited: Array<string> = ['home']
const visited = new Set<string>()

const hackable = new Set<string>()
const unhackable = new Array<string>()

let highestMoneyHost: string;

/** @param {NS} ns */
export async function main(ns: NS) {
    await traverseNetwork(ns, unvisited);

    await infectAll(ns, hackable, highestMoneyHost);

    await traverseNetwork(ns, unhackable, true);
}

async function traverseNetwork(ns: NS, nodes: Array<string>, retriggerInfection=false) {
    while (nodes.length > 0) {
        await ns.sleep(50);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const host: string = nodes.pop()!;
        ns.print(`Traversal current host: ${host}`);

        if (host != 'home') {
            const isHackable = attemptHack(ns, host);
            if (isHackable) {
                hackable.add(host);
                if (updateHighestMoneyHost(ns, host) && retriggerInfection) {
                    await infectAll(ns, hackable, highestMoneyHost)
                }
            } else {
                unhackable.unshift(host)  // lmao inefficient AF
            }
        }

        if (visited.has(host)) {
            continue;
        }

        visited.add(host)
        const neighbors = ns.scan(host);
        for (const n_host of neighbors) {
            nodes.push(n_host);
        }
    }
    ns.print(`No more servers to traverse. Unhackable servers: ${unhackable.join('\n')}`)
}
1
function attemptRootAccess(ns: NS, host: string) {
    ns.print(`Attempting root access on: ${host}`)
    if (ns.hasRootAccess(host)) {
        return true;
    }

    openAllPorts(ns, host);

    try {
        ns.nuke(host);
    } catch {
        return false;
    }
    return true;
}

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

function updateHighestMoneyHost(ns: NS, host: string) {
    if (highestMoneyHost && ns.getServerMaxMoney(host) <= ns.getServerMaxMoney(highestMoneyHost)) {
        return false;
    }
    highestMoneyHost = host;
    return true;
}

async function infectAll(ns: NS, hackableHosts: Iterable<string>, target?: string, malware?: string) {
    ns.print(`Infecting all hackable servers...`);
    for (const host of hackableHosts) {
        if (!target) target = host
        infect(ns, host, target, malware);
    }
}

async function infect(ns: NS, host: string, target: string, malware='moneyScript.js') {
    ns.print(`Infecting: ${host}`);
    
    ns.kill(malware, host);
    await ns.scp(malware, host);

    const numThreads = getNumExecutableThreads(ns, host, malware)
    if (numThreads <= 0) {
        return;
    }

    if (isHackable(ns, target)) {
        ns.exec(malware, host, numThreads, target);
    } else {
        ns.exec(malware, host, numThreads, host);
    }
}

function getNumExecutableThreads(ns: NS, host: string, malware: string) {
    return Math.trunc((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(malware));
}

function attemptHack(ns: NS, host: string) {
    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host)) {
        ns.print(`Unable to hack ${host} due to insufficient hacking level`);
        return false;
    }

    if (attemptRootAccess(ns, host)) {
        ns.print(`Successfully obtained root access for ${host}`);
        return true;
    }
    ns.print(`Unable obtain root access for ${host}`);
    return false;
}

function isHackable(ns: NS, host: string) {
    return ns.hasRootAccess(host) && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host);
}
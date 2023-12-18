import { NS } from "@ns";
import { execMaxOn, getMaxMoneyHost, setMaxMoneyHost } from "./lib/helpers";

const unvisited: Array<string> = ['home']
const visited = new Set<string>()

const nukedHosts = new Set<string>()
const unhackable = new Array<string>()

const running = new Map<string, string>()

const defaultMalware = '/malware/hackScript.js'

/** @param {NS} ns */
export async function main(ns: NS) {
    await traverseNetwork(ns, unvisited);

    await infectAll(ns, nukedHosts, getMaxMoneyHost(ns));

    await traverseNetwork(ns, unhackable, true);
}

async function traverseNetwork(ns: NS, nodes: Array<string>, triggerInfection=false) {
    while (nodes.length > 0) {
        await ns.sleep(50);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const host: string = nodes.pop()!;
        // ns.print(`Traversal current host: ${host}`);

        if (host != 'home') {
            const hasRootAccess = attemptRootAccess(ns, host);
            if (hasRootAccess) {
                nukedHosts.add(host);

                const foundBetterHost = updateHighestMoneyHost(ns, host);
                if (triggerInfection) {
                    if (foundBetterHost) {
                        await infectAll(ns, nukedHosts, getMaxMoneyHost(ns))
                    } else {
                        await infect(ns, host, getMaxMoneyHost(ns));
                    }
                }
            } else {
                unhackable.unshift(host)  // lmao inefficient AF
            }
        }
        if (!scanNeighbors(ns, host, nodes)) continue;
    }
    // ns.print(`No more servers to traverse. Unhackable servers: ${unhackable.join('\n')}`)
}


function scanNeighbors(ns: NS, host: string, nodes: Array<string>) {
    // ns.print(`Scanning neighbors of ${host}`)
    if (visited.has(host)) {
        return false;
    }

    visited.add(host)
    const neighbors = ns.scan(host);
    for (const n_host of neighbors) {
        // ns.print(`Adding neighbor ${n_host} of ${host}`)
        nodes.push(n_host);
    }
    return true;
}

function attemptRootAccess(ns: NS, host: string) {
    // ns.print(`Attempting root access on: ${host}`)
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
    // ns.print(`Opening ports on ${host}`)

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
    if (!isHackable(ns, host)) return false;

    if (!getMaxMoneyHost(ns) || ns.getServerMaxMoney(host) > ns.getServerMaxMoney(getMaxMoneyHost(ns))) {
        setMaxMoneyHost(ns, host)
        return true;
    }
    return false;
}

async function infectAll(ns: NS, hackableHosts: Iterable<string>, target: string, malware?: string) {
    // ns.print(`Infecting all nuked servers...`);
    infectHome(ns, target)
    for (const host of hackableHosts) {
        infect(ns, host, target, malware);
    }
}

async function infectHome(ns: NS, target: string, malware=defaultMalware) {
    const reservedRam = ['crawler.js', 'serverManage.js', 'shareScript.js', 'playScript.js', 'hacknetManage.js']
                            .map((script) => ns.getScriptRam(script))
                            .reduce((initRam, scriptRam) => initRam + scriptRam, 0)
    execMaxOn(ns, 'home', malware, target, getNumExecutableThreads(ns, 'home', malware, reservedRam))
}

async function infect(ns: NS, host: string, target: string, malware=defaultMalware) {
    // ns.print(`Infecting: ${host}`);
    
    // TODO: If the script and params are exactly the same, do not kill
    const currentTarget = running.get(host);
    if (currentTarget != target) {
        ns.killall(host);
    }
    await ns.scp(malware, host);

    const numThreads = getNumExecutableThreads(ns, host, malware)
    if (numThreads <= 0) {
        return;
    }

    if (!isHackable(ns, target)) {
        target = host;
    }

    running.set(host, target)
    ns.exec(malware, host, numThreads, target);
}

function getNumExecutableThreads(ns: NS, host: string, malware: string, reservedRam=0) {
    return Math.trunc((ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reservedRam) / ns.getScriptRam(malware));
}

function isHackable(ns: NS, host: string) {
    return ns.hasRootAccess(host) && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host);
}
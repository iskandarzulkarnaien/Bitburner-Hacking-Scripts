import { NS } from "@ns";
import { execMaxOn, getMaxMoneyHost, getThresholdMoneyAmount } from "./lib/helpers";


const baseRam  = 8

const moneyThreshold = 10

const defaultServerName = 'domain'
const defaultMalware = '/malware/hackScript.js'

/** @param {NS} ns */
export async function main(ns: NS) {
    await expandServers(ns)
    await upgradeServers(ns)
}

async function expandServers(ns: NS) {
    ns.disableLog('ALL')
    while (!hasReachedPurchaseLimit(ns)) {
        ns.print(`Attempting to purchase server...`)
        if (ns.getPurchasedServerCost(baseRam) < getThresholdMoneyAmount(ns, moneyThreshold)) {
            const host = ns.purchaseServer(defaultServerName, baseRam);
            ns.print(`maxMoneyHost: ${getMaxMoneyHost(ns)}`)
            runMalware(ns, host)
        }
        await ns.sleep(500);
    }
}

function hasReachedPurchaseLimit(ns: NS) {
    return ns.getPurchasedServers().length >= ns.getPurchasedServerLimit()
}

async function upgradeServers(ns: NS) {
    let currMaxRam = baseRam
    while (currMaxRam <= ns.getPurchasedServerMaxRam()) {
        for (const server of ns.getPurchasedServers()) {
            await ns.sleep(500)

            const serverMaxRam = ns.getServerMaxRam(server)
            const nextRamLevel = serverMaxRam * 2
            if (ns.getPurchasedServerUpgradeCost(server, nextRamLevel) > getThresholdMoneyAmount(ns, moneyThreshold)) {
                ns.print(`Insufficient funds to upgrade server ${server}...`)
                continue
            }
            ns.print(`Successfully upgraded server ${server} from RAM: ${serverMaxRam} to ${nextRamLevel}...`)
            ns.upgradePurchasedServer(server, nextRamLevel)
            ns.killall(server)
            runMalware(ns, server)
            currMaxRam = currMaxRam > nextRamLevel ? currMaxRam : nextRamLevel
        }
    }
}


function runMalware(ns: NS, server: string) {
    let target = getMaxMoneyHost(ns)
    if (!target) target = 'omega-net'

    execMaxOn(ns, server, defaultMalware, target)
}
import { NS } from "@ns";

let currMoney = 0;

let buyNodeThreshold: number;
let upgradeLevelThreshold: number;
let upgradeRamThreshold: number;
let upgradeCoresThreshold: number;
let upgradeCacheThreshold: number;


/** @param {NS} ns */
export async function main(ns: NS) {
    setupThreshold(ns);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        buyMoreNodes(ns);
        upgradeAllNodes(ns);
        await ns.sleep(50);
    }
}

function buyMoreNodes(ns: NS) {
    if (ns.hacknet.numNodes() >= ns.hacknet.maxNumNodes()) {
        return;
    }

    currMoney = ns.getServerMoneyAvailable('home');
    if (ns.hacknet.getPurchaseNodeCost() > currMoney / buyNodeThreshold) {
        return; 
    }
    ns.hacknet.purchaseNode();
    currMoney = ns.getServerMoneyAvailable('home');
}

function setupThreshold(ns: NS) {
    let defaultThreshold = 100;

    buyNodeThreshold = defaultThreshold / 10;

    if (ns.args.length > 0) {
        // Aggressive
        defaultThreshold = 1
        buyNodeThreshold = defaultThreshold;
    }

    upgradeLevelThreshold = defaultThreshold;
    upgradeRamThreshold = defaultThreshold;
    upgradeCoresThreshold = defaultThreshold;
    upgradeCacheThreshold = defaultThreshold;
}

function upgradeAllNodes(ns: NS) {
    currMoney = ns.getServerMoneyAvailable('home');
    const numNodes = ns.hacknet.numNodes();

    for (let i = 0; i < numNodes; i++) {
        upgradeLevel(ns, i);
        upgradeRam(ns, i);
        upgradeCache(ns, i);
        upgradeCore(ns, i);
    }
}

function upgradeLevel(ns: NS, i: number) {
    if (ns.hacknet.getLevelUpgradeCost(i) > currMoney / upgradeLevelThreshold) {
        return;
    }
    ns.hacknet.upgradeLevel(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

function upgradeCore(ns: NS, i: number) {
    if (ns.hacknet.getCoreUpgradeCost(i) > currMoney / upgradeCoresThreshold) {
        return;
    }
    ns.hacknet.upgradeCore(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

function upgradeRam(ns: NS, i: number) {
    if (ns.hacknet.getRamUpgradeCost(i) > currMoney / upgradeRamThreshold) {
        return;
    }
    ns.hacknet.upgradeRam(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

function upgradeCache(ns: NS, i: number) {
    if (ns.hacknet.getCacheUpgradeCost(i) > currMoney / upgradeCacheThreshold) {
        return;
    }
    ns.hacknet.upgradeCache(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

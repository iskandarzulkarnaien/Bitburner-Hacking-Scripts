import { NS } from "@ns";

let currMoney = 0;

/** @param {NS} ns */
export async function main(ns: NS) {
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
    if (ns.hacknet.getPurchaseNodeCost() > currMoney / 100) {
        return; 
    }
    ns.hacknet.purchaseNode();
    currMoney = ns.getServerMoneyAvailable('home');
}


function upgradeAllNodes(ns: NS) {
    currMoney = ns.getServerMoneyAvailable('home');
    const numNodes = ns.hacknet.numNodes();

    for (let i = 0; i < numNodes; i++) {
        upgradeLevel(ns, i);
        upgradeCache(ns, i);
        upgradeCore(ns, i);
    }
}

function upgradeLevel(ns: NS, i: number) {
    if (ns.hacknet.getLevelUpgradeCost(i) > currMoney / 100) {
        return;
    }
    ns.hacknet.upgradeLevel(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

function upgradeCore(ns: NS, i: number) {
    if (ns.hacknet.getCoreUpgradeCost(i) > currMoney / 100) {
        return;
    }
    ns.hacknet.upgradeCore(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

function upgradeCache(ns: NS, i: number) {
    if (ns.hacknet.getCacheUpgradeCost(i) > currMoney / 100) {
        return;
    }
    ns.hacknet.upgradeCache(i);
    currMoney = ns.getServerMoneyAvailable('home');
}

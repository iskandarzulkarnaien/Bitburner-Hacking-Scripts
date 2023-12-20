import { GangGenInfo, GangMemberInfo, GangTaskStats, NS } from "@ns";
import { Gang } from "gang/gang/gang";
import { Member } from "gang/member/member";
import { Task } from "gang/tasks/task";


export function calculateApproximateMoneyGain(ns: NS, gang: Gang, member: Member, task: Task): number {
    const gangInfo = gang.getInfo()
    const memberStats = member.getMemberInfo()
    const taskStats = task.getTaskStats()

    if (taskStats.baseMoney === 0) return 0;
    
    const difficultyModifier = 3.2 * taskStats.difficulty;
    const statWeight = calculateStatWeight(taskStats, memberStats) - difficultyModifier
    
    if (statWeight <= 0) return 0;

    const territoryMultiplier = calculateTerritoryMultiplier(gangInfo, taskStats);
    if (isNaN(territoryMultiplier) || territoryMultiplier <= 0) return 0;

    const respectMultiplier = calculateWantedPenalty(gangInfo);
    const territoryPenalty = calculateTerritoryPenalty(ns, gangInfo)

    return Math.pow(5 * taskStats.baseMoney * statWeight * territoryMultiplier * respectMultiplier, territoryPenalty);
}


function calculateStatWeight(taskStats: GangTaskStats, memberStats: GangMemberInfo) {
    const hackWeight = (taskStats.hackWeight / 100) * memberStats.hack
    const strWeight = (taskStats.strWeight / 100) * memberStats.str;
    const defWeight = (taskStats.defWeight / 100) * memberStats.def;
    const dexWeight = (taskStats.dexWeight / 100) * memberStats.dex;
    const agiWeight = (taskStats.agiWeight / 100) * memberStats.agi;
    const chaWeight = (taskStats.chaWeight / 100) * memberStats.cha;
    return hackWeight + strWeight + defWeight +dexWeight + agiWeight + chaWeight
}


function calculateWantedPenalty(gangInfo: GangGenInfo): number {
    return gangInfo.respect / (gangInfo.respect + gangInfo.wantedLevel);
}


function calculateTerritoryPenalty(ns: NS, gangInfo: GangGenInfo) {
    return (0.2 * gangInfo.territory + 0.8) * ns.getBitNodeMultipliers().GangSoftcap;
}


function calculateTerritoryMultiplier(gangInfo: GangGenInfo, taskStats: GangTaskStats) {
    return Math.max(0.005, Math.pow(gangInfo.territory * 100, taskStats.territory.money) / 100);
}

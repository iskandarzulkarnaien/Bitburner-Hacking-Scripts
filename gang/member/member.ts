import { Gang, GangMemberInfo, NS } from "@ns";
import { NSContainer } from "/lib/ns_container";
import { Task } from "/gang/tasks/task";
import { CombatTask } from "/gang/tasks/combat_task";
import { TrainingTask } from "/gang/tasks/training_task";

export class Member extends NSContainer {
    gang: Gang;
    name: string;

    constructor(ns: NS, name: string) {
        super(ns);
        this.gang = ns.gang;
        this.name = name;
    }

    getMemberInfo(): GangMemberInfo {
        return this.gang.getMemberInformation(this.name);
    }

    execTask(task: Task): void {
        this.gang.setMemberTask(this.name, task.name);
    }

    bestTask(): Task {
        const combatStats = this.getCombatStats()
        const checkThreshold = (threshold: number) => combatStats.every((stat) => stat < threshold)

        const baseThreshold = 75
        const thresholdMult = this.getAvgCombatMultiplier()
        const finalThreshold = baseThreshold * thresholdMult

        if (checkThreshold(finalThreshold)) {
            return TrainingTask.trainCombat(this.ns)
        } else if (checkThreshold(finalThreshold * 2)) {
            return CombatTask.mugPeople(this.ns)
        } else if (checkThreshold(finalThreshold * 3)) {
            return CombatTask.dealDrugs(this.ns)
        } else if (checkThreshold(finalThreshold * 4)) {
            return CombatTask.strongarmCivilians(this.ns)
        } else if (checkThreshold(finalThreshold * 5)) {
            return CombatTask.runACon(this.ns)
        } else if (checkThreshold(finalThreshold * 6)) {
            return CombatTask.armedRobbery(this.ns)
        } else if (checkThreshold(finalThreshold * 7)) {
            return CombatTask.traffickIllegalArms(this.ns)
        } else if (checkThreshold(finalThreshold * 8)) {
            return CombatTask.threatenAndBlackmail(this.ns)
        } else if (checkThreshold(finalThreshold * 9)) {
            return CombatTask.humanTrafficking(this.ns)
        } else {
            return CombatTask.terrorism(this.ns)
        }
    }

    private getAvgCombatMultiplier() {
        const { str_asc_mult, str_mult, def_asc_mult, def_mult, dex_asc_mult, dex_mult, agi_asc_mult, agi_mult } = this.getMemberInfo()
        const multipliers = [str_asc_mult, str_mult, def_asc_mult, def_mult, 
            dex_asc_mult, dex_mult, agi_asc_mult, agi_mult].map((multiplier) => Number(multiplier))
        return multipliers.reduce((sum, next) => sum + next, 0) / multipliers.length
    }

    private getCombatStats() {
        const { str, def, dex, agi } = this.getMemberInfo()
        return [str, def, dex, agi].map((stat) => Number(stat))
    }
}
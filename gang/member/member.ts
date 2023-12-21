import { Gang, GangMemberInfo, NS } from "@ns";
import { NSContainer } from "/lib/ns_container";
import { Task } from "/gang/tasks/task";
import { Stats } from "/gang/stats/enum_stats";
import { ineligibleAscension, invalidTask } from "gang/lib/error_messages";

export abstract class Member extends NSContainer {
    // NS-related
    gang: Gang;

    // Member-related
    name: string;
    abstract validTasks: Array<Task>;
    abstract mainStats: Array<Stats>;

    static trainingLevelThreshold = 35;  // 35 -> Reasonable | 50 -> Possible, but slow | 75 -> Too slow
    static ascensionFactorThreshold = 1.10;

    constructor(ns: NS, name: string) {
        super(ns);
        this.gang = ns.gang;
        this.name = name;
    }

    toString(): string {
        return this.name
    }

    getMemberInfo(): GangMemberInfo {
        return this.gang.getMemberInformation(this.name);
    }

    performTask(task: Task): void {
        if (!this.validTasks.find((validTask) => validTask.equals(task))) throw new Error(invalidTask(task, this.validTasks))
        this.gang.setMemberTask(this.name, task.name);
    }

    requireTraining(): boolean {
        const currStats = new Map<Stats, number>();
        for (const stat of this.mainStats) {
            const statLevel = this.getMemberInfo()[stat]
            currStats.set(stat, statLevel)
        }

        // We use min to ensure training time is capped by weakest skill
        const minAscensionMultiplier = Math.min(...this.getMainStatsAscensionMultipliers().values())
        const trainLevelCap = Member.trainingLevelThreshold * minAscensionMultiplier

        const currStatsLevels = Array.from(currStats).map(([, level]) => level)
        const requireTraining = currStatsLevels.some((currLevel) => currLevel < trainLevelCap)
        return requireTraining 
    }

    ascensionEligible(): boolean {
        const ascensionStatsFactors = this.gang.getAscensionResult(this.name)
        if (!ascensionStatsFactors) return false

        for (const stat of this.mainStats) {
            if (ascensionStatsFactors[stat] < Member.ascensionFactorThreshold) {
                return false
            }
        }
        return true
    }

    performAscension(): void {
        if (!this.ascensionEligible()) throw new Error(ineligibleAscension(this))
        this.gang.ascendMember(this.name)
    }

    getMainStatsAscensionMultipliers(): Map<Stats, number> {
        const currMultipliers = new Map<Stats, number>();

        const memberInfo = this.getMemberInfo()
        for (const stat of this.mainStats) {
            const ascensionMultiplier = memberInfo[`${stat}_asc_mult`]
            currMultipliers.set(stat, ascensionMultiplier)
        }
        return currMultipliers
    }

    abstract train(): void;
}
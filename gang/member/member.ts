import { Gang, GangMemberInfo, NS } from "@ns";
import { NSContainer } from "/lib/ns_container";
import { Task } from "/gang/tasks/task";
import { Stats } from "/gang/stats/enum_stats";
import { invalidTask } from "gang/lib/error_messages";

export abstract class Member extends NSContainer {
    // NS-related
    gang: Gang;

    // Member-related
    name: string;
    abstract validTasks: Array<Task>;
    abstract mainStats: Array<Stats>;
    static trainingThreshold = 75;

    constructor(ns: NS, name: string) {
        super(ns);
        this.gang = ns.gang;
        this.name = name;
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
        const trainLevelCap = Member.trainingThreshold * minAscensionMultiplier

        const currStatsLevels = Array.from(currStats).map(([, level]) => level)
        const requireTraining = currStatsLevels.some((currLevel) => currLevel < trainLevelCap)
        return requireTraining 
    }

    getMainStatsAscensionMultipliers(): Map<Stats, number> {
        const currMultipliers = new Map<Stats, number>();
        for (const stat of this.mainStats) {
            const ascensionMultiplier = this.getMemberInfo()[`${stat}_asc_mult`]
            currMultipliers.set(stat, ascensionMultiplier)
        }
        return currMultipliers
    }

    abstract train(): void;
}
import { Gang, GangMemberInfo, NS } from "@ns";
import { NSContainer } from "/lib/ns_container";
import { Task } from "/gang/tasks/task";
import { Stats } from "/gang/stats/enum_stats";
import { ineligibleAscension, invalidTask, statNotFound, unreachableConditionalPathReached } from "gang/lib/error_messages";

export abstract class Member extends NSContainer {
    // NS-related
    gang: Gang;

    // Member-related
    name: string;

    // Miscellaneous
    abstract validTasks: Array<Task>;
    abstract mainStats: Array<Stats>;

    static trainingLevelThreshold = 90;
    static ascensionFactorThreshold = 1.5;

    numAscensions = 0;  // TODO: This will not be accurate until we setup file-storage of data

    constructor(ns: NS, name: string) {
        super(ns);
        this.gang = ns.gang;
        this.name = name;
    }

    equals(other: Member): boolean {
        return this.name === other.name
    }

    toString(): string {
        return this.name
    }

    // Info-related
    getMemberInfo(): GangMemberInfo {
        return this.gang.getMemberInformation(this.name);
    }

    // Role-related
    getRole(): string {
        return this.constructor.name
    }

    roleSwap<MemberRole extends Member>(Role: new (ns: NS, name: string) => MemberRole): Member {
        return new Role(this.ns, this.name)
    }

    // Task-related
    performTask(task: Task): void {
        if (!this.validTasks.find((validTask) => validTask.equals(task))) throw new Error(invalidTask(task, this.validTasks))
        this.gang.setMemberTask(this.name, task.name);
    }

    // Training-related
    abstract train(): void;

    requireTraining(): boolean {
        const currStats = new Map<Stats, number>();
        for (const stat of this.mainStats) {
            const statLevel = this.getMemberInfo()[stat]
            currStats.set(stat, statLevel)
        }

        const checker = this.getTrainingChecker()
        if (checker === this.exactTrainingChecker) {
            return this.exactTrainingChecker(currStats)
        }

        const currStatsLevels = Array.from(currStats).map(([, level]) => level)
        return (checker as (currStatsLevels: Array<number>) => boolean)(currStatsLevels)  // TODO: find a better way to express this
    }

    private getTrainingChecker(which = 'exact') {
        switch (which) {
            case 'min':
                return this.minTrainingChecker
            case 'max':
                return this.maxTrainingChecker
            case 'avg':
                return this.avgTrainingChecker
            case 'exact':
                return this.exactTrainingChecker
            default:
                throw new Error(unreachableConditionalPathReached())
        }
    }

    private minTrainingChecker(currStatsLevels: Array<number>): boolean {
        // Caps training time by weakest skill
        const minAscensionMultiplier = Math.min(...this.getMainStatsAscensionMultipliers().values())
        const trainLevelCap = Member.trainingLevelThreshold * minAscensionMultiplier
        return currStatsLevels.some((currLevel) => currLevel < trainLevelCap)
    }

    private maxTrainingChecker(currStatsLevels: Array<number>): boolean {
        // Ensures training to the highest quality
        const maxAscensionMultiplier = Math.max(...this.getMainStatsAscensionMultipliers().values())
        const trainLevelCap = Member.trainingLevelThreshold * maxAscensionMultiplier
        return currStatsLevels.some((currLevel) => currLevel < trainLevelCap)
    }

    private avgTrainingChecker(currStatsLevels: Array<number>): boolean {
        // Balanced approach
        const multiplierValues = Array.from(this.getMainStatsAscensionMultipliers().values())
        const avgAscensionMultiplier = multiplierValues.reduce((total, currMultiplier) => total + currMultiplier) / multiplierValues.length
        const trainLevelCap = Member.trainingLevelThreshold * avgAscensionMultiplier
        return currStatsLevels.some((currLevel) => currLevel < trainLevelCap)
    }

    private exactTrainingChecker(currStats: Map<Stats, number>): boolean {
        const ascensionMultipliers = this.getMainStatsAscensionMultipliers()
        for (const [stat, currLevel] of currStats) {
            const statMultiplier = ascensionMultipliers.get(stat)
            if (!statMultiplier) throw new Error(statNotFound(stat, this))
            if (currLevel < Member.trainingLevelThreshold * statMultiplier) return true
        }
        return false
    }

    // Ascension-related
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
        
        const ascensionResults = this.gang.ascendMember(this.name)
        if (!ascensionResults) return
        
        this.numAscensions += 1
    }

    // Rank is defined as average of main stats
    getAscensionRank(): string {
        const multipliers = Array.from(this.getMainStatsAscensionMultipliers().values())
        return (multipliers.reduce((sum, value) => sum + value, 0) / multipliers.length).toFixed(0)
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

    getMainStatsNextAscensionMultipliers(): Map<Stats, number> {
        const nextAscensionMultipliers = this.getMainStatsAscensionMultipliers()
        nextAscensionMultipliers.forEach((value: number, stat: Stats) => nextAscensionMultipliers.set(stat, value * Member.ascensionFactorThreshold))
        return nextAscensionMultipliers
    }
}
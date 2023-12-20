import { NS } from "@ns";
import { Member } from "/gang/member/member";
import { Task } from "/gang/tasks/task";
import { CombatTask } from "/gang/tasks/combat_task";
import { TrainingTask } from "/gang/tasks/training_task";
import { CombatStats, Stats } from "/gang/stats/enum_stats";
import { SpecialTask } from "gang/tasks/special_task";

export class Warrior extends Member {
    validTasks: Array<Task>;
    mainStats: Array<Stats>

    constructor(ns: NS, name: string) {
        super(ns, name);
        this.validTasks = CombatTask.getAll(ns).concat(TrainingTask.trainCombat(ns), SpecialTask.territoryWarfare(ns))
        this.mainStats = [CombatStats.Strength, CombatStats.Defense, CombatStats.Dexterity, CombatStats.Strength]
    }

    train(): void {
        this.performTask(TrainingTask.trainCombat(this.ns))
    }
}
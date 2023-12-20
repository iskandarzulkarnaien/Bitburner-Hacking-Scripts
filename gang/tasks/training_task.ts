import { NS } from "@ns";
import { Task } from "/gang/tasks/task";

export class TrainingTask extends Task {
    static trainCombat(ns: NS): TrainingTask {
        return new TrainingTask(ns, "Train Combat")
    }

    static trainHacking(ns: NS): TrainingTask {
        return new TrainingTask(ns, "Train Hacking")
    }

    static trainCharisma(ns: NS): TrainingTask {
        return new TrainingTask(ns, "Train Charisma")
    }

    static getAll(ns: NS): Array<TrainingTask> {
        return [
            TrainingTask.trainCombat(ns),
            TrainingTask.trainHacking(ns),
            TrainingTask.trainCharisma(ns)
        ]
    }
}